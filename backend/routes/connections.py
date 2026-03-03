"""
SkillTen Connections/Network API — Real DB-backed peer connections
Uses SQLAlchemy with SQLite/PostgreSQL
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from datetime import datetime, timezone

from database import get_db
from models import User, UserProfile, UserConnection, ViyaNotification
from auth import require_user

router = APIRouter()


class ConnectReq(BaseModel):
    user_id: str
    message: Optional[str] = None

class DisconnectReq(BaseModel):
    user_id: str


def _peer_response(user: User, connection_status: str = "none"):
    """Format a user as a peer/connection response."""
    profile = user.profile
    return {
        "user_id": user.id,
        "display_name": profile.display_name if profile else user.email.split("@")[0],
        "username": profile.username if profile else "",
        "avatar_url": profile.avatar_url if profile else None,
        "tagline": profile.tagline if profile else None,
        "college_name": profile.college_name if profile else None,
        "stream": profile.stream if profile else None,
        "target_role": profile.target_role if profile else None,
        "city": profile.city if profile else None,
        "skillten_score": profile.viya_score if profile else 0,
        "streak_days": profile.streak_days if profile else 0,
        "connection_status": connection_status,
    }


@router.get("/peers")
def find_peers(
    search: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=50),
    user: User = Depends(require_user),
    db: Session = Depends(get_db)
):
    """Find suggested peers — users not yet connected."""
    # Get IDs of users already connected to
    connected_ids = set()
    sent = db.query(UserConnection.receiver_id).filter(
        UserConnection.requester_id == user.id
    ).all()
    received = db.query(UserConnection.requester_id).filter(
        UserConnection.receiver_id == user.id
    ).all()
    connected_ids = {r[0] for r in sent} | {r[0] for r in received}
    connected_ids.add(user.id)  # Exclude self

    # Query users not in connected set
    query = db.query(User).join(UserProfile).filter(
        ~User.id.in_(connected_ids),
        User.is_active == True,
    )

    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                UserProfile.display_name.ilike(search_term),
                UserProfile.username.ilike(search_term),
                UserProfile.college_name.ilike(search_term),
                UserProfile.target_role.ilike(search_term),
            )
        )

    total = query.count()
    offset = (page - 1) * limit
    peers = query.offset(offset).limit(limit).all()

    return {
        "peers": [_peer_response(p, "none") for p in peers],
        "total": total,
        "page": page,
    }


@router.get("/connections")
def get_connections(
    status: Optional[str] = "accepted",
    user: User = Depends(require_user),
    db: Session = Depends(get_db)
):
    """Get current user's connections."""
    connections = []

    # Connections where user is requester
    sent = db.query(UserConnection).filter(
        UserConnection.requester_id == user.id,
        UserConnection.status == status,
    ).all()
    for conn in sent:
        other = db.query(User).filter(User.id == conn.receiver_id).first()
        if other:
            connections.append({
                **_peer_response(other, status),
                "connected_at": conn.responded_at.isoformat() if conn.responded_at else conn.created_at.isoformat() if conn.created_at else None,
                "connection_id": conn.id,
            })

    # Connections where user is receiver
    received = db.query(UserConnection).filter(
        UserConnection.receiver_id == user.id,
        UserConnection.status == status,
    ).all()
    for conn in received:
        other = db.query(User).filter(User.id == conn.requester_id).first()
        if other:
            connections.append({
                **_peer_response(other, status),
                "connected_at": conn.responded_at.isoformat() if conn.responded_at else conn.created_at.isoformat() if conn.created_at else None,
                "connection_id": conn.id,
            })

    return {"connections": connections, "total": len(connections)}


@router.get("/pending")
def get_pending_requests(user: User = Depends(require_user), db: Session = Depends(get_db)):
    """Get pending connection requests received."""
    pending = db.query(UserConnection).filter(
        UserConnection.receiver_id == user.id,
        UserConnection.status == "pending",
    ).all()

    requests = []
    for conn in pending:
        requester = db.query(User).filter(User.id == conn.requester_id).first()
        if requester:
            requests.append({
                **_peer_response(requester, "pending"),
                "connection_id": conn.id,
                "message": conn.message,
                "requested_at": conn.created_at.isoformat() if conn.created_at else None,
            })

    return {"requests": requests, "total": len(requests)}


@router.post("/connect")
def connect_with_peer(req: ConnectReq, user: User = Depends(require_user), db: Session = Depends(get_db)):
    """Send a connection request."""
    if req.user_id == user.id:
        raise HTTPException(status_code=400, detail="Cannot connect with yourself")

    target = db.query(User).filter(User.id == req.user_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="User not found")

    # Check if connection already exists
    existing = db.query(UserConnection).filter(
        or_(
            and_(UserConnection.requester_id == user.id, UserConnection.receiver_id == req.user_id),
            and_(UserConnection.requester_id == req.user_id, UserConnection.receiver_id == user.id),
        )
    ).first()

    if existing:
        if existing.status == "accepted":
            raise HTTPException(status_code=400, detail="Already connected")
        elif existing.status == "pending":
            # If target sent us a request too, auto-accept
            if existing.requester_id == req.user_id:
                existing.status = "accepted"
                existing.responded_at = datetime.now(timezone.utc)
                db.commit()
                return {"success": True, "status": "accepted", "message": "Connection accepted!"}
            raise HTTPException(status_code=400, detail="Request already sent")

    # Create connection request
    connection = UserConnection(
        requester_id=user.id,
        receiver_id=req.user_id,
        status="accepted",  # Auto-accept for now (like LinkedIn's "Follow" model)
        message=req.message,
        responded_at=datetime.now(timezone.utc),
    )
    db.add(connection)
    db.commit()

    # Notify the other user
    name = user.profile.display_name if user.profile else user.email.split("@")[0]
    notif = ViyaNotification(
        user_id=req.user_id,
        type="new_connection",
        title=f"{name} connected with you",
        body="You have a new connection on SkillTen!",
        action_url=f"/u/{user.profile.username}" if user.profile else "/network",
        icon="🤝",
    )
    db.add(notif)
    db.commit()

    return {"success": True, "status": "accepted", "message": "Connected!"}


@router.delete("/disconnect")
def disconnect_peer(req: DisconnectReq, user: User = Depends(require_user), db: Session = Depends(get_db)):
    """Remove a connection."""
    # Find and delete connection in either direction
    connection = db.query(UserConnection).filter(
        or_(
            and_(UserConnection.requester_id == user.id, UserConnection.receiver_id == req.user_id),
            and_(UserConnection.requester_id == req.user_id, UserConnection.receiver_id == user.id),
        )
    ).first()

    if not connection:
        raise HTTPException(status_code=404, detail="Connection not found")

    db.delete(connection)
    db.commit()
    return {"success": True, "message": "Disconnected"}


@router.get("/stats")
def connection_stats(user: User = Depends(require_user), db: Session = Depends(get_db)):
    """Get connection statistics."""
    total_connections = db.query(UserConnection).filter(
        or_(
            UserConnection.requester_id == user.id,
            UserConnection.receiver_id == user.id,
        ),
        UserConnection.status == "accepted",
    ).count()

    pending_received = db.query(UserConnection).filter(
        UserConnection.receiver_id == user.id,
        UserConnection.status == "pending",
    ).count()

    return {
        "total_connections": total_connections,
        "pending_requests": pending_received,
    }
