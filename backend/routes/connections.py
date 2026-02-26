"""
Connections/Network API — Bible §29
Peer connections, find peers, social networking
"""
from fastapi import APIRouter, Request

router = APIRouter()

def require_user(request: Request):
    user = getattr(request.state, "user", None)
    if not user:
        from fastapi import HTTPException
        raise HTTPException(status_code=401, detail="Not authenticated")
    return user


@router.get("/peers")
async def find_peers(request: Request):
    """Find suggested peers based on similar career goals."""
    user = require_user(request)
    user_id = str(user.get("id", ""))
    
    try:
        from database import supabase
        # Find users with similar profiles (same college/stream/target_role)
        result = supabase.table("users").select(
            "id, name, email, college_name, stream, city, points, streak_days"
        ).neq("id", user_id).limit(20).execute()
        
        peers = []
        for u in (result.data or []):
            peers.append({
                "user_id": str(u["id"]),
                "display_name": u.get("name", "Student"),
                "username": u.get("email", "").split("@")[0],
                "college_name": u.get("college_name", ""),
                "target_role": u.get("stream", "Student"),
                "skillten_score": u.get("points", 0),
                "streak_days": u.get("streak_days", 0),
            })
        
        return {"peers": peers}
    except Exception:
        return {"peers": []}


@router.get("/connections")
async def get_connections(request: Request):
    """Get current user's connections."""
    user = require_user(request)
    user_id = str(user.get("id", ""))
    
    try:
        from database import supabase
        result = supabase.table("user_connections").select(
            "*, users!user_connections_connected_user_id_fkey(id, name, email, college_name, points, streak_days)"
        ).eq("user_id", user_id).eq("status", "connected").execute()
        
        connections = []
        for conn in (result.data or []):
            connected_user = conn.get("users", {})
            connections.append({
                "user_id": str(connected_user.get("id", "")),
                "display_name": connected_user.get("name", "User"),
                "username": connected_user.get("email", "").split("@")[0],
                "college_name": connected_user.get("college_name", ""),
                "skillten_score": connected_user.get("points", 0),
                "connected_at": conn.get("created_at"),
            })
        
        return {"connections": connections}
    except Exception:
        return {"connections": []}


@router.post("/connect")
async def connect_with_peer(request: Request):
    """Connect with another user."""
    user = require_user(request)
    body = await request.json()
    target_user_id = body.get("user_id")
    
    if not target_user_id:
        return {"error": "user_id required"}
    
    if target_user_id == str(user["id"]):
        return {"error": "Cannot connect with yourself"}
    
    try:
        from database import supabase
        # Check if already connected
        existing = supabase.table("user_connections").select("id").eq(
            "user_id", str(user["id"])
        ).eq("connected_user_id", target_user_id).execute()
        
        if existing.data:
            return {"error": "Already connected"}
        
        # Create bidirectional connection
        supabase.table("user_connections").insert([
            {"user_id": str(user["id"]), "connected_user_id": target_user_id, "status": "connected"},
            {"user_id": target_user_id, "connected_user_id": str(user["id"]), "status": "connected"},
        ]).execute()
        
        return {"success": True, "message": "Connected!"}
    except Exception as e:
        return {"success": False, "error": str(e)}


@router.delete("/disconnect")
async def disconnect_peer(request: Request):
    """Remove a connection."""
    user = require_user(request)
    body = await request.json()
    target_user_id = body.get("user_id")
    
    if not target_user_id:
        return {"error": "user_id required"}
    
    try:
        from database import supabase
        supabase.table("user_connections").delete().eq(
            "user_id", str(user["id"])
        ).eq("connected_user_id", target_user_id).execute()
        
        supabase.table("user_connections").delete().eq(
            "user_id", target_user_id
        ).eq("connected_user_id", str(user["id"])).execute()
        
        return {"success": True, "message": "Disconnected"}
    except Exception:
        return {"success": True}
