"""
SkillTen — Seed Data
Populates the database with production-quality Indian market data
"""
from datetime import datetime, timezone, timedelta


def seed_all(db):
    """Master seed function — call from main.py lifespan"""
    _seed_careers(db)
    _seed_skills(db)
    _seed_coding_problems(db)
    _seed_jobs(db)
    _seed_companies(db)
    _seed_challenges(db)
    _seed_colleges(db)
    _seed_market_insights(db)
    _seed_badges(db)
    _seed_questions(db)
    db.commit()


def _seed_careers(db):
    from models import Career
    if db.query(Career).count() > 0:
        return
    careers = [
        {"title": "Software Engineer", "slug": "software-engineer", "category": "Technology", "description": "Design, develop, and maintain software systems. One of the most in-demand roles in India with salaries ranging from ₹6-50+ LPA.", "salary_range_min": 600000, "salary_range_max": 5000000, "demand_score": 95, "growth_outlook": "Very High", "icon": "💻", "required_skills": ["DSA", "System Design", "Python/Java/C++", "Git", "SQL"], "top_companies": ["Google", "Microsoft", "Amazon", "Flipkart", "Razorpay"]},
        {"title": "Data Scientist", "slug": "data-scientist", "category": "Technology", "description": "Extract insights from data using ML, statistics, and domain expertise. India's fastest growing tech role.", "salary_range_min": 800000, "salary_range_max": 4500000, "demand_score": 90, "growth_outlook": "Very High", "icon": "📊", "required_skills": ["Python", "ML/DL", "Statistics", "SQL", "TensorFlow/PyTorch"], "top_companies": ["Google", "Amazon", "Flipkart", "Swiggy", "PhonePe"]},
        {"title": "Product Manager", "slug": "product-manager", "category": "Business", "description": "Own the product vision, roadmap, and execution. Bridge between business and technology.", "salary_range_min": 1200000, "salary_range_max": 5000000, "demand_score": 85, "growth_outlook": "High", "icon": "🎯", "required_skills": ["Product Strategy", "Analytics", "User Research", "SQL", "Communication"], "top_companies": ["Google", "Microsoft", "Razorpay", "CRED", "Meesho"]},
        {"title": "DevOps Engineer", "slug": "devops-engineer", "category": "Technology", "description": "Automate infrastructure, CI/CD, and cloud deployments. Critical for modern engineering teams.", "salary_range_min": 800000, "salary_range_max": 3500000, "demand_score": 88, "growth_outlook": "High", "icon": "⚙️", "required_skills": ["AWS/GCP", "Docker", "Kubernetes", "CI/CD", "Linux", "Terraform"], "top_companies": ["Amazon", "Microsoft", "Flipkart", "Ola", "Razorpay"]},
        {"title": "UX Designer", "slug": "ux-designer", "category": "Design", "description": "Create intuitive user experiences through research, wireframing, and prototyping.", "salary_range_min": 600000, "salary_range_max": 3000000, "demand_score": 75, "growth_outlook": "High", "icon": "🎨", "required_skills": ["Figma", "User Research", "Prototyping", "Design Systems", "Accessibility"], "top_companies": ["Google", "Microsoft", "Swiggy", "CRED", "Razorpay"]},
        {"title": "Cybersecurity Analyst", "slug": "cybersecurity-analyst", "category": "Technology", "description": "Protect organizations from cyber threats. India needs 1M+ cybersecurity professionals by 2025.", "salary_range_min": 600000, "salary_range_max": 3000000, "demand_score": 82, "growth_outlook": "Very High", "icon": "🔒", "required_skills": ["Network Security", "SIEM", "Penetration Testing", "Cloud Security", "Python"], "top_companies": ["Deloitte", "PwC", "TCS", "Wipro", "Palo Alto Networks"]},
    ]
    for c in careers:
        db.add(Career(**c))


