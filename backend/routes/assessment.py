"""SkillTen Assessment 4D — start, submit answers, get profile (AI-powered)"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from database import get_db
from models import (User, AssessmentSession, AssessmentAnswer, CareerProfile4D, CareerMatch, Question)
from auth import require_user
from ai_engine import analyze_4d_assessment

router = APIRouter()


class StartReq(BaseModel):
    device_type: Optional[str] = "web"

@router.post("/start")
def start_assessment(req: StartReq, user: User = Depends(require_user), db: Session = Depends(get_db)):
    session = AssessmentSession(
        user_id=user.id, device_type=req.device_type, total_questions=20
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    questions = db.query(Question).filter(Question.is_assessment_question == True, Question.is_active == True).limit(20).all()
    return {
        "session_id": session.id,
        "questions": [{
            "id": q.id, "question_text": q.question_text, "options": q.options,
            "category": q.category, "question_type": q.question_type,
        } for q in questions]
    }


class AnswerReq(BaseModel):
    question_id: str
    selected_option: str
    time_spent_ms: int = 0
    question_order: int = 0

class SubmitReq(BaseModel):
    session_id: str
    answers: List[AnswerReq]

@router.post("/submit")
async def submit_assessment(req: SubmitReq, user: User = Depends(require_user), db: Session = Depends(get_db)):
    session = db.query(AssessmentSession).filter_by(id=req.session_id, user_id=user.id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")

    # Save answers
    answer_data = []
    time_data = []
    for a in req.answers:
        db.add(AssessmentAnswer(
            session_id=session.id, question_id=a.question_id,
            selected_option=a.selected_option, time_spent_ms=a.time_spent_ms,
            question_order=a.question_order,
        ))
        answer_data.append({"question_id": a.question_id, "selected": a.selected_option, "order": a.question_order})
        time_data.append(a.time_spent_ms)

    session.is_complete = True
    session.completed_at = datetime.now(timezone.utc)

    # Run AI 4D analysis (Gemini or mock fallback)
    ai_result = await analyze_4d_assessment(answer_data, time_data)

    dims = ai_result.get("dimensions", {"analytical": 70, "interpersonal": 60, "creative": 55, "systematic": 65})
    archetype = ai_result.get("archetype", {"code": "AN", "name": "The Architect"})
    dominant = ai_result.get("dominant_dimension", "analytical")

    profile = CareerProfile4D(
        user_id=user.id, session_id=session.id,
        dim_analytical=dims.get("analytical", 70),
        dim_interpersonal=dims.get("interpersonal", 60),
        dim_creative=dims.get("creative", 55),
        dim_systematic=dims.get("systematic", 65),
        dominant_dimension=dominant,
        archetype_code=archetype.get("code", "AN"),
        archetype_name=archetype.get("name", "The Architect"),
        consistency_score=ai_result.get("consistency_score", 80),
    )
    db.add(profile)
    db.flush()

    # Save career matches
    for rank, career in enumerate(ai_result.get("top_careers", [])[:5], 1):
        db.add(CareerMatch(
            user_id=user.id, profile_id=profile.id,
            career_slug=career.get("slug", f"career-{rank}"),
            career_name=career.get("name", "Unknown"),
            match_score=career.get("match_score", 70),
            rank=rank,
            driving_dimension=career.get("driving_dimension", dominant),
            why_match=career.get("why", ""),
        ))

    # Update user profile
    if user.profile:
        user.profile.archetype_code = archetype.get("code", "AN")
        user.profile.archetype_name = archetype.get("name", "The Architect")

    db.commit()
    return {
        "profile": {
            "dimensions": dims,
            "dominant": dominant,
            "archetype": archetype,
            "consistency_score": ai_result.get("consistency_score", 80),
        },
        "matches": [{"slug": c.get("slug"), "name": c.get("name"), "score": c.get("match_score"), "why": c.get("why")} for c in ai_result.get("top_careers", [])[:5]],
        "personality_summary": ai_result.get("personality_summary", ""),
        "advice": ai_result.get("advice", ""),
    }


@router.get("/profile")
def get_profile(user: User = Depends(require_user), db: Session = Depends(get_db)):
    profile = db.query(CareerProfile4D).filter_by(user_id=user.id, is_current=True).first()
    if not profile:
        return {"has_profile": False}
    matches = db.query(CareerMatch).filter_by(profile_id=profile.id).order_by(CareerMatch.rank).all()
    return {
        "has_profile": True,
        "dimensions": {
            "analytical": profile.dim_analytical, "interpersonal": profile.dim_interpersonal,
            "creative": profile.dim_creative, "systematic": profile.dim_systematic,
        },
        "archetype": {"code": profile.archetype_code, "name": profile.archetype_name},
        "consistency_score": profile.consistency_score,
        "matches": [{"slug": m.career_slug, "name": m.career_name, "score": m.match_score, "rank": m.rank, "why": m.why_match} for m in matches],
    }
