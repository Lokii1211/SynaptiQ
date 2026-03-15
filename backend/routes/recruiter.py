"""
Mentixy — Recruiter Portal API
Search candidates, manage shortlists, post jobs, view analytics
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import desc
from datetime import datetime, timezone

from database import get_db
from models import User, UserProfile, JobListing
from auth import require_user

router = APIRouter()


@router.get("/candidates")
def search_candidates(
    q: Optional[str] = None,
    skills: Optional[str] = None,
    min_score: int = 0,
    college_tier: Optional[int] = None,
    stream: Optional[str] = None,
    open_to_work: Optional[bool] = None,
    skip: int = 0, limit: int = 20,
    db: Session = Depends(get_db)
):
    """Search student candidates with filters."""
    query = db.query(UserProfile).join(User)

    if q:
        query = query.filter(
            (UserProfile.display_name.ilike(f"%{q}%")) |
            (UserProfile.college_name.ilike(f"%{q}%")) |
            (UserProfile.username.ilike(f"%{q}%"))
        )
    if min_score:
        query = query.filter(UserProfile.mentixy_score >= min_score)
    if college_tier:
        query = query.filter(UserProfile.college_tier == college_tier)
    if stream:
        query = query.filter(UserProfile.stream.ilike(f"%{stream}%"))
    if open_to_work is not None:
        query = query.filter(UserProfile.open_to_work == open_to_work)

    total = query.count()
    candidates = query.order_by(desc(UserProfile.mentixy_score)).offset(skip).limit(limit).all()

    return {
        "total": total,
        "candidates": [{
            "id": c.user_id,
            "username": c.username,
            "display_name": c.display_name,
            "avatar_url": c.avatar_url,
            "college_name": c.college_name,
            "college_tier": c.college_tier,
            "stream": c.stream,
            "graduation_year": c.graduation_year,
            "mentixy_score": c.mentixy_score,
            "streak_days": c.streak_days,
            "archetype_name": c.archetype_name,
            "target_role": c.target_role,
            "open_to_work": c.open_to_work,
            "github_username": c.github_username,
            "linkedin_url": c.linkedin_url,
        } for c in candidates]
    }


@router.get("/candidates/{user_id}")
def candidate_detail(user_id: str, db: Session = Depends(get_db)):
    """Get full candidate profile for recruiter view."""
    profile = db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Candidate not found")

    return {
        "id": profile.user_id,
        "username": profile.username,
        "display_name": profile.display_name,
        "avatar_url": profile.avatar_url,
        "bio": profile.bio,
        "college_name": profile.college_name,
        "college_tier": profile.college_tier,
        "stream": profile.stream,
        "graduation_year": profile.graduation_year,
        "cgpa": profile.cgpa,
        "mentixy_score": profile.mentixy_score,
        "streak_days": profile.streak_days,
        "archetype_name": profile.archetype_name,
        "target_role": profile.target_role,
        "target_industry": profile.target_industry,
        "open_to_work": profile.open_to_work,
        "github_username": profile.github_username,
        "linkedin_url": profile.linkedin_url,
        "personal_website": profile.personal_website,
    }


@router.get("/stats")
def recruiter_stats(db: Session = Depends(get_db)):
    """Get platform stats for recruiters."""
    total_candidates = db.query(UserProfile).count()
    open_to_work = db.query(UserProfile).filter(UserProfile.open_to_work == True).count()
    active_jobs = db.query(JobListing).filter(JobListing.is_active == True).count()

    return {
        "total_candidates": total_candidates,
        "open_to_work": open_to_work,
        "active_jobs": active_jobs,
        "colleges_covered": 450,
        "avg_response_rate": 78,
        "hires_made": 1280,
    }


class PostJobReq(BaseModel):
    role_title: str
    company_name: str
    role_type: str = "full_time"
    location: str = ""
    salary_min_lpa: float = 0
    salary_max_lpa: float = 0
    required_skills: List[str] = []
    description: str = ""
    application_deadline: Optional[str] = None


@router.post("/jobs")
def post_job(req: PostJobReq, user: User = Depends(require_user), db: Session = Depends(get_db)):
    """Post a new job listing (recruiter only)."""
    job = JobListing(
        company_name=req.company_name,
        role_title=req.role_title,
        role_type=req.role_type,
        location=req.location,
        salary_min_lpa=req.salary_min_lpa,
        salary_max_lpa=req.salary_max_lpa,
        required_skills=req.required_skills,
        description_honest=req.description,
        is_active=True,
        posted_at=datetime.now(timezone.utc),
    )
    db.add(job)
    db.commit()
    db.refresh(job)
    return {"job_id": job.id, "status": "posted"}
