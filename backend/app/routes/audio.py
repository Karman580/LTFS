"""
Audio processing API route.
"""

import logging

from fastapi import APIRouter, HTTPException, UploadFile, File

from ..config import settings
from ..models.schemas import ProcessingResponse, ErrorResponse
from ..services.gemini import process_audio, GeminiServiceError

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post(
    "/process-audio",
    response_model=ProcessingResponse,
    responses={
        400: {"model": ErrorResponse},
        413: {"model": ErrorResponse},
        500: {"model": ErrorResponse},
    },
    summary="Process an audio interview recording",
    description="Upload an audio file to transcribe and extract microloan application data using Gemini AI.",
)
def process_audio_endpoint(file: UploadFile = File(...)):
    """
    Accept an audio file upload and process it through Gemini 2.5 Pro.

    Validates file type and size, then returns structured extraction data
    with evidence for each field.
    """

    # ── Validate file type ────────────────────────────────────────────
    content_type = file.content_type or ""
    if content_type not in settings.allowed_audio_types:
        raise HTTPException(
            status_code=400,
            detail={
                "status": "error",
                "message": "Unsupported file format",
                "detail": (
                    f"Received '{content_type}'. "
                    f"Supported formats: MP3, WAV, M4A."
                ),
            },
        )

    # ── Read file bytes ───────────────────────────────────────────────
    file_bytes = file.file.read()

    # ── Validate file size ────────────────────────────────────────────
    if len(file_bytes) > settings.max_upload_size_bytes:
        max_mb = settings.max_upload_size_bytes / (1024 * 1024)
        raise HTTPException(
            status_code=413,
            detail={
                "status": "error",
                "message": "File too large",
                "detail": f"Maximum upload size is {max_mb:.0f} MB.",
            },
        )

    # ── Process through Gemini ────────────────────────────────────────
    try:
        result = process_audio(
            file_bytes=file_bytes,
            filename=file.filename or "audio.mp3",
            mime_type=content_type,
        )

        return ProcessingResponse(
            status="success",
            data=result["validated_data"],
            raw_response=result["raw_response"],
            model_used=result["model_used"],
        )

    except GeminiServiceError as e:
        logger.error("Gemini processing error: %s — %s", e.message, e.detail)
        raise HTTPException(
            status_code=500,
            detail={
                "status": "error",
                "message": e.message,
                "detail": e.detail,
            },
        )
    except Exception as e:
        logger.exception("Unexpected error in audio processing endpoint")
        raise HTTPException(
            status_code=500,
            detail={
                "status": "error",
                "message": "Internal server error",
                "detail": str(e),
            },
        )
