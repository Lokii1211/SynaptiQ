"""SkillTen AI Chat — Gemini-powered career advisor"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from database import get_db
from models import ChatSession, User
from auth import require_user
from ai_engine import career_chat

router = APIRouter()

class ChatReq(BaseModel):
    message: str
    session_id: Optional[str] = None

@router.post("/")
async def chat(req: ChatReq, user: User = Depends(require_user), db: Session = Depends(get_db)):
    if req.session_id:
        session = db.query(ChatSession).filter_by(id=req.session_id, user_id=user.id).first()
        if not session:
            raise HTTPException(status_code=404, detail="Session not found")
    else:
        session = ChatSession(user_id=user.id, title=req.message[:50], messages=[])
        db.add(session)
        db.flush()

    msgs = session.messages or []
    msgs.append({"role": "user", "content": req.message, "ts": str(datetime.now(timezone.utc))})

    # Build user profile context for AI
    user_profile = {}
    if user.profile:
        user_profile = {
            "college_name": user.profile.college_name,
            "college_tier": user.profile.college_tier,
            "stream": user.profile.stream,
            "graduation_year": user.profile.graduation_year,
            "cgpa": user.profile.cgpa,
            "target_role": user.profile.target_role,
            "archetype_name": user.profile.archetype_name,
            "skillten_score": user.profile.viya_score,
        }

    # Generate AI response via Gemini (or mock fallback)
    ai_reply = await career_chat(req.message, msgs[:-1], user_profile)
    msgs.append({"role": "assistant", "content": ai_reply, "ts": str(datetime.now(timezone.utc))})

    session.messages = msgs
    session.updated_at = datetime.now(timezone.utc)
    db.commit()
    return {"session_id": session.id, "reply": ai_reply}

@router.get("/sessions")
def list_sessions(user: User = Depends(require_user), db: Session = Depends(get_db)):
    sessions = db.query(ChatSession).filter_by(user_id=user.id).order_by(ChatSession.updated_at.desc()).all()
    return {"sessions": [{"id": s.id, "title": s.title, "message_count": len(s.messages or []), "updated_at": str(s.updated_at)} for s in sessions]}

@router.get("/sessions/{session_id}")
def get_session(session_id: str, user: User = Depends(require_user), db: Session = Depends(get_db)):
    s = db.query(ChatSession).filter_by(id=session_id, user_id=user.id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"id": s.id, "title": s.title, "messages": s.messages}
