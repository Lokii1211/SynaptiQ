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
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://synaptiqq.vercel.app",
        "https://skillten.vercel.app",
        "http://localhost:3000",
        "http://localhost:8000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(master_router, prefix="/api")
app.include_router(ws_router, prefix="/api", tags=["WebSocket"])


# ─── Universal Search ───
from fastapi import Query as Q, Depends
from sqlalchemy.orm import Session
from database import get_db

@app.get("/api/search")
def universal_search(
    q: str = Q(..., min_length=1, max_length=100),
    db: Session = Depends(get_db),
):
    """Search across users, careers, coding problems, and skills."""
    from models import User, UserProfile, Career, CodingProblem, SkillsTaxonomy
    import re
    search = f"%{q}%"
    results = {"query": q, "users": [], "careers": [], "problems": [], "skills": []}

    # Search users
    users = db.query(UserProfile).filter(
        (UserProfile.display_name.ilike(search)) |
        (UserProfile.username.ilike(search))
    ).limit(5).all()
    results["users"] = [{"username": u.username, "display_name": u.display_name, "avatar_url": u.avatar_url} for u in users]

    # Search careers
    careers = db.query(Career).filter(
        (Career.title.ilike(search)) |
        (Career.description.ilike(search))
    ).limit(5).all()
    results["careers"] = [{"slug": c.slug, "title": c.title, "category": c.category} for c in careers]

    # Search coding problems
    problems = db.query(CodingProblem).filter(
        (CodingProblem.title.ilike(search)) |
        (CodingProblem.category.ilike(search))
    ).limit(5).all()
    results["problems"] = [{"slug": p.slug, "title": p.title, "difficulty": p.difficulty} for p in problems]

    # Search skills
    skills = db.query(SkillsTaxonomy).filter(
        (SkillsTaxonomy.name.ilike(search))
    ).limit(5).all()
    results["skills"] = [{"slug": s.slug, "name": s.name, "category": s.category} for s in skills]

    results["total"] = sum(len(v) for v in results.values() if isinstance(v, list))
    return results


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


@app.get("/api/health")
def api_health():
    """Health check accessible through frontend rewrite."""
    return {"status": "healthy", "platform": "SkillTen"}


@app.get("/health/db")
def health_db():
    """Diagnostic endpoint — shows database status"""
    from database import DATABASE_URL, SessionLocal
    from sqlalchemy import text
    # Mask password in URL for display
    import re
    safe_url = re.sub(r':([^@]+)@', ':****@', DATABASE_URL[:80])
    info = {
        "db_type": "postgresql" if "postgresql" in DATABASE_URL else "sqlite",
        "db_url_safe": safe_url,
        "connection": "unknown",
        "tables": {},
        "error": None,
    }
    try:
        db = SessionLocal()
        # Test connection
        db.execute(text("SELECT 1"))
        info["connection"] = "ok"
        # Check key tables
        for table in ["users", "user_profiles", "careers", "questions", "coding_problems"]:
            try:
                result = db.execute(text(f"SELECT COUNT(*) FROM {table}"))
                count = result.scalar()
                info["tables"][table] = count
            except Exception as e:
                info["tables"][table] = f"ERROR: {str(e)[:100]}"
        db.close()
    except Exception as e:
        info["connection"] = "failed"
        info["error"] = str(e)[:500]
    return info


@app.get("/api/health/db")
def api_health_db():
    """DB health accessible through frontend rewrite."""
    return health_db()


@app.post("/api/admin/seed")
def trigger_seed():
    """Manually trigger database seeding — safe to call multiple times (idempotent)."""
    results = {}
    db = SessionLocal()
    try:
        from seed_problems import seed_coding_problems
        results["coding_problems"] = seed_coding_problems(db)
    except Exception as e:
        results["coding_problems_error"] = str(e)[:200]
    try:
        from seed_aptitude import seed_aptitude_questions
        results["aptitude_questions"] = seed_aptitude_questions(db)
    except Exception as e:
        results["aptitude_questions_error"] = str(e)[:200]
    try:
        from seed_data import seed_all
        seed_all(db)
        results["full_seed"] = "completed"
    except Exception as e:
        results["full_seed_error"] = str(e)[:200]
    db.close()
    return {"status": "ok", "results": results}


if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=os.getenv("ENV") != "production")

