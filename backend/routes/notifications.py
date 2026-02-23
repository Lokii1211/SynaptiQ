"""SkillTen Notifications"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from datetime import datetime, timezone
from database import get_db
from models import ViyaNotification, User
from auth import require_user

router = APIRouter()

@router.get("/")
def list_notifications(
    unread_only: bool = False, skip: int = 0, limit: int = 20,
    user: User = Depends(require_user), db: Session = Depends(get_db)
):
    q = db.query(ViyaNotification).filter_by(user_id=user.id)
    if unread_only:
        q = q.filter(ViyaNotification.is_read == False)
    total = q.count()
    notifs = q.order_by(ViyaNotification.created_at.desc()).offset(skip).limit(limit).all()
    return {"total": total, "unread_count": db.query(ViyaNotification).filter_by(user_id=user.id, is_read=False).count(), "notifications": [{
        "id": n.id, "type": n.type, "title": n.title, "body": n.body,
        "action_url": n.action_url, "icon": n.icon, "is_read": n.is_read,
        "created_at": str(n.created_at),
    } for n in notifs]}

@router.post("/{notif_id}/read")
def mark_read(notif_id: str, user: User = Depends(require_user), db: Session = Depends(get_db)):
    n = db.query(ViyaNotification).filter_by(id=notif_id, user_id=user.id).first()
    if n:
        n.is_read = True
        n.read_at = datetime.now(timezone.utc)
        db.commit()
    return {"status": "ok"}

@router.post("/read-all")
def mark_all_read(user: User = Depends(require_user), db: Session = Depends(get_db)):
    db.query(ViyaNotification).filter_by(user_id=user.id, is_read=False).update({"is_read": True, "read_at": datetime.now(timezone.utc)})
    db.commit()
    return {"status": "ok"}
