"""Mentixy — Achievements & Badges API"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from auth import require_user

router = APIRouter()

# ─── Achievement Definitions ───
ACHIEVEMENTS = [
    # Consistency
    {"id": "streak_7", "title": "Week Warrior", "desc": "Maintain a 7-day streak", "icon": "🔥", "category": "consistency", "rarity": "common", "xp": 50, "condition": "streak >= 7"},
    {"id": "streak_30", "title": "Monthly Machine", "desc": "Maintain a 30-day streak", "icon": "⚡", "category": "consistency", "rarity": "rare", "xp": 200, "condition": "streak >= 30"},
    {"id": "streak_100", "title": "Centurion", "desc": "100-day streak! Legendary!", "icon": "💎", "category": "consistency", "rarity": "legendary", "xp": 1000, "condition": "streak >= 100"},
    {"id": "early_bird", "title": "Early Bird", "desc": "Complete a challenge before 8 AM", "icon": "🌅", "category": "consistency", "rarity": "uncommon", "xp": 30},
    # Coding
    {"id": "first_solve", "title": "First Blood", "desc": "Solve your first coding problem", "icon": "💻", "category": "coding", "rarity": "common", "xp": 20},
    {"id": "solve_10", "title": "Problem Crusher", "desc": "Solve 10 coding problems", "icon": "🔨", "category": "coding", "rarity": "common", "xp": 75},
    {"id": "solve_50", "title": "Code Machine", "desc": "Solve 50 coding problems", "icon": "⚙️", "category": "coding", "rarity": "rare", "xp": 300},
    {"id": "solve_hard", "title": "Hard Hitter", "desc": "Solve a Hard difficulty problem", "icon": "🎯", "category": "coding", "rarity": "uncommon", "xp": 100},
    {"id": "polyglot", "title": "Polyglot", "desc": "Solve in 3+ different languages", "icon": "🌍", "category": "coding", "rarity": "rare", "xp": 150},
    # Assessment
    {"id": "assessed", "title": "Self-Aware", "desc": "Complete the 4D Assessment", "icon": "🧬", "category": "assessment", "rarity": "common", "xp": 100},
    {"id": "shared_card", "title": "Career Sharer", "desc": "Share your assessment card", "icon": "📤", "category": "assessment", "rarity": "common", "xp": 30},
    # Aptitude
    {"id": "apt_first", "title": "Aptitude Ace", "desc": "Score 80%+ on an aptitude test", "icon": "🧠", "category": "aptitude", "rarity": "common", "xp": 50},
    {"id": "apt_perfect", "title": "Perfect Ten", "desc": "Score 100% on an aptitude test", "icon": "💯", "category": "aptitude", "rarity": "rare", "xp": 200},
    # Skills
    {"id": "skill_verified", "title": "Skill Verified", "desc": "Get your first skill verified", "icon": "✅", "category": "skills", "rarity": "common", "xp": 75},
    {"id": "skills_5", "title": "Multi-Skilled", "desc": "Verify 5 different skills", "icon": "🏅", "category": "skills", "rarity": "rare", "xp": 250},
    # Social
    {"id": "first_post", "title": "Community Voice", "desc": "Post in the community forum", "icon": "🗣️", "category": "social", "rarity": "common", "xp": 20},
    {"id": "helper", "title": "Peer Helper", "desc": "Help 10 peers with answers", "icon": "🤝", "category": "social", "rarity": "uncommon", "xp": 100},
    {"id": "refer_1", "title": "Ambassador", "desc": "Refer your first friend", "icon": "🎁", "category": "social", "rarity": "common", "xp": 50},
    {"id": "refer_5", "title": "Campus Influencer", "desc": "Refer 5 friends", "icon": "📣", "category": "social", "rarity": "rare", "xp": 300},
    # Mock Drive
    {"id": "mock_complete", "title": "Placement Ready", "desc": "Complete a full Mock Drive", "icon": "🏢", "category": "mock_drive", "rarity": "uncommon", "xp": 150},
    {"id": "mock_clear", "title": "Mock Cleared", "desc": "Clear all rounds with 70%+", "icon": "🎯", "category": "mock_drive", "rarity": "rare", "xp": 300},
    # Career
    {"id": "roadmap_start", "title": "Roadmap Runner", "desc": "Start following a career roadmap", "icon": "🗺️", "category": "career", "rarity": "common", "xp": 30},
    {"id": "score_50", "title": "Rising Star", "desc": "Achieve Mentixy Score™ of 50+", "icon": "⭐", "category": "career", "rarity": "common", "xp": 75},
    {"id": "score_75", "title": "Top Performer", "desc": "Achieve Mentixy Score™ of 75+", "icon": "🌟", "category": "career", "rarity": "rare", "xp": 250},
    {"id": "score_90", "title": "Elite", "desc": "Achieve Mentixy Score™ of 90+", "icon": "👑", "category": "career", "rarity": "legendary", "xp": 1000},
]


@router.get("")
def get_achievements(user=Depends(require_user), db: Session = Depends(get_db)):
    """Get all achievements with user's unlock status"""
    from models import UserProfile, UserProblemSubmission, AssessmentSession
    
    profile = db.query(UserProfile).filter(UserProfile.user_id == user.id).first()
    
    # Calculate user stats for achievement checking
    streak = profile.streak_days if profile else 0
    mentixy_score = profile.mentixy_score if profile else 0
    try:
        problems_solved = db.query(UserProblemSubmission).filter(
            UserProblemSubmission.user_id == user.id,
            UserProblemSubmission.status == "accepted"
        ).count()
    except Exception:
        problems_solved = 0
    try:
        has_assessment = db.query(AssessmentSession).filter(
            AssessmentSession.user_id == user.id,
            AssessmentSession.is_complete == True
        ).count() > 0
    except Exception:
        has_assessment = False

    results = []
    for ach in ACHIEVEMENTS:
        unlocked = False
        progress = 0
        max_progress = 1

        # Check unlock conditions
        if ach["id"] == "streak_7":
            unlocked = streak >= 7; progress = min(streak, 7); max_progress = 7
        elif ach["id"] == "streak_30":
            unlocked = streak >= 30; progress = min(streak, 30); max_progress = 30
        elif ach["id"] == "streak_100":
            unlocked = streak >= 100; progress = min(streak, 100); max_progress = 100
        elif ach["id"] == "first_solve":
            unlocked = problems_solved >= 1; progress = min(problems_solved, 1)
        elif ach["id"] == "solve_10":
            unlocked = problems_solved >= 10; progress = min(problems_solved, 10); max_progress = 10
        elif ach["id"] == "solve_50":
            unlocked = problems_solved >= 50; progress = min(problems_solved, 50); max_progress = 50
        elif ach["id"] == "assessed":
            unlocked = has_assessment; progress = 1 if has_assessment else 0
        elif ach["id"] == "score_50":
            unlocked = mentixy_score >= 50; progress = min(mentixy_score, 50); max_progress = 50
        elif ach["id"] == "score_75":
            unlocked = mentixy_score >= 75; progress = min(mentixy_score, 75); max_progress = 75
        elif ach["id"] == "score_90":
            unlocked = mentixy_score >= 90; progress = min(mentixy_score, 90); max_progress = 90

        results.append({
            **ach,
            "unlocked": unlocked,
            "progress": progress,
            "max_progress": max_progress,
        })

    total_xp = sum(a["xp"] for a in results if a["unlocked"])
    unlocked_count = sum(1 for a in results if a["unlocked"])

    return {
        "achievements": results,
        "total_xp": total_xp,
        "unlocked_count": unlocked_count,
        "total_count": len(ACHIEVEMENTS),
    }
