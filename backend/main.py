"""
SkillSync AI - Main Application
AI-Powered Career Guidance Platform
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

from database import init_db, SessionLocal
from models import Career
from career_data import CAREERS
from routes import router


def seed_careers():
    """Seed career data if database is empty"""
    db = SessionLocal()
    try:
        count = db.query(Career).count()
        if count == 0:
            print("📦 Seeding career data...")
            for career_data in CAREERS:
                career = Career(**career_data)
                db.add(career)
            db.commit()
            print(f"✅ Seeded {len(CAREERS)} careers")
        else:
            print(f"📋 {count} careers already in database")
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown"""
    print("🚀 SkillSync AI Starting...")
    print("━" * 40)
    init_db()
    print("✅ Database initialized")
    seed_careers()
    print("━" * 40)
    print("🎯 SkillSync AI is READY!")
    print("   → API Docs: http://localhost:8000/docs")
    print("━" * 40)
    yield
    print("👋 SkillSync AI shutting down...")


app = FastAPI(
    title="SkillSync AI",
    description="""
## AI-Powered Career Guidance Platform

**Discover. Plan. Achieve.**

### Features
- 🧠 **AI Career Assessment** — Psychometric test with AI-powered recommendations
- 🔍 **Career Explorer** — 200+ career profiles with salary data
- 📊 **Skill Gap Analyzer** — Know exactly what to learn next
- 📝 **AI Resume Builder** — ATS-optimized resumes in minutes
- 💬 **AI Career Chat** — Ask anything about careers
- 📈 **Market Insights** — Trending skills and salary benchmarks

Built for Indian students. Powered by AI.
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(router, prefix="/api")


@app.get("/", tags=["System"])
async def root():
    return {
        "name": "SkillSync AI",
        "tagline": "Discover. Plan. Achieve.",
        "version": "1.0.0",
        "docs": "/docs",
        "endpoints": {
            "auth": "/api/auth/*",
            "assessment": "/api/assessment/*",
            "careers": "/api/careers",
            "skills": "/api/skills/*",
            "resume": "/api/resume/*",
            "chat": "/api/chat",
            "market": "/api/market/*"
        }
    }


@app.get("/health", tags=["System"])
async def health():
    return {"status": "healthy", "version": "1.0.0"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
