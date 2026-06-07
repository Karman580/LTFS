import cloudinary
import cloudinary.uploader
import logging

from ..config import settings

logger = logging.getLogger(__name__)

import urllib.parse

# Manually parse the CLOUDINARY_URL to ensure explicit configuration
if settings.cloudinary_url:
    try:
        parsed_url = urllib.parse.urlparse(settings.cloudinary_url)
        cloudinary.config(
            cloud_name=parsed_url.hostname,
            api_key=parsed_url.username,
            api_secret=parsed_url.password,
            secure=True
        )
        logger.info("Cloudinary configuration loaded successfully")
        print("✅ Cloudinary configuration loaded successfully")
        print(f"✅ Cloudinary Cloud Name: {parsed_url.hostname}")
    except Exception as e:
        logger.error(f"Cloudinary configuration missing or invalid: {e}")
        print(f"❌ Cloudinary configuration missing or invalid: {e}")
else:
    logger.warning("Cloudinary configuration missing")
    print("❌ Cloudinary configuration missing")

def upload_audio(file_bytes: bytes, filename: str) -> dict:
    """
    Uploads an audio file to Cloudinary and returns a dict with url and duration.
    """
    logger.info("Cloudinary upload started")
    
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
        logger.info("Cloudinary upload successful")
        logger.info(f"Cloudinary public_id: {response.get('public_id')}")
        logger.info(f"Cloudinary secure_url: {response.get('secure_url')}")
        
        return {
            "url": response.get("secure_url", ""),
            "duration": response.get("duration", 0.0)
        }
    except Exception as e:
        logger.error(f"Failed to upload audio to Cloudinary: {e}")
        return {"url": "", "duration": 0.0}
