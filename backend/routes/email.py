"""
SkillTen — Email API Routes
Endpoints for triggering emails (internal use + admin)
"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from typing import Optional
from sqlalchemy.orm import Session

from database import get_db
from models import User
from auth import require_user
from email_service import (
    send_welcome_email,
    send_streak_reminder,
    send_weekly_digest,
    send_achievement_email,
    send_placement_match,
    send_password_reset,
)

router = APIRouter()


class SendEmailReq(BaseModel):
    email_type: str
    data: dict = {}


class PasswordResetReq(BaseModel):
    email: EmailStr


@router.post("/send")
def send_email_endpoint(req: SendEmailReq, user: User = Depends(require_user)):
    """Send an email to the authenticated user (for testing/triggers)."""
    profile = user.profile
    name = profile.display_name if profile else "User"
    email = user.email

    if req.email_type == "welcome":
        success = send_welcome_email(email, name)
    elif req.email_type == "streak_reminder":
        success = send_streak_reminder(email, name, req.data.get("streak_days", 7), req.data.get("hours_left", 6))
    elif req.email_type == "weekly_digest":
        success = send_weekly_digest(email, name, {
            "skillten_score": req.data.get("skillten_score", profile.viya_score if profile else 0),
            "streak_days": req.data.get("streak_days", profile.streak_days if profile else 0),
            "problems_solved": req.data.get("problems_solved", 0),
            "rank_change": req.data.get("rank_change", 0),
        })
    elif req.email_type == "achievement":
        success = send_achievement_email(email, name, req.data.get("badge_name", "First Steps"), req.data.get("xp", 50))
    elif req.email_type == "job_match":
        success = send_placement_match(email, name, req.data.get("company", "TCS"), req.data.get("role", "Software Engineer"), req.data.get("match_pct", 85))
    else:
        raise HTTPException(status_code=400, detail=f"Unknown email type: {req.email_type}")

    return {"success": success, "email_type": req.email_type, "sent_to": email}


@router.post("/password-reset")
def request_password_reset(req: PasswordResetReq, db: Session = Depends(get_db)):
    """Request a password reset email (public endpoint)."""
    user = db.query(User).filter(User.email == req.email).first()
    if not user:
        # Don't reveal if email exists — always return success
        return {"success": True, "message": "If the email exists, a reset link was sent."}

    import secrets
    reset_token = secrets.token_urlsafe(48)
    # In production: store reset_token in DB with expiry
    # For now, we send the email with the token
    profile = user.profile
    name = profile.display_name if profile else "User"
    send_password_reset(user.email, name, reset_token)

    return {"success": True, "message": "If the email exists, a reset link was sent."}


@router.get("/templates")
def list_email_templates():
    """List available email templates (admin/debug)."""
    return {
        "templates": [
            {"type": "welcome", "description": "Welcome email after signup", "trigger": "POST /signup"},
            {"type": "streak_reminder", "description": "Streak at risk notification", "trigger": "Cron: 23h inactive"},
            {"type": "weekly_digest", "description": "Weekly progress summary", "trigger": "Cron: Sunday 9 AM IST"},
            {"type": "achievement", "description": "Achievement unlocked", "trigger": "Achievement API"},
            {"type": "job_match", "description": "New job/internship match", "trigger": "Job matching engine"},
            {"type": "password_reset", "description": "Password reset link", "trigger": "POST /password-reset"},
        ]
    }
