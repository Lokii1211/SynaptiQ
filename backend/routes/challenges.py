"""Mentixy Challenges — list, detail, register, submit"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from database import get_db
from models import Challenge, ChallengeRegistration, User
from auth import require_user

router = APIRouter()


@router.get("")
def list_challenges(
    status: Optional[str] = None, challenge_type: Optional[str] = None,
    skip: int = 0, limit: int = 20, db: Session = Depends(get_db)
):
    q = db.query(Challenge)
    if status:
        q = q.filter(Challenge.status == status)
    if challenge_type:
        q = q.filter(Challenge.challenge_type == challenge_type)
    total = q.count()
    challenges = q.order_by(Challenge.start_at.desc()).offset(skip).limit(limit).all()
    return {"total": total, "challenges": [{
        "id": c.id, "title": c.title, "slug": c.slug, "type": c.challenge_type,
        "sponsor": c.sponsor_company, "difficulty": c.difficulty,
        "prizes": c.prizes, "fast_track_offer": c.fast_track_offer,
        "start_at": str(c.start_at) if c.start_at else None,
        "end_at": str(c.end_at) if c.end_at else None,
        "status": c.status, "total_registrations": c.total_registrations,
    } for c in challenges]}


@router.get("/{slug}")
def get_challenge(slug: str, db: Session = Depends(get_db)):
    c = db.query(Challenge).filter(Challenge.slug == slug).first()
    if not c:
        raise HTTPException(status_code=404, detail="Challenge not found")
    return {
        "id": c.id, "title": c.title, "slug": c.slug, "type": c.challenge_type,
        "description": c.description, "rules": c.rules, "prizes": c.prizes,
        "sponsor": c.sponsor_company, "difficulty": c.difficulty,
        "start_at": str(c.start_at) if c.start_at else None,
        "end_at": str(c.end_at) if c.end_at else None,
        "registration_deadline": str(c.registration_deadline) if c.registration_deadline else None,
        "is_team_challenge": c.is_team_challenge, "team_size_min": c.team_size_min,
        "team_size_max": c.team_size_max, "status": c.status,
        "total_registrations": c.total_registrations,
    }


@router.post("/{slug}/register")
def register_challenge(slug: str, user: User = Depends(require_user), db: Session = Depends(get_db)):
    challenge = db.query(Challenge).filter(Challenge.slug == slug).first()
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    existing = db.query(ChallengeRegistration).filter_by(challenge_id=challenge.id, user_id=user.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already registered")
    reg = ChallengeRegistration(challenge_id=challenge.id, user_id=user.id)
    db.add(reg)
    challenge.total_registrations = (challenge.total_registrations or 0) + 1
    db.commit()
    return {"status": "registered", "registration_id": reg.id}


@router.get("/my/registrations")
def my_registrations(user: User = Depends(require_user), db: Session = Depends(get_db)):
    regs = db.query(ChallengeRegistration).filter_by(user_id=user.id).all()
    return {"registrations": [{
        "id": r.id, "challenge_id": r.challenge_id, "status": r.status,
        "score": r.score, "rank": r.rank,
    } for r in regs]}
