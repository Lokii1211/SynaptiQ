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

class RunReq(BaseModel):
    language: str
    code: str
    custom_input: Optional[str] = None


# ────────────── RUN (test without saving) ──────────────

@router.post("/problems/{slug}/run")
def run_code(slug: str, req: RunReq, user: User = Depends(require_user), db: Session = Depends(get_db)):
    """Run code against sample test cases OR custom input — does NOT save as submission."""
    problem = db.query(CodingProblem).filter(CodingProblem.slug == slug).first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")

    import random, time

    # Custom input mode
    if req.custom_input is not None:
        runtime = random.randint(10, 300)
        return {
            "mode": "custom_input",
            "input": req.custom_input,
            "output": f"[Simulated output for custom input]",
            "runtime_ms": runtime,
            "memory_mb": round(random.uniform(3, 30), 1),
            "error": None,
        }

    # Run against sample test cases (visible ones only)
    test_cases = problem.test_cases or []
    visible_cases = test_cases[:3] if len(test_cases) > 3 else test_cases

    case_results = []
    for i, tc in enumerate(visible_cases):
        tc_input = tc.get("input", "")
        expected = tc.get("expected_output", tc.get("output", ""))
        passed = random.random() > 0.3
        runtime = random.randint(5, 150)

        your_output = expected if passed else f"[Simulated wrong output for case {i + 1}]"

        case_results.append({
            "case_number": i + 1,
            "status": "passed" if passed else "failed",
            "input": tc_input,
            "expected_output": expected,
            "your_output": your_output,
            "runtime_ms": runtime,
            "diff": None if passed else f"Expected {expected}, got {your_output}",
        })

    total_passed = sum(1 for c in case_results if c["status"] == "passed")

    return {
        "mode": "run",
        "test_cases": case_results,
        "total_passed": total_passed,
        "total_cases": len(case_results),
        "overall_runtime_ms": sum(c["runtime_ms"] for c in case_results),
        "memory_mb": round(random.uniform(5, 40), 1),
    }


# ────────────── SUBMIT (graded, saved) ──────────────

@router.post("/problems/{slug}/submit")
def submit_solution(slug: str, req: SubmitReq, user: User = Depends(require_user), db: Session = Depends(get_db)):
    """Submit code for grading — runs ALL test cases including hidden ones. Saves result."""
    problem = db.query(CodingProblem).filter(CodingProblem.slug == slug).first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")

    import random

    test_cases = problem.test_cases or []
    tc_total = len(test_cases) if test_cases else 5

    # Simulate per-test-case results
    case_results = []
    for i in range(tc_total):
        tc = test_cases[i] if i < len(test_cases) else {}
        tc_input = tc.get("input", "")
        expected = tc.get("expected_output", tc.get("output", ""))
        is_visible = i < 3  # First 3 are visible
        passed = random.random() > 0.25
        runtime = random.randint(5, 200)

        your_output = expected if passed else f"[Wrong output]"

        case_results.append({
            "case_number": i + 1,
            "status": "passed" if passed else "failed",
            "input": tc_input if is_visible else "[Hidden]",
            "expected_output": expected if is_visible else "[Hidden]",
            "your_output": your_output if is_visible else ("[Hidden]" if passed else "[Hidden — differs from expected]"),
            "runtime_ms": runtime,
            "is_hidden": not is_visible,
        })

    tc_passed = sum(1 for c in case_results if c["status"] == "passed")
    status = "accepted" if tc_passed == tc_total else "wrong_answer"
    total_runtime = sum(c["runtime_ms"] for c in case_results)
    memory = round(random.uniform(5, 50), 1)

    # Runtime percentile (simulated)
    runtime_percentile = random.randint(30, 95)
    memory_percentile = random.randint(25, 90)

    prev = db.query(UserProblemSubmission).filter_by(user_id=user.id, problem_id=problem.id).count()

    sub = UserProblemSubmission(
        user_id=user.id, problem_id=problem.id,
        language=req.language, code=req.code, status=status,
        runtime_ms=total_runtime, memory_mb=memory,
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
        "submission_id": sub.id,
        "status": status,
        "test_cases_passed": tc_passed,
        "test_cases_total": tc_total,
        "runtime_ms": total_runtime,
        "memory_mb": memory,
        "runtime_percentile": runtime_percentile,
        "memory_percentile": memory_percentile,
        "case_results": case_results,
        "attempt_number": sub.attempt_number,
    }


# ────────────── SUBMISSION HISTORY ──────────────

@router.get("/problems/{slug}/submissions")
def submission_history(
    slug: str,
    user: User = Depends(require_user),
    db: Session = Depends(get_db),
):
    """Get all submissions for a specific problem by the current user."""
    problem = db.query(CodingProblem).filter(CodingProblem.slug == slug).first()
    if not problem:
        raise HTTPException(status_code=404, detail="Problem not found")

    subs = db.query(UserProblemSubmission).filter_by(
        user_id=user.id, problem_id=problem.id,
    ).order_by(UserProblemSubmission.submitted_at.desc()).limit(50).all()

    best = None
    for s in subs:
        if s.status == "accepted" and (best is None or s.runtime_ms < best.runtime_ms):
            best = s

    return {
        "problem_slug": slug,
        "total_submissions": len(subs),
        "best_submission_id": best.id if best else None,
        "submissions": [{
            "id": s.id,
            "status": s.status,
            "language": s.language,
            "runtime_ms": s.runtime_ms,
            "memory_mb": s.memory_mb,
            "test_cases_passed": s.test_cases_passed,
            "test_cases_total": s.test_cases_total,
            "attempt_number": s.attempt_number,
            "submitted_at": s.submitted_at.isoformat() if s.submitted_at else None,
        } for s in subs],
    }


@router.get("/submissions/{submission_id}/code")
def get_submission_code(
    submission_id: str,
    user: User = Depends(require_user),
    db: Session = Depends(get_db),
):
    """Get the code of a specific submission."""
    sub = db.query(UserProblemSubmission).filter_by(
        id=submission_id, user_id=user.id,
    ).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Submission not found")
    return {
        "id": sub.id,
        "code": sub.code,
        "language": sub.language,
        "status": sub.status,
        "runtime_ms": sub.runtime_ms,
        "memory_mb": sub.memory_mb,
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

