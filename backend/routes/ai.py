"""SkillTen AI Routes — exposes all AI engine capabilities"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy.orm import Session

from database import get_db
from models import User
from auth import require_user
from ai_engine import (
    analyze_skill_gap, analyze_resume, review_code,
    calculate_job_match, generate_roadmap, generate_interview_prep,
    generate_reroute_options, generate_parent_report, check_salary_truth,
    salary_negotiation_simulator, career_day_simulator, emotion_aware_intervention
)

router = APIRouter()


class SkillGapReq(BaseModel):
    current_skills: List[str]
    target_career: str

@router.post("/skill-gap")
async def ai_skill_gap(req: SkillGapReq, user: User = Depends(require_user), db: Session = Depends(get_db)):
    ctx = {}
    if user.profile:
        ctx = {"college_tier": user.profile.college_tier, "stream": user.profile.stream, "graduation_year": user.profile.graduation_year}
    result = await analyze_skill_gap(req.current_skills, req.target_career, ctx)
    return result


class ResumeAnalyzeReq(BaseModel):
    resume_data: dict
    target_role: str

@router.post("/resume-review")
async def ai_resume_review(req: ResumeAnalyzeReq, user: User = Depends(require_user)):
    result = await analyze_resume(req.resume_data, req.target_role)
    return result


class CodeReviewReq(BaseModel):
    code: str
    language: str
    problem_title: Optional[str] = ""

@router.post("/code-review")
async def ai_code_review(req: CodeReviewReq, user: User = Depends(require_user)):
    result = await review_code(req.code, req.language, req.problem_title)
    return result


class JobMatchReq(BaseModel):
    job_id: str

@router.post("/job-match")
async def ai_job_match(req: JobMatchReq, user: User = Depends(require_user), db: Session = Depends(get_db)):
    from models import JobListing
    job = db.query(JobListing).filter_by(id=req.job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    
    profile = user.profile
    user_data = {
        "skills": profile.skills if profile and hasattr(profile, 'skills') else [],
        "college_tier": profile.college_tier if profile else None,
        "cgpa": profile.cgpa if profile else None,
        "target_role": profile.target_role if profile else None,
    }
    job_data = {
        "role_title": job.role_title, "company_name": job.company_name,
        "required_skills": job.required_skills, "preferred_skills": job.preferred_skills,
        "company_type": job.company_type, "salary_min_lpa": job.salary_min_lpa,
    }
    result = await calculate_job_match(user_data, job_data)
    return result


class RoadmapGenReq(BaseModel):
    target_career: str
    current_skills: List[str] = []
    hours_per_week: int = 10

@router.post("/generate-roadmap")
async def ai_generate_roadmap(req: RoadmapGenReq, user: User = Depends(require_user), db: Session = Depends(get_db)):
    from models import LearningRoadmap, RoadmapPhase, RoadmapMilestone
    
    ctx = {"hours_per_week": req.hours_per_week}
    if user.profile:
        ctx.update({"college_tier": user.profile.college_tier, "stream": user.profile.stream, "graduation_year": user.profile.graduation_year})
    
    result = await generate_roadmap(req.target_career, req.current_skills, ctx)
    
    # Save to database
    roadmap = LearningRoadmap(
        user_id=user.id,
        target_career_name=req.target_career,
        total_months=result.get("total_months", 6),
        hours_per_week=req.hours_per_week,
    )
    db.add(roadmap)
    db.flush()
    
    for phase_data in result.get("phases", []):
        phase = RoadmapPhase(
            roadmap_id=roadmap.id,
            phase_number=phase_data.get("phase_number", 1),
            title=phase_data.get("title", ""),
            description=phase_data.get("description", ""),
            duration_weeks=phase_data.get("duration_weeks", 4),
        )
        db.add(phase)
        db.flush()
        
        for ms_data in phase_data.get("milestones", []):
            milestone = RoadmapMilestone(
                phase_id=phase.id,
                user_id=user.id,
                milestone_order=ms_data.get("order", 1),
                skill_name=ms_data.get("skill_name", ""),
                resource_name=ms_data.get("resource_name", ""),
                resource_url=ms_data.get("resource_url", ""),
                is_free=ms_data.get("is_free", True),
                estimated_hours=ms_data.get("estimated_hours", 10),
                project_to_build=ms_data.get("project_to_build", ""),
                why_companies_care=ms_data.get("why_companies_care", ""),
            )
            db.add(milestone)
    
    db.commit()
    return {"roadmap_id": roadmap.id, "roadmap": result}


class InterviewPrepReq(BaseModel):
    company: str
    role: str
    round_type: str = "technical"

@router.post("/interview-prep")
async def ai_interview_prep(req: InterviewPrepReq, user: User = Depends(require_user)):
    result = await generate_interview_prep(req.company, req.role, req.round_type)
    return result


# ═══════════════════════════════════════════════════════════════
# Bible XF-08 — Roadmap Rerouting Engine
# ═══════════════════════════════════════════════════════════════

class RerouteReq(BaseModel):
    original_roadmap: dict = {}
    completed_milestones: List[str] = []
    missed_milestones: List[str] = []
    available_hours_per_week: int = 10
    target_career: str = "Software Engineer"
    placement_deadline: Optional[str] = None

@router.post("/reroute-roadmap")
async def ai_reroute_roadmap(req: RerouteReq, user: User = Depends(require_user)):
    """Bible XF-08 — When student falls behind, generate 3 reroute options"""
    student_profile = {}
    if user.profile:
        student_profile = {
            "college_tier": user.profile.college_tier,
            "stream": user.profile.stream,
            "graduation_year": user.profile.graduation_year,
            "display_name": user.display_name,
        }
    result = await generate_reroute_options(
        req.original_roadmap, req.completed_milestones, req.missed_milestones,
        student_profile, req.available_hours_per_week, req.target_career, req.placement_deadline
    )
    return result


# ═══════════════════════════════════════════════════════════════
# Bible XF-10 — Parent Report Generator
# ═══════════════════════════════════════════════════════════════

@router.get("/parent-report")
async def ai_parent_report(user: User = Depends(require_user)):
    """Bible XF-10 — Weekly parent-friendly progress report"""
    student_profile = {
        "display_name": user.display_name,
        "email": user.email,
    }
    if user.profile:
        student_profile.update({
            "target_role": user.profile.target_role,
            "college_name": user.profile.college_name,
        })
    weekly_activity = {
        "problems_solved": 8,
        "modules_completed": 1,
        "streak_days": 12,
        "hours_spent": 6,
    }
    result = await generate_parent_report(student_profile, weekly_activity)
    return result


# ═══════════════════════════════════════════════════════════════
# Bible XF-10 — Salary Truth Checker
# ═══════════════════════════════════════════════════════════════

class SalaryTruthReq(BaseModel):
    ctc_lpa: float
    role: str
    city: str

@router.post("/salary-truth")
async def ai_salary_truth(req: SalaryTruthReq, user: User = Depends(require_user)):
    """Bible XF-10 — CTC vs in-hand salary breakdown for parents"""
    college_tier = user.profile.college_tier if user.profile else 2
    result = await check_salary_truth(req.ctc_lpa, req.role, req.city, college_tier)
    return result


# ═══════════════════════════════════════════════════════════════
# Bible 05-D — Salary Negotiation Simulator
# ═══════════════════════════════════════════════════════════════

class NegotiateReq(BaseModel):
    company_type: str = "MNC"
    role: str = "Software Engineer"
    initial_offer_lpa: float = 8.0
    budget_ceiling_lpa: float = 12.0
    scenario: str = "campus_placement"
    student_message: str = ""
    conversation_history: list = []

@router.post("/negotiate-salary")
async def ai_negotiate_salary(req: NegotiateReq, user: User = Depends(require_user)):
    """Bible 05-D — Interactive salary negotiation simulator with HR recruiter persona"""
    result = await salary_negotiation_simulator(
        req.company_type, req.role, req.initial_offer_lpa,
        req.budget_ceiling_lpa, req.scenario,
        req.student_message, req.conversation_history
    )
    return result


# ═══════════════════════════════════════════════════════════════
# Bible 05-G — Career Day Simulator
# ═══════════════════════════════════════════════════════════════

class CareerDayReq(BaseModel):
    career: str = "Software Engineer"
    company_type: str = "startup"
    city: str = "Bangalore"
    level: str = "fresher"
    student_choice: str = ""
    decision_number: int = 0
    conversation_history: list = []

@router.post("/career-day-simulator")
async def ai_career_day(req: CareerDayReq, user: User = Depends(require_user)):
    """Bible 05-G — Interactive day-in-the-life career simulation"""
    result = await career_day_simulator(
        req.career, req.company_type, req.city, req.level,
        req.student_choice, req.decision_number, req.conversation_history
    )
    return result


# ═══════════════════════════════════════════════════════════════
# Bible 05-F — Emotion-Aware Intervention
# ═══════════════════════════════════════════════════════════════

class EmotionReq(BaseModel):
    signal_type: str = "burnout"
    student_data: dict = {}
    positive_history: list = []

@router.post("/wellbeing-check")
async def ai_wellbeing_check(req: EmotionReq, user: User = Depends(require_user)):
    """Bible 05-F — Triggered by behavioral signals — wellbeing support"""
    result = await emotion_aware_intervention(
        req.signal_type, req.student_data, req.positive_history
    )
    return result


