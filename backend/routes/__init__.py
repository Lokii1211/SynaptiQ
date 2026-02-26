"""SkillTen — Master API Router (Bible-Complete)"""
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
# ─── New Bible-required routes ───
from .aptitude import router as aptitude_router
from .skills import router as skills_router
from .parent import router as parent_router
from .leaderboard import router as leaderboard_router
from .profile import router as profile_router
from .mock_drive import router as mock_drive_router
from .score import router as score_router
from .achievements import router as achievements_router
from .tracker import router as tracker_router
from .referral import router as referral_router
from .community import router as community_router
from .connections import router as connections_router
from .email import router as email_router
from .recruiter import router as recruiter_router

master_router = APIRouter()

master_router.include_router(auth_router, prefix="/auth", tags=["Auth"])
master_router.include_router(assessment_router, prefix="/assessment", tags=["Assessment 4D"])
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
# ─── Bible-required routes ───
master_router.include_router(aptitude_router, prefix="/aptitude", tags=["Aptitude Engine"])
master_router.include_router(skills_router, prefix="/skills", tags=["Skill Verification"])
master_router.include_router(parent_router, prefix="/parent", tags=["Parent Portal"])
master_router.include_router(leaderboard_router, prefix="/leaderboard", tags=["Leaderboard & Campus Wars"])
master_router.include_router(profile_router, prefix="/profile", tags=["Public Profile"])
master_router.include_router(mock_drive_router, prefix="/mock-drive", tags=["Mock Placement Drive"])
master_router.include_router(score_router, prefix="/score", tags=["Viya Score™"])
master_router.include_router(achievements_router, prefix="/achievements", tags=["Achievements"])
master_router.include_router(tracker_router, prefix="/tracker", tags=["Streak Tracker"])
master_router.include_router(referral_router, prefix="/referral", tags=["Referral System"])
master_router.include_router(community_router, prefix="/community", tags=["Community Forum"])
master_router.include_router(connections_router, prefix="/connections", tags=["Connections"])
master_router.include_router(email_router, prefix="/email", tags=["Email Service"])
master_router.include_router(recruiter_router, prefix="/recruiter", tags=["Recruiter Portal"])

