"""SkillTen Network — connections, community posts"""
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from typing import Optional
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from database import get_db
from models import UserConnection, CommunityPost, User, UserProfile
from auth import require_user

router = APIRouter()


class ConnectReq(BaseModel):
    receiver_id: str
    message: Optional[str] = None
    connection_type: str = "peer"

@router.post("/connect")
def send_connection(req: ConnectReq, user: User = Depends(require_user), db: Session = Depends(get_db)):
    if req.receiver_id == user.id:
        raise HTTPException(status_code=400, detail="Cannot connect to yourself")
    existing = db.query(UserConnection).filter_by(requester_id=user.id, receiver_id=req.receiver_id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Connection already exists")
    conn = UserConnection(
        requester_id=user.id, receiver_id=req.receiver_id,
        message=req.message, connection_type=req.connection_type,
    )
    db.add(conn)
    db.commit()
    return {"status": "request_sent", "connection_id": conn.id}


@router.post("/connect/{conn_id}/respond")
def respond_connection(conn_id: str, accept: bool = True, user: User = Depends(require_user), db: Session = Depends(get_db)):
    conn = db.query(UserConnection).filter_by(id=conn_id, receiver_id=user.id).first()
    if not conn:
        raise HTTPException(status_code=404, detail="Connection not found")
    conn.status = "accepted" if accept else "rejected"
    conn.responded_at = datetime.now(timezone.utc)
    db.commit()
    return {"status": conn.status}


@router.get("/connections")
def my_connections(user: User = Depends(require_user), db: Session = Depends(get_db)):
    sent = db.query(UserConnection).filter_by(requester_id=user.id, status="accepted").all()
    received = db.query(UserConnection).filter_by(receiver_id=user.id, status="accepted").all()
    connections = []
    for c in sent:
        p = db.query(UserProfile).filter_by(user_id=c.receiver_id).first()
        if p:
            connections.append({"user_id": c.receiver_id, "username": p.username, "display_name": p.display_name, "type": c.connection_type})
    for c in received:
        p = db.query(UserProfile).filter_by(user_id=c.requester_id).first()
        if p:
            connections.append({"user_id": c.requester_id, "username": p.username, "display_name": p.display_name, "type": c.connection_type})
    return {"connections": connections}


@router.get("/peers")
def find_peers(
    career_path: Optional[str] = None, college: Optional[str] = None,
    skip: int = 0, limit: int = 20,
    user: User = Depends(require_user), db: Session = Depends(get_db)
):
    q = db.query(UserProfile).filter(UserProfile.user_id != user.id, UserProfile.is_public == True)
    if career_path:
        q = q.filter(UserProfile.target_role.ilike(f"%{career_path}%"))
    if college:
        q = q.filter(UserProfile.college_name.ilike(f"%{college}%"))
    peers = q.offset(skip).limit(limit).all()
    return {"peers": [{
        "user_id": p.user_id, "username": p.username, "display_name": p.display_name,
        "college_name": p.college_name, "target_role": p.target_role,
        "skillten_score": p.viya_score,
    } for p in peers]}


class PostReq(BaseModel):
    title: Optional[str] = None
    content: str
    post_type: str = "discussion"
    tags: Optional[list] = None
    is_anonymous: bool = False

@router.post("/community/posts")
def create_post(req: PostReq, user: User = Depends(require_user), db: Session = Depends(get_db)):
    post = CommunityPost(
        author_id=user.id, title=req.title, content=req.content,
        post_type=req.post_type, tags=req.tags, is_anonymous=req.is_anonymous,
    )
    db.add(post)
    db.commit()
    return {"status": "posted", "post_id": post.id}


@router.get("/community/posts")
def list_posts(
    post_type: Optional[str] = None, skip: int = 0, limit: int = 20,
    db: Session = Depends(get_db)
):
    q = db.query(CommunityPost).filter(CommunityPost.moderation_status == "approved")
    if post_type:
        q = q.filter(CommunityPost.post_type == post_type)
    posts = q.order_by(CommunityPost.created_at.desc()).offset(skip).limit(limit).all()
    return {"posts": [{
        "id": p.id, "title": p.title, "content": p.content[:200],
        "post_type": p.post_type, "tags": p.tags,
        "likes_count": p.likes_count, "comments_count": p.comments_count,
        "is_anonymous": p.is_anonymous, "created_at": str(p.created_at),
    } for p in posts]}
