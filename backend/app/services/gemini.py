"""
Gemini 2.5 Pro integration service.

Handles audio upload, structured output extraction, and Pydantic validation.
Uses the google-genai SDK for direct audio understanding.
"""

import json
import logging
import os
import tempfile
import time
from typing import Any

from google import genai
from google.genai import types

from ..config import settings
from ..models.schemas import ExtractionData
from ..prompts.extraction import get_system_prompt, get_user_prompt

logger = logging.getLogger(__name__)


class GeminiServiceError(Exception):
    """Raised when Gemini processing fails."""

    def __init__(self, message: str, detail: str | None = None, raw_response: str | None = None):
        self.message = message
        self.detail = detail
        self.raw_response = raw_response
        super().__init__(message)


def _wait_for_file_active(
    client: genai.Client, uploaded_file: Any, timeout: int = 120
) -> Any:
    """Poll until an uploaded file reaches ACTIVE state."""
    start = time.time()
    while uploaded_file.state.name == "PROCESSING":
        if time.time() - start > timeout:
            raise GeminiServiceError(
                "Audio processing timed out",
                "The uploaded file did not become active within the timeout period.",
            )
        time.sleep(2)
        uploaded_file = client.files.get(name=uploaded_file.name)

    if uploaded_file.state.name != "ACTIVE":
        raise GeminiServiceError(
            "Audio processing failed",
            f"File state: {uploaded_file.state.name}",
        )
    return uploaded_file


from tenacity import retry, stop_after_attempt, wait_exponential

def _is_transient_error(e: Exception) -> bool:
    error_str = str(e).lower()
    transient_keywords = [
        "429", "500", "502", "503", "504",
        "quota", "resource", "exhausted", 
        "unavailable", "overloaded", "demand"
    ]
    return any(keyword in error_str for keyword in transient_keywords)

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1, min=2, max=8),
    reraise=True
)
def _generate_with_retry(client, model, uploaded_file):
    return client.models.generate_content(
        model=model,
        contents=[
            types.Content(
                parts=[
                    types.Part.from_uri(
                        file_uri=uploaded_file.uri,
                        mime_type=uploaded_file.mime_type,
                    ),
                    types.Part.from_text(text=get_user_prompt()),
                ]
            )
        ],
        config=types.GenerateContentConfig(
            system_instruction=get_system_prompt(),
            response_mime_type="application/json",
            response_schema=ExtractionData,
            temperature=0.1,
        ),
    )

def process_audio(
    file_bytes: bytes, filename: str, mime_type: str
) -> dict[str, Any]:
    """
    Process audio through Gemini API with fallbacks and retries.
    """
    if not settings.gemini_api_key:
        raise GeminiServiceError(
            "Gemini API key not configured",
            "Please set the GEMINI_API_KEY environment variable.",
        )

    client = genai.Client(api_key=settings.gemini_api_key)
    
    # Primary model and fallbacks per requirements
    models_to_try = [
        "gemini-2.5-flash",
        "gemini-2.0-flash",
        "gemini-2.0-flash-lite"
    ]

    # ── Save audio to temp file for upload ────────────────────────────
    suffix = os.path.splitext(filename)[1] or ".mp3"
    tmp_path: str | None = None

    try:
        with tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
            tmp.write(file_bytes)
            tmp_path = tmp.name

        logger.info("Uploading audio to Gemini File API: %s (%s)", filename, mime_type)

        uploaded_file = client.files.upload(
            file=tmp_path,
            config=types.UploadFileConfig(mime_type=mime_type),
        )

        # Wait for the file to be ready
        uploaded_file = _wait_for_file_active(client, uploaded_file)
        logger.info("File active: %s", uploaded_file.name)

        # ── Generate structured extraction ────────────────────────────
        response = None
        used_model = None
        last_error = None

        for model in models_to_try:
            logger.info("Attempting extraction with model: %s", model)
            try:
                response = _generate_with_retry(client, model, uploaded_file)
                used_model = model
                break  # Success, exit fallback loop
                
            except Exception as e:
                # Check for transient errors (429, 503, etc.)
                if _is_transient_error(e):
                    logger.warning(f"Model {model} overloaded or unavailable. Trying next fallback. Error: {e}")
                    last_error = e
                    continue
                else:
                    # If it's a non-transient error (e.g., 400 Bad Request), raise immediately
                    logger.error(f"Non-transient error encountered with {model}: {e}")
                    raise

        if not response:
            # All models failed due to quota or other errors
            logger.error("All fallback models failed. Last raw error: %s", last_error)
            raise GeminiServiceError(
                "AI_OVERLOADED",
                "AI service is experiencing high demand. Please retry in a few minutes.",
                raw_response=str(last_error) if last_error else None
            )

        raw_response = response.text
        logger.info("Received Gemini response (%d chars) from model: %s", len(raw_response), used_model)

        # ── Parse and validate ────────────────────────────────────────
        try:
            parsed = json.loads(raw_response)
        except json.JSONDecodeError as e:
            raise GeminiServiceError(
                "Failed to parse Gemini response as JSON",
                f"JSONDecodeError: {e}",
                raw_response=raw_response
            )

        try:
            validated = ExtractionData.model_validate(parsed)
        except Exception as e:
            raise GeminiServiceError(
                "Gemini response failed Pydantic validation",
                f"ValidationError: {e}",
                raw_response=raw_response
            )

        return {
            "validated_data": validated.model_dump(),
            "raw_response": raw_response,
            "model_used": used_model,
        }

    except GeminiServiceError:
        raise
    except Exception as e:
        logger.exception("Unexpected error during Gemini processing")
        raise GeminiServiceError(
            "An unexpected error occurred during audio processing",
            str(e),
        )
    finally:
        # Clean up temp file
        if tmp_path and os.path.exists(tmp_path):
            os.unlink(tmp_path)