def _seed_skills(db):
    from models import SkillsTaxonomy
    if db.query(SkillsTaxonomy).count() > 0:
        return
    skills = [
        {"slug": "python", "name": "Python", "category": "Programming", "is_trending": True, "trending_score": 95, "demand_level": "very_high", "avg_salary_premium_pct": 15, "learning_time_hours": 100},
        {"slug": "javascript", "name": "JavaScript", "category": "Programming", "is_trending": True, "trending_score": 90, "demand_level": "very_high", "avg_salary_premium_pct": 12, "learning_time_hours": 120},
        {"slug": "react", "name": "React.js", "category": "Frontend", "is_trending": True, "trending_score": 88, "demand_level": "high", "avg_salary_premium_pct": 18, "learning_time_hours": 80},
        {"slug": "machine-learning", "name": "Machine Learning", "category": "AI/ML", "is_trending": True, "trending_score": 92, "demand_level": "very_high", "avg_salary_premium_pct": 25, "learning_time_hours": 200},
        {"slug": "aws", "name": "AWS", "category": "Cloud", "is_trending": True, "trending_score": 85, "demand_level": "high", "avg_salary_premium_pct": 20, "learning_time_hours": 150},
        {"slug": "docker", "name": "Docker", "category": "DevOps", "is_trending": True, "trending_score": 80, "demand_level": "high", "avg_salary_premium_pct": 15, "learning_time_hours": 40},
        {"slug": "sql", "name": "SQL", "category": "Data", "is_trending": False, "trending_score": 70, "demand_level": "very_high", "avg_salary_premium_pct": 8, "learning_time_hours": 50},
        {"slug": "system-design", "name": "System Design", "category": "Architecture", "is_trending": True, "trending_score": 87, "demand_level": "high", "avg_salary_premium_pct": 30, "learning_time_hours": 100},
        {"slug": "dsa", "name": "Data Structures & Algorithms", "category": "CS Fundamentals", "is_trending": False, "trending_score": 75, "demand_level": "very_high", "avg_salary_premium_pct": 20, "learning_time_hours": 200},
        {"slug": "generative-ai", "name": "Generative AI", "category": "AI/ML", "is_trending": True, "trending_score": 98, "demand_level": "very_high", "avg_salary_premium_pct": 35, "learning_time_hours": 80},
    ]
    for s in skills:
        db.add(SkillsTaxonomy(**s))


