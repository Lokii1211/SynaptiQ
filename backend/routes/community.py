"""
SkillTen Community API — Real DB-backed posts, comments, likes
Uses SQLAlchemy with SQLite/PostgreSQL (no supabase client)
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, List
from sqlalchemy.orm import Session
from datetime import datetime, timezone

from database import get_db
from models import User, UserProfile, CommunityPost, PostComment, PostLike, ViyaNotification
from auth import require_user, get_current_user

router = APIRouter()


class CreatePostReq(BaseModel):
    title: str
    content: str
    category: Optional[str] = "general"
    tags: Optional[List[str]] = []

class CreateCommentReq(BaseModel):
    content: str


def _post_response(post: CommunityPost, current_user_id: str = None):
    """Format a post for API response."""
    author_name = "Anonymous"
    author_avatar = None
    author_username = None
    if post.author and post.author.profile:
        if not post.is_anonymous:
            author_name = post.author.profile.display_name or post.author.email.split("@")[0]
            author_avatar = post.author.profile.avatar_url
            author_username = post.author.profile.username

    # Check if current user liked this post
    user_liked = False
    if current_user_id and post.likes:
        user_liked = any(like.user_id == current_user_id for like in post.likes)

    return {
        "id": post.id,
        "author_id": post.author_id if not post.is_anonymous else None,
        "author_name": author_name,
        "author_avatar": author_avatar,
        "author_username": author_username,
        "title": post.title,
        "content": post.content,
        "post_type": post.post_type or "general",
        "tags": post.tags or [],
        "likes_count": post.likes_count,
        "comments_count": post.comments_count,
        "views_count": post.views_count,
        "user_liked": user_liked,
        "is_pinned": post.is_pinned,
        "created_at": post.created_at.isoformat() if post.created_at else None,
    }


def _comment_response(comment: PostComment):
    """Format a comment for API response."""
    author_name = "Anonymous"
    if comment.author and comment.author.profile:
        author_name = comment.author.profile.display_name or comment.author.email.split("@")[0]

    return {
        "id": comment.id,
        "author_name": author_name,
        "author_avatar": comment.author.profile.avatar_url if comment.author and comment.author.profile else None,
        "content": comment.content,
        "likes_count": comment.likes_count,
        "created_at": comment.created_at.isoformat() if comment.created_at else None,
    }


@router.get("/posts")
def get_posts(
    category: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=50),
    user: Optional[User] = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get community posts with optional category filter."""
    query = db.query(CommunityPost).filter(
        CommunityPost.moderation_status == "approved"
    ).order_by(CommunityPost.is_pinned.desc(), CommunityPost.created_at.desc())

    if category and category not in ("all", ""):
        query = query.filter(CommunityPost.post_type == category)

    total = query.count()
    offset = (page - 1) * limit
    posts = query.offset(offset).limit(limit).all()

    user_id = user.id if user else None
    return {
        "posts": [_post_response(p, user_id) for p in posts],
        "page": page,
        "total": total,
        "has_more": (offset + limit) < total,
    }


