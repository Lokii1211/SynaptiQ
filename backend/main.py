"""
SkillTen — AI Career Intelligence Platform
Main application entry point
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn
import os

from database import init_db, SessionLocal
from routes import master_router
from websocket_hub import router as ws_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Initialize database on startup"""
    try:
        init_db()

        # Seed data if database is empty
        db = SessionLocal()
        try:
            from models import Career
            if db.query(Career).count() == 0:
                try:
                    from seed_data import seed_all
                    seed_all(db)
                    print("✅ SkillTen seed data loaded")
                except Exception as e:
                    print(f"⚠️ Seed data error (non-fatal): {e}")
        finally:
            db.close()
    except Exception as e:
        print(f"⚠️ Database init error (non-fatal on serverless): {e}")

    yield


app = FastAPI(
    title="SkillTen",
    description="""
## SkillTen — AI Career Intelligence Platform

**Discover. Plan. Achieve.**

### Core Features
- 🧬 **4D Career Assessment** — Psychometric profiling (Analytical × Interpersonal × Creative × Systematic)
- 🎯 **Career Explorer** — 200+ career profiles with salary data
- 💻 **Coding Arena** — LeetCode-style problems with AI code review
- 🧠 **Aptitude Lab** — TCS/Infosys-pattern mock tests
- 🏆 **Challenges** — Company-sponsored competitions with fast-track offers
- 🤝 **Network** — Peer matching + community
- 🏢 **Company Intel** — Glassdoor-killer with honest reviews
- 📊 **Market Insights** — Trending skills and salary benchmarks
- 📝 **Resume Builder** — ATS-optimized with AI suggestions
- 💬 **AI Chat** — Career advisor chatbot (Gemini-powered)
- 🎓 **Campus Command** — Placement data + interview experiences
- 🤖 **AI Engine** — Skill gap, code review, job match, roadmap generation, interview prep

Built for Indian students. Powered by AI.
    """,
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(master_router, prefix="/api")
app.include_router(ws_router, prefix="/api", tags=["WebSocket"])


@app.get("/")
def root():
    return {
        "platform": "SkillTen",
        "tagline": "AI Career Intelligence Platform",
        "version": "2.1.0",
        "docs": "/docs",
        "websocket": "/api/ws/{user_id}",
        "features": ["Google OAuth", "WebSocket Notifications", "Email Service", "4 Languages"]
    }


@app.get("/health")
def health():
    return {"status": "healthy", "platform": "SkillTen"}


if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=os.getenv("ENV") != "production")
