"""SkillTen Leaderboard & Campus Wars — college vs college gamification
Bible Section 1 (Prompt 1.2 §9) + Section 3 (Prompt 3.1 §Screen 9)
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from datetime import datetime, timezone, timedelta

from database import get_db
from models import (
    User, UserProfile, UserCodingStats, UserViyaScoreLog,
    College, UserActivityDaily
)
from auth import require_user

router = APIRouter()


# ─── 1. Individual Leaderboard ───

@router.get("/individual")
def individual_leaderboard(
    metric: str = "viya_score",  # viya_score | streak | problems_solved
    period: str = "all",         # all | weekly | monthly
    skip: int = 0, limit: int = 50,
    db: Session = Depends(get_db),
):
    """
    Individual leaderboard ranked by Viya Score, streak, or problems solved.
    """
    q = db.query(UserProfile)

    if metric == "viya_score":
        q = q.order_by(desc(UserProfile.viya_score))
    elif metric == "streak":
        q = q.order_by(desc(UserProfile.streak_days))
    elif metric == "problems_solved":
        q = q.order_by(desc(UserProfile.total_points))
    else:
        q = q.order_by(desc(UserProfile.viya_score))

    total = q.count()
    profiles = q.offset(skip).limit(limit).all()

    return {
        "metric": metric,
        "total": total,
        "leaderboard": [{
            "rank": skip + i + 1,
            "username": p.username,
            "display_name": p.display_name,
            "avatar_url": p.avatar_url,
            "college_name": p.college_name,
            "viya_score": p.viya_score or 0,
            "streak_days": p.streak_days or 0,
            "total_points": p.total_points or 0,
            "archetype_name": p.archetype_name,
        } for i, p in enumerate(profiles)],
    }


# ─── 2. Campus Wars — College vs College ───

@router.get("/campus-wars")
def campus_wars_leaderboard(
    state: Optional[str] = None,
    tier: Optional[int] = None,
    skip: int = 0, limit: int = 30,
    db: Session = Depends(get_db),
):
    """
    Campus Wars leaderboard — colleges ranked by aggregate student scores.
    """
    q = db.query(College)
    if state:
        q = q.filter(College.state.ilike(f"%{state}%"))
    if tier:
        q = q.filter(College.tier == tier)

    colleges = q.order_by(desc(College.avg_ctc_viya)).offset(skip).limit(limit).all()

    results = []
    for rank, college in enumerate(colleges, skip + 1):
        # Count active students from this college
        student_count = db.query(UserProfile).filter(
            UserProfile.college_name.ilike(f"%{college.name}%"),
        ).count()

        # Aggregate Viya score
        avg_score = db.query(func.avg(UserProfile.viya_score)).filter(
            UserProfile.college_name.ilike(f"%{college.name}%"),
            UserProfile.viya_score > 0,
        ).scalar() or 0

        results.append({
            "rank": rank,
            "college_id": college.id,
            "college_name": college.name,
            "slug": college.slug,
            "city": college.city,
            "state": college.state,
            "tier": college.tier,
            "nirf_rank": college.nirf_rank,
            "active_students": student_count,
            "avg_viya_score": round(float(avg_score), 1),
            "placement_rate": college.placement_rate_viya,
            "avg_ctc": college.avg_ctc_viya,
        })

    return {"total": len(results), "campus_wars": results}


# ─── 3. My College Rank ───

@router.get("/my-college")
def my_college_rank(
    user: User = Depends(require_user),
    db: Session = Depends(get_db),
):
    """Get the logged-in user's college ranking in Campus Wars."""
    profile = user.profile
    if not profile or not profile.college_name:
        return {"has_college": False}

    # Find college peers
    peers = db.query(UserProfile).filter(
        UserProfile.college_name == profile.college_name,
        UserProfile.viya_score > 0,
    ).order_by(desc(UserProfile.viya_score)).all()

    my_rank = None
    for i, p in enumerate(peers, 1):
        if p.user_id == user.id:
            my_rank = i
            break

    college_avg = sum(p.viya_score or 0 for p in peers) / max(len(peers), 1)

    return {
        "has_college": True,
        "college_name": profile.college_name,
        "my_rank_in_college": my_rank,
        "total_students": len(peers),
        "college_avg_score": round(college_avg, 1),
        "my_score": profile.viya_score or 0,
        "top_students": [{
            "rank": i + 1,
            "username": p.username,
            "display_name": p.display_name,
            "viya_score": p.viya_score or 0,
            "archetype_name": p.archetype_name,
        } for i, p in enumerate(peers[:10])],
    }


# ─── 4. Daily Challenge Contribution (Campus Wars) ───

@router.get("/today-contribution")
def today_contribution(
    user: User = Depends(require_user),
    db: Session = Depends(get_db),
):
    """Today's contribution to Campus Wars from the logged-in user."""
    today = datetime.now(timezone.utc).date()

    activity = db.query(UserActivityDaily).filter_by(
        user_id=user.id,
    ).filter(
        func.date(UserActivityDaily.activity_date) == today,
    ).first()

    if not activity:
        return {
            "date": str(today),
            "problems_solved": 0,
            "points_earned": 0,
            "time_spent_minutes": 0,
        }

    return {
        "date": str(today),
        "problems_solved": activity.problems_solved or 0,
        "points_earned": activity.points_earned or 0,
        "time_spent_minutes": activity.session_minutes or 0,
        "assessments_taken": activity.assessments_taken or 0,
        "skills_practiced": activity.skills_practiced or 0,
    }
