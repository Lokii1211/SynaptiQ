"""SkillTen — Master API Router"""
from fastapi import APIRouter
from .auth import router as auth_router
from .assessment import router as assessment_router
from .careers import router as careers_router
from .jobs import router as jobs_router
from .internships import router as internships_router
from .coding import router as coding_router
from .learning import router as learning_router
from .challenges import router as challenges_router
from .network import router as network_router
from .companies import router as companies_router
from .resume import router as resume_router
from .chat import router as chat_router
from .notifications import router as notifications_router
from .campus import router as campus_router
from .market import router as market_router
from .ai import router as ai_router

master_router = APIRouter()

master_router.include_router(auth_router, prefix="/auth", tags=["Auth"])
master_router.include_router(assessment_router, prefix="/assessment", tags=["Assessment"])
master_router.include_router(careers_router, prefix="/careers", tags=["Careers"])
master_router.include_router(jobs_router, prefix="/jobs", tags=["Jobs Engine"])
master_router.include_router(internships_router, prefix="/internships", tags=["Internships"])
master_router.include_router(coding_router, prefix="/coding", tags=["Coding Arena"])
master_router.include_router(learning_router, prefix="/learning", tags=["Learning Hub"])
master_router.include_router(challenges_router, prefix="/challenges", tags=["Challenges"])
master_router.include_router(network_router, prefix="/network", tags=["Network"])
master_router.include_router(companies_router, prefix="/companies", tags=["Company Intel"])
master_router.include_router(resume_router, prefix="/resume", tags=["Resume Builder"])
master_router.include_router(chat_router, prefix="/chat", tags=["AI Chat"])
master_router.include_router(notifications_router, prefix="/notifications", tags=["Notifications"])
master_router.include_router(campus_router, prefix="/campus", tags=["Campus"])
master_router.include_router(market_router, prefix="/market", tags=["Market"])
master_router.include_router(ai_router, prefix="/ai", tags=["AI Engine"])
