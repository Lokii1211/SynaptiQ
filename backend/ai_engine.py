"""
SkillSync AI - AI Engine (Gemini-Powered)
Core intelligence for career guidance
"""

import os
import json
from typing import Optional
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "")
if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)

model = genai.GenerativeModel("gemini-2.0-flash") if GOOGLE_API_KEY else None


async def analyze_assessment(answers: dict) -> dict:
    """Analyze psychometric assessment answers and return career recommendations"""
    if not model:
        return _mock_assessment_results(answers)

    prompt = f"""You are an expert career counselor AI for Indian students.

Analyze these psychometric assessment answers and provide career guidance.

Assessment Answers:
{json.dumps(answers, indent=2)}

Return a JSON response with this EXACT structure (no markdown, just raw JSON):
{{
    "personality_summary": "2-3 sentence personality description",
    "strengths": ["strength1", "strength2", "strength3", "strength4", "strength5"],
    "work_style": "description of ideal work environment",
    "top_careers": [
        {{
            "title": "Career Title",
            "match_score": 92,
            "why": "Why this career matches their profile",
            "avg_salary": "₹X-Y LPA",
            "growth": "high/medium/low",
            "education_path": "Required education",
            "top_skills": ["skill1", "skill2", "skill3"]
        }}
    ],
    "personality_traits": {{
        "analytical": 75,
        "creative": 60,
        "social": 45,
        "enterprising": 80,
        "conventional": 30,
        "realistic": 55
    }},
    "advice": "Personalized career advice paragraph"
}}

Provide exactly 5 career recommendations sorted by match_score (highest first).
Focus on careers relevant to Indian job market.
Be specific with salary ranges in Indian Rupees (LPA format).
"""

    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        # Clean potential markdown wrapping
        if text.startswith("```"):
            text = text.split("\n", 1)[1]
            text = text.rsplit("```", 1)[0]
        return json.loads(text)
    except Exception as e:
        print(f"Gemini assessment error: {e}")
        return _mock_assessment_results(answers)


async def analyze_skill_gap(current_skills: list, target_career: str) -> dict:
    """Analyze gap between current skills and target career requirements"""
    if not model:
        return _mock_skill_gap(current_skills, target_career)

    prompt = f"""You are an expert career skills advisor for Indian students.

Current Skills: {json.dumps(current_skills)}
Target Career: {target_career}

Analyze the skill gap and return JSON (no markdown, raw JSON only):
{{
    "target_career": "{target_career}",
    "required_skills": [
        {{"skill": "name", "importance": "critical/important/nice-to-have", "has": true/false}}
    ],
    "skill_match_percentage": 65,
    "missing_critical": ["skill1", "skill2"],
    "learning_path": [
        {{
            "step": 1,
            "skill": "skill name",
            "resource": "course/platform name",
            "duration": "X weeks",
            "type": "course/project/certification",
            "free": true/false
        }}
    ],
    "timeline_months": 6,
    "estimated_readiness": "description of when they'll be job-ready",
    "quick_wins": ["easy skills to acquire first"]
}}

Recommend real Indian-accessible resources (Coursera, Udemy, NPTEL, YouTube, etc).
Be realistic with timelines.
"""

    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        if text.startswith("```"):
            text = text.split("\n", 1)[1]
            text = text.rsplit("```", 1)[0]
        return json.loads(text)
    except Exception as e:
        print(f"Gemini skill gap error: {e}")
        return _mock_skill_gap(current_skills, target_career)


async def generate_resume_suggestions(resume_data: dict, target_role: str) -> dict:
    """Generate AI suggestions to improve a resume"""
    if not model:
        return _mock_resume_suggestions()

    prompt = f"""You are an expert resume reviewer specializing in Indian job market.

Resume Data: {json.dumps(resume_data)}
Target Role: {target_role}

Provide improvement suggestions. Return JSON (no markdown):
{{
    "ats_score": 72,
    "overall_feedback": "summary feedback",
    "section_feedback": {{
        "summary": "feedback on summary/objective",
        "experience": "feedback on experience section",
        "skills": "feedback on skills section",
        "education": "feedback on education"
    }},
    "improvements": [
        {{"section": "summary", "current": "what they wrote", "suggested": "improved version", "impact": "high/medium/low"}}
    ],
    "missing_keywords": ["keyword1", "keyword2"],
    "action_verbs": ["verb1", "verb2", "verb3"],
    "tips": ["tip1", "tip2", "tip3"]
}}
"""

    try:
        response = model.generate_content(prompt)
        text = response.text.strip()
        if text.startswith("```"):
            text = text.split("\n", 1)[1]
            text = text.rsplit("```", 1)[0]
        return json.loads(text)
    except Exception as e:
        print(f"Gemini resume error: {e}")
        return _mock_resume_suggestions()


async def career_chat(message: str, context: list = None) -> str:
    """AI career counselor chat"""
    if not model:
        return "I'm SkillSync AI, your career guidance assistant. I can help you explore careers, analyze skills, and plan your future. What would you like to know?"

    history = ""
    if context:
        for msg in context[-6:]:  # Last 6 messages for context
            role = "User" if msg["role"] == "user" else "Assistant"
            history += f"{role}: {msg['content']}\n"

    prompt = f"""You are SkillSync AI, a friendly and expert career guidance counselor for Indian students.

You help students with:
- Career exploration and discovery
- Skill development advice
- Education path guidance
- Job market insights
- Resume and interview tips
- Course and college recommendations

Be conversational, supportive, and specific to India's job market.
Keep responses concise (2-4 paragraphs max).
Use relevant data points when possible.

{f"Previous conversation:{chr(10)}{history}" if history else ""}

User: {message}

Respond naturally as SkillSync AI:"""

    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"Gemini chat error: {e}")
        return "I'm having trouble connecting right now. Please try again in a moment!"


