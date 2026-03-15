"""Mentixy Aptitude Engine — timed mini-tests, percentile scoring, solution explanations
Bible Section 5 (Prompt 5.1 §7) + Section 6 (Prompt 6.1 §C)
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from database import get_db
from models import (
    User, AptitudeTestSession, UserAptitudeProfile, Question
)
from auth import require_user

router = APIRouter()


# ─── Request / Response Models ───

class StartAptitudeReq(BaseModel):
    section: str = "mixed"           # quant | logical | verbal | data_interpretation | mixed
    difficulty: str = "adaptive"     # easy | medium | hard | adaptive

class AptitudeAnswerItem(BaseModel):
    question_id: str
    selected_option: str
    time_spent_ms: int = 0

class SubmitAptitudeReq(BaseModel):
    session_id: str
    answers: List[AptitudeAnswerItem]

# ─── 0. Aptitude Topics ───

APTITUDE_TOPICS = [
    {"id": "quant", "name": "Quantitative Aptitude", "icon": "📊", "description": "Number systems, percentages, profit/loss, time & work, probability", "question_count": 500, "avg_time_mins": 8, "companies": ["TCS", "Infosys", "Wipro", "Cognizant"]},
    {"id": "logical", "name": "Logical Reasoning", "icon": "🧠", "description": "Puzzles, seating arrangement, syllogisms, coding-decoding, blood relations", "question_count": 400, "avg_time_mins": 10, "companies": ["TCS", "Accenture", "Capgemini"]},
    {"id": "verbal", "name": "Verbal Ability", "icon": "📝", "description": "Reading comprehension, grammar, sentence completion, para jumbles", "question_count": 350, "avg_time_mins": 7, "companies": ["Infosys", "Wipro", "HCL"]},
    {"id": "data_interpretation", "name": "Data Interpretation", "icon": "📈", "description": "Tables, bar graphs, pie charts, line graphs, caselets", "question_count": 250, "avg_time_mins": 12, "companies": ["TCS", "Deloitte", "EY"]},
    {"id": "mixed", "name": "Mixed (Adaptive)", "icon": "🎯", "description": "Combined questions from all sections, difficulty adapts to performance", "question_count": 1500, "avg_time_mins": 8, "companies": ["All Companies"]},
]


@router.get("/topics")
def get_aptitude_topics(
    user: User = Depends(require_user),
    db: Session = Depends(get_db),
):
    """Get available aptitude topics with metadata."""
    # Get actual question counts from DB per category
    for topic in APTITUDE_TOPICS:
        if topic["id"] != "mixed":
            count = db.query(Question).filter(
                Question.is_aptitude_question == True,
                Question.is_active == True,
                Question.category == topic["id"],
            ).count()
            topic["db_question_count"] = count
        else:
            count = db.query(Question).filter(
                Question.is_aptitude_question == True,
                Question.is_active == True,
            ).count()
            topic["db_question_count"] = count

    return {"topics": APTITUDE_TOPICS}


# ─── 1. Start a Timed Mini-Test (10 questions, 8 minutes) ───

class PracticeCheckReq(BaseModel):
    question_id: str
    selected_option: str
    time_spent_ms: int = 0

@router.post("/practice/check")
def practice_check_answer(
    req: PracticeCheckReq,
    user: User = Depends(require_user),
    db: Session = Depends(get_db),
):
    """Practice Mode: Check a single answer instantly → full explanation."""
    q = db.query(Question).filter_by(id=req.question_id).first()
    if not q:
        raise HTTPException(status_code=404, detail="Question not found")

    is_correct = req.selected_option == (q.correct_answer or "")

    # Build rich explanation response
    explanation_text = q.explanation or ""

    # Parse shortcut if embedded in explanation (format: SHORTCUT: ... FULL: ...)
    shortcut = ""
    full_solution = explanation_text
    concept = q.category or "General"
    common_mistake = ""

    if "SHORTCUT:" in explanation_text:
        parts = explanation_text.split("SHORTCUT:")
        if len(parts) > 1:
            rest = parts[1]
            if "FULL:" in rest:
                shortcut_parts = rest.split("FULL:")
                shortcut = shortcut_parts[0].strip()
                full_solution = shortcut_parts[1].strip()
            else:
                shortcut = rest.strip()

    # Generate contextual common mistake based on category
    mistake_map = {
        "quant": "Forgetting to convert units or misreading the question conditions",
        "logical": "Not considering all possible arrangements or missing negative cases",
        "verbal": "Choosing an option that sounds correct but changes the original meaning",
        "data_interpretation": "Calculating percentage of the wrong base value",
        "mixed": "Rushing through without reading all options carefully",
    }
    common_mistake = mistake_map.get(q.category, mistake_map["mixed"])

    # Company relevance
    company_tags = q.company_tags if hasattr(q, 'company_tags') and q.company_tags else ["TCS", "Infosys"]

    return {
        "question_id": req.question_id,
        "is_correct": is_correct,
        "selected_option": req.selected_option,
        "correct_answer": q.correct_answer or "",
        "explanation": {
            "shortcut_method": shortcut or f"Apply the standard formula for {concept} problems",
            "full_solution": full_solution,
            "concept_name": concept.replace("_", " ").title(),
            "common_mistake": common_mistake,
            "difficulty": q.difficulty or "medium",
            "company_relevance": company_tags,
        },
        "time_spent_ms": req.time_spent_ms,
    }


@router.post("/start")
def start_aptitude_test(
    req: StartAptitudeReq,
    user: User = Depends(require_user),
    db: Session = Depends(get_db),
):
    """Start a timed aptitude mini-test — 10 questions, 480-second timer."""
    # Map frontend section names to DB category names
    section_aliases = {
        "quant": ["quant", "quantitative"],
        "logical": ["logical"],
        "verbal": ["verbal"],
        "data_interpretation": ["data_interpretation"],
        "technical": ["technical"],
    }

    q = db.query(Question).filter(
        Question.is_aptitude_question == True,
        Question.is_active == True,
    )
    if req.section != "mixed":
        cats = section_aliases.get(req.section, [req.section])
        q = q.filter(Question.category.in_(cats))
    if req.difficulty != "adaptive":
        q = q.filter(Question.difficulty == req.difficulty)

    # Randomize using func.random()
    from sqlalchemy import func
    questions = q.order_by(func.random()).limit(10).all()

    session = AptitudeTestSession(
        user_id=user.id,
        test_type="mini",
        sections=[req.section],
        duration_minutes=8,
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    return {
        "session_id": session.id,
        "time_limit_seconds": 480,
        "section": req.section,
        "total_questions": len(questions),
        "questions": [{
            "id": q.id,
            "question_text": q.question_text,
            "options": q.options,
            "category": q.category,
            "difficulty": q.difficulty,
            "question_type": q.question_type,
        } for q in questions],
    }


# ─── 2. Submit Answers & Score ───

@router.post("/submit")
def submit_aptitude_test(
    req: SubmitAptitudeReq,
    user: User = Depends(require_user),
    db: Session = Depends(get_db),
):
    """Submit aptitude answers → auto-grade, percentile rank, solution explanations."""
    session = db.query(AptitudeTestSession).filter_by(
        id=req.session_id, user_id=user.id,
    ).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    if session.completed_at:
        raise HTTPException(status_code=400, detail="Already submitted")

    # Grade
    correct = 0
    results = []
    for ans in req.answers:
        q = db.query(Question).filter_by(id=ans.question_id).first()
        is_correct = False
        correct_answer = ""
        explanation = ""
        if q:
            correct_answer = q.correct_answer or ""
            explanation = q.explanation or ""
            if ans.selected_option == correct_answer:
                is_correct = True
                correct += 1

        results.append({
            "question_id": ans.question_id,
            "selected": ans.selected_option,
            "correct_answer": correct_answer,
            "is_correct": is_correct,
            "explanation": explanation,
            "time_spent_ms": ans.time_spent_ms,
        })

    total = len(req.answers) or 1
    score = round((correct / total) * 100, 1)
    time_taken = sum(a.time_spent_ms for a in req.answers) // 1000

    # Percentile (simple approximation — real uses population data)
    percentile = min(99, round(score * 0.95 + 5, 1))

    session.completed_at = datetime.now(timezone.utc)
    session.total_score = score
    session.time_taken_seconds = time_taken
    session.section_scores = {"score": score, "correct": correct, "total": total}
    session.percentile_scores = {"overall": percentile}
    session.passed_cutoff = score >= 60

    # Update aptitude profile
    profile = db.query(UserAptitudeProfile).filter_by(user_id=user.id).first()
    if not profile:
        profile = UserAptitudeProfile(user_id=user.id)
        db.add(profile)

    profile.tests_taken = (profile.tests_taken or 0) + 1
    profile.overall_percentile = percentile
    profile.last_tested_at = datetime.now(timezone.utc)

    # Trend tracking
    trend = profile.score_trend or []
    trend.append({"date": datetime.now(timezone.utc).isoformat()[:10], "score": score, "percentile": percentile})
    if len(trend) > 50:
        trend = trend[-50:]
    profile.score_trend = trend

    db.commit()

    return {
        "score": score,
        "correct": correct,
        "total": total,
        "percentile": percentile,
        "passed": session.passed_cutoff,
        "time_taken_seconds": time_taken,
        "results": results,
    }


# ─── 3. Aptitude History ───

@router.get("/history")
def aptitude_history(
    skip: int = 0, limit: int = 20,
    user: User = Depends(require_user),
    db: Session = Depends(get_db),
):
    """Get past aptitude test sessions."""
    sessions = db.query(AptitudeTestSession).filter_by(
        user_id=user.id,
    ).order_by(AptitudeTestSession.started_at.desc()).offset(skip).limit(limit).all()

    return {
        "sessions": [{
            "id": s.id,
            "test_type": s.test_type,
            "sections": s.sections,
            "total_score": s.total_score,
            "percentile": (s.percentile_scores or {}).get("overall"),
            "passed": s.passed_cutoff,
            "time_taken_seconds": s.time_taken_seconds,
            "started_at": s.started_at.isoformat() if s.started_at else None,
            "completed_at": s.completed_at.isoformat() if s.completed_at else None,
        } for s in sessions],
    }


# ─── 4. Aptitude Profile ───

@router.get("/profile")
def aptitude_profile(
    user: User = Depends(require_user),
    db: Session = Depends(get_db),
):
    """Get user's aptitude profile with percentile breakdown."""
    profile = db.query(UserAptitudeProfile).filter_by(user_id=user.id).first()
    if not profile:
        return {
            "has_profile": False,
            "tests_taken": 0,
        }
    return {
        "has_profile": True,
        "quant_percentile": profile.quant_percentile,
        "logical_percentile": profile.logical_percentile,
        "verbal_percentile": profile.verbal_percentile,
        "di_percentile": profile.di_percentile,
        "overall_percentile": profile.overall_percentile,
        "tests_taken": profile.tests_taken,
        "score_trend": profile.score_trend,
        "viya_certified_level": profile.viya_certified_level,
        "last_tested_at": profile.last_tested_at.isoformat() if profile.last_tested_at else None,
    }
