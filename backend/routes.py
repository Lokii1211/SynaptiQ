"""
SkillSync AI - API Routes
"""

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List, Dict
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from database import get_db
from models import User, Assessment, Career, SavedCareer, Resume, ChatSession
from auth import hash_password, verify_password, create_access_token, require_user
from ai_engine import analyze_assessment, analyze_skill_gap, generate_resume_suggestions, career_chat
from career_data import ASSESSMENT_QUESTIONS

router = APIRouter()


# ============================================================
# Request / Response Models
# ============================================================

class SignupRequest(BaseModel):
    email: str = Field(..., min_length=5)
    name: str = Field(..., min_length=2)
    password: str = Field(..., min_length=6)
    age: Optional[int] = None
    education_level: Optional[str] = None
    city: Optional[str] = None


class LoginRequest(BaseModel):
    email: str
    password: str


class AssessmentSubmitRequest(BaseModel):
    answers: Dict[str, int]  # {question_id: selected_option_index}


class SkillGapRequest(BaseModel):
    current_skills: List[str]
    target_career: str


class ResumeRequest(BaseModel):
    content: Dict  # {name, email, phone, summary, experience, education, skills, projects}
    target_role: str = ""
    template: str = "modern"


class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None


# ============================================================
# Auth Routes
# ============================================================

@router.post("/auth/signup", tags=["Auth"])
async def signup(req: SignupRequest, db: Session = Depends(get_db)):
    """Create a new user account"""
    existing = db.query(User).filter(User.email == req.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        email=req.email,
        name=req.name,
        hashed_password=hash_password(req.password),
        age=req.age,
        education_level=req.education_level,
        city=req.city
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": user.id})

    return {
        "token": token,
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "age": user.age,
            "education_level": user.education_level,
            "city": user.city
        }
    }


@router.post("/auth/login", tags=["Auth"])
async def login(req: LoginRequest, db: Session = Depends(get_db)):
    """Login with email and password"""
    user = db.query(User).filter(User.email == req.email).first()
    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_access_token({"sub": user.id})

    return {
        "token": token,
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "age": user.age,
            "education_level": user.education_level,
            "city": user.city
        }
    }


@router.get("/auth/me", tags=["Auth"])
async def get_me(user: User = Depends(require_user)):
    """Get current user profile"""
    return {
        "id": user.id,
        "email": user.email,
        "name": user.name,
        "age": user.age,
        "education_level": user.education_level,
        "city": user.city,
        "created_at": user.created_at.isoformat() if user.created_at else None
    }


# ============================================================
# Assessment Routes
# ============================================================

@router.get("/assessment/questions", tags=["Assessment"])
async def get_assessment_questions():
    """Get career assessment questions"""
    return {
        "total_questions": len(ASSESSMENT_QUESTIONS),
        "estimated_time": "5-7 minutes",
        "questions": ASSESSMENT_QUESTIONS
    }


@router.post("/assessment/submit", tags=["Assessment"])
async def submit_assessment(
    req: AssessmentSubmitRequest,
    user: User = Depends(require_user),
    db: Session = Depends(get_db)
):
    """Submit assessment answers and get AI-powered career recommendations"""
    # Process answers to extract traits
    trait_scores = {"analytical": 0, "creative": 0, "social": 0, "enterprising": 0, "conventional": 0, "realistic": 0}

    for q_id_str, option_idx in req.answers.items():
        q_id = int(q_id_str)
        question = next((q for q in ASSESSMENT_QUESTIONS if q["id"] == q_id), None)
        if question and 0 <= option_idx < len(question["options"]):
            trait = question["options"][option_idx]["trait"]
            score = question["options"][option_idx]["score"]
            trait_scores[trait] = trait_scores.get(trait, 0) + score

    # Get AI analysis
    results = await analyze_assessment({
        "answers": req.answers,
        "trait_scores": trait_scores,
        "user_age": user.age,
        "education_level": user.education_level
    })

    # Save to database
    assessment = Assessment(
        user_id=user.id,
        assessment_type="career",
        answers=req.answers,
        results=results,
        top_careers=results.get("top_careers"),
        personality_traits=results.get("personality_traits"),
        completed=True
    )
    db.add(assessment)
    db.commit()
    db.refresh(assessment)

    return {
        "assessment_id": assessment.id,
        **results
    }


@router.get("/assessment/results", tags=["Assessment"])
async def get_assessment_results(
    user: User = Depends(require_user),
    db: Session = Depends(get_db)
):
    """Get latest assessment results"""
    assessment = db.query(Assessment).filter(
        Assessment.user_id == user.id,
        Assessment.completed == True
    ).order_by(Assessment.created_at.desc()).first()

    if not assessment:
        return {"has_results": False, "message": "No assessment completed yet"}

    return {
        "has_results": True,
        "assessment_id": assessment.id,
        "completed_at": assessment.created_at.isoformat() if assessment.created_at else None,
        "results": assessment.results,
        "top_careers": assessment.top_careers,
        "personality_traits": assessment.personality_traits
    }


