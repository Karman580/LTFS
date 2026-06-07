"""
Application configuration loaded from environment variables.
"""

import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings read from environment variables."""

    gemini_api_key: str = ""
    gemini_model: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

    # Integrations
    cloudinary_url: str = ""

    max_upload_size_bytes: int = 50 * 1024 * 1024  # 50 MB

    allowed_audio_types: list[str] = [
        "audio/mpeg",
        "audio/mp3",
        "audio/wav",
        "audio/wave",
        "audio/x-wav",
        "audio/x-m4a",
        "audio/mp4",
        "audio/m4a",
        "audio/aac",
    ]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
