"""
FastAPI application entry point for the LTFS Audio Extraction Backend.
"""

import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes.audio import router as audio_router

# ── Logging ───────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s — %(message)s",
)

# ── App ───────────────────────────────────────────────────────────────
app = FastAPI(
    title="LTFS Audio Extraction API",
    description="AI-powered microloan audio extraction backend using Gemini 2.5 Pro",
    version="1.0.0",
)

# ── CORS ──────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://frontend:3000",
        "https://ltfs-h2oxsz3ey-jbkjbs-projects.vercel.app",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routes ────────────────────────────────────────────────────────────
app.include_router(audio_router, prefix="/api")


@app.get("/api/health")
def health_check():
    """Health check endpoint."""
    return {"status": "healthy", "service": "ltfs-audio-extraction"}
