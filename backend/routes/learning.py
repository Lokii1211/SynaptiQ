"""Mentixy Learning Roadmaps — generate, track, milestone progress"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from database import get_db
from models import LearningRoadmap, RoadmapPhase, RoadmapMilestone, User
from auth import require_user

router = APIRouter()


@router.get("/roadmaps")
def my_roadmaps(user: User = Depends(require_user), db: Session = Depends(get_db)):
    roadmaps = db.query(LearningRoadmap).filter_by(user_id=user.id).order_by(LearningRoadmap.generated_at.desc()).all()
    return {"roadmaps": [{
        "id": r.id, "target_career": r.target_career_name, "total_months": r.total_months,
        "completion_pct": r.completion_pct, "is_active": r.is_active,
        "hours_per_week": r.hours_per_week,
    } for r in roadmaps]}


@router.get("/roadmaps/{roadmap_id}")
def get_roadmap(roadmap_id: str, user: User = Depends(require_user), db: Session = Depends(get_db)):
    r = db.query(LearningRoadmap).filter_by(id=roadmap_id, user_id=user.id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Roadmap not found")
    phases = db.query(RoadmapPhase).filter_by(roadmap_id=r.id).order_by(RoadmapPhase.phase_number).all()
    return {
        "id": r.id, "target_career": r.target_career_name, "total_months": r.total_months,
        "completion_pct": r.completion_pct, "hours_per_week": r.hours_per_week,
        "phases": [{
            "id": ph.id, "phase_number": ph.phase_number, "title": ph.title,
            "description": ph.description, "duration_weeks": ph.duration_weeks,
            "status": ph.status, "completion_pct": ph.completion_pct,
            "milestones": [{
                "id": m.id, "skill_name": m.skill_name, "resource_name": m.resource_name,
                "resource_url": m.resource_url, "estimated_hours": m.estimated_hours,
                "project_to_build": m.project_to_build, "status": m.status,
                "why_companies_care": m.why_companies_care,
            } for m in db.query(RoadmapMilestone).filter_by(phase_id=ph.id).order_by(RoadmapMilestone.milestone_order).all()]
        } for ph in phases]
    }


@router.post("/milestones/{milestone_id}/complete")
def complete_milestone(milestone_id: str, user: User = Depends(require_user), db: Session = Depends(get_db)):
    m = db.query(RoadmapMilestone).filter_by(id=milestone_id, user_id=user.id).first()
    if not m:
        raise HTTPException(status_code=404, detail="Milestone not found")
    m.status = "completed"
    m.completed_at = datetime.now(timezone.utc)
    db.commit()
    return {"status": "completed"}
