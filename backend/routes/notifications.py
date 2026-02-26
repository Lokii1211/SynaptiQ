"""
Notifications API — Bible §30
Push notifications for streaks, achievements, jobs, challenges
"""
from fastapi import APIRouter, Request
from datetime import datetime

router = APIRouter()

def require_user(request: Request):
    """Extract user from request state (set by auth middleware)."""
    user = getattr(request.state, "user", None)
    if not user:
        from fastapi import HTTPException
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user


@router.get("/")
async def get_notifications(request: Request):
    """Get all notifications for the current user."""
    user = require_user(request)
    user_id = str(user.get("id", ""))
    
    try:
        from database import supabase
        result = supabase.table("notifications").select("*").eq(
            "user_id", user_id
        ).order("created_at", desc=True).limit(50).execute()
        
        notifications = result.data if result.data else []
        unread_count = len([n for n in notifications if not n.get("is_read")])
        
        return {
            "notifications": notifications,
            "unread_count": unread_count,
            "total": len(notifications)
        }
    except Exception:
        # Return empty if DB not set up yet
        return {
            "notifications": [],
            "unread_count": 0,
            "total": 0
        }


@router.post("/mark-read")
async def mark_notification_read(request: Request):
    """Mark a specific notification as read."""
    user = require_user(request)
    body = await request.json()
    notification_id = body.get("notification_id")
    
    if not notification_id:
        return {"error": "notification_id required"}
    
    try:
        from database import supabase
        supabase.table("notifications").update({
            "is_read": True
        }).eq("id", notification_id).eq("user_id", str(user["id"])).execute()
        
        return {"success": True}
    except Exception:
        return {"success": True}  # Graceful fallback


@router.post("/mark-all-read")
async def mark_all_read(request: Request):
    """Mark all notifications as read for the current user."""
    user = require_user(request)
    
    try:
        from database import supabase
        supabase.table("notifications").update({
            "is_read": True
        }).eq("user_id", str(user["id"])).eq("is_read", False).execute()
        
        return {"success": True, "message": "All notifications marked as read"}
    except Exception:
        return {"success": True}


@router.post("/send")
async def send_notification(request: Request):
    """Send a notification to a user (admin or system use)."""
    user = require_user(request)
    body = await request.json()
    
    target_user_id = body.get("user_id", str(user["id"]))
    notification_type = body.get("type", "system")
    title = body.get("title", "SkillTen Notification")
    message = body.get("message", "")
    icon = body.get("icon", "🔔")
    action_url = body.get("action_url")
    
    if not message:
        return {"error": "message is required"}
    
    try:
        from database import supabase
        result = supabase.table("notifications").insert({
            "user_id": target_user_id,
            "type": notification_type,
            "title": title,
            "message": message,
            "icon": icon,
            "action_url": action_url,
            "is_read": False,
        }).execute()
        
        return {
            "success": True,
            "notification": result.data[0] if result.data else None
        }
    except Exception as e:
        return {"success": False, "error": str(e)}


@router.delete("/clear")
async def clear_notifications(request: Request):
    """Clear all notifications for the current user."""
    user = require_user(request)
    
    try:
        from database import supabase
        supabase.table("notifications").delete().eq(
            "user_id", str(user["id"])
        ).execute()
        
        return {"success": True, "message": "All notifications cleared"}
    except Exception:
        return {"success": True}