def _seed_coding_problems(db):
    from models import CodingProblem
    if db.query(CodingProblem).count() > 0:
        return
    problems = [
        {"title": "Two Sum", "slug": "two-sum", "difficulty": "easy", "difficulty_numeric": 1, "category": "arrays", "company_tags": ["Google", "Amazon", "Microsoft"], "india_frequency": "very_high", "problem_statement": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.", "examples": [{"input": "nums = [2,7,11,15], target = 9", "output": "[0,1]"}], "time_complexity": "O(n)", "space_complexity": "O(n)", "estimated_minutes_fresher": 15},
        {"title": "Reverse Linked List", "slug": "reverse-linked-list", "difficulty": "easy", "difficulty_numeric": 1, "category": "linked_lists", "company_tags": ["Amazon", "Microsoft", "TCS"], "india_frequency": "very_high", "problem_statement": "Given the head of a singly linked list, reverse the list, and return the reversed list.", "time_complexity": "O(n)", "space_complexity": "O(1)", "estimated_minutes_fresher": 20},
        {"title": "Longest Substring Without Repeating Characters", "slug": "longest-substring-no-repeat", "difficulty": "medium", "difficulty_numeric": 3, "category": "strings", "company_tags": ["Amazon", "Google", "Flipkart"], "india_frequency": "high", "problem_statement": "Given a string s, find the length of the longest substring without repeating characters.", "time_complexity": "O(n)", "space_complexity": "O(min(m,n))", "estimated_minutes_fresher": 30},
        {"title": "LRU Cache", "slug": "lru-cache", "difficulty": "hard", "difficulty_numeric": 5, "category": "design", "company_tags": ["Google", "Microsoft", "Amazon", "Flipkart"], "india_frequency": "high", "problem_statement": "Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.", "time_complexity": "O(1)", "space_complexity": "O(capacity)", "estimated_minutes_fresher": 45},
    ]
    for p in problems:
        db.add(CodingProblem(**p))


def _seed_jobs(db):
    from models import JobListing
    if db.query(JobListing).count() > 0:
        return
    now = datetime.now(timezone.utc)
    jobs = [
        {"company_name": "Google", "role_title": "SDE-1", "role_type": "fulltime", "company_type": "MNC", "location": "Bangalore", "salary_min_lpa": 25, "salary_max_lpa": 40, "required_skills": ["DSA", "System Design", "Python/Java"], "interview_difficulty": 5, "is_verified": True, "description_honest": "Extremely competitive. Google India SDE-1 roles have ~0.5% acceptance rate. Interview is 5 rounds including 2 coding, 1 system design, 1 behavioral.", "interview_rounds": [{"round": "Online Assessment", "type": "coding"}, {"round": "Phone Screen", "type": "coding"}, {"round": "Onsite 1", "type": "coding"}, {"round": "Onsite 2", "type": "system_design"}, {"round": "Googleyness", "type": "behavioral"}]},
        {"company_name": "Razorpay", "role_title": "Backend Engineer", "role_type": "fulltime", "company_type": "startup", "location": "Bangalore", "salary_min_lpa": 18, "salary_max_lpa": 30, "funding_stage": "Series F", "required_skills": ["Go/Java", "Microservices", "PostgreSQL", "Redis"], "interview_difficulty": 4, "is_verified": True, "description_honest": "Fast-paced fintech. Great learning for backend engineers. Good WLB compared to other startups."},
        {"company_name": "TCS Digital", "role_title": "System Engineer", "role_type": "fulltime", "company_type": "MNC", "location": "Mumbai / Pune", "salary_min_lpa": 7, "salary_max_lpa": 11, "min_cgpa": 7.0, "required_skills": ["Java", "SQL", "Problem Solving"], "interview_difficulty": 2, "is_verified": True, "description_honest": "Mass recruiter. Stable job with decent WLB. Growth can be slow unless you move to TCS Digital."},
        {"company_name": "Flipkart", "role_title": "SDE Intern", "role_type": "internship", "company_type": "MNC", "location": "Bangalore", "stipend_monthly": 80000, "required_skills": ["DSA", "Java/Python", "DBMS"], "interview_difficulty": 4, "is_verified": True, "description_honest": "One of the best internships in India. High PPO rate (~70%). 6-month duration with real team projects."},
        {"company_name": "Zerodha", "role_title": "Frontend Developer", "role_type": "fulltime", "company_type": "startup", "location": "Bangalore (Remote-friendly)", "is_remote": True, "salary_min_lpa": 15, "salary_max_lpa": 25, "required_skills": ["React", "TypeScript", "CSS", "Performance"], "interview_difficulty": 3, "is_verified": True, "description_honest": "Profitable bootstrapped company. Small team, high ownership. No VC pressure. Best WLB among Indian startups."},
    ]
    for j in jobs:
        db.add(JobListing(**j))


def _seed_companies(db):
    from models import ViyaCompany
    if db.query(ViyaCompany).count() > 0:
        return
    companies = [
        {"name": "Google India", "slug": "google-india", "company_type": "MNC", "founded_year": 1998, "industry": "Technology", "headquarters_city": "Bangalore", "viya_overall_rating": 4.5, "work_hours_actual": "40-45 hrs/week", "wfh_policy": "Hybrid (3 days office)", "interview_difficulty": 5, "ppo_rate": 0.85, "salary_data": {"sde1": {"ctc": "₹25-40 LPA", "in_hand": "₹1.5-2.5L/month"}}, "pros": ["Best compensation", "World-class peers", "20% time"], "cons": ["Slow promotions", "Can feel bureaucratic", "High bar stressful"], "best_for": "Top-tier engineers wanting best compensation and brand", "verdict": "The gold standard. If you can get in, it's hard to say no."},
        {"name": "Razorpay", "slug": "razorpay", "company_type": "startup", "founded_year": 2014, "funding_stage": "Series F", "industry": "Fintech", "headquarters_city": "Bangalore", "viya_overall_rating": 4.2, "work_hours_actual": "45-50 hrs/week", "wfh_policy": "Hybrid", "interview_difficulty": 4, "pros": ["Great fintech exposure", "Strong engineering culture", "Good ESOPs"], "cons": ["Can be intense", "Rapidly changing priorities"], "best_for": "Engineers who want startup speed with unicorn stability"},
        {"name": "TCS", "slug": "tcs", "company_type": "MNC", "founded_year": 1968, "industry": "IT Services", "headquarters_city": "Mumbai", "viya_overall_rating": 3.2, "work_hours_actual": "40-45 hrs/week", "wfh_policy": "Office-first", "interview_difficulty": 2, "salary_data": {"se": {"ctc": "₹3.5-7 LPA", "in_hand": "₹25-45K/month"}, "digital": {"ctc": "₹7-11 LPA", "in_hand": "₹50-75K/month"}}, "pros": ["Job security", "Visa sponsorship", "Large network"], "cons": ["Slow growth", "Below-market pay", "Bureaucratic"], "best_for": "Freshers wanting stability and international exposure"},
    ]
    for c in companies:
        db.add(ViyaCompany(**c))


def _seed_challenges(db):
    from models import Challenge
    if db.query(Challenge).count() > 0:
        return
    now = datetime.now(timezone.utc)
    challenges = [
        {"title": "Google Kickstart India 2026", "slug": "google-kickstart-2026", "challenge_type": "company", "sponsor_company": "Google", "difficulty": "hard", "description": "Google's flagship coding competition for students. Top performers get fast-track interviews.", "prizes": {"1st": "₹5L + Interview", "2nd": "₹3L + Interview", "3rd": "₹1L"}, "fast_track_offer": True, "start_at": now + timedelta(days=30), "end_at": now + timedelta(days=31), "registration_deadline": now + timedelta(days=25), "status": "upcoming"},
        {"title": "Flipkart GRiD 7.0", "slug": "flipkart-grid-7", "challenge_type": "hackathon", "sponsor_company": "Flipkart", "difficulty": "medium", "description": "Flipkart's annual engineering challenge. Build solutions for real e-commerce problems.", "prizes": {"1st": "₹3L + PPO", "2nd": "₹2L", "3rd": "₹1L"}, "fast_track_offer": True, "is_team_challenge": True, "team_size_min": 2, "team_size_max": 4, "start_at": now + timedelta(days=15), "status": "upcoming"},
    ]
    for c in challenges:
        db.add(Challenge(**c))


def _seed_colleges(db):
    from models import College
    if db.query(College).count() > 0:
        return
    colleges = [
        {"name": "Indian Institute of Technology Bombay", "slug": "iit-bombay", "short_name": "IIT-B", "tier": 1, "city": "Mumbai", "state": "Maharashtra", "college_type": "IIT", "nirf_rank": 3, "avg_ctc_reported": 21.0, "placement_rate_reported": 0.95},
        {"name": "Indian Institute of Technology Delhi", "slug": "iit-delhi", "short_name": "IIT-D", "tier": 1, "city": "New Delhi", "state": "Delhi", "college_type": "IIT", "nirf_rank": 2, "avg_ctc_reported": 20.0, "placement_rate_reported": 0.93},
        {"name": "Vellore Institute of Technology", "slug": "vit-vellore", "short_name": "VIT", "tier": 2, "city": "Vellore", "state": "Tamil Nadu", "college_type": "Private", "nirf_rank": 12, "avg_ctc_reported": 8.5, "placement_rate_reported": 0.85},
        {"name": "SRM Institute of Science and Technology", "slug": "srm-chennai", "short_name": "SRM", "tier": 2, "city": "Chennai", "state": "Tamil Nadu", "college_type": "Private", "nirf_rank": 19, "avg_ctc_reported": 7.0, "placement_rate_reported": 0.80},
    ]
    for c in colleges:
        db.add(College(**c))


def _seed_market_insights(db):
    from models import MarketInsight
    if db.query(MarketInsight).count() > 0:
        return
    insights = [
        {"category": "salary_trends", "title": "India Tech Salary Report 2026", "data": {"avg_fresher_ctc": "₹6.5 LPA", "top_10_pct_ctc": "₹25+ LPA", "yoy_growth": "12%", "highest_paying_role": "ML Engineer", "highest_paying_city": "Bangalore"}, "source": "SkillTen Research"},
        {"category": "hiring_trends", "title": "Most In-Demand Skills Q1 2026", "data": {"top_skills": ["GenAI/LLM", "Python", "React", "AWS", "System Design"], "emerging": ["Rust", "Web3", "Edge AI"], "declining": ["Angular", "jQuery", "PHP"]}, "source": "SkillTen Analysis"},
    ]
    for i in insights:
        db.add(MarketInsight(**i))


def _seed_badges(db):
    from models import Badge
    if db.query(Badge).count() > 0:
        return
    badges = [
        {"slug": "first-problem", "name": "First Blood", "description": "Solved your first coding problem", "category": "coding", "rarity": "common", "points_value": 10},
        {"slug": "streak-7", "name": "Week Warrior", "description": "7-day activity streak", "category": "streak", "rarity": "uncommon", "points_value": 50},
        {"slug": "streak-30", "name": "Monthly Machine", "description": "30-day activity streak", "category": "streak", "rarity": "rare", "points_value": 200},
        {"slug": "assessment-complete", "name": "Self-Aware", "description": "Completed the 4D Career Assessment", "category": "assessment", "rarity": "common", "points_value": 25},
        {"slug": "100-problems", "name": "Century Club", "description": "Solved 100 coding problems", "category": "coding", "rarity": "epic", "points_value": 500},
    ]
    for b in badges:
        db.add(Badge(**b))


def _seed_questions(db):
    from models import Question
    if db.query(Question).count() > 0:
        return
    questions = [
        {"question_type": "preference", "category": "analytical", "question_text": "When faced with a complex problem, what's your first instinct?", "options": [{"key": "A", "text": "Break it down into smaller parts and analyze each", "dimension": "analytical"}, {"key": "B", "text": "Discuss it with others to get different perspectives", "dimension": "interpersonal"}, {"key": "C", "text": "Think of creative, unconventional solutions", "dimension": "creative"}, {"key": "D", "text": "Create a step-by-step plan to solve it systematically", "dimension": "systematic"}], "is_assessment_question": True},
        {"question_type": "preference", "category": "interpersonal", "question_text": "In a team project, what role do you naturally gravitate towards?", "options": [{"key": "A", "text": "The one analyzing data and finding patterns", "dimension": "analytical"}, {"key": "B", "text": "The one coordinating and motivating the team", "dimension": "interpersonal"}, {"key": "C", "text": "The one generating ideas and designing solutions", "dimension": "creative"}, {"key": "D", "text": "The one organizing tasks and tracking progress", "dimension": "systematic"}], "is_assessment_question": True},
        {"question_type": "preference", "category": "creative", "question_text": "What type of content do you enjoy consuming most?", "options": [{"key": "A", "text": "Technical papers and research articles", "dimension": "analytical"}, {"key": "B", "text": "Podcasts and discussions with experts", "dimension": "interpersonal"}, {"key": "C", "text": "Design showcases and creative portfolios", "dimension": "creative"}, {"key": "D", "text": "How-to guides and documentation", "dimension": "systematic"}], "is_assessment_question": True},
        {"question_type": "preference", "category": "systematic", "question_text": "How do you prefer to learn a new technology?", "options": [{"key": "A", "text": "Read the docs, understand the internals", "dimension": "analytical"}, {"key": "B", "text": "Join a study group or find a mentor", "dimension": "interpersonal"}, {"key": "C", "text": "Start building something immediately", "dimension": "creative"}, {"key": "D", "text": "Follow a structured course or tutorial", "dimension": "systematic"}], "is_assessment_question": True},
    ]
    for q in questions:
        db.add(Question(**q))
