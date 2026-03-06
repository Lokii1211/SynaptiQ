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


# ─── Built-in assessment questions (used when DB has no questions) ───
BUILTIN_ASSESSMENT_QUESTIONS = [
    {"id": f"aq-{i+1}", "question_text": q["text"], "options": q["options"], "category": q["cat"], "question_type": "personality"}
    for i, q in enumerate([
        {"text": "When facing a complex problem, you prefer to:", "options": ["A: Break it into smaller parts and analyze systematically", "B: Discuss with others for diverse perspectives", "C: Brainstorm creative unconventional solutions", "D: Follow a proven step-by-step methodology"], "cat": "analytical"},
        {"text": "In a team project, you naturally take the role of:", "options": ["A: The one who researches and brings data", "B: The team coordinator who keeps everyone aligned", "C: The idea generator who thinks outside the box", "D: The planner who creates timelines and checklists"], "cat": "interpersonal"},
        {"text": "You feel most energized when:", "options": ["A: Solving a challenging puzzle or algorithm", "B: Mentoring someone and seeing them succeed", "C: Designing something visually stunning", "D: Organizing a complex project end-to-end"], "cat": "creative"},
        {"text": "Your ideal weekend project would be:", "options": ["A: Building a data dashboard or ML model", "B: Volunteering or organizing a community event", "C: Creating digital art, music, or a short film", "D: Automating your personal finance tracker"], "cat": "systematic"},
        {"text": "During a job interview, you feel most confident talking about:", "options": ["A: Technical deep-dives and problem-solving", "B: Team experiences and conflict resolution", "C: Your portfolio and creative projects", "D: Process improvements you've implemented"], "cat": "analytical"},
        {"text": "When reading news, you gravitate toward:", "options": ["A: Tech and science breakthroughs", "B: Social impact and community stories", "C: Design, art, and entertainment", "D: Business strategy and market analysis"], "cat": "creative"},
        {"text": "Your approach to learning something new:", "options": ["A: Read documentation and experiment hands-on", "B: Join a study group or find a mentor", "C: Watch videos and learn by doing creative projects", "D: Follow a structured course with clear milestones"], "cat": "systematic"},
        {"text": "When a plan fails, you typically:", "options": ["A: Analyze what went wrong with data", "B: Seek feedback from others involved", "C: Pivot to a completely different approach", "D: Review the process and fix the weak link"], "cat": "analytical"},
        {"text": "In a debate, you tend to:", "options": ["A: Use facts and statistics to support your point", "B: Consider everyone's emotions and find common ground", "C: Present new angles no one considered", "D: Structure your arguments logically step by step"], "cat": "interpersonal"},
        {"text": "You would describe your communication style as:", "options": ["A: Precise and data-driven", "B: Empathetic and collaborative", "C: Expressive and storytelling-based", "D: Clear, structured, and to-the-point"], "cat": "interpersonal"},
        {"text": "The career achievement that would make you proudest:", "options": ["A: Publishing a research paper or patent", "B: Building a team that achieves great things", "C: Creating a product millions of people love", "D: Scaling operations to 10x efficiency"], "cat": "creative"},
        {"text": "Your response to ambiguity at work:", "options": ["A: Gather more data before deciding", "B: Consult with colleagues and stakeholders", "C: Trust your intuition and experiment", "D: Create a framework to reduce ambiguity"], "cat": "systematic"},
        {"text": "When evaluating a job offer, you prioritize:", "options": ["A: Technical challenge and learning opportunities", "B: Company culture and team dynamics", "C: Creative freedom and innovation scope", "D: Career growth path and role clarity"], "cat": "analytical"},
        {"text": "Your note-taking style is:", "options": ["A: Detailed with diagrams and flowcharts", "B: Summary of key discussions and action items", "C: Mind maps and visual sketches", "D: Organized with bullet points and headings"], "cat": "systematic"},
        {"text": "Under tight deadlines, you:", "options": ["A: Focus on the highest-impact technical work first", "B: Communicate priorities and delegate effectively", "C: Find creative shortcuts that still deliver quality", "D: Follow the project plan and track progress hourly"], "cat": "interpersonal"},
        {"text": "You handle criticism by:", "options": ["A: Evaluating if the criticism is factually valid", "B: Understanding the critic's perspective emotionally", "C: Seeing it as fuel for doing something even better", "D: Systematically addressing each point raised"], "cat": "analytical"},
        {"text": "Your idea of a perfect mentor is someone who:", "options": ["A: Has deep technical expertise in your field", "B: Genuinely cares about your personal growth", "C: Pushes you to think bigger and be more creative", "D: Helps you plan your career path strategically"], "cat": "interpersonal"},
        {"text": "When starting a new project, you first:", "options": ["A: Research existing solutions and analyze gaps", "B: Talk to potential users and understand their needs", "C: Sketch ideas and envision the final product", "D: Define scope, timeline, and success metrics"], "cat": "creative"},
        {"text": "Your stress management approach:", "options": ["A: Solve the problem causing stress logically", "B: Talk to friends or family about it", "C: Do something creative to take your mind off it", "D: Make a plan to systematically reduce stressors"], "cat": "systematic"},
        {"text": "Five years from now, you see yourself:", "options": ["A: As a recognized expert in a specialized domain", "B: Leading and inspiring a high-performing team", "C: Building innovative products used by millions", "D: Running operations at a senior management level"], "cat": "analytical"},
    ])
]


@router.get("/questions")
def get_assessment_questions(
    user: User = Depends(require_user),
    db: Session = Depends(get_db),
):
    """Get assessment questions — from DB if seeded, otherwise built-in 20-question set."""
    questions = db.query(Question).filter(
        Question.is_assessment_question == True,
        Question.is_active == True
    ).limit(20).all()

    if questions:
        return {
            "count": len(questions),
            "questions": [{
                "id": q.id, "question_text": q.question_text, "options": q.options,
                "category": q.category, "question_type": q.question_type,
            } for q in questions]
        }

    # Fallback: return built-in psychometric questions
    return {
        "count": len(BUILTIN_ASSESSMENT_QUESTIONS),
        "questions": BUILTIN_ASSESSMENT_QUESTIONS,
    }


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
