"""SkillTen Parent Intelligence Portal — weekly reports, salary truth, trajectory
Bible Section 1 (Prompt 1.2 §7) + Section 3 (Prompt 3.1 §Screen 8)
"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from database import get_db
from models import User, UserProfile, UserCodingStats, UserAptitudeProfile, UserSkillVerification
from auth import require_user
from ai_engine import generate_parent_report, check_salary_truth

router = APIRouter()


# ─── Request Models ───

class SalaryTruthReq(BaseModel):
    ctc_lpa: float
    role: str
    city: str
    college_tier: int = 2

class TrajectoryReq(BaseModel):
    target_role: str
    current_year: int = 3


# ─── 1. Weekly Parent Summary Card ───

@router.get("/weekly-summary")
async def weekly_summary(
    user: User = Depends(require_user),
    db: Session = Depends(get_db),
):
    """
    Generate WhatsApp-shareable weekly summary for parents.
    Shows: activity this week, skills verified, streak, next milestone.
    """
    profile = user.profile
    coding_stats = db.query(UserCodingStats).filter_by(user_id=user.id).first()
    aptitude = db.query(UserAptitudeProfile).filter_by(user_id=user.id).first()
    verified_skills = db.query(UserSkillVerification).filter_by(
        user_id=user.id, is_expired=False,
    ).count()

    student_profile = {
        "name": profile.display_name if profile else "Student",
        "college": profile.college_name if profile else "",
        "stream": profile.stream if profile else "",
        "year": profile.current_year_of_study if profile else 0,
        "viya_score": profile.viya_score if profile else 0,
        "streak_days": profile.streak_days if profile else 0,
        "archetype": profile.archetype_name if profile else "",
    }

    weekly_activity = {
        "problems_solved": coding_stats.problems_solved_total if coding_stats else 0,
        "current_streak": coding_stats.current_streak_days if coding_stats else 0,
        "aptitude_percentile": aptitude.overall_percentile if aptitude else None,
        "skills_verified": verified_skills,
        "tests_taken": aptitude.tests_taken if aptitude else 0,
    }

    # Use AI engine to generate parent-friendly report
    report = await generate_parent_report(student_profile, weekly_activity)

    return {
        "student_name": student_profile["name"],
        "report": report,
        "quick_stats": {
            "viya_score": student_profile["viya_score"],
            "streak_days": student_profile["streak_days"],
            "skills_verified": verified_skills,
            "problems_solved": weekly_activity["problems_solved"],
        },
        "generated_at": datetime.now(timezone.utc).isoformat(),
    }


# ─── 2. Salary Truth Checker (CTC → In-Hand) ───

@router.post("/salary-truth")
async def salary_truth(
    req: SalaryTruthReq,
    user: User = Depends(require_user),
):
    """
    CTC to in-hand salary conversion for parents.
    Shows: base salary, HRA, PF deductions, tax, actual monthly in-hand.
    """
    result = await check_salary_truth(
        ctc_lpa=req.ctc_lpa,
        role=req.role,
        city=req.city,
        college_tier=req.college_tier,
    )
    return result


# ─── 3. 5-Year Career Trajectory Projection ───

@router.post("/trajectory")
async def career_trajectory(
    req: TrajectoryReq,
    user: User = Depends(require_user),
    db: Session = Depends(get_db),
):
    """
    5-year career trajectory projection.
    Shows: expected CTC progression, role growth, skill requirements at each stage.
    """
    profile = user.profile

    # Build trajectory based on India market data
    year = req.current_year
    role = req.target_role
    college_tier = profile.college_tier if profile else 2

    # Tier-based salary multipliers (India-specific)
    base_ctc = {1: 12.0, 2: 6.0, 3: 4.0, 4: 3.0}.get(college_tier, 4.0)
    growth_rates = [0.0, 0.30, 0.25, 0.40, 0.35, 0.30]  # Year 0-5

    trajectory = []
    current_ctc = base_ctc
    roles_progression = {
        "Software Engineer": ["SDE-I", "SDE-I", "SDE-II", "SDE-II", "SDE-III", "Senior SDE"],
        "Data Scientist": ["Junior DS", "DS", "DS", "Senior DS", "Lead DS", "Principal DS"],
        "Product Manager": ["APM", "PM", "PM", "Senior PM", "Group PM", "Director PM"],
        "DevOps Engineer": ["Junior DevOps", "DevOps Eng", "Senior DevOps", "Lead DevOps", "Staff DevOps", "Principal"],
    }
    role_map = roles_progression.get(role, [role] * 6)

    for yr in range(6):
        current_ctc *= (1 + growth_rates[yr]) if yr > 0 else 1
        trajectory.append({
            "year": yr,
            "label": f"Year {yr}" if yr > 0 else "Fresher",
            "expected_role": role_map[min(yr, len(role_map) - 1)],
            "expected_ctc_lpa": round(current_ctc, 1),
            "monthly_in_hand": round((current_ctc * 100000 * 0.70) / 12),
            "key_skills": _skills_for_year(role, yr),
        })

    return {
        "target_role": role,
        "college_tier": college_tier,
        "trajectory": trajectory,
        "stability_index": _stability_index(role),
    }


# ─── 4. Role Stability Index ───

@router.get("/stability/{role}")
def role_stability(role: str):
    """Stability index for target roles — helps parents understand risk."""
    return {
        "role": role,
        "stability": _stability_index(role),
    }


# ─── Helpers ───

def _skills_for_year(role: str, year: int) -> list:
    skill_map = {
        "Software Engineer": [
            ["DSA", "Git", "Python/Java"],
            ["System Design Basics", "APIs", "SQL"],
            ["Cloud (AWS/GCP)", "CI/CD", "Docker"],
            ["Distributed Systems", "Microservices"],
            ["Architecture", "Tech Leadership"],
            ["Strategy", "Cross-team Leadership"],
        ],
        "Data Scientist": [
            ["Python", "Statistics", "SQL"],
            ["ML Algorithms", "Pandas", "Visualization"],
            ["Deep Learning", "NLP", "Feature Engineering"],
            ["MLOps", "A/B Testing", "Business Analytics"],
            ["Research", "Model Deployment at Scale"],
            ["Strategy", "Team Building"],
        ],
    }
    skills = skill_map.get(role, [["Core Skills"]] * 6)
    return skills[min(year, len(skills) - 1)]


def _stability_index(role: str) -> dict:
    stability_data = {
        "Software Engineer": {"score": 85, "label": "High", "explanation": "Strong demand across all sectors, consistent 15-20% YoY growth in India"},
        "Data Scientist": {"score": 78, "label": "High", "explanation": "Growing demand but requires continuous upskilling, AI/ML market expanding 25% YoY"},
        "Product Manager": {"score": 72, "label": "Medium-High", "explanation": "Growing demand in tech companies, competitive entry but stable once established"},
        "DevOps Engineer": {"score": 82, "label": "High", "explanation": "Cloud adoption driving 30%+ demand growth, essential for all tech companies"},
        "UI/UX Designer": {"score": 68, "label": "Medium", "explanation": "Good demand in product companies, freelance options available"},
        "Cybersecurity Analyst": {"score": 88, "label": "Very High", "explanation": "Critical shortage in India, government mandates driving demand"},
    }
    return stability_data.get(role, {
        "score": 70, "label": "Medium", "explanation": "Market demand varies, research specific companies and sectors",
    })