@router.get("/posts/{post_id}")
def get_post(post_id: str, user: Optional[User] = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get a single post with its comments."""
    post = db.query(CommunityPost).filter(CommunityPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    # Increment view count
    post.views_count = (post.views_count or 0) + 1
    db.commit()

    # Get comments
    comments = db.query(PostComment).filter(
        PostComment.post_id == post_id
    ).order_by(PostComment.created_at.asc()).all()

    user_id = user.id if user else None
    return {
        "post": _post_response(post, user_id),
        "comments": [_comment_response(c) for c in comments],
    }


@router.post("/posts")
def create_post(req: CreatePostReq, user: User = Depends(require_user), db: Session = Depends(get_db)):
    """Create a new community post."""
    if not req.title.strip() or not req.content.strip():
        raise HTTPException(status_code=400, detail="Title and content are required")

    if len(req.title) > 300:
        raise HTTPException(status_code=400, detail="Title too long (max 300 chars)")

    post = CommunityPost(
        author_id=user.id,
        title=req.title.strip(),
        content=req.content.strip(),
        post_type=req.category,
        tags=req.tags,
    )
    db.add(post)
    db.commit()
    db.refresh(post)

    return {
        "success": True,
        "post": _post_response(post, user.id),
    }


@router.post("/posts/{post_id}/like")
def like_post(post_id: str, user: User = Depends(require_user), db: Session = Depends(get_db)):
    """Like/unlike a community post (toggle)."""
    post = db.query(CommunityPost).filter(CommunityPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    # Check if already liked
    existing = db.query(PostLike).filter(
        PostLike.post_id == post_id, PostLike.user_id == user.id
    ).first()

    if existing:
        # Unlike
        db.delete(existing)
        post.likes_count = max((post.likes_count or 0) - 1, 0)
        db.commit()
        return {"success": True, "liked": False, "likes_count": post.likes_count}
    else:
        # Like
        like = PostLike(post_id=post_id, user_id=user.id)
        db.add(like)
        post.likes_count = (post.likes_count or 0) + 1
        db.commit()

        # Notify post author (if not own post)
        if post.author_id != user.id:
            name = user.profile.display_name if user.profile else user.email.split("@")[0]
            notif = ViyaNotification(
                user_id=post.author_id,
                type="post_like",
                title=f"{name} liked your post",
                body=post.title[:100],
                action_url=f"/community/{post.id}",
                icon="❤️",
            )
            db.add(notif)
            db.commit()

        return {"success": True, "liked": True, "likes_count": post.likes_count}


@router.post("/posts/{post_id}/comment")
def add_comment(post_id: str, req: CreateCommentReq, user: User = Depends(require_user), db: Session = Depends(get_db)):
    """Add a comment to a post."""
    post = db.query(CommunityPost).filter(CommunityPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")

    if not req.content.strip():
        raise HTTPException(status_code=400, detail="Comment content is required")

    comment = PostComment(
        post_id=post_id,
        author_id=user.id,
        content=req.content.strip(),
    )
    db.add(comment)
    post.comments_count = (post.comments_count or 0) + 1
    db.commit()
    db.refresh(comment)

    # Notify post author
    if post.author_id != user.id:
        name = user.profile.display_name if user.profile else user.email.split("@")[0]
        notif = ViyaNotification(
            user_id=post.author_id,
            type="post_comment",
            title=f"{name} commented on your post",
            body=req.content[:100],
            action_url=f"/community/{post.id}",
            icon="💬",
        )
        db.add(notif)
        db.commit()

    return {
        "success": True,
        "comment": _comment_response(comment),
    }


@router.delete("/posts/{post_id}")
def delete_post(post_id: str, user: User = Depends(require_user), db: Session = Depends(get_db)):
    """Delete own post."""
    post = db.query(CommunityPost).filter(CommunityPost.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    if post.author_id != user.id and user.role != "admin":
        raise HTTPException(status_code=403, detail="Not your post")

    db.delete(post)
    db.commit()
    return {"success": True}


@router.get("/categories")
def get_categories():
    """Get available community categories."""
    return {
        "categories": [
            {"slug": "all", "label": "All Posts", "icon": "📋"},
            {"slug": "placements", "label": "Placements", "icon": "🎯"},
            {"slug": "career-advice", "label": "Career Advice", "icon": "💡"},
            {"slug": "resources", "label": "Resources", "icon": "📚"},
            {"slug": "success-stories", "label": "Success Stories", "icon": "🏆"},
            {"slug": "questions", "label": "Questions", "icon": "❓"},
            {"slug": "interview-prep", "label": "Interview Prep", "icon": "🎤"},
            {"slug": "college-life", "label": "College Life", "icon": "🎓"},
            {"slug": "side-projects", "label": "Side Projects", "icon": "🔨"},
            {"slug": "general", "label": "General", "icon": "💬"},
        ]
    }
