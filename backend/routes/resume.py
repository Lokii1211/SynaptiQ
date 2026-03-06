"""SkillTen Resume Builder"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session
from database import get_db
from models import Resume, User
from auth import require_user

router = APIRouter()

class ResumeReq(BaseModel):
    title: str = "My Resume"
    template: str = "fresher"
    content: dict
    target_role: Optional[str] = None

@router.post("")
def create_resume(req: ResumeReq, user: User = Depends(require_user), db: Session = Depends(get_db)):
    resume = Resume(user_id=user.id, title=req.title, template=req.template, content=req.content, target_role=req.target_role)
    db.add(resume)
    db.commit()
    return {"resume_id": resume.id, "status": "created"}

@router.get("")
def list_resumes(user: User = Depends(require_user), db: Session = Depends(get_db)):
    resumes = db.query(Resume).filter_by(user_id=user.id).order_by(Resume.updated_at.desc()).all()
    return {"resumes": [{"id": r.id, "title": r.title, "template": r.template, "ats_score": r.ats_score, "target_role": r.target_role, "is_primary": r.is_primary, "updated_at": str(r.updated_at)} for r in resumes]}

@router.get("/{resume_id}")
def get_resume(resume_id: str, user: User = Depends(require_user), db: Session = Depends(get_db)):
    r = db.query(Resume).filter_by(id=resume_id, user_id=user.id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Resume not found")
    return {"id": r.id, "title": r.title, "template": r.template, "content": r.content, "ai_suggestions": r.ai_suggestions, "ats_score": r.ats_score, "target_role": r.target_role}

@router.patch("/{resume_id}")
def update_resume(resume_id: str, req: ResumeReq, user: User = Depends(require_user), db: Session = Depends(get_db)):
    r = db.query(Resume).filter_by(id=resume_id, user_id=user.id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Resume not found")
    r.title = req.title
    r.template = req.template
    r.content = req.content
    r.target_role = req.target_role
    db.commit()
    return {"status": "updated"}
