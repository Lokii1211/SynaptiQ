# ============================================
# MEMORIA x ECHO - Main FastAPI Application
# ============================================
import os
import sys
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from loguru import logger

from config import settings
from database import init_db, close_db

IS_VERCEL = os.environ.get("VERCEL", "")

# Configure logging
logger.remove()
logger.add(sys.stdout, level="INFO", format="{time:HH:mm:ss} | {level: <8} | {name} - {message}")
if not IS_VERCEL:
    os.makedirs("logs", exist_ok=True)
    logger.add("logs/app.log", rotation="10 MB", retention="30 days", level="DEBUG")

# Track if DB has been initialized (for serverless cold starts)
_db_initialized = False


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup & shutdown lifecycle."""
    global _db_initialized
    logger.info("Starting MEMORIA x ECHO backend...")
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    await init_db()
    logger.info("Database initialized")

    # Seed endangered languages if table is empty
    if not _db_initialized:
        await seed_endangered_languages()
        _db_initialized = True

    yield

    if not IS_VERCEL:
        logger.info("Shutting down...")
        await close_db()


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI-Powered Cognitive Companion & Universal Communication Intelligence Platform",
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---- Register Routers ----
from auth.router import router as auth_router
from memoria.router import router as memoria_router
from echo.router import router as echo_router

app.include_router(auth_router)
app.include_router(memoria_router)
app.include_router(echo_router)


# ---- Health Check ----
@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "services": {
            "database": "connected",
            "gemini_ai": "configured" if settings.GOOGLE_AI_API_KEY else "not_configured",
            "openai": "configured" if settings.OPENAI_API_KEY else "not_configured",
        },
    }


# ---- API Overview ----
@app.get("/api/overview")
async def api_overview():
    return {
        "platform": "MEMORIA × ECHO",
        "modules": {
            "auth": {
                "endpoints": [
                    "POST /api/auth/register",
                    "POST /api/auth/login",
                    "GET  /api/auth/me",
                    "PUT  /api/auth/me",
                ],
            },
            "memoria": {
                "endpoints": [
                    "POST /api/memoria/memories",
                    "GET  /api/memoria/memories",
                    "GET  /api/memoria/memories/{id}",
                    "DELETE /api/memoria/memories/{id}",
                    "POST /api/memoria/cognitive/assess",
                    "GET  /api/memoria/cognitive/history",
                    "GET  /api/memoria/cognitive/latest",
                    "POST /api/memoria/chat",
                    "GET  /api/memoria/knowledge-graph",
                    "GET  /api/memoria/stats",
                ],
            },
            "echo": {
                "endpoints": [
                    "POST /api/echo/translate",
                    "GET  /api/echo/translations",
                    "POST /api/echo/emotion/analyze",
                    "GET  /api/echo/emotion/history",
                    "POST /api/echo/aac/predict",
                    "POST /api/echo/emergency/start",
                    "POST /api/echo/emergency/message",
                    "POST /api/echo/emergency/{id}/resolve",
                    "GET  /api/echo/languages/endangered",
                    "GET  /api/echo/stats",
                    "WS   /api/echo/ws/emergency/{session_id}",
                ],
            },
        },
    }


# ---- Serve Frontend Static Files (local dev only) ----
# On Vercel, static files are served by Vercel's CDN
if not IS_VERCEL:
    FRONTEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

    @app.get("/")
    async def serve_index():
        return FileResponse(os.path.join(FRONTEND_DIR, "index.html"))

    @app.get("/echo")
    async def serve_echo():
        return FileResponse(os.path.join(FRONTEND_DIR, "echo.html"))

    # Serve static files (CSS, JS, images)
    app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")

    # Fallback: serve files from frontend root directly (MUST be last)
    @app.get("/{filename:path}")
    async def serve_frontend_file(filename: str):
        if filename.startswith("api/"):
            return JSONResponse(status_code=404, content={"detail": "API endpoint not found"})
        filepath = os.path.join(FRONTEND_DIR, filename)
        if os.path.isfile(filepath):
            return FileResponse(filepath)
        return JSONResponse(status_code=404, content={"detail": "Not found"})


# ---- Seed Data ----
async def seed_endangered_languages():
    """Seed endangered languages data on first run."""
    from sqlalchemy import select, func
    from database import async_session
    from echo.models import EndangeredLanguage

    async with async_session() as db:
        count = await db.execute(select(func.count(EndangeredLanguage.id)))
        if count.scalar() > 0:
            return

        languages = [
            EndangeredLanguage(name="Toda", region="Nilgiris, Tamil Nadu", country="India",
                               speakers_count=1500, status="critical", risk_score=0.12,
                               hours_recorded=200, words_documented=5000,
                               songs_preserved=47, stories_recorded=128,
                               has_ai_model=True, model_accuracy=0.82),
            EndangeredLanguage(name="Nihali", region="Jalgaon, Maharashtra", country="India",
                               speakers_count=2000, status="critical", risk_score=0.15,
                               hours_recorded=80, words_documented=3200,
                               songs_preserved=12, stories_recorded=45,
                               has_ai_model=False),
            EndangeredLanguage(name="Great Andamanese", region="Andaman Islands", country="India",
                               speakers_count=10, status="critical", risk_score=0.02,
                               hours_recorded=320, words_documented=8500,
                               songs_preserved=89, stories_recorded=200,
                               has_ai_model=True, model_accuracy=0.71),
            EndangeredLanguage(name="Kurukh", region="Jharkhand", country="India",
                               speakers_count=2000000, status="vulnerable", risk_score=0.45,
                               hours_recorded=50, words_documented=12000,
                               songs_preserved=30, stories_recorded=75,
                               has_ai_model=False),
            EndangeredLanguage(name="Tulu", region="Karnataka / Kerala", country="India",
                               speakers_count=2000000, status="vulnerable", risk_score=0.60,
                               hours_recorded=100, words_documented=18000,
                               songs_preserved=55, stories_recorded=110,
                               has_ai_model=True, model_accuracy=0.88),
            EndangeredLanguage(name="Santhali", region="Jharkhand / Odisha", country="India",
                               speakers_count=7600000, status="vulnerable", risk_score=0.55,
                               hours_recorded=75, words_documented=15000,
                               songs_preserved=40, stories_recorded=90,
                               has_ai_model=True, model_accuracy=0.85),
            EndangeredLanguage(name="Gondi", region="Central India", country="India",
                               speakers_count=2900000, status="endangered", risk_score=0.30,
                               hours_recorded=60, words_documented=9000,
                               songs_preserved=25, stories_recorded=60,
                               has_ai_model=False),
            EndangeredLanguage(name="Bodo", region="Assam", country="India",
                               speakers_count=1500000, status="vulnerable", risk_score=0.50,
                               hours_recorded=90, words_documented=14000,
                               songs_preserved=35, stories_recorded=80,
                               has_ai_model=True, model_accuracy=0.79),
            EndangeredLanguage(name="Ainu", region="Hokkaido", country="Japan",
                               speakers_count=10, status="critical", risk_score=0.01,
                               hours_recorded=500, words_documented=12000,
                               songs_preserved=150, stories_recorded=300,
                               has_ai_model=True, model_accuracy=0.75),
            EndangeredLanguage(name="Yuchi", region="Oklahoma", country="USA",
                               speakers_count=4, status="critical", risk_score=0.01,
                               hours_recorded=280, words_documented=7000,
                               songs_preserved=60, stories_recorded=120,
                               has_ai_model=True, model_accuracy=0.68),
        ]

        db.add_all(languages)
        await db.commit()
        logger.info(f"📜 Seeded {len(languages)} endangered languages")


# ---- Error Handler ----
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled error: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error", "type": type(exc).__name__},
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
    )
