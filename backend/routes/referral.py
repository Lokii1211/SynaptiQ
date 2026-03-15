"""Mentixy — Referral System API (Bible §31)"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db
from auth import require_user

router = APIRouter()


class ReferralCodeReq(BaseModel):
    ref_code: str


@router.get("")
def get_referrals(user=Depends(require_user), db: Session = Depends(get_db)):
    """Get current user's referral stats"""
    from models import UserProfile

    profile = db.query(UserProfile).filter(UserProfile.user_id == user.id).first()
    if not profile:
        return {"code": "", "referrals": [], "total_xp": 0}

    code = f"VIYU-{profile.username.upper()[:6]}" if profile.username else "VIYA-USER"

    # Count referrals (Mock for now, would query referral tracking table)
    referral_count = profile.referral_count if hasattr(profile, 'referral_count') else 0

    # Calculate rewards
    rewards = []
    tiers = [
        {"count": 1, "xp": 50, "reward": "+50 XP"},
        {"count": 3, "xp": 150, "reward": "+150 XP + Streak Freeze"},
        {"count": 5, "xp": 300, "reward": "+300 XP + Campus Influencer badge"},
        {"count": 10, "xp": 500, "reward": "+500 XP + Brand Ambassador badge + 1mo Pro"},
        {"count": 25, "xp": 1000, "reward": "+1000 XP + Lifetime Pro Access"},
    ]

    total_xp = 0
    for tier in tiers:
        achieved = referral_count >= tier["count"]
        if achieved:
            total_xp += tier["xp"]
        rewards.append({
            **tier,
            "achieved": achieved,
            "remaining": max(0, tier["count"] - referral_count),
        })

    return {
        "code": code,
        "share_link": f"https://mentixy.in/signup?ref={code}",
        "referral_count": referral_count,
        "total_xp": total_xp,
        "rewards": rewards,
        "referrals": [],  # TODO: actual referral list from tracking table
    }


@router.post("/apply")
def apply_referral(req: ReferralCodeReq, user=Depends(require_user), db: Session = Depends(get_db)):
    """Apply a referral code when signing up"""
    from models import UserProfile

    # Find referrer
    code_parts = req.ref_code.split("-")
    if len(code_parts) < 2:
        raise HTTPException(400, "Invalid referral code")

    username_part = code_parts[1].lower()
    referrer_profile = db.query(UserProfile).filter(
        UserProfile.username.ilike(f"{username_part}%")
    ).first()

    if not referrer_profile:
        raise HTTPException(404, "Referral code not found")

    if referrer_profile.user_id == user.id:
        raise HTTPException(400, "You cannot refer yourself")

    # Increment referrer's count
    if hasattr(referrer_profile, 'referral_count'):
        referrer_profile.referral_count = (referrer_profile.referral_count or 0) + 1

    db.commit()

    return {
        "message": f"Referral applied! {referrer_profile.display_name} gets +50 XP",
        "referrer": referrer_profile.display_name,
    }
