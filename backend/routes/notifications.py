"""
Mentixy Notifications API — Real DB-backed notifications
Uses SQLAlchemy with SQLite/PostgreSQL
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from database import get_db
from models import User, ViyaNotification
from auth import require_user

router = APIRouter()


class MarkReadReq(BaseModel):
    notification_id: str

class SendNotifReq(BaseModel):
    user_id: Optional[str] = None
    type: str = "system"
    title: str
    body: str
    icon: Optional[str] = "🔔"
    action_url: Optional[str] = None


@router.get("")
def get_notifications(
    unread_only: bool = False,
    page: int = Query(1, ge=1),
    limit: int = Query(30, ge=1, le=100),
    user: User = Depends(require_user),
    db: Session = Depends(get_db)
):
    """Get notifications for the current user."""
    query = db.query(ViyaNotification).filter(
        ViyaNotification.user_id == user.id
    )

    if unread_only:
        query = query.filter(ViyaNotification.is_read == False)

    total = query.count()
    unread_count = db.query(ViyaNotification).filter(
        ViyaNotification.user_id == user.id,
        ViyaNotification.is_read == False,
    ).count()

    offset = (page - 1) * limit
    notifications = query.order_by(
        ViyaNotification.created_at.desc()
    ).offset(offset).limit(limit).all()

    return {
        "notifications": [
            {
                "id": n.id,
                "type": n.type,
                "title": n.title,
                "body": n.body,
                "icon": n.icon,
                "action_url": n.action_url,
                "is_read": n.is_read,
                "created_at": n.created_at.isoformat() if n.created_at else None,
            }
            for n in notifications
        ],
        "unread_count": unread_count,
        "total": total,
    }


@router.post("/mark-read")
def mark_notification_read(req: MarkReadReq, user: User = Depends(require_user), db: Session = Depends(get_db)):
    """Mark a specific notification as read."""
    notif = db.query(ViyaNotification).filter(
        ViyaNotification.id == req.notification_id,
        ViyaNotification.user_id == user.id,
    ).first()

    if notif:
        notif.is_read = True
        notif.read_at = datetime.now(timezone.utc)
        db.commit()

    return {"success": True}


@router.post("/mark-all-read")
def mark_all_read(user: User = Depends(require_user), db: Session = Depends(get_db)):
    """Mark all notifications as read."""
    db.query(ViyaNotification).filter(
        ViyaNotification.user_id == user.id,
        ViyaNotification.is_read == False,
    ).update({"is_read": True, "read_at": datetime.now(timezone.utc)})
    db.commit()

    return {"success": True, "message": "All notifications marked as read"}


@router.post("/send")
def send_notification(req: SendNotifReq, user: User = Depends(require_user), db: Session = Depends(get_db)):
    """Send a notification (admin or system use)."""
    target_user_id = req.user_id or user.id

    notif = ViyaNotification(
        user_id=target_user_id,
        type=req.type,
        title=req.title,
        body=req.body,
        icon=req.icon,
        action_url=req.action_url,
    )
    db.add(notif)
    db.commit()
    db.refresh(notif)

    return {
        "success": True,
        "notification": {
            "id": notif.id,
            "type": notif.type,
            "title": notif.title,
            "body": notif.body,
        }
    }


@router.delete("/clear")
def clear_notifications(user: User = Depends(require_user), db: Session = Depends(get_db)):
    """Clear all notifications for the current user."""
    deleted = db.query(ViyaNotification).filter(
        ViyaNotification.user_id == user.id
    ).delete()
    db.commit()

    return {"success": True, "deleted": deleted}
