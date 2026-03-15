"""Mentixy Mentixy Score™ Calculator — empirically-weighted composite scoring
Bible Section 1 (Prompt 1.2 §6) + Section 4 (Prompt 4.1 §6)

Formula:
  Mentixy Score™ = 0.30 × Verified Skills
              + 0.20 × Coding Consistency
              + 0.20 × Aptitude Percentile
              + 0.15 × Assessment Completion
              + 0.10 × Community
              + 0.05 × Roadmap Progress

Weights derived from Multiple Linear Regression on placement data.
"""
from sqlalchemy.orm import Session
from datetime import datetime, timezone, timedelta

from models import (
    User, UserProfile, UserSkillVerification, UserCodingStats,
    UserAptitudeProfile, CareerProfile4D, UserViyaScoreLog,
    UserActivityDaily, UserConnection, CommunityPost, LearningRoadmap,
)


def calculate_mentixy_score(user_id: str, db: Session) -> dict:
    """
    Calculate and store the composite Mentixy Score™ for a user.
    Returns breakdown and total score (0-100).
    """

    # ─── 1. Verified Skills Component (30%) ───
    verified_skills = db.query(UserSkillVerification).filter_by(
        user_id=user_id,
    ).filter(UserSkillVerification.is_expired == False).all()
    now = datetime.now(timezone.utc)
    active_skills = [
        s for s in verified_skills
        if s.expires_at and s.expires_at > now
    ]
    # Score: 0-100 based on number of verified skills (cap at 10)
    skill_score = min(100, len(active_skills) * 10)
    # Bonus for high percentile scores
    if active_skills:
        avg_percentile = sum(s.verified_percentile or 50 for s in active_skills) / len(active_skills)
        skill_score = min(100, skill_score * (avg_percentile / 100) * 1.3)
    skill_component = round(skill_score * 0.30, 2)

    # ─── 2. Coding Consistency Component (20%) ───
    coding_stats = db.query(UserCodingStats).filter_by(user_id=user_id).first()
    if coding_stats:
        streak_score = min(100, (coding_stats.current_streak_days or 0) * 3)
        problems_score = min(100, (coding_stats.problems_solved_total or 0) * 2)
        coding_score = (streak_score * 0.6 + problems_score * 0.4)
    else:
        coding_score = 0
    coding_component = round(coding_score * 0.20, 2)

    # ─── 3. Aptitude Percentile Component (20%) ───
    aptitude = db.query(UserAptitudeProfile).filter_by(user_id=user_id).first()
    aptitude_score = aptitude.overall_percentile if aptitude and aptitude.overall_percentile else 0
    aptitude_component = round(aptitude_score * 0.20, 2)

    # ─── 4. Assessment Completion Component (15%) ───
    has_4d = db.query(CareerProfile4D).filter_by(
        user_id=user_id, is_current=True,
    ).first() is not None
    assessment_score = 100 if has_4d else 0
    assessment_component = round(assessment_score * 0.15, 2)

    # ─── 5. Community Component (10%) ───
    connections = db.query(UserConnection).filter(
        (UserConnection.requester_id == user_id) | (UserConnection.receiver_id == user_id),
    ).filter(UserConnection.status == "accepted").count()
    posts = db.query(CommunityPost).filter_by(author_id=user_id).count()
    community_score = min(100, (connections * 5) + (posts * 10))
    community_component = round(community_score * 0.10, 2)

    # ─── 6. Roadmap Progress Component (5%) ───
    roadmap = db.query(LearningRoadmap).filter_by(
        user_id=user_id, is_active=True,
    ).first()
    roadmap_score = roadmap.completion_pct if roadmap and roadmap.completion_pct else 0
    roadmap_component = round(roadmap_score * 0.05, 2)

    # ─── Final Score ───
    total_score = round(
        skill_component + coding_component + aptitude_component
        + assessment_component + community_component + roadmap_component,
    )
    total_score = max(0, min(100, total_score))

    breakdown = {
        "verified_skills": {"raw": round(skill_score, 1), "weight": 0.30, "weighted": skill_component},
        "coding_consistency": {"raw": round(coding_score, 1), "weight": 0.20, "weighted": coding_component},
        "aptitude_percentile": {"raw": round(aptitude_score, 1), "weight": 0.20, "weighted": aptitude_component},
        "assessment_completion": {"raw": assessment_score, "weight": 0.15, "weighted": assessment_component},
        "community": {"raw": community_score, "weight": 0.10, "weighted": community_component},
        "roadmap_progress": {"raw": round(roadmap_score, 1), "weight": 0.05, "weighted": roadmap_component},
    }

    # ─── Save to profile ───
    profile = db.query(UserProfile).filter_by(user_id=user_id).first()
    old_score = profile.mentixy_score or 0 if profile else 0
    if profile:
        profile.mentixy_score = total_score

    # Log score change
    delta = total_score - old_score
    log_entry = UserViyaScoreLog(
        user_id=user_id,
        score=total_score,
        score_breakdown=breakdown,
        delta=delta,
    )
    db.add(log_entry)
    db.commit()

    return {
        "mentixy_score": total_score,
        "delta": delta,
        "breakdown": breakdown,
        "calculated_at": datetime.now(timezone.utc).isoformat(),
    }
