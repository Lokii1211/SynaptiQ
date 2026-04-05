"""
Mentixy — Seed Community Posts
Creates realistic Indian student community discussions
"""
from datetime import datetime, timezone, timedelta
from models import CommunityPost, User


def seed_community_posts(db):
    """Seed community posts using the first user in DB as author."""
    if db.query(CommunityPost).count() > 0:
        return 0

    # Find the first user to use as author
    user = db.query(User).first()
    if not user:
        print("  [WARN] No users found — skipping community seed")
        return 0

    author_id = user.id
    now = datetime.now(timezone.utc)

    posts = [
        {
            "author_id": author_id,
            "post_type": "placements",
            "title": "Got placed at Razorpay! Here's my complete interview experience",
            "content": "After 6 months of prep on Mentixy, finally cracked Razorpay SDE-1! 🎉\n\nRounds:\n1. Online Assessment (2 medium DSA + 1 SQL)\n2. Technical Round 1 — System Design (Design a payment gateway)\n3. Technical Round 2 — Deep coding (LRU Cache + Rate Limiter)\n4. HR Round\n\nTips:\n- Focus on Go/Java internals\n- System Design is heavily weighted\n- They love candidates who understand distributed systems\n\nAMA in comments!",
            "tags": ["placement", "razorpay", "sde-1", "interview-experience"],
            "likes_count": 47,
            "comments_count": 12,
            "views_count": 890,
            "created_at": now - timedelta(hours=6),
        },
        {
            "author_id": author_id,
            "post_type": "resources",
            "title": "FREE resources that actually helped me crack product companies",
            "content": "After trying 50+ paid courses, here are the FREE ones that actually worked:\n\n📚 DSA:\n- Striver's A2Z DSA Sheet (450 problems, structured)\n- NeetCode 150 (pattern-based, best for interviews)\n\n🎨 System Design:\n- Gaurav Sen's YouTube (best explanations)\n- System Design Primer GitHub repo\n\n💻 Projects:\n- Build a URL Shortener (covers 80% of SD concepts)\n- Build a real-time chat app\n\n🧠 Aptitude:\n- Mentixy's built-in practice (TCS/Infosys pattern)\n- IndiaBix for verbal\n\nDon't waste money on paid courses until you exhaust these!",
            "tags": ["resources", "free", "dsa", "system-design", "tips"],
            "likes_count": 128,
            "comments_count": 34,
            "views_count": 2340,
            "is_pinned": True,
            "created_at": now - timedelta(days=1),
        },
        {
            "author_id": author_id,
            "post_type": "questions",
            "title": "TCS Digital vs Infosys PP — Which one should I choose?",
            "content": "Got offers from both:\n- TCS Digital: ₹9 LPA, Mumbai\n- Infosys PP: ₹9.5 LPA, Pune\n\nI'm from Tier-2 college, CSE branch, 8.2 CGPA.\n\nWhich has better growth? WLB? Tech exposure?\n\nPlease share if you have experience in either!",
            "tags": ["career-advice", "tcs", "infosys", "offer-comparison"],
            "likes_count": 23,
            "comments_count": 45,
            "views_count": 560,
            "created_at": now - timedelta(hours=12),
        },
        {
            "author_id": author_id,
            "post_type": "success-stories",
            "title": "From mass recruiter reject to Google L3 in 18 months 🚀",
            "content": "Timeline:\n- March 2025: Rejected from TCS NQT (couldn't solve a single coding Q)\n- April 2025: Started grinding DSA on Mentixy\n- July 2025: Solved 200 problems, got internship at startup\n- December 2025: 500 problems, started targeting product companies\n- March 2026: Cleared Google's interview!\n\nKey insight: It's not about talent. It's about consistency. I solved at least 2 problems every single day for 18 months.\n\nMy Mentixy Score went from 120 to 847 in this period.\n\nIf I can do it, anyone can. Keep going! 💪",
            "tags": ["success-story", "google", "motivation", "dsa"],
            "likes_count": 312,
            "comments_count": 67,
            "views_count": 5670,
            "created_at": now - timedelta(days=3),
        },
        {
            "author_id": author_id,
            "post_type": "interview-prep",
            "title": "Amazon SDE-1 2026 off-campus process — Live update thread",
            "content": "Amazon just opened SDE-1 applications for 2026 batch!\n\nLink: [career page]\n\nEligibility:\n- 2024/2025/2026 graduates\n- No CGPA cutoff mentioned\n- DSA + System Design focused\n\nI'll update this thread as I go through the process. Like to follow!\n\nUpdate 1: Applied today, got OA link within 2 hours\nUpdate 2: OA was 2 coding questions (1 medium graph, 1 hard DP) + work style assessment",
            "tags": ["amazon", "off-campus", "sde-1", "live-update"],
            "likes_count": 89,
            "comments_count": 156,
            "views_count": 3210,
            "created_at": now - timedelta(hours=3),
        },
        {
            "author_id": author_id,
            "post_type": "college-life",
            "title": "How are you all managing placement prep + academics?",
            "content": "7th sem is killing me. We have:\n- 6 subjects with labs\n- Mini project submission\n- Placement prep\n- Internship (part-time)\n\nI'm sleeping 4 hours/day and still behind on everything. How are you guys managing?\n\nDo companies even care about CGPA above 7?\n\nNeed some practical time management tips 🙏",
            "tags": ["college-life", "time-management", "placement-prep", "help"],
            "likes_count": 67,
            "comments_count": 89,
            "views_count": 1230,
            "created_at": now - timedelta(days=2),
        },
    ]

    for p in posts:
        db.add(CommunityPost(**p))
    db.commit()
    return len(posts)
