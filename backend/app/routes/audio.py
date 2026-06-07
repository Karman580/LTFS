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
    Tracks execution and saves audio to Cloudinary, metadata to Firestore.
    """
    import time
    import datetime
    import uuid
    from ..services.cloudinary_service import upload_audio
    from ..services.firestore_service import save_application_record
    
    start_time = time.time()
    
    # Generate submission ID: LTFS-YYYYMMDD-HHMMSS-RANDOM
    date_str = datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
    random_hex = uuid.uuid4().hex[:4].upper()
    submission_id = f"LTFS-{date_str}-{random_hex}"
    
    filename = file.filename or "audio.mp3"
    
    record = {
        "submission_id": submission_id,
        "timestamp": datetime.datetime.utcnow().isoformat() + "Z",
        "filename": filename,
        "audio_url": "",
        "transcript": "",
        "extracted_fields": {},
        "processing_time": 0.0,
        "processing_started_at": datetime.datetime.utcnow().isoformat() + "Z",
        "processing_completed_at": "",
        "audio_duration": 0.0,
        "audio_size_mb": 0.0,
        "status": "processing",
        "error_logs": "",
        "model_version": settings.gemini_model,
        "app_version": "1.0.0"
    }

    generic_error_detail = {
        "status": "error",
        "message": "Processing Temporarily Unavailable",
        "detail": "The application could not be processed at this time.\nPlease try again later or contact the administrator."
    }

    content_type = file.content_type or ""
    
    try:
        # ── Validate file type ────────────────────────────────────────────
        if content_type not in settings.allowed_audio_types:
            record["status"] = "failed"
            record["error_logs"] = f"Unsupported file format: {content_type}"
            raise HTTPException(status_code=400, detail=generic_error_detail)

        # ── Read file bytes ───────────────────────────────────────────────
        try:
            file_bytes = file.file.read()
        except Exception as e:
            record["status"] = "failed"
            record["error_logs"] = f"Failed to read file: {str(e)}"
            raise HTTPException(status_code=500, detail=generic_error_detail)

        record["audio_size_mb"] = round(len(file_bytes) / (1024 * 1024), 2)

        # ── Validate file size ────────────────────────────────────────────
        if len(file_bytes) > settings.max_upload_size_bytes:
            record["status"] = "failed"
            record["error_logs"] = f"File too large: {len(file_bytes)} bytes"
            raise HTTPException(status_code=413, detail=generic_error_detail)

        # ── Upload to Cloudinary ──────────────────────────────────────────
        try:
            cloudinary_res = upload_audio(file_bytes, filename)
            record["audio_url"] = cloudinary_res.get("url", "")
            record["audio_duration"] = cloudinary_res.get("duration", 0.0)
        except Exception as e:
            logger.error(f"Cloudinary upload failed: {e}")
            record["error_logs"] += f"| Cloudinary upload failed: {str(e)} "

        # ── Process through Gemini ────────────────────────────────────────
        try:
            result = process_audio(
                file_bytes=file_bytes,
                filename=filename,
                mime_type=content_type,
            )
            
            record["transcript"] = result.get("raw_response", "")
            record["extracted_fields"] = result.get("validated_data", {})
            record["status"] = "success"
            record["model_version"] = result.get("model_used", record["model_version"])

            return ProcessingResponse(
                status="success",
                data=result["validated_data"],
                raw_response=result["raw_response"],
                model_used=result["model_used"],
            )

        except GeminiServiceError as e:
            logger.error("Gemini processing error: %s — %s", e.message, e.detail)
            
            # Partial success if we got a raw response but Pydantic validation failed
            if hasattr(e, "raw_response") and e.raw_response:
                record["transcript"] = e.raw_response
                record["status"] = "partial_success"
                record["error_logs"] += f"| Extraction failed, transcript saved: {e.message} - {e.detail} "
            else:
                record["status"] = "failed"
                record["error_logs"] += f"| Gemini Error: {e.message} - {e.detail} "
                
            raise HTTPException(status_code=500, detail=generic_error_detail)
            
        except Exception as e:
            logger.exception("Unexpected error in audio processing endpoint")
            record["status"] = "failed"
            record["error_logs"] += f"| Unexpected Error: {str(e)} "
            raise HTTPException(status_code=500, detail=generic_error_detail)
            
    finally:
        # Guarantee Firestore logging regardless of success or failure
        record["processing_time"] = round(time.time() - start_time, 2)
        record["processing_completed_at"] = datetime.datetime.utcnow().isoformat() + "Z"
        save_application_record(record)
