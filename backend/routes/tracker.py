"""SkillTen — Streak Tracker API (Bible §16)"""
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import datetime, timezone, timedelta
from database import get_db
from auth import require_user

router = APIRouter()


class StreakFreezeReq(BaseModel):
    use_freeze: bool = True


@router.get("/")
def get_streak(user=Depends(require_user), db: Session = Depends(get_db)):
    """Get full streak data for current user"""
    from models import UserProfile

    profile = db.query(UserProfile).filter(UserProfile.user_id == user.id).first()
    if not profile:
        return {"streak_days": 0, "max_streak": 0, "freezes_remaining": 3, "milestones": []}

    streak = profile.streak_days or 0
    max_streak = profile.max_streak if hasattr(profile, 'max_streak') else streak
    freezes = profile.streak_freezes if hasattr(profile, 'streak_freezes') else 3
    last_active = profile.last_active_date if hasattr(profile, 'last_active_date') else None

    # Check if streak is at risk (no activity today)
    today = datetime.now(timezone.utc).date()
    at_risk = False
    if last_active:
        if isinstance(last_active, str):
            last_active = datetime.fromisoformat(last_active).date()
        elif isinstance(last_active, datetime):
            last_active = last_active.date()
        days_since = (today - last_active).days
        at_risk = days_since >= 1 and streak > 0

    # Milestones
    milestones = [
        {"days": 7, "label": "Week Warrior", "icon": "🔥", "xp": 50, "achieved": streak >= 7},
        {"days": 30, "label": "Monthly Machine", "icon": "⚡", "xp": 200, "achieved": streak >= 30},
        {"days": 60, "label": "Two Month Titan", "icon": "💪", "xp": 400, "achieved": streak >= 60},
        {"days": 100, "label": "Centurion", "icon": "💎", "xp": 750, "achieved": streak >= 100},
        {"days": 200, "label": "Double Century", "icon": "🏆", "xp": 1500, "achieved": streak >= 200},
        {"days": 365, "label": "Year Legend", "icon": "👑", "xp": 5000, "achieved": streak >= 365},
    ]

    # Next milestone
    next_milestone = None
    for m in milestones:
        if not m["achieved"]:
            next_milestone = m
            break

    return {
        "streak_days": streak,
        "max_streak": max_streak,
        "freezes_remaining": freezes,
        "at_risk": at_risk,
        "last_active": str(last_active) if last_active else None,
        "milestones": milestones,
        "next_milestone": next_milestone,
        "today_completed": not at_risk and streak > 0,
    }


@router.post("/check-in")
def daily_check_in(user=Depends(require_user), db: Session = Depends(get_db)):
    """Record daily activity and update streak"""
    from models import UserProfile

    profile = db.query(UserProfile).filter(UserProfile.user_id == user.id).first()
    if not profile:
        return {"error": "Profile not found"}

    today = datetime.now(timezone.utc).date()
    yesterday = today - timedelta(days=1)

    last_active = None
    if hasattr(profile, 'last_active_date') and profile.last_active_date:
        last_active = profile.last_active_date
        if isinstance(last_active, str):
            last_active = datetime.fromisoformat(last_active).date()
        elif isinstance(last_active, datetime):
            last_active = last_active.date()

    if last_active == today:
        return {"message": "Already checked in today", "streak_days": profile.streak_days}

    if last_active == yesterday:
        # Continue streak
        profile.streak_days = (profile.streak_days or 0) + 1
    elif last_active and (today - last_active).days == 2:
        # Grace period: 1 day missed, check if freeze available
        freezes = profile.streak_freezes if hasattr(profile, 'streak_freezes') else 3
        if freezes > 0:
            profile.streak_days = (profile.streak_days or 0) + 1
            if hasattr(profile, 'streak_freezes'):
                profile.streak_freezes -= 1
        else:
            profile.streak_days = 1  # Streak broken
    else:
        # Streak broken or first time
        profile.streak_days = 1

    # Update max streak
    if hasattr(profile, 'max_streak'):
        if profile.streak_days > (profile.max_streak or 0):
            profile.max_streak = profile.streak_days

    if hasattr(profile, 'last_active_date'):
        profile.last_active_date = today

    db.commit()

    return {
        "message": "Check-in successful!",
        "streak_days": profile.streak_days,
        "max_streak": getattr(profile, 'max_streak', profile.streak_days),
    }


@router.post("/freeze")
def use_streak_freeze(req: StreakFreezeReq, user=Depends(require_user), db: Session = Depends(get_db)):
    """Use a streak freeze to protect streak"""
    from models import UserProfile

    profile = db.query(UserProfile).filter(UserProfile.user_id == user.id).first()
    if not profile:
        return {"error": "Profile not found"}

    freezes = profile.streak_freezes if hasattr(profile, 'streak_freezes') else 0
    if freezes <= 0:
        return {"error": "No streak freezes remaining", "freezes_remaining": 0}

    if hasattr(profile, 'streak_freezes'):
        profile.streak_freezes -= 1
    db.commit()

    return {
        "message": "Streak freeze activated!",
        "freezes_remaining": getattr(profile, 'streak_freezes', 0),
        "streak_days": profile.streak_days,
    }
