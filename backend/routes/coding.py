"""SkillTen Coding Arena — problems, submit, stats"""
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from database import get_db
from models import CodingProblem, UserProblemSubmission, UserCodingStats, User
from auth import require_user

router = APIRouter()


@router.get("/problems")
def list_problems(
    category: Optional[str] = None,
    difficulty: Optional[str] = None,
    company: Optional[str] = None,
    skip: int = 0, limit: int = 20,
    db: Session = Depends(get_db)
):
    q = db.query(CodingProblem).filter(CodingProblem.is_active == True)
    if category:
        q = q.filter(CodingProblem.category == category)
    if difficulty:
        q = q.filter(CodingProblem.difficulty == difficulty)
    total = q.count()
    problems = q.offset(skip).limit(limit).all()
    return {"total": total, "problems": [{
        "id": p.id, "title": p.title, "slug": p.slug,
        "difficulty": p.difficulty, "category": p.category,
        "company_tags": p.company_tags, "acceptance_rate": p.acceptance_rate,
        "career_path_tags": p.career_path_tags,
    } for p in problems]}


@router.get("/problems/{slug}")
def get_problem(slug: str, db: Session = Depends(get_db)):
    p = db.query(CodingProblem).filter(CodingProblem.slug == slug).first()
    if not p:
        raise HTTPException(status_code=404, detail="Problem not found")
    return {
        "id": p.id, "title": p.title, "slug": p.slug,
        "difficulty": p.difficulty, "category": p.category,
        "problem_statement": p.problem_statement, "constraints": p.constraints,
        "examples": p.examples, "hints": p.hints,
        "starter_code": p.starter_code, "test_cases": p.test_cases,
        "time_complexity": p.time_complexity, "space_complexity": p.space_complexity,
        "interview_context": p.interview_context,
        "company_tags": p.company_tags, "career_path_tags": p.career_path_tags,
    }


class SubmitReq(BaseModel):
    language: str
    code: str

@router.post("/problems/{slug}/submit")
def submit_solution(slug: str, req: SubmitReq, user: User = Depends(require_user), db: Session = Depends(get_db)):
    problem = db.query(CodingProblem).filter(CodingProblem.slug == slug).first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")

    # Simulated execution
    import random
    tc_total = len(problem.test_cases or []) or 5
    tc_passed = random.randint(max(1, tc_total - 2), tc_total)
    status = "accepted" if tc_passed == tc_total else "wrong_answer"

    prev = db.query(UserProblemSubmission).filter_by(user_id=user.id, problem_id=problem.id).count()

    sub = UserProblemSubmission(
        user_id=user.id, problem_id=problem.id,
        language=req.language, code=req.code, status=status,
        runtime_ms=random.randint(20, 500), memory_mb=round(random.uniform(5, 50), 1),
        test_cases_passed=tc_passed, test_cases_total=tc_total,
        attempt_number=prev + 1,
    )
    db.add(sub)

    problem.total_submissions = (problem.total_submissions or 0) + 1
    if status == "accepted":
        problem.accepted_submissions = (problem.accepted_submissions or 0) + 1

    # Update stats
    stats = db.query(UserCodingStats).filter_by(user_id=user.id).first()
    if not stats:
        stats = UserCodingStats(user_id=user.id)
        db.add(stats)
    if status == "accepted":
        stats.problems_solved_total = (stats.problems_solved_total or 0) + 1
        diff_map = {"easy": "easy_solved", "medium": "medium_solved", "hard": "hard_solved"}
        field = diff_map.get(problem.difficulty)
        if field:
            setattr(stats, field, (getattr(stats, field) or 0) + 1)

    db.commit()
    return {
        "submission_id": sub.id, "status": status,
        "test_cases_passed": tc_passed, "test_cases_total": tc_total,
        "runtime_ms": sub.runtime_ms, "memory_mb": sub.memory_mb,
    }


@router.get("/stats/me")
def my_stats(user: User = Depends(require_user), db: Session = Depends(get_db)):
    stats = db.query(UserCodingStats).filter_by(user_id=user.id).first()
    if not stats:
        return {"problems_solved_total": 0, "easy_solved": 0, "medium_solved": 0, "hard_solved": 0}
    return {
        "problems_solved_total": stats.problems_solved_total,
        "easy_solved": stats.easy_solved, "medium_solved": stats.medium_solved,
        "hard_solved": stats.hard_solved,
        "current_streak_days": stats.current_streak_days,
        "contest_rating": stats.contest_rating,
    }
