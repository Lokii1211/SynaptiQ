"""SkillTen Public Profile — viya.ai/u/username
Bible Section 3 (Prompt 3.1 §Screen 7) + Section 12 (Prompt 12.1)
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from database import get_db
from models import (
    User, UserProfile, UserSkillVerification, UserCodingStats,
    UserAptitudeProfile, CareerProfile4D, CareerMatch, UserBadge,
    Badge, UserActivityDaily, SkillsTaxonomy
)

router = APIRouter()


# ─── 1. Public Profile by Username ───

@router.get("/{username}")
def public_profile(username: str, db: Session = Depends(get_db)):
    """
    Public career profile page.
    Shows: Viya Score, verified skill badges, activity heatmap, placement readiness.
    URL: /api/profile/{username}
    """
    profile = db.query(UserProfile).filter_by(username=username).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    user_id = profile.user_id

    # Verified skills with badges
    verifications = db.query(UserSkillVerification).filter_by(
        user_id=user_id, is_expired=False,
    ).all()
    now = datetime.now(timezone.utc)
    verified_skills = []
    for v in verifications:
        is_active = v.expires_at and v.expires_at > now if v.expires_at else False
        skill = db.query(SkillsTaxonomy).filter_by(id=v.skill_id).first()
        if is_active:
            verified_skills.append({
                "skill_name": skill.name if skill else "Unknown",
                "score": v.verified_score,
                "percentile": v.verified_percentile,
                "proficiency_level": v.proficiency_level,
                "verified_at": v.last_verified_at.isoformat()[:10] if v.last_verified_at else None,
                "expires_at": v.expires_at.isoformat()[:10] if v.expires_at else None,
            })

    # Coding stats
    coding = db.query(UserCodingStats).filter_by(user_id=user_id).first()

    # Aptitude
    aptitude = db.query(UserAptitudeProfile).filter_by(user_id=user_id).first()

    # 4D Profile & Career matches
    career_profile = db.query(CareerProfile4D).filter_by(
        user_id=user_id, is_current=True,
    ).first()
    matches = []
    dimensions = None
    if career_profile:
        dimensions = {
            "analytical": career_profile.dim_analytical,
            "interpersonal": career_profile.dim_interpersonal,
            "creative": career_profile.dim_creative,
            "systematic": career_profile.dim_systematic,
        }
        matches = db.query(CareerMatch).filter_by(
            profile_id=career_profile.id
        ).order_by(CareerMatch.rank).limit(3).all()

    # Badges
    user_badges = db.query(UserBadge).filter_by(user_id=user_id).all()
    badges = []
    for ub in user_badges:
        badge = db.query(Badge).filter_by(id=ub.badge_id).first()
        if badge:
            badges.append({
                "name": badge.name,
                "slug": badge.slug,
                "icon_url": badge.icon_url,
                "rarity": badge.rarity,
                "earned_at": ub.earned_at.isoformat()[:10] if ub.earned_at else None,
            })

    # Activity heatmap (365 days)
    heatmap = {}
    if coding and coding.activity_heatmap:
        heatmap = coding.activity_heatmap

    return {
        "username": profile.username,
        "display_name": profile.display_name,
        "tagline": profile.tagline,
        "avatar_url": profile.avatar_url,
        "bio": profile.bio,
        "college_name": profile.college_name,
        "stream": profile.stream,
        "graduation_year": profile.graduation_year,
        "target_role": profile.target_role,
        "open_to_work": profile.open_to_work,
        "linkedin_url": profile.linkedin_url,
        "github_username": profile.github_username,

        "viya_score": profile.viya_score or 0,
        "streak_days": profile.streak_days or 0,
        "archetype": {
            "code": profile.archetype_code,
            "name": profile.archetype_name,
        } if profile.archetype_name else None,

        "dimensions": dimensions,
        "career_matches": [{
            "career_name": m.career_name,
            "match_score": m.match_score,
            "rank": m.rank,
        } for m in matches],

        "verified_skills": verified_skills,
        "total_verified_skills": len(verified_skills),

        "coding_stats": {
            "problems_solved": coding.problems_solved_total if coding else 0,
            "easy": coding.easy_solved if coding else 0,
            "medium": coding.medium_solved if coding else 0,
            "hard": coding.hard_solved if coding else 0,
            "streak": coding.current_streak_days if coding else 0,
            "contest_rating": coding.contest_rating if coding else None,
        },

        "aptitude": {
            "overall_percentile": aptitude.overall_percentile if aptitude else None,
            "tests_taken": aptitude.tests_taken if aptitude else 0,
        },

        "badges": badges,
        "activity_heatmap": heatmap,
    }
