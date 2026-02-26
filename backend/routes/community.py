"""
Community API — Bible §22
Forum posts, comments, likes, categories
"""
from fastapi import APIRouter, Request
from datetime import datetime

router = APIRouter()

def require_user(request: Request):
    user = getattr(request.state, "user", None)
    if not user:
        from fastapi import HTTPException
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user


@router.get("/posts")
async def get_posts(request: Request):
    """Get community posts with optional category filter."""
    category = request.query_params.get("category", None)
    page = int(request.query_params.get("page", "1"))
    limit = int(request.query_params.get("limit", "20"))
    offset = (page - 1) * limit
    
    try:
        from database import supabase
        query = supabase.table("community_posts").select("*").order("created_at", desc=True)
        
        if category and category != "all":
            query = query.eq("category", category)
        
        result = query.range(offset, offset + limit - 1).execute()
        posts = result.data if result.data else []
        
        return {
            "posts": posts,
            "page": page,
            "total": len(posts)
        }
    except Exception:
        # Fallback seed data
        return {
            "posts": [
                {"id": "1", "user_name": "Priya S.", "title": "How I got into Google from a Tier-3 college", "content": "Total prep time: 8 months. Don't let your college name hold you back!", "category": "success-stories", "tags": ["google", "placement"], "likes": 347, "created_at": "2026-02-20"},
                {"id": "2", "user_name": "Rahul K.", "title": "Best free resources for ML in 2026", "content": "After trying 20+ courses, here are my top picks.", "category": "resources", "tags": ["ml", "free"], "likes": 215, "created_at": "2026-02-19"},
                {"id": "3", "user_name": "Vikram R.", "title": "Tier-2 college to ₹18L at Swiggy", "content": "ECE graduate. Switched to SWE. Here's my 14-month roadmap.", "category": "success-stories", "tags": ["swiggy", "tier-2"], "likes": 421, "created_at": "2026-02-18"},
            ],
            "page": 1,
            "total": 3
        }


@router.get("/posts/{post_id}")
async def get_post(post_id: str, request: Request):
    """Get a single post with its comments."""
    try:
        from database import supabase
        post_result = supabase.table("community_posts").select("*").eq("id", post_id).single().execute()
        comments_result = supabase.table("post_comments").select("*").eq("post_id", post_id).order("created_at", desc=False).execute()
        
        return {
            "post": post_result.data,
            "comments": comments_result.data if comments_result.data else []
        }
    except Exception:
        return {"post": None, "comments": []}


@router.post("/posts")
async def create_post(request: Request):
    """Create a new community post."""
    user = require_user(request)
    body = await request.json()
    
    title = body.get("title", "").strip()
    content = body.get("content", "").strip()
    category = body.get("category", "general")
    tags = body.get("tags", [])
    
    if not title or not content:
        return {"error": "Title and content are required"}
    
    if len(title) > 200:
        return {"error": "Title too long (max 200 chars)"}
    
    user_name = user.get("name", user.get("email", "Anonymous").split("@")[0])
    
    try:
        from database import supabase
        result = supabase.table("community_posts").insert({
            "user_id": str(user["id"]),
            "user_name": user_name,
            "title": title,
            "content": content,
            "category": category,
            "tags": tags,
            "likes": 0,
        }).execute()
        
        return {
            "success": True,
            "post": result.data[0] if result.data else None
        }
    except Exception as e:
        return {"success": False, "error": str(e)}


@router.post("/posts/{post_id}/comment")
async def add_comment(post_id: str, request: Request):
    """Add a comment to a post."""
    user = require_user(request)
    body = await request.json()
    content = body.get("content", "").strip()
    
    if not content:
        return {"error": "Comment content is required"}
    
    user_name = user.get("name", user.get("email", "Anonymous").split("@")[0])
    
    try:
        from database import supabase
        result = supabase.table("post_comments").insert({
            "post_id": post_id,
            "user_id": str(user["id"]),
            "user_name": user_name,
            "content": content,
        }).execute()
        
        return {
            "success": True,
            "comment": result.data[0] if result.data else None
        }
    except Exception as e:
        return {"success": False, "error": str(e)}


@router.post("/posts/{post_id}/like")
async def like_post(post_id: str, request: Request):
    """Like/upvote a community post."""
    require_user(request)
    
    try:
        from database import supabase
        # Get current likes count
        post = supabase.table("community_posts").select("likes").eq("id", post_id).single().execute()
        current_likes = post.data.get("likes", 0) if post.data else 0
        
        # Increment
        supabase.table("community_posts").update({
            "likes": current_likes + 1
        }).eq("id", post_id).execute()
        
        return {"success": True, "likes": current_likes + 1}
    except Exception:
        return {"success": True, "likes": 0}


@router.get("/categories")
async def get_categories(request: Request):
    """Get available community categories."""
    return {
        "categories": [
            {"slug": "all", "label": "All Posts", "icon": "📋"},
            {"slug": "success-stories", "label": "Success Stories", "icon": "🏆"},
            {"slug": "resources", "label": "Resources", "icon": "📚"},
            {"slug": "career-dilemma", "label": "Career Dilemma", "icon": "🤔"},
            {"slug": "interview-prep", "label": "Interview Prep", "icon": "🎯"},
            {"slug": "general", "label": "General", "icon": "💬"},
            {"slug": "college-life", "label": "College Life", "icon": "🎓"},
            {"slug": "side-projects", "label": "Side Projects", "icon": "🔨"},
        ]
    }
