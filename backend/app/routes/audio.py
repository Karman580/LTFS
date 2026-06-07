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
    Saves audio to Cloudinary and returns extraction result directly.
    """
    from ..services.cloudinary_service import upload_audio
    
    filename = file.filename or "audio.mp3"
    content_type = file.content_type or ""

    generic_error_detail = {
        "status": "error",
        "message": "Processing Temporarily Unavailable",
        "detail": "The application could not be processed at this time.\nPlease try again later or contact the administrator."
    }
    
    # ── Validate file type ────────────────────────────────────────────
    if content_type not in settings.allowed_audio_types:
        raise HTTPException(status_code=400, detail=generic_error_detail)

    # ── Read file bytes ───────────────────────────────────────────────
    try:
        file_bytes = file.file.read()
    except Exception as e:
        raise HTTPException(status_code=500, detail=generic_error_detail)

    # ── Validate file size ────────────────────────────────────────────
    if len(file_bytes) > settings.max_upload_size_bytes:
        raise HTTPException(status_code=413, detail=generic_error_detail)

    # ── Upload to Cloudinary ──────────────────────────────────────────
    try:
        upload_audio(file_bytes, filename)
    except Exception as e:
        logger.error(f"Cloudinary upload failed: {e}")

    # ── Process through Gemini ────────────────────────────────────────
    try:
        result = process_audio(
            file_bytes=file_bytes,
            filename=filename,
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
        raise HTTPException(status_code=500, detail=generic_error_detail)
        
    except Exception as e:
        logger.exception("Unexpected error in audio processing endpoint")
        raise HTTPException(status_code=500, detail=generic_error_detail)
