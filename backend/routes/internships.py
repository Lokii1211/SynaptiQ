"""SkillTen Internships — filtered view of job_listings where role_type=internship"""
from fastapi import APIRouter, Depends, Query
from typing import Optional
from sqlalchemy.orm import Session
from database import get_db
from models import JobListing

router = APIRouter()

@router.get("/")
def list_internships(
    q: Optional[str] = None, location: Optional[str] = None,
    is_remote: Optional[bool] = None,
    skip: int = 0, limit: int = 20, db: Session = Depends(get_db)
):
    query = db.query(JobListing).filter(JobListing.role_type == "internship", JobListing.is_active == True)
    if q:
        query = query.filter((JobListing.role_title.ilike(f"%{q}%")) | (JobListing.company_name.ilike(f"%{q}%")))
    if location:
        query = query.filter(JobListing.location.ilike(f"%{location}%"))
    if is_remote is not None:
        query = query.filter(JobListing.is_remote == is_remote)
    total = query.count()
    internships = query.order_by(JobListing.posted_at.desc()).offset(skip).limit(limit).all()
    return {"total": total, "internships": [{
        "id": j.id, "company_name": j.company_name, "role_title": j.role_title,
        "location": j.location, "is_remote": j.is_remote,
        "stipend_monthly": j.stipend_monthly,
        "required_skills": j.required_skills, "posted_at": str(j.posted_at),
    } for j in internships]}
