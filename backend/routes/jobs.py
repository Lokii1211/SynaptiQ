"""SkillTen Jobs Engine — listing, search, apply, track, AI match"""
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from database import get_db
from models import JobListing, UserJobApplication, User
from auth import require_user

router = APIRouter()


@router.get("")
def list_jobs(
    q: Optional[str] = None,
    role_type: Optional[str] = None,
    location: Optional[str] = None,
    min_salary: Optional[float] = None,
    company_type: Optional[str] = None,
    skip: int = 0, limit: int = 20,
    db: Session = Depends(get_db)
):
    query = db.query(JobListing).filter(JobListing.is_active == True)
    if q:
        query = query.filter(
            (JobListing.role_title.ilike(f"%{q}%")) |
            (JobListing.company_name.ilike(f"%{q}%"))
        )
    if role_type:
        query = query.filter(JobListing.role_type == role_type)
    if location:
        query = query.filter(JobListing.location.ilike(f"%{location}%"))
    if min_salary:
        query = query.filter(JobListing.salary_min_lpa >= min_salary)
    if company_type:
        query = query.filter(JobListing.company_type == company_type)

    total = query.count()
    jobs = query.order_by(JobListing.posted_at.desc()).offset(skip).limit(limit).all()
    return {"total": total, "jobs": [_job_dict(j) for j in jobs]}


@router.get("/{job_id}")
def get_job(job_id: str, db: Session = Depends(get_db)):
    job = db.query(JobListing).filter(JobListing.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return _job_dict(job)


@router.get("/matched")
def matched_jobs(user: User = Depends(require_user), db: Session = Depends(get_db)):
    profile = user.profile
    if not profile:
        return {"jobs": []}
    query = db.query(JobListing).filter(JobListing.is_active == True)
    if profile.graduation_year:
        query = query.filter(
            (JobListing.graduation_year_min <= profile.graduation_year) |
            (JobListing.graduation_year_min == None)
        )
    jobs = query.order_by(JobListing.posted_at.desc()).limit(20).all()
    return {"jobs": [_job_dict(j) for j in jobs]}


class ApplyReq(BaseModel):
    resume_version_id: Optional[str] = None
    cover_letter: Optional[str] = None

@router.post("/{job_id}/apply")
def apply_job(job_id: str, req: ApplyReq, user: User = Depends(require_user), db: Session = Depends(get_db)):
    existing = db.query(UserJobApplication).filter_by(user_id=user.id, job_id=job_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already applied")
    app = UserJobApplication(
        user_id=user.id, job_id=job_id, status="applied",
        applied_at=datetime.now(timezone.utc),
        resume_version_id=req.resume_version_id,
        cover_letter=req.cover_letter
    )
    db.add(app)
    db.commit()
    return {"status": "applied", "application_id": app.id}


@router.get("/applications/me")
def my_applications(user: User = Depends(require_user), db: Session = Depends(get_db)):
    apps = db.query(UserJobApplication).filter_by(user_id=user.id).order_by(UserJobApplication.created_at.desc()).all()
    return {"applications": [{
        "id": a.id, "job_id": a.job_id, "status": a.status,
        "applied_at": str(a.applied_at) if a.applied_at else None,
        "match_score": a.match_score, "notes": a.notes,
        "job": _job_dict(a.job) if a.job else None
    } for a in apps]}


class UpdateAppReq(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None

@router.patch("/applications/{app_id}")
def update_application(app_id: str, req: UpdateAppReq, user: User = Depends(require_user), db: Session = Depends(get_db)):
    app = db.query(UserJobApplication).filter_by(id=app_id, user_id=user.id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    if req.status:
        app.status = req.status
    if req.notes is not None:
        app.notes = req.notes
    db.commit()
    return {"status": "updated"}


def _job_dict(j: JobListing):
    return {
        "id": j.id, "company_name": j.company_name, "company_logo_url": j.company_logo_url,
        "company_type": j.company_type, "role_title": j.role_title, "role_type": j.role_type,
        "location": j.location, "is_remote": j.is_remote,
        "salary_min_lpa": j.salary_min_lpa, "salary_max_lpa": j.salary_max_lpa,
        "required_skills": j.required_skills, "preferred_skills": j.preferred_skills,
        "description_honest": j.description_honest,
        "interview_rounds": j.interview_rounds, "interview_difficulty": j.interview_difficulty,
        "application_deadline": str(j.application_deadline) if j.application_deadline else None,
        "posted_at": str(j.posted_at), "source": j.source, "is_verified": j.is_verified,
        "funding_stage": j.funding_stage, "team_size_range": j.team_size_range,
    }
