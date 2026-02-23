"""SkillTen Campus Command Center"""
from fastapi import APIRouter, Depends, Query
from typing import Optional
from sqlalchemy.orm import Session
from database import get_db
from models import College, PlacementOutcome, InterviewExperience, User
from auth import require_user

router = APIRouter()

@router.get("/colleges")
def list_colleges(state: Optional[str] = None, tier: Optional[int] = None, skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    q = db.query(College)
    if state:
        q = q.filter(College.state.ilike(f"%{state}%"))
    if tier:
        q = q.filter(College.tier == tier)
    colleges = q.offset(skip).limit(limit).all()
    return {"colleges": [{"id": c.id, "name": c.name, "slug": c.slug, "tier": c.tier, "city": c.city, "state": c.state, "nirf_rank": c.nirf_rank, "placement_rate_viya": c.placement_rate_viya, "avg_ctc_viya": c.avg_ctc_viya} for c in colleges]}

@router.get("/placements")
def placement_outcomes(company: Optional[str] = None, college_tier: Optional[int] = None, skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    q = db.query(PlacementOutcome)
    if company:
        q = q.filter(PlacementOutcome.company_name.ilike(f"%{company}%"))
    if college_tier:
        q = q.filter(PlacementOutcome.college_tier == college_tier)
    outcomes = q.order_by(PlacementOutcome.reported_at.desc()).offset(skip).limit(limit).all()
    return {"outcomes": [{"id": o.id, "company_name": o.company_name, "role_title": o.role_title, "ctc_lpa": o.ctc_lpa, "location": o.location, "college_tier": o.college_tier, "stream": o.stream} for o in outcomes]}

@router.get("/interviews")
def interview_experiences(company: Optional[str] = None, skip: int = 0, limit: int = 20, db: Session = Depends(get_db)):
    q = db.query(InterviewExperience)
    if company:
        q = q.filter(InterviewExperience.company_name.ilike(f"%{company}%"))
    experiences = q.order_by(InterviewExperience.reported_at.desc()).offset(skip).limit(limit).all()
    return {"experiences": [{"id": e.id, "company_name": e.company_name, "role_title": e.role_title, "round_type": e.round_type, "difficulty_rating": e.difficulty_rating, "outcome": e.outcome, "tips_for_next": e.tips_for_next} for e in experiences]}
