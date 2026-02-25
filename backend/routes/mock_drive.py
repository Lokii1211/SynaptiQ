"""SkillTen Mock Placement Drive — simulated full placement process
Bible Section 6 (Prompt 6.1 §7) — "VIYA's most emotionally powerful feature"

Round 1: Aptitude Test (30Q, 30 min)
Round 2: Coding Round (2 problems, 45 min)
Round 3: Technical MCQ (20Q, 20 min)
Round 4: HR Questions (5Q, written + AI scoring)
"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from database import get_db
from models import User, Question
from auth import require_user

router = APIRouter()


# ─── Request Models ───

class StartMockDriveReq(BaseModel):
    target_company: str = "TCS"
    target_role: str = "Software Engineer"

class SubmitRoundReq(BaseModel):
    drive_id: str
    round_number: int
    answers: list  # flexible for different round types

class HRAnswerItem(BaseModel):
    question: str
    answer: str


# ─── 1. Start Mock Placement Drive ───

@router.post("/start")
def start_mock_drive(
    req: StartMockDriveReq,
    user: User = Depends(require_user),
    db: Session = Depends(get_db),
):
    """
    Start a full mock placement drive simulation.
    Returns all 4 rounds with questions and time limits.
    """
    import uuid

    drive_id = str(uuid.uuid4())[:8]

    # Round 1: Aptitude (30 questions, 30 minutes)
    aptitude_qs = db.query(Question).filter(
        Question.is_aptitude_question == True,
        Question.is_active == True
    ).limit(30).all()

    # Round 3: Technical MCQ (20 questions, 20 minutes)
    tech_qs = db.query(Question).filter(
        Question.is_quiz_question == True,
        Question.is_active == True,
    ).limit(20).all()

    # Round 2: Coding (2 problems — we'll generate prompts)
    coding_problems = [
        {
            "id": "mock-coding-1",
            "title": "Two Sum",
            "difficulty": "easy",
            "statement": "Given an array of integers and a target, return indices of two numbers that add up to the target.",
            "examples": [{"input": "nums = [2,7,11,15], target = 9", "output": "[0,1]"}],
            "time_limit_minutes": 22,
        },
        {
            "id": "mock-coding-2",
            "title": "Reverse Linked List",
            "difficulty": "medium",
            "statement": "Given the head of a singly linked list, reverse the list and return the reversed list.",
            "examples": [{"input": "head = [1,2,3,4,5]", "output": "[5,4,3,2,1]"}],
            "time_limit_minutes": 23,
        },
    ]

    # Round 4: HR Questions
    hr_questions = [
        {"id": "hr-1", "question": "Tell me about yourself. What makes you a good fit for this role?"},
        {"id": "hr-2", "question": "Describe a challenging project you worked on. What was your role and what did you learn?"},
        {"id": "hr-3", "question": f"Why do you want to join {req.target_company}?"},
        {"id": "hr-4", "question": "Where do you see yourself in 5 years?"},
        {"id": "hr-5", "question": "Tell me about a time you failed and how you handled it."},
    ]

    return {
        "drive_id": drive_id,
        "target_company": req.target_company,
        "target_role": req.target_role,
        "total_rounds": 4,
        "rounds": [
            {
                "round_number": 1,
                "name": "Aptitude Test",
                "type": "aptitude",
                "time_limit_minutes": 30,
                "total_questions": len(aptitude_qs),
                "questions": [{
                    "id": q.id,
                    "question_text": q.question_text,
                    "options": q.options,
                    "category": q.category,
                    "difficulty": q.difficulty,
                } for q in aptitude_qs],
            },
            {
                "round_number": 2,
                "name": "Coding Round",
                "type": "coding",
                "time_limit_minutes": 45,
                "total_questions": 2,
                "problems": coding_problems,
            },
            {
                "round_number": 3,
                "name": "Technical MCQ",
                "type": "technical",
                "time_limit_minutes": 20,
                "total_questions": len(tech_qs),
                "questions": [{
                    "id": q.id,
                    "question_text": q.question_text,
                    "options": q.options,
                    "category": q.category,
                    "difficulty": q.difficulty,
                } for q in tech_qs],
            },
            {
                "round_number": 4,
                "name": "HR Interview",
                "type": "hr",
                "time_limit_minutes": 15,
                "total_questions": 5,
                "questions": hr_questions,
            },
        ],
    }


# ─── 2. Submit Round Results ───

@router.post("/submit-round")
def submit_round(
    req: SubmitRoundReq,
    user: User = Depends(require_user),
    db: Session = Depends(get_db),
):
    """Submit answers for a specific round and get scored."""
    round_num = req.round_number

    if round_num in [1, 3]:
        # MCQ grading
        correct = 0
        total = len(req.answers)
        results = []
        for ans in req.answers:
            q_id = ans.get("question_id", "")
            selected = ans.get("selected_option", "")
            q = db.query(Question).filter_by(id=q_id).first()
            is_correct = False
            if q and q.correct_answer and selected == q.correct_answer:
                is_correct = True
                correct += 1
            results.append({
                "question_id": q_id,
                "is_correct": is_correct,
                "correct_answer": q.correct_answer if q else "",
            })

        score = round((correct / max(total, 1)) * 100, 1)
        passed = score >= 50

        return {
            "round_number": round_num,
            "round_name": "Aptitude Test" if round_num == 1 else "Technical MCQ",
            "score": score,
            "correct": correct,
            "total": total,
            "passed": passed,
            "cutoff": 50,
            "results": results,
            "feedback": _round_feedback(round_num, score),
        }

    elif round_num == 2:
        # Coding round — simplified scoring
        solutions = req.answers
        total_score = 0
        for sol in solutions:
            code = sol.get("code", "")
            length_score = min(40, len(code) // 5)
            has_logic = 30 if any(kw in code.lower() for kw in ["for", "while", "if", "return", "def", "function"]) else 0
            total_score += length_score + has_logic
        score = min(100, total_score)
        return {
            "round_number": 2,
            "round_name": "Coding Round",
            "score": score,
            "passed": score >= 50,
            "cutoff": 50,
            "feedback": _round_feedback(2, score),
        }

    elif round_num == 4:
        # HR round — AI-scored (simplified)
        answers = req.answers
        total_score = 0
        results = []
        for ans in answers:
            text = ans.get("answer", "")
            # Simple scoring heuristic
            word_count = len(text.split())
            detail_score = min(40, word_count * 2)
            has_examples = 20 if any(w in text.lower() for w in ["project", "experience", "learned", "team", "challenge"]) else 0
            professional = 20 if word_count > 30 else 10
            ans_score = min(100, detail_score + has_examples + professional)
            total_score += ans_score
            results.append({
                "question": ans.get("question", ""),
                "score": ans_score,
                "feedback": "Strong answer" if ans_score >= 70 else "Could be more detailed" if ans_score >= 40 else "Needs improvement",
            })

        avg_score = round(total_score / max(len(answers), 1), 1)
        return {
            "round_number": 4,
            "round_name": "HR Interview",
            "score": avg_score,
            "passed": avg_score >= 50,
            "cutoff": 50,
            "results": results,
            "feedback": _round_feedback(4, avg_score),
        }

    raise HTTPException(status_code=400, detail="Invalid round number")


# ─── 3. Final Drive Results ───

@router.post("/results")
def drive_results(
    drive_id: str,
    round_scores: list,  # [{round: 1, score: 75}, ...]
    user: User = Depends(require_user),
):
    """
    Calculate final mock placement drive results.
    Returns: placement likelihood, per-round feedback, improvement plan.
    """
    total_score = 0
    round_results = []
    all_passed = True

    for rs in round_scores:
        score = rs.get("score", 0)
        passed = score >= 50
        if not passed:
            all_passed = False
        total_score += score
        round_results.append({
            "round": rs.get("round", 0),
            "score": score,
            "passed": passed,
        })

    avg_score = round(total_score / max(len(round_scores), 1), 1)
    placement_probability = min(95, round(avg_score * 0.9 + 10, 1)) if all_passed else min(40, round(avg_score * 0.4, 1))

    return {
        "drive_id": drive_id,
        "overall_score": avg_score,
        "placement_probability": placement_probability,
        "all_rounds_cleared": all_passed,
        "round_results": round_results,
        "verdict": "Likely to get placed!" if placement_probability >= 70 else "Needs improvement" if placement_probability >= 40 else "Significant preparation needed",
        "improvement_plan": _improvement_plan(round_results),
    }


# ─── Helpers ───

def _round_feedback(round_num: int, score: float) -> str:
    labels = {1: "Aptitude", 2: "Coding", 3: "Technical", 4: "HR"}
    name = labels.get(round_num, "Round")
    if score >= 80:
        return f"Excellent performance in {name}! You're well-prepared for this round."
    elif score >= 60:
        return f"Good performance in {name}. A few areas to strengthen, but you're on track."
    elif score >= 40:
        return f"Average performance in {name}. Focus on consistent practice to improve."
    else:
        return f"Needs significant improvement in {name}. Create a dedicated study plan."


def _improvement_plan(results: list) -> list:
    plan = []
    for r in results:
        rnd = r.get("round", 0)
        score = r.get("score", 0)
        if score < 70:
            recommendations = {
                1: {"area": "Aptitude", "actions": ["Practice 20 quant problems daily", "Focus on time management", "Use shortcuts for calculations"]},
                2: {"area": "Coding", "actions": ["Solve 2 DSA problems daily", "Focus on arrays, strings, trees", "Practice explaining your approach"]},
                3: {"area": "Technical", "actions": ["Review core CS concepts (OS, DBMS, CN)", "Practice MCQs from previous years", "Focus on OOP principles"]},
                4: {"area": "HR Skills", "actions": ["Prepare STAR-format answers", "Practice common HR questions aloud", "Research the company thoroughly"]},
            }
            rec = recommendations.get(rnd, {"area": "General", "actions": ["Practice more"]})
            rec["current_score"] = score
            rec["target_score"] = 70
            plan.append(rec)
    return plan
