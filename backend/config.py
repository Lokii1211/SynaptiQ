# ============================================
# MEMORIA x ECHO - Configuration
# ============================================
import os
from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # App
    APP_NAME: str = "MEMORIA x ECHO"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    # Database - use /tmp for Vercel serverless
    DATABASE_URL: str = (
        "sqlite+aiosqlite:///tmp/memoria_echo.db"
        if os.environ.get("VERCEL")
        else "sqlite+aiosqlite:///./memoria_echo.db"
    )

    # JWT Auth
    SECRET_KEY: str = "your-super-secret-key-change-in-production-2026"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours

    # AI APIs
    OPENAI_API_KEY: Optional[str] = None
    GOOGLE_AI_API_KEY: Optional[str] = None

    # Google Gemini (Free tier)
    GEMINI_MODEL: str = "gemini-2.0-flash"

    # CORS
    CORS_ORIGINS: list = ["*"]

    # File Storage
    UPLOAD_DIR: str = "/tmp/uploads" if os.environ.get("VERCEL") else "uploads"
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024  # 10MB

    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        extra = "ignore"


settings = Settings()
