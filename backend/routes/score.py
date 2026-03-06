"""SkillTen Score Route — compute and return Viya Score™
Bible Section 1 (Prompt 1.2 §6) + Section 4 (Prompt 4.1 §6)
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import User, UserViyaScoreLog
from auth import require_user
from score_calculator import calculate_viya_score

router = APIRouter()


@router.get("")
def get_score(
    user: User = Depends(require_user),
    db: Session = Depends(get_db),
):
    """Get current SkillTen Score™ overview."""
    profile = user.profile
    return {
        "viya_score": profile.viya_score if profile else 0,
        "streak_days": profile.streak_days if profile else 0,
        "archetype_name": profile.archetype_name if profile else None,
        "archetype_code": profile.archetype_code if profile else None,
    }


@router.post("/calculate")
def recalculate_score(
    user: User = Depends(require_user),
    db: Session = Depends(get_db),
):
    """Recalculate the user's Viya Score™ with full breakdown."""
    result = calculate_viya_score(user.id, db)
    return result


@router.get("/current")
def current_score(
    user: User = Depends(require_user),
    db: Session = Depends(get_db),
):
    """Get current Viya Score™ without recalculating."""
    profile = user.profile
    return {
        "viya_score": profile.viya_score if profile else 0,
        "streak_days": profile.streak_days if profile else 0,
        "archetype_name": profile.archetype_name if profile else None,
    }


@router.get("/history")
def score_history(
    limit: int = 30,
    user: User = Depends(require_user),
    db: Session = Depends(get_db),
):
    """Get Viya Score™ history for trend chart."""
    logs = db.query(UserViyaScoreLog).filter_by(
        user_id=user.id,
    ).order_by(UserViyaScoreLog.calculated_at.desc()).limit(limit).all()

    return {
        "history": [{
            "score": l.score,
            "delta": l.delta,
            "breakdown": l.score_breakdown,
            "calculated_at": l.calculated_at.isoformat() if l.calculated_at else None,
        } for l in reversed(logs)],
    }