# ============================================================
# Mock/Fallback Responses (when Gemini API is unavailable)
# ============================================================

def _mock_assessment_results(answers: dict) -> dict:
    return {
        "personality_summary": "You show strong analytical thinking combined with creative problem-solving abilities. Your responses indicate a preference for structured environments with room for innovation.",
        "strengths": ["Analytical Thinking", "Problem Solving", "Attention to Detail", "Communication", "Adaptability"],
        "work_style": "You thrive in environments that blend structured processes with creative freedom. You prefer teams but can work independently when needed.",
        "top_careers": [
            {
                "title": "Software Developer",
                "match_score": 92,
                "why": "Your analytical skills and problem-solving ability are perfectly suited for software development",
                "avg_salary": "₹6-25 LPA",
                "growth": "high",
                "education_path": "B.Tech CS/IT or BCA + certifications",
                "top_skills": ["Python", "JavaScript", "System Design"]
            },
            {
                "title": "Data Analyst",
                "match_score": 87,
                "why": "Your attention to detail and analytical nature align well with data analysis work",
                "avg_salary": "₹4-15 LPA",
                "growth": "high",
                "education_path": "B.Tech/B.Sc Statistics/CS + Data Analytics certification",
                "top_skills": ["SQL", "Python", "Tableau"]
            },
            {
                "title": "Product Manager",
                "match_score": 82,
                "why": "Your mix of analytical and communication skills makes you an excellent PM candidate",
                "avg_salary": "₹8-30 LPA",
                "growth": "high",
                "education_path": "B.Tech + MBA or Product Management certification",
                "top_skills": ["Product Strategy", "Analytics", "Stakeholder Management"]
            },
            {
                "title": "UX Designer",
                "match_score": 78,
                "why": "Your creative side combined with analytical thinking is ideal for user experience design",
                "avg_salary": "₹5-20 LPA",
                "growth": "high",
                "education_path": "Any degree + UX Design bootcamp/certification",
                "top_skills": ["Figma", "User Research", "Prototyping"]
            },
            {
                "title": "Business Analyst",
                "match_score": 75,
                "why": "Your problem-solving and communication skills are key for bridging business and technology",
                "avg_salary": "₹5-18 LPA",
                "growth": "medium",
                "education_path": "B.Tech/BBA/MBA with analytics focus",
                "top_skills": ["Requirements Analysis", "SQL", "Process Mapping"]
            }
        ],
        "personality_traits": {
            "analytical": 78,
            "creative": 62,
            "social": 55,
            "enterprising": 70,
            "conventional": 40,
            "realistic": 58
        },
        "advice": "Based on your profile, you have a strong foundation for technology-driven careers. I recommend exploring software development or data analytics as your primary path. Start by building small projects, contributing to open source, and pursuing relevant certifications. Your communication skills give you an edge — consider roles that blend technical and business aspects like Product Management as you grow."
    }


def _mock_skill_gap(current_skills: list, target_career: str) -> dict:
    return {
        "target_career": target_career,
        "required_skills": [
            {"skill": "Python", "importance": "critical", "has": "Python" in current_skills},
            {"skill": "Data Analysis", "importance": "critical", "has": "Data Analysis" in current_skills},
            {"skill": "SQL", "importance": "critical", "has": "SQL" in current_skills},
            {"skill": "Machine Learning", "importance": "important", "has": False},
            {"skill": "Communication", "importance": "important", "has": True}
        ],
        "skill_match_percentage": 45,
        "missing_critical": ["Python", "SQL", "Data Analysis"],
        "learning_path": [
            {"step": 1, "skill": "Python Basics", "resource": "NPTEL Python Course", "duration": "4 weeks", "type": "course", "free": True},
            {"step": 2, "skill": "SQL", "resource": "Khan Academy SQL", "duration": "2 weeks", "type": "course", "free": True},
            {"step": 3, "skill": "Data Analysis", "resource": "Google Data Analytics Certificate (Coursera)", "duration": "8 weeks", "type": "certification", "free": False},
            {"step": 4, "skill": "Portfolio Project", "resource": "Kaggle Competitions", "duration": "4 weeks", "type": "project", "free": True}
        ],
        "timeline_months": 5,
        "estimated_readiness": "With consistent effort of 2 hours daily, you can be job-ready for entry-level positions in about 5 months.",
        "quick_wins": ["Start with Python basics", "Practice SQL on HackerRank", "Build a small data project on GitHub"]
    }


def _mock_resume_suggestions() -> dict:
    return {
        "ats_score": 68,
        "overall_feedback": "Your resume has a good structure but needs stronger action verbs and quantified achievements.",
        "section_feedback": {
            "summary": "Add a strong professional summary highlighting your key skills and career goal",
            "experience": "Use action verbs and quantify your achievements with numbers",
            "skills": "Group skills by category (Technical, Tools, Soft Skills)",
            "education": "Include relevant coursework and academic achievements"
        },
        "improvements": [],
        "missing_keywords": ["data-driven", "collaborated", "optimized", "led"],
        "action_verbs": ["Developed", "Implemented", "Analyzed", "Designed", "Optimized", "Led"],
        "tips": [
            "Keep resume to 1 page for freshers",
            "Add links to GitHub/portfolio",
            "Include certifications with dates"
        ]
    }
