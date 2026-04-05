"""Mentixy — Seed Internship Listings"""
from datetime import datetime, timezone, timedelta


def seed_internships(db):
    from models import JobListing
    # Only seed if we have < 3 internships
    existing = db.query(JobListing).filter(JobListing.role_type == "internship").count()
    if existing >= 3:
        return 0

    now = datetime.now(timezone.utc)
    internships = [
        {
            "company_name": "Microsoft",
            "role_title": "Software Engineering Intern",
            "role_type": "internship",
            "company_type": "MNC",
            "location": "Hyderabad",
            "stipend_monthly": 85000,
            "required_skills": ["C++", "DSA", "System Design", "OOP"],
            "interview_difficulty": 4,
            "is_verified": True,
            "is_active": True,
            "description_honest": "6-month internship with real product team exposure. High PPO rate (~80%). Work on Azure, Office, or Teams.",
            "posted_at": now - timedelta(days=2),
        },
        {
            "company_name": "Amazon",
            "role_title": "SDE Intern",
            "role_type": "internship",
            "company_type": "MNC",
            "location": "Bangalore",
            "stipend_monthly": 90000,
            "required_skills": ["DSA", "Java/Python", "Problem Solving", "OS"],
            "interview_difficulty": 4,
            "is_verified": True,
            "is_active": True,
            "description_honest": "2-month internship. Very structured with a mentor. Focus on real customer-facing projects. PPO based on project impact.",
            "posted_at": now - timedelta(days=1),
        },
        {
            "company_name": "Razorpay",
            "role_title": "Backend Engineering Intern",
            "role_type": "internship",
            "company_type": "startup",
            "location": "Bangalore",
            "is_remote": False,
            "stipend_monthly": 60000,
            "required_skills": ["Go/Python", "REST APIs", "SQL", "Git"],
            "interview_difficulty": 3,
            "is_verified": True,
            "is_active": True,
            "description_honest": "3-month internship in payments team. Fast-paced fintech environment. Good conversion rate to full-time.",
            "funding_stage": "Series F",
            "posted_at": now - timedelta(days=3),
        },
        {
            "company_name": "Google",
            "role_title": "STEP Intern",
            "role_type": "internship",
            "company_type": "MNC",
            "location": "Bangalore",
            "stipend_monthly": 120000,
            "required_skills": ["DSA", "Python/C++", "Algorithms", "OOP"],
            "interview_difficulty": 5,
            "is_verified": True,
            "is_active": True,
            "description_honest": "Google's Student Training in Engineering Program. Extremely selective (<1% acceptance). Best internship in India.",
            "posted_at": now - timedelta(days=5),
        },
        {
            "company_name": "CRED",
            "role_title": "Frontend Intern",
            "role_type": "internship",
            "company_type": "startup",
            "location": "Bangalore (Remote-friendly)",
            "is_remote": True,
            "stipend_monthly": 50000,
            "required_skills": ["React", "TypeScript", "CSS", "Figma"],
            "interview_difficulty": 3,
            "is_verified": True,
            "is_active": True,
            "description_honest": "Work on India's most beautiful fintech app. Great for design-conscious frontend devs. 3-month duration.",
            "funding_stage": "Series D",
            "posted_at": now - timedelta(days=4),
        },
        {
            "company_name": "Swiggy",
            "role_title": "Data Science Intern",
            "role_type": "internship",
            "company_type": "startup",
            "location": "Bangalore",
            "stipend_monthly": 55000,
            "required_skills": ["Python", "ML", "SQL", "Statistics"],
            "interview_difficulty": 3,
            "is_verified": True,
            "is_active": True,
            "description_honest": "Work on recommendation and logistics optimization. Real-world data at scale. 3-6 month duration.",
            "posted_at": now - timedelta(days=6),
        },
    ]

    count = 0
    for intern in internships:
        db.add(JobListing(**intern))
        count += 1
    return count
