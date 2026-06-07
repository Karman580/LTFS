import cloudinary
import cloudinary.uploader
import logging

from ..config import settings

logger = logging.getLogger(__name__)

# Note: Cloudinary will automatically configure itself if CLOUDINARY_URL is present in env,
# but we can also explicitly configure it if needed.
if settings.cloudinary_url:
    cloudinary.config(cloudinary_url=settings.cloudinary_url)
else:
    logger.warning("CLOUDINARY_URL not set in environment.")

def upload_audio(file_bytes: bytes, filename: str) -> dict:
    """
    Uploads an audio file to Cloudinary and returns a dict with url and duration.
    """
    if not settings.cloudinary_url:
        logger.warning("Cloudinary not configured, returning empty URL")
        return {"url": "", "duration": 0.0}
        
    try:
        response = cloudinary.uploader.upload(
            file_bytes,
            resource_type="auto",
            folder="audio_uploads",
            use_filename=True,
            unique_filename=True
        )
        return {
            "url": response.get("secure_url", ""),
            "duration": response.get("duration", 0.0)
        }
    except Exception as e:
        logger.error(f"Failed to upload audio to Cloudinary: {e}")
        return {"url": "", "duration": 0.0}