# ============================================================
# Career Explorer Routes
# ============================================================

@router.get("/careers", tags=["Careers"])
async def list_careers(
    category: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Browse all career profiles"""
    query = db.query(Career)
    if category:
        query = query.filter(Career.category == category)
    if search:
        query = query.filter(Career.title.ilike(f"%{search}%"))

    careers = query.order_by(Career.demand_score.desc()).all()

    return {
        "count": len(careers),
        "careers": [
            {
                "id": c.id,
                "title": c.title,
                "slug": c.slug,
                "category": c.category,
                "description": c.description[:150] + "..." if len(c.description) > 150 else c.description,
                "salary_range": f"₹{c.salary_range_min // 100000}L - ₹{c.salary_range_max // 100000}L" if c.salary_range_min else "N/A",
                "growth_outlook": c.growth_outlook,
                "demand_score": c.demand_score,
                "icon": c.icon
            }
            for c in careers
        ]
    }


@router.get("/careers/categories", tags=["Careers"])
async def get_categories(db: Session = Depends(get_db)):
    """Get all career categories"""
    categories = db.query(Career.category).distinct().all()
    category_map = {
        "technology": {"name": "Technology", "icon": "💻", "color": "#6366f1"},
        "business": {"name": "Business", "icon": "💼", "color": "#f59e0b"},
        "design": {"name": "Design", "icon": "🎨", "color": "#ec4899"},
        "finance": {"name": "Finance", "icon": "📈", "color": "#10b981"},
        "healthcare": {"name": "Healthcare", "icon": "🩺", "color": "#ef4444"},
        "engineering": {"name": "Engineering", "icon": "⚙️", "color": "#8b5cf6"},
        "marketing": {"name": "Marketing", "icon": "📱", "color": "#f97316"},
        "government": {"name": "Government", "icon": "🏛️", "color": "#0ea5e9"}
    }
    return {
        "categories": [
            {"key": cat[0], **category_map.get(cat[0], {"name": cat[0].title(), "icon": "📋", "color": "#64748b"})}
            for cat in categories
        ]
    }


@router.get("/careers/{slug}", tags=["Careers"])
async def get_career_detail(slug: str, db: Session = Depends(get_db)):
    """Get detailed career profile"""
    career = db.query(Career).filter(Career.slug == slug).first()
    if not career:
        raise HTTPException(status_code=404, detail="Career not found")

    return {
        "id": career.id,
        "title": career.title,
        "slug": career.slug,
        "category": career.category,
        "icon": career.icon,
        "description": career.description,
        "day_in_life": career.day_in_life,
        "required_skills": career.required_skills,
        "required_education": career.required_education,
        "salary_range": {
            "min": career.salary_range_min,
            "max": career.salary_range_max,
            "formatted": f"₹{career.salary_range_min // 100000}L - ₹{career.salary_range_max // 100000}L"
        },
        "growth_outlook": career.growth_outlook,
        "demand_score": career.demand_score,
        "top_companies": career.top_companies,
        "entrance_exams": career.entrance_exams,
        "related_courses": career.related_courses
    }


# ============================================================
# Skill Gap Analysis
# ============================================================

@router.post("/skills/gap-analysis", tags=["Skills"])
async def skill_gap_analysis(req: SkillGapRequest):
    """AI-powered skill gap analysis"""
    result = await analyze_skill_gap(req.current_skills, req.target_career)
    return result


# ============================================================
# Resume Builder
# ============================================================

@router.post("/resume/create", tags=["Resume"])
async def create_resume(
    req: ResumeRequest,
    user: User = Depends(require_user),
    db: Session = Depends(get_db)
):
    """Create/save a resume"""
    resume = Resume(
        user_id=user.id,
        content=req.content,
        template=req.template,
        title=req.target_role or "My Resume"
    )
    db.add(resume)
    db.commit()
    db.refresh(resume)

    # Get AI suggestions if target role provided
    suggestions = None
    if req.target_role:
        suggestions = await generate_resume_suggestions(req.content, req.target_role)
        resume.ai_suggestions = suggestions
        resume.ats_score = suggestions.get("ats_score")
        db.commit()

    return {
        "resume_id": resume.id,
        "ats_score": resume.ats_score,
        "suggestions": suggestions
    }


@router.get("/resume/list", tags=["Resume"])
async def list_resumes(
    user: User = Depends(require_user),
    db: Session = Depends(get_db)
):
    """Get user's saved resumes"""
    resumes = db.query(Resume).filter(Resume.user_id == user.id).order_by(Resume.updated_at.desc()).all()
    return {
        "count": len(resumes),
        "resumes": [
            {
                "id": r.id,
                "title": r.title,
                "template": r.template,
                "ats_score": r.ats_score,
                "updated_at": r.updated_at.isoformat() if r.updated_at else None
            }
            for r in resumes
        ]
    }


# ============================================================
# AI Career Chat
# ============================================================

@router.post("/chat", tags=["Chat"])
async def chat_with_ai(
    req: ChatRequest,
    user: User = Depends(require_user),
    db: Session = Depends(get_db)
):
    """Chat with AI career counselor"""
    # Find or create session
    session = None
    if req.session_id:
        session = db.query(ChatSession).filter(
            ChatSession.id == req.session_id,
            ChatSession.user_id == user.id
        ).first()

    if not session:
        session = ChatSession(user_id=user.id, title=req.message[:50])
        db.add(session)
        db.commit()
        db.refresh(session)

    # Add user message
    messages = session.messages or []
    messages.append({
        "role": "user",
        "content": req.message,
        "timestamp": datetime.now(timezone.utc).isoformat()
    })

    # Get AI response
    ai_response = await career_chat(req.message, messages)

    messages.append({
        "role": "assistant",
        "content": ai_response,
        "timestamp": datetime.now(timezone.utc).isoformat()
    })

    session.messages = messages
    session.updated_at = datetime.now(timezone.utc)
    db.commit()

    return {
        "session_id": session.id,
        "response": ai_response,
        "messages_count": len(messages)
    }


@router.get("/chat/sessions", tags=["Chat"])
async def get_chat_sessions(
    user: User = Depends(require_user),
    db: Session = Depends(get_db)
):
    """Get user's chat sessions"""
    sessions = db.query(ChatSession).filter(
        ChatSession.user_id == user.id
    ).order_by(ChatSession.updated_at.desc()).all()

    return {
        "sessions": [
            {
                "id": s.id,
                "title": s.title,
                "messages_count": len(s.messages) if s.messages else 0,
                "updated_at": s.updated_at.isoformat() if s.updated_at else None
            }
            for s in sessions
        ]
    }


# ============================================================
# Market Insights (public, no auth required)
# ============================================================

@router.get("/market/trending-skills", tags=["Market"])
async def get_trending_skills():
    """Get trending skills in Indian job market"""
    return {
        "last_updated": "2026-02-17",
        "skills": [
            {"name": "Generative AI / LLMs", "growth": "+340%", "category": "technology", "avg_salary": "₹12-35 LPA"},
            {"name": "Cloud Computing (AWS/Azure)", "growth": "+85%", "category": "technology", "avg_salary": "₹8-25 LPA"},
            {"name": "Full Stack Development", "growth": "+62%", "category": "technology", "avg_salary": "₹6-22 LPA"},
            {"name": "Data Science & Analytics", "growth": "+55%", "category": "technology", "avg_salary": "₹6-30 LPA"},
            {"name": "Cybersecurity", "growth": "+48%", "category": "technology", "avg_salary": "₹5-25 LPA"},
            {"name": "Product Management", "growth": "+42%", "category": "business", "avg_salary": "₹10-35 LPA"},
            {"name": "UI/UX Design", "growth": "+38%", "category": "design", "avg_salary": "₹5-20 LPA"},
            {"name": "DevOps / MLOps", "growth": "+35%", "category": "technology", "avg_salary": "₹8-28 LPA"},
            {"name": "Digital Marketing", "growth": "+30%", "category": "marketing", "avg_salary": "₹3-15 LPA"},
            {"name": "Blockchain Development", "growth": "+25%", "category": "technology", "avg_salary": "₹8-30 LPA"}
        ]
    }


@router.get("/market/salary-insights", tags=["Market"])
async def get_salary_insights(role: Optional[str] = None):
    """Get salary benchmarks"""
    data = {
        "Software Developer": {"fresher": "₹4-8 LPA", "mid": "₹10-20 LPA", "senior": "₹20-40 LPA", "top_cities": ["Bangalore", "Hyderabad", "Pune"]},
        "Data Scientist": {"fresher": "₹6-10 LPA", "mid": "₹12-25 LPA", "senior": "₹25-50 LPA", "top_cities": ["Bangalore", "Mumbai", "Hyderabad"]},
        "Product Manager": {"fresher": "₹8-15 LPA", "mid": "₹18-30 LPA", "senior": "₹30-60 LPA", "top_cities": ["Bangalore", "Mumbai", "Gurgaon"]},
        "UX Designer": {"fresher": "₹4-8 LPA", "mid": "₹10-18 LPA", "senior": "₹18-35 LPA", "top_cities": ["Bangalore", "Mumbai", "Delhi"]},
        "Digital Marketer": {"fresher": "₹3-5 LPA", "mid": "₹6-12 LPA", "senior": "₹12-25 LPA", "top_cities": ["Mumbai", "Delhi", "Bangalore"]}
    }

    if role:
        match = data.get(role, None)
        if match:
            return {"role": role, **match}
        return {"error": "Role not found", "available_roles": list(data.keys())}

    return {"roles": data}
