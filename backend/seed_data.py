"""
Mentixy — Seed Data
Populates the database with production-quality Indian market data
"""
from datetime import datetime, timezone, timedelta


def seed_all(db):
    """Master seed function — call from main.py lifespan"""
    _seed_careers(db)
    _seed_skills(db)
    # NOTE: coding problems are seeded by seed_problems.py (30 problems) — not the inline _seed_coding_problems
    _seed_jobs(db)
    _seed_companies(db)
    _seed_challenges(db)
    _seed_colleges(db)
    _seed_market_insights(db)
    _seed_badges(db)
    _seed_questions(db)
    # Enhanced seed: 30 real problems + 50 aptitude questions
    try:
        from seed_problems import seed_coding_problems
        count = seed_coding_problems(db)
        if count:
            print(f"  [OK] Seeded {count} coding problems (GFG/LeetCode/HackerRank)")
    except Exception as e:
        print(f"  [WARN] Coding problems seed: {e}")
    try:
        from seed_aptitude import seed_aptitude_questions
        count = seed_aptitude_questions(db)
        if count:
            print(f"  [OK] Seeded {count} aptitude questions (TCS/Infosys/Wipro)")
    except Exception as e:
        print(f"  [WARN] Aptitude seed: {e}")
    try:
        from seed_community import seed_community_posts
        count = seed_community_posts(db)
        if count:
            print(f"  [OK] Seeded {count} community posts")
    except Exception as e:
        print(f"  [WARN] Community posts seed: {e}")
    try:
        from seed_internships import seed_internships
        count = seed_internships(db)
        if count:
            print(f"  [OK] Seeded {count} internship listings")
    except Exception as e:
        print(f"  [WARN] Internships seed: {e}")
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
        {"category": "salary_trends", "title": "India Tech Salary Report 2026", "data": {"avg_fresher_ctc": "₹6.5 LPA", "top_10_pct_ctc": "₹25+ LPA", "yoy_growth": "12%", "highest_paying_role": "ML Engineer", "highest_paying_city": "Bangalore"}, "source": "Mentixy Research"},
        {"category": "hiring_trends", "title": "Most In-Demand Skills Q1 2026", "data": {"top_skills": ["GenAI/LLM", "Python", "React", "AWS", "System Design"], "emerging": ["Rust", "Web3", "Edge AI"], "declining": ["Angular", "jQuery", "PHP"]}, "source": "Mentixy Analysis"},
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

    # ─── 4D Assessment Questions (Bible: 45 scenario-based, 4 dimensions) ───
    assessment_questions = [
        {"question_type": "preference", "category": "analytical", "question_text": "When faced with a complex problem, what's your first instinct?", "options": [{"key": "A", "text": "Break it down into smaller parts and analyze each", "dimension": "analytical"}, {"key": "B", "text": "Discuss it with others to get different perspectives", "dimension": "interpersonal"}, {"key": "C", "text": "Think of creative, unconventional solutions", "dimension": "creative"}, {"key": "D", "text": "Create a step-by-step plan to solve it systematically", "dimension": "systematic"}], "is_assessment_question": True},
        {"question_type": "preference", "category": "interpersonal", "question_text": "In a team project, what role do you naturally gravitate towards?", "options": [{"key": "A", "text": "The one analyzing data and finding patterns", "dimension": "analytical"}, {"key": "B", "text": "The one coordinating and motivating the team", "dimension": "interpersonal"}, {"key": "C", "text": "The one generating ideas and designing solutions", "dimension": "creative"}, {"key": "D", "text": "The one organizing tasks and tracking progress", "dimension": "systematic"}], "is_assessment_question": True},
        {"question_type": "preference", "category": "creative", "question_text": "What type of content do you enjoy consuming most?", "options": [{"key": "A", "text": "Technical papers and research articles", "dimension": "analytical"}, {"key": "B", "text": "Podcasts and discussions with experts", "dimension": "interpersonal"}, {"key": "C", "text": "Design showcases and creative portfolios", "dimension": "creative"}, {"key": "D", "text": "How-to guides and documentation", "dimension": "systematic"}], "is_assessment_question": True},
        {"question_type": "preference", "category": "systematic", "question_text": "How do you prefer to learn a new technology?", "options": [{"key": "A", "text": "Read the docs, understand the internals", "dimension": "analytical"}, {"key": "B", "text": "Join a study group or find a mentor", "dimension": "interpersonal"}, {"key": "C", "text": "Start building something immediately", "dimension": "creative"}, {"key": "D", "text": "Follow a structured course or tutorial", "dimension": "systematic"}], "is_assessment_question": True},
        {"question_type": "preference", "category": "analytical", "question_text": "Your company launches a product that gets mixed reviews. What do you do first?", "options": [{"key": "A", "text": "Analyze the negative reviews for patterns and root causes", "dimension": "analytical"}, {"key": "B", "text": "Talk to users directly to understand their experience", "dimension": "interpersonal"}, {"key": "C", "text": "Brainstorm radical improvements that could flip perception", "dimension": "creative"}, {"key": "D", "text": "Create an action plan with deadlines for fixing top issues", "dimension": "systematic"}], "is_assessment_question": True},
        {"question_type": "preference", "category": "interpersonal", "question_text": "A teammate is struggling with their work and falling behind. How do you respond?", "options": [{"key": "A", "text": "Identify the specific technical blockers they're facing", "dimension": "analytical"}, {"key": "B", "text": "Have an open conversation to understand what's going on", "dimension": "interpersonal"}, {"key": "C", "text": "Suggest a different approach that might make their task easier", "dimension": "creative"}, {"key": "D", "text": "Help them break their work into smaller, manageable tasks", "dimension": "systematic"}], "is_assessment_question": True},
        {"question_type": "preference", "category": "creative", "question_text": "You need to present a technical concept to non-technical stakeholders. How do you prepare?", "options": [{"key": "A", "text": "Prepare data and metrics that prove the concept works", "dimension": "analytical"}, {"key": "B", "text": "Tell a story that connects the concept to their daily experience", "dimension": "interpersonal"}, {"key": "C", "text": "Create a visual demo or interactive prototype", "dimension": "creative"}, {"key": "D", "text": "Create a structured slide deck with clear flow", "dimension": "systematic"}], "is_assessment_question": True},
        {"question_type": "preference", "category": "systematic", "question_text": "You discover a critical bug in production at 11 PM. What's your first action?", "options": [{"key": "A", "text": "Analyze logs and trace the root cause before anything else", "dimension": "analytical"}, {"key": "B", "text": "Immediately communicate the issue to the team and stakeholders", "dimension": "interpersonal"}, {"key": "C", "text": "Think of a creative hotfix or workaround", "dimension": "creative"}, {"key": "D", "text": "Follow the incident response protocol step by step", "dimension": "systematic"}], "is_assessment_question": True},
        {"question_type": "preference", "category": "analytical", "question_text": "What motivates you most in your work?", "options": [{"key": "A", "text": "Solving difficult puzzles and intellectual challenges", "dimension": "analytical"}, {"key": "B", "text": "Making a positive impact on people's lives", "dimension": "interpersonal"}, {"key": "C", "text": "Creating something new that hasn't existed before", "dimension": "creative"}, {"key": "D", "text": "Building reliable systems that work perfectly", "dimension": "systematic"}], "is_assessment_question": True},
        {"question_type": "preference", "category": "interpersonal", "question_text": "If you could choose any weekend activity, which appeals most?", "options": [{"key": "A", "text": "Reading a complex book or taking an online course", "dimension": "analytical"}, {"key": "B", "text": "Organizing a community event or mentoring juniors", "dimension": "interpersonal"}, {"key": "C", "text": "Working on a personal creative project or side hustle", "dimension": "creative"}, {"key": "D", "text": "Organizing your workspace and planning the upcoming week", "dimension": "systematic"}], "is_assessment_question": True},
        {"question_type": "preference", "category": "creative", "question_text": "Your manager asks you to improve a slow feature. What approach excites you?", "options": [{"key": "A", "text": "Profile the code, find bottlenecks, optimize algorithmically", "dimension": "analytical"}, {"key": "B", "text": "Talk to users about which parts feel slow to prioritize", "dimension": "interpersonal"}, {"key": "C", "text": "Redesign the entire feature with a fundamentally different approach", "dimension": "creative"}, {"key": "D", "text": "Set up benchmarks, create a methodical optimization plan", "dimension": "systematic"}], "is_assessment_question": True},
        {"question_type": "preference", "category": "systematic", "question_text": "You're starting a new project from scratch. What do you do first?", "options": [{"key": "A", "text": "Research existing solutions and academic papers", "dimension": "analytical"}, {"key": "B", "text": "Interview potential users to understand their needs", "dimension": "interpersonal"}, {"key": "C", "text": "Sketch ideas and build a rough prototype immediately", "dimension": "creative"}, {"key": "D", "text": "Define requirements, architecture, and a project timeline", "dimension": "systematic"}], "is_assessment_question": True},
        {"question_type": "preference", "category": "analytical", "question_text": "When making a career decision, what factor matters most?", "options": [{"key": "A", "text": "The intellectual depth and learning opportunities", "dimension": "analytical"}, {"key": "B", "text": "The team culture and people you'll work with", "dimension": "interpersonal"}, {"key": "C", "text": "The freedom to innovate and build new things", "dimension": "creative"}, {"key": "D", "text": "The stability, clear growth path, and structured environment", "dimension": "systematic"}], "is_assessment_question": True},
        {"question_type": "preference", "category": "interpersonal", "question_text": "How do you handle disagreements in code reviews?", "options": [{"key": "A", "text": "Present data and evidence for why your approach is better", "dimension": "analytical"}, {"key": "B", "text": "Have a face-to-face discussion to understand their perspective", "dimension": "interpersonal"}, {"key": "C", "text": "Propose a third alternative that combines both approaches", "dimension": "creative"}, {"key": "D", "text": "Refer to the team's coding standards and established patterns", "dimension": "systematic"}], "is_assessment_question": True},
        {"question_type": "preference", "category": "creative", "question_text": "Your hackathon team has 24 hours to build something. What's your dream project?", "options": [{"key": "A", "text": "An AI that solves a specific, measurable problem", "dimension": "analytical"}, {"key": "B", "text": "A platform that connects people who need help with those who can give it", "dimension": "interpersonal"}, {"key": "C", "text": "An experimental art/tech project that makes people say 'wow'", "dimension": "creative"}, {"key": "D", "text": "A well-engineered tool that automates a tedious process", "dimension": "systematic"}], "is_assessment_question": True},
        {"question_type": "preference", "category": "systematic", "question_text": "You've been given freedom to choose any project at work. What do you pick?", "options": [{"key": "A", "text": "Researching new algorithms that could improve performance 10x", "dimension": "analytical"}, {"key": "B", "text": "Building a mentorship program for new engineers", "dimension": "interpersonal"}, {"key": "C", "text": "Prototyping an innovative feature no competitor has", "dimension": "creative"}, {"key": "D", "text": "Improving CI/CD, monitoring, and incident response processes", "dimension": "systematic"}], "is_assessment_question": True},
        {"question_type": "preference", "category": "analytical", "question_text": "What does your ideal workspace look like?", "options": [{"key": "A", "text": "Quiet, with access to whiteboards and reference materials", "dimension": "analytical"}, {"key": "B", "text": "Open, collaborative, with lots of team interaction", "dimension": "interpersonal"}, {"key": "C", "text": "Flexible, with room for inspiration and experimentation", "dimension": "creative"}, {"key": "D", "text": "Organized, with proper tools and minimal distractions", "dimension": "systematic"}], "is_assessment_question": True},
        {"question_type": "preference", "category": "interpersonal", "question_text": "How do you celebrate a project success?", "options": [{"key": "A", "text": "Analyze what worked well and document findings", "dimension": "analytical"}, {"key": "B", "text": "Organize a team dinner or celebration", "dimension": "interpersonal"}, {"key": "C", "text": "Start thinking about what to build next", "dimension": "creative"}, {"key": "D", "text": "Write a retrospective and update processes based on learnings", "dimension": "systematic"}], "is_assessment_question": True},
        {"question_type": "preference", "category": "creative", "question_text": "If you could have any superpower at work, what would it be?", "options": [{"key": "A", "text": "Instantly understand any complex system or codebase", "dimension": "analytical"}, {"key": "B", "text": "Read people's minds to understand their real needs", "dimension": "interpersonal"}, {"key": "C", "text": "Turn any idea into a working prototype instantly", "dimension": "creative"}, {"key": "D", "text": "Automate any repetitive task with a snap", "dimension": "systematic"}], "is_assessment_question": True},
        {"question_type": "preference", "category": "systematic", "question_text": "When learning about a new company before an interview, what do you research first?", "options": [{"key": "A", "text": "Their tech stack, system architecture, and engineering blog", "dimension": "analytical"}, {"key": "B", "text": "Their culture, team reviews on Glassdoor, and leadership", "dimension": "interpersonal"}, {"key": "C", "text": "Their products, innovations, and what they're building next", "dimension": "creative"}, {"key": "D", "text": "Their revenue, growth metrics, and organizational structure", "dimension": "systematic"}], "is_assessment_question": True},
    ]

    # ─── Aptitude Questions (Bible: Quant, Logical, Verbal, DI) ───
    aptitude_questions = [
        # Quantitative
        {"question_type": "mcq", "category": "quant", "difficulty": "easy", "question_text": "A train travels 360 km in 4 hours. What is its speed in km/h?", "options": [{"key": "A", "text": "80 km/h"}, {"key": "B", "text": "90 km/h"}, {"key": "C", "text": "100 km/h"}, {"key": "D", "text": "85 km/h"}], "correct_answer": "B", "explanation": "Speed = Distance/Time = 360/4 = 90 km/h. Shortcut: For quick division, 360 ÷ 4 = 36 × 10 ÷ 4 = 9 × 10 = 90.", "is_aptitude_question": True},
        {"question_type": "mcq", "category": "quant", "difficulty": "easy", "question_text": "If the cost price of an article is ₹800 and selling price is ₹960, what is the profit percentage?", "options": [{"key": "A", "text": "15%"}, {"key": "B", "text": "20%"}, {"key": "C", "text": "25%"}, {"key": "D", "text": "16%"}], "correct_answer": "B", "explanation": "Profit = 960-800 = ₹160. Profit% = (160/800)×100 = 20%. Shortcut: 160/800 = 1/5 = 20%.", "is_aptitude_question": True},
        {"question_type": "mcq", "category": "quant", "difficulty": "medium", "question_text": "A can do a piece of work in 10 days and B can do it in 15 days. In how many days will they finish working together?", "options": [{"key": "A", "text": "5 days"}, {"key": "B", "text": "6 days"}, {"key": "C", "text": "7 days"}, {"key": "D", "text": "8 days"}], "correct_answer": "B", "explanation": "A's rate = 1/10, B's rate = 1/15. Combined = 1/10 + 1/15 = 3/30 + 2/30 = 5/30 = 1/6. So 6 days.", "is_aptitude_question": True},
        {"question_type": "mcq", "category": "quant", "difficulty": "medium", "question_text": "The compound interest on ₹10,000 at 10% per annum for 2 years is:", "options": [{"key": "A", "text": "₹2,000"}, {"key": "B", "text": "₹2,100"}, {"key": "C", "text": "₹2,050"}, {"key": "D", "text": "₹2,200"}], "correct_answer": "B", "explanation": "CI = P(1+r/100)^n - P = 10000(1.1)^2 - 10000 = 12100 - 10000 = ₹2100.", "is_aptitude_question": True},
        {"question_type": "mcq", "category": "quant", "difficulty": "hard", "question_text": "A mixture contains milk and water in 7:3 ratio. If 15 litres of water is added, the ratio becomes 7:6. Find the quantity of milk.", "options": [{"key": "A", "text": "28 litres"}, {"key": "B", "text": "35 litres"}, {"key": "C", "text": "42 litres"}, {"key": "D", "text": "49 litres"}], "correct_answer": "B", "explanation": "Let milk = 7x, water = 3x. After adding 15L water: 7x/(3x+15) = 7/6. Cross multiply: 42x = 21x + 105 → x = 5. Milk = 35L.", "is_aptitude_question": True},
        # Logical Reasoning
        {"question_type": "mcq", "category": "logical", "difficulty": "easy", "question_text": "Complete the series: 2, 6, 12, 20, 30, ?", "options": [{"key": "A", "text": "38"}, {"key": "B", "text": "40"}, {"key": "C", "text": "42"}, {"key": "D", "text": "44"}], "correct_answer": "C", "explanation": "Pattern: differences are 4,6,8,10,12. So 30+12 = 42. Formula: n(n+1) → 1×2, 2×3, 3×4, 4×5, 5×6, 6×7=42.", "is_aptitude_question": True},
        {"question_type": "mcq", "category": "logical", "difficulty": "easy", "question_text": "If APPLE is coded as ELPPA, how is GRAPE coded?", "options": [{"key": "A", "text": "EPARG"}, {"key": "B", "text": "EPARC"}, {"key": "C", "text": "REPAG"}, {"key": "D", "text": "EPRAG"}], "correct_answer": "A", "explanation": "The coding reverses the word. GRAPE reversed = EPARG.", "is_aptitude_question": True},
        {"question_type": "mcq", "category": "logical", "difficulty": "medium", "question_text": "All roses are flowers. Some flowers are red. Which conclusion is valid?", "options": [{"key": "A", "text": "All roses are red"}, {"key": "B", "text": "Some roses are red"}, {"key": "C", "text": "Some flowers are roses"}, {"key": "D", "text": "No roses are red"}], "correct_answer": "C", "explanation": "Since all roses are flowers, we can conclude some flowers are roses. We cannot conclude anything about roses being red.", "is_aptitude_question": True},
        {"question_type": "mcq", "category": "logical", "difficulty": "medium", "question_text": "A is the father of B. C is the daughter of A. D is the brother of C. What is D to B?", "options": [{"key": "A", "text": "Uncle"}, {"key": "B", "text": "Brother"}, {"key": "C", "text": "Cousin"}, {"key": "D", "text": "Father"}], "correct_answer": "B", "explanation": "A is father of B and C. D is brother of C, so D is also A's son. Therefore D is B's brother.", "is_aptitude_question": True},
        {"question_type": "mcq", "category": "logical", "difficulty": "hard", "question_text": "In a certain code, 'COMPUTER' is written as 'RFUVQNPC'. How is 'LANGUAGE' written?", "options": [{"key": "A", "text": "FHBVHOBM"}, {"key": "B", "text": "HBVHOBMF"}, {"key": "C", "text": "FBHVHOBM"}, {"key": "D", "text": "BHFVHOBM"}], "correct_answer": "A", "explanation": "Each letter's position shifts by pattern: C→R(+15), O→F(+13)... The word is reversed and each letter shifted by +1.", "is_aptitude_question": True},
        # Verbal Ability
        {"question_type": "mcq", "category": "verbal", "difficulty": "easy", "question_text": "Choose the correct synonym of 'ARDUOUS':", "options": [{"key": "A", "text": "Simple"}, {"key": "B", "text": "Difficult"}, {"key": "C", "text": "Slow"}, {"key": "D", "text": "Quick"}], "correct_answer": "B", "explanation": "Arduous means requiring great effort; difficult. Rule: 'Ard-' root relates to hard/difficult.", "is_aptitude_question": True},
        {"question_type": "mcq", "category": "verbal", "difficulty": "easy", "question_text": "Select the grammatically correct sentence:", "options": [{"key": "A", "text": "Each of the boys have done their work"}, {"key": "B", "text": "Each of the boys has done his work"}, {"key": "C", "text": "Each of the boys have done his work"}, {"key": "D", "text": "Each of the boys has done their work"}], "correct_answer": "B", "explanation": "'Each' is singular, so takes 'has' (singular verb) and 'his' (singular pronoun).", "is_aptitude_question": True},
        {"question_type": "mcq", "category": "verbal", "difficulty": "medium", "question_text": "Choose the antonym of 'BENEVOLENT':", "options": [{"key": "A", "text": "Kind"}, {"key": "B", "text": "Generous"}, {"key": "C", "text": "Malevolent"}, {"key": "D", "text": "Charitable"}], "correct_answer": "C", "explanation": "Benevolent = well-wishing (bene = good). Malevolent = ill-wishing (mal = bad). They are direct antonyms.", "is_aptitude_question": True},
        {"question_type": "mcq", "category": "verbal", "difficulty": "medium", "question_text": "The idiom 'to burn the midnight oil' means:", "options": [{"key": "A", "text": "To waste resources"}, {"key": "B", "text": "To work or study late into the night"}, {"key": "C", "text": "To cook late at night"}, {"key": "D", "text": "To leave a light on"}], "correct_answer": "B", "explanation": "This idiom originates from the era before electricity when people used oil lamps to study/work late at night.", "is_aptitude_question": True},
        {"question_type": "mcq", "category": "verbal", "difficulty": "hard", "question_text": "Choose the correctly punctuated sentence:", "options": [{"key": "A", "text": "Its a beautiful day isnt it"}, {"key": "B", "text": "It's a beautiful day, isn't it?"}, {"key": "C", "text": "Its a beautiful day, isnt it?"}, {"key": "D", "text": "It's a beautiful day isnt it?"}], "correct_answer": "B", "explanation": "It's (contraction of 'it is'), comma before tag question, isn't (contraction of 'is not'), question mark at end.", "is_aptitude_question": True},
        # Data Interpretation
        {"question_type": "mcq", "category": "data_interpretation", "difficulty": "easy", "question_text": "A company's revenue was ₹50 crore in 2024 and ₹60 crore in 2025. What was the growth rate?", "options": [{"key": "A", "text": "15%"}, {"key": "B", "text": "20%"}, {"key": "C", "text": "25%"}, {"key": "D", "text": "10%"}], "correct_answer": "B", "explanation": "Growth = (60-50)/50 × 100 = 10/50 × 100 = 20%.", "is_aptitude_question": True},
        {"question_type": "mcq", "category": "data_interpretation", "difficulty": "medium", "question_text": "If a pie chart shows IT sector at 72° out of 360°, what percentage does IT represent?", "options": [{"key": "A", "text": "18%"}, {"key": "B", "text": "20%"}, {"key": "C", "text": "22%"}, {"key": "D", "text": "25%"}], "correct_answer": "B", "explanation": "Percentage = (72/360) × 100 = 20%. Shortcut: 72 = 360/5, so 1/5 = 20%.", "is_aptitude_question": True},
    ]

    # ─── Quiz Questions for Skill Verification (Bible: 15 per skill) ───
    quiz_questions = [
        {"question_type": "mcq", "category": "python", "difficulty": "easy", "question_text": "What is the output of: print(type([]))?", "options": [{"key": "A", "text": "<class 'list'>"}, {"key": "B", "text": "<class 'tuple'>"}, {"key": "C", "text": "<class 'dict'>"}, {"key": "D", "text": "<class 'set'>"}], "correct_answer": "A", "explanation": "[] creates an empty list in Python.", "is_quiz_question": True},
        {"question_type": "mcq", "category": "python", "difficulty": "easy", "question_text": "Which keyword is used to define a function in Python?", "options": [{"key": "A", "text": "func"}, {"key": "B", "text": "def"}, {"key": "C", "text": "function"}, {"key": "D", "text": "define"}], "correct_answer": "B", "explanation": "In Python, functions are defined using the 'def' keyword.", "is_quiz_question": True},
        {"question_type": "mcq", "category": "python", "difficulty": "medium", "question_text": "What does 'self' refer to in a Python class method?", "options": [{"key": "A", "text": "The class itself"}, {"key": "B", "text": "The instance of the class"}, {"key": "C", "text": "The parent class"}, {"key": "D", "text": "A global variable"}], "correct_answer": "B", "explanation": "'self' refers to the current instance of the class, allowing access to its attributes and methods.", "is_quiz_question": True},
        {"question_type": "mcq", "category": "python", "difficulty": "medium", "question_text": "What is a list comprehension in Python?", "options": [{"key": "A", "text": "A way to iterate over lists"}, {"key": "B", "text": "A concise way to create lists using a single line"}, {"key": "C", "text": "A method to sort lists"}, {"key": "D", "text": "A way to flatten nested lists"}], "correct_answer": "B", "explanation": "List comprehension provides a concise way to create lists: [x**2 for x in range(10)].", "is_quiz_question": True},
        {"question_type": "mcq", "category": "python", "difficulty": "hard", "question_text": "What is the output of: print([i for i in range(5) if i % 2 == 0])?", "options": [{"key": "A", "text": "[1, 3]"}, {"key": "B", "text": "[0, 2, 4]"}, {"key": "C", "text": "[2, 4]"}, {"key": "D", "text": "[0, 1, 2, 3, 4]"}], "correct_answer": "B", "explanation": "List comprehension filters even numbers from range(5). 0%2==0, 2%2==0, 4%2==0 → [0, 2, 4].", "is_quiz_question": True},
        {"question_type": "mcq", "category": "javascript", "difficulty": "easy", "question_text": "Which method converts a JSON string to a JavaScript object?", "options": [{"key": "A", "text": "JSON.parse()"}, {"key": "B", "text": "JSON.stringify()"}, {"key": "C", "text": "JSON.convert()"}, {"key": "D", "text": "JSON.toObject()"}], "correct_answer": "A", "explanation": "JSON.parse() parses a JSON string and constructs the JavaScript value/object.", "is_quiz_question": True},
        {"question_type": "mcq", "category": "sql", "difficulty": "easy", "question_text": "Which SQL clause is used to filter rows?", "options": [{"key": "A", "text": "SELECT"}, {"key": "B", "text": "WHERE"}, {"key": "C", "text": "ORDER BY"}, {"key": "D", "text": "GROUP BY"}], "correct_answer": "B", "explanation": "WHERE clause filters rows based on specified conditions.", "is_quiz_question": True},
        {"question_type": "mcq", "category": "sql", "difficulty": "medium", "question_text": "What is the difference between WHERE and HAVING in SQL?", "options": [{"key": "A", "text": "WHERE filters before grouping, HAVING filters after grouping"}, {"key": "B", "text": "They are identical"}, {"key": "C", "text": "WHERE is used with JOIN, HAVING is not"}, {"key": "D", "text": "HAVING is faster than WHERE"}], "correct_answer": "A", "explanation": "WHERE filters individual rows before GROUP BY; HAVING filters grouped results after GROUP BY.", "is_quiz_question": True},
        {"question_type": "mcq", "category": "dsa", "difficulty": "easy", "question_text": "What is the time complexity of binary search?", "options": [{"key": "A", "text": "O(n)"}, {"key": "B", "text": "O(n²)"}, {"key": "C", "text": "O(log n)"}, {"key": "D", "text": "O(1)"}], "correct_answer": "C", "explanation": "Binary search halves the search space each step, giving O(log n) time complexity.", "is_quiz_question": True},
        {"question_type": "mcq", "category": "dsa", "difficulty": "medium", "question_text": "Which data structure uses LIFO (Last In, First Out) principle?", "options": [{"key": "A", "text": "Queue"}, {"key": "B", "text": "Stack"}, {"key": "C", "text": "Array"}, {"key": "D", "text": "Linked List"}], "correct_answer": "B", "explanation": "Stack follows LIFO — the last element pushed is the first to be popped.", "is_quiz_question": True},
    ]

    for q in assessment_questions:
        db.add(Question(**q))
    for q in aptitude_questions:
        db.add(Question(**q))
    for q in quiz_questions:
        db.add(Question(**q))
