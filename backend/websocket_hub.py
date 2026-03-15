"""
Mentixy — WebSocket Notifications Hub
Real-time push notifications via WebSocket connections
Bible §30: Push notifications for streaks, achievements, jobs, challenges
"""
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Dict, Set
import asyncio
import json
from datetime import datetime

router = APIRouter()


class ConnectionManager:
    """Manages WebSocket connections for real-time notifications."""

    def __init__(self):
        # user_id -> set of WebSocket connections (supports multiple tabs/devices)
        self.active_connections: Dict[str, Set[WebSocket]] = {}
        # All connections for broadcast
        self.all_connections: Set[WebSocket] = set()

    async def connect(self, websocket: WebSocket, user_id: str):
        """Accept and track a new WebSocket connection."""
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = set()
        self.active_connections[user_id].add(websocket)
        self.all_connections.add(websocket)
        print(f"[WS] User {user_id} connected. Total connections: {len(self.all_connections)}")

    def disconnect(self, websocket: WebSocket, user_id: str):
        """Remove a disconnected WebSocket."""
        if user_id in self.active_connections:
            self.active_connections[user_id].discard(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]
        self.all_connections.discard(websocket)
        print(f"[WS] User {user_id} disconnected. Total connections: {len(self.all_connections)}")

    async def send_to_user(self, user_id: str, message: dict):
        """Send a message to a specific user (all their connections)."""
        if user_id in self.active_connections:
            dead_connections = set()
            for ws in self.active_connections[user_id]:
                try:
                    await ws.send_json(message)
                except Exception:
                    dead_connections.add(ws)
            # Cleanup dead connections
            for ws in dead_connections:
                self.active_connections[user_id].discard(ws)
                self.all_connections.discard(ws)

    async def broadcast(self, message: dict, exclude_user: str = None):
        """Send a message to all connected users."""
        dead_connections = set()
        for ws in self.all_connections:
            try:
                await ws.send_json(message)
            except Exception:
                dead_connections.add(ws)
        for ws in dead_connections:
            self.all_connections.discard(ws)

    def get_online_count(self) -> int:
        """Get number of online users."""
        return len(self.active_connections)

    def is_user_online(self, user_id: str) -> bool:
        """Check if a specific user is online."""
        return user_id in self.active_connections and len(self.active_connections[user_id]) > 0


# Global connection manager instance
manager = ConnectionManager()


@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    """Main WebSocket endpoint for real-time notifications."""
    await manager.connect(websocket, user_id)

    # Send welcome message
    await websocket.send_json({
        "type": "connected",
        "message": "Connected to Mentixy notifications",
        "online_users": manager.get_online_count(),
        "timestamp": datetime.utcnow().isoformat(),
    })

    try:
        while True:
            # Listen for client messages
            data = await websocket.receive_text()
            try:
                message = json.loads(data)
                msg_type = message.get("type", "")

                if msg_type == "ping":
                    await websocket.send_json({"type": "pong", "timestamp": datetime.utcnow().isoformat()})

                elif msg_type == "typing":
                    # Forward typing indicator to chat recipient
                    target = message.get("target_user_id")
                    if target:
                        await manager.send_to_user(target, {
                            "type": "typing",
                            "from_user_id": user_id,
                            "timestamp": datetime.utcnow().isoformat(),
                        })

                elif msg_type == "read_receipt":
                    # Mark notification as read from WS
                    notification_id = message.get("notification_id")
                    if notification_id:
                        await websocket.send_json({
                            "type": "read_confirmed",
                            "notification_id": notification_id,
                        })

                elif msg_type == "get_online":
                    await websocket.send_json({
                        "type": "online_count",
                        "count": manager.get_online_count(),
                    })

            except json.JSONDecodeError:
                await websocket.send_json({"type": "error", "message": "Invalid JSON"})

    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id)
    except Exception:
        manager.disconnect(websocket, user_id)


# ─── Helper functions for server-side notification sending ───

async def notify_user(user_id: str, notification_type: str, title: str, message: str,
                      icon: str = "🔔", action_url: str = None):
    """Send a real-time notification to a user (call from any route)."""
    payload = {
        "type": "notification",
        "notification_type": notification_type,
        "title": title,
        "message": message,
        "icon": icon,
        "action_url": action_url,
        "timestamp": datetime.utcnow().isoformat(),
    }
    await manager.send_to_user(user_id, payload)


async def notify_streak_risk(user_id: str, hours_remaining: int):
    """Notify user their streak is at risk."""
    await notify_user(
        user_id, "streak_risk",
        "🔥 Streak at Risk!",
        f"You have {hours_remaining} hours left to maintain your streak. Complete a quick challenge!",
        "🔥", "/daily"
    )


async def notify_achievement(user_id: str, badge_name: str, xp: int):
    """Notify user of a new achievement."""
    await notify_user(
        user_id, "achievement",
        f"🏅 Achievement Unlocked: {badge_name}",
        f"You earned +{xp} XP! Check your achievements page.",
        "🏅", "/achievements"
    )


async def notify_campus_wars(user_id: str, college_name: str, new_rank: int):
    """Notify user of campus wars rank change."""
    await notify_user(
        user_id, "campus_wars",
        f"🏆 {college_name} moved to #{new_rank}!",
        "Your contributions helped your college climb the leaderboard.",
        "🏆", "/leaderboard"
    )


async def notify_recruiter_view(user_id: str, company_name: str):
    """Notify user a recruiter viewed their profile."""
    await notify_user(
        user_id, "recruiter_view",
        f"👀 {company_name} viewed your profile",
        "A recruiter checked your Mentixy profile. Keep it updated!",
        "👀", "/settings"
    )


async def broadcast_system(message: str, icon: str = "📢"):
    """Broadcast a system notification to all online users."""
    await manager.broadcast({
        "type": "system",
        "title": "Mentixy",
        "message": message,
        "icon": icon,
        "timestamp": datetime.utcnow().isoformat(),
    })
