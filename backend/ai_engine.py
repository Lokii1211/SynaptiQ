"""
SkillTen AI Engine — Gemini-Powered Intelligence Layer
Covers: Assessment 4D, Career Chat, Skill Gap, Resume ATS, Code Review,
        Job Matching, Roadmap Generation, Interview Prep
"""

import os
import json
from typing import Optional, List
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

GOOGLE_API_KEY = os.getenv("GEMINI_API_KEY", "") or os.getenv("GOOGLE_API_KEY", "")
if GOOGLE_API_KEY:
    genai.configure(api_key=GOOGLE_API_KEY)

model = genai.GenerativeModel("gemini-2.0-flash") if GOOGLE_API_KEY else None


def _clean_json(text: str) -> dict:
    """Extract JSON from Gemini response (handles markdown wrapping)"""
    text = text.strip()
    if text.startswith("```"):
        text = text.split("\n", 1)[1]
        text = text.rsplit("```", 1)[0]
    return json.loads(text)


def _safe_generate(prompt: str, fallback: dict) -> dict:
    """Safe wrapper for Gemini generation with fallback"""
    if not model:
        return fallback
    try:
        response = model.generate_content(prompt)
        return _clean_json(response.text)
    except Exception as e:
        print(f"[SkillTen AI] Error: {e}")
        return fallback


# ═══════════════════════════════════════════════════════════════
# 1. ASSESSMENT 4D ANALYSIS
# ═══════════════════════════════════════════════════════════════

async def analyze_4d_assessment(answers: list, time_data: list = None) -> dict:
    """Analyze 4D assessment answers → archetype + career matches"""
    prompt = f"""You are SkillTen's 4D Career Profiling Engine for Indian students.

Analyze these psychometric answers across 4 dimensions:
- Analytical (A): Logic, data, patterns, systems thinking
- Interpersonal (I): Communication, empathy, leadership, teamwork
- Creative (C): Innovation, design, ideation, artistic expression
- Systematic (S): Planning, process, organization, execution

Assessment Answers: {json.dumps(answers, indent=2)}
{f"Response Times (ms): {json.dumps(time_data)}" if time_data else ""}

Return ONLY raw JSON (no markdown):
{{
    "dimensions": {{
        "analytical": 0-100,
        "interpersonal": 0-100,
        "creative": 0-100,
        "systematic": 0-100
    }},
    "dominant_dimension": "analytical|interpersonal|creative|systematic",
    "archetype": {{
        "code": "2-letter code like AN, IP, CR, SY, AI, AC, AS, IC, IS, CS",
        "name": "The Architect / The Connector / The Visionary / etc",
        "description": "2-3 sentences about this archetype"
    }},
    "consistency_score": 0-100,
    "top_careers": [
        {{
            "slug": "software-engineer",
            "name": "Software Engineer",
            "match_score": 92,
            "driving_dimension": "analytical",
            "why": "1-2 sentence explanation",
            "salary_p50_lpa": 12,
            "timeline_months": 6
        }}
    ],
    "personality_summary": "2-3 sentence personality description",
    "advice": "Personalized career advice for Indian market"
}}

Provide exactly 5 career matches sorted by score. Focus on Indian job market.
Use Indian salary data (LPA). Be honest, not generic."""

    return _safe_generate(prompt, _mock_4d_assessment())


# ═══════════════════════════════════════════════════════════════
# 2. CAREER CHAT
# ═══════════════════════════════════════════════════════════════

async def career_chat(message: str, context: list = None, user_profile: dict = None) -> str:
    """AI career counselor chat — SkillTen's conversational advisor"""
    if not model:
        return _mock_chat_response(message)

    history = ""
    if context:
        for msg in context[-8:]:
            role = "User" if msg.get("role") == "user" else "SkillTen"
            history += f"{role}: {msg.get('content', '')}\n"

    profile_context = ""
    if user_profile:
        profile_context = f"""
User Profile:
- College: {user_profile.get('college_name', 'N/A')} (Tier {user_profile.get('college_tier', 'N/A')})
- Stream: {user_profile.get('stream', 'N/A')}
- Year: {user_profile.get('graduation_year', 'N/A')}
- CGPA: {user_profile.get('cgpa', 'N/A')}
- Target Role: {user_profile.get('target_role', 'N/A')}
- Archetype: {user_profile.get('archetype_name', 'N/A')}
- Viya Score: {user_profile.get('viya_score', 0)}
"""

    prompt = f"""You are SkillTen AI, an expert career guidance counselor for Indian students.

You are NOT generic. You know:
- Indian salary benchmarks (fresher vs experienced, tier 1 vs tier 2/3 colleges)
- Real interview patterns at Google, Amazon, TCS, Infosys, Flipkart, startups
- GATE, CAT, GRE, UPSC preparation strategies
- Indian placement season dynamics
- Tier 1/2/3 college hiring differences
- Skills that actually get you hired vs resume fillers

{profile_context}
{("Conversation history:" + chr(10) + history) if history else ""}

User: {message}

Rules:
1. Be conversational but data-driven
2. Give specific, actionable advice (not vague platitudes)
3. Reference real companies, real salary ranges, real resources
4. Keep responses concise (2-4 paragraphs)
5. If user asks something you're unsure about, say so honestly
6. Use ₹ for salary references

Respond as SkillTen AI:"""

    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        print(f"[SkillTen AI] Chat error: {e}")
        return _mock_chat_response(message)


# ═══════════════════════════════════════════════════════════════
# 3. SKILL GAP ANALYSIS
# ═══════════════════════════════════════════════════════════════

async def analyze_skill_gap(current_skills: list, target_career: str, user_context: dict = None) -> dict:
    """Analyze gap between user's skills and target career"""
    ctx = ""
    if user_context:
        ctx = f"User: {user_context.get('college_tier', 'N/A')} tier, {user_context.get('stream', 'N/A')}, graduating {user_context.get('graduation_year', 'N/A')}"

    prompt = f"""You are SkillTen's Skill Gap Analyzer for Indian students.

Current Skills: {json.dumps(current_skills)}
Target Career: {target_career}
{ctx}

Return ONLY raw JSON:
{{
    "target_career": "{target_career}",
    "skill_match_percentage": 65,
    "required_skills": [
        {{"skill": "name", "importance": "critical|important|nice-to-have", "has": true/false, "proficiency_needed": "beginner|intermediate|advanced"}}
    ],
    "missing_critical": ["skill1", "skill2"],
    "learning_path": [
        {{
            "step": 1,
            "skill": "skill name",
            "resource": "course/platform name (real Indian-accessible resource)",
            "resource_url": "actual URL",
            "duration": "X weeks",
            "type": "course|project|certification|practice",
            "free": true/false,
            "why_companies_care": "1 sentence"
        }}
    ],
    "timeline_months": 6,
    "quick_wins": ["easy skill to acquire first"],
    "estimated_readiness": "When they'll be job-ready",
    "non_obvious_tips": ["insider advice"]
}}

Use REAL resources: NPTEL, Coursera, freeCodeCamp, LeetCode, YouTube channels.
Be realistic with timelines for an Indian student."""

    return _safe_generate(prompt, _mock_skill_gap(current_skills, target_career))


# ═══════════════════════════════════════════════════════════════
# 4. RESUME ATS SCORING + SUGGESTIONS
# ═══════════════════════════════════════════════════════════════

async def analyze_resume(resume_data: dict, target_role: str) -> dict:
    """ATS score + improvement suggestions for resume"""
    prompt = f"""You are SkillTen's Resume ATS Analyzer for Indian job market.

Resume Data: {json.dumps(resume_data)}
Target Role: {target_role}

Score this resume and provide actionable improvements.
Return ONLY raw JSON:
{{
    "ats_score": 72,
    "grade": "B+",
    "overall_feedback": "2-sentence summary",
    "section_scores": {{
        "summary": {{"score": 70, "feedback": "..."}},
        "experience": {{"score": 65, "feedback": "..."}},
        "skills": {{"score": 80, "feedback": "..."}},
        "education": {{"score": 75, "feedback": "..."}},
        "projects": {{"score": 60, "feedback": "..."}}
    }},
    "improvements": [
        {{
            "section": "summary",
            "priority": "high|medium|low",
            "current": "what they wrote (or 'missing')",
            "suggested": "improved version",
            "impact_on_score": "+5 to +15 points"
        }}
    ],
    "missing_keywords": ["keyword1", "keyword2"],
    "strong_action_verbs": ["Developed", "Implemented"],
    "formatting_issues": ["issue1"],
    "tips": ["tip1", "tip2"]
}}

Be tough but constructive. Indian freshers need honest feedback."""

    return _safe_generate(prompt, _mock_resume_suggestions())


# ═══════════════════════════════════════════════════════════════
# 5. CODE REVIEW AI
# ═══════════════════════════════════════════════════════════════

async def review_code(code: str, language: str, problem_title: str = "") -> dict:
    """AI code review for coding submissions"""
    prompt = f"""You are SkillTen's Code Review AI, an expert competitive programmer.

Language: {language}
Problem: {problem_title}
Code:
```{language}
{code}
```

Review this code and return ONLY raw JSON:
{{
    "overall_quality": "excellent|good|average|needs_improvement",
    "score": 85,
    "time_complexity": "O(n)",
    "space_complexity": "O(1)",
    "is_optimal": true/false,
    "feedback": [
        {{
            "type": "optimization|bug|style|best_practice",
            "line_hint": "near line X or description",
            "message": "what to improve",
            "suggestion": "how to fix it"
        }}
    ],
    "better_approach": "Brief description of optimal approach if not optimal",
    "interview_tip": "What an interviewer would say about this code",
    "indian_company_relevance": "Which Indian companies ask similar problems"
}}"""

    return _safe_generate(prompt, _mock_code_review(language))


# ═══════════════════════════════════════════════════════════════
# 6. JOB MATCH SCORING
# ═══════════════════════════════════════════════════════════════

async def calculate_job_match(user_profile: dict, job_data: dict) -> dict:
    """Calculate AI match score between user and job"""
    prompt = f"""You are SkillTen's Job Match Engine.

User Profile: {json.dumps(user_profile)}
Job Details: {json.dumps(job_data)}

Calculate match and return ONLY raw JSON:
{{
    "match_score": 78,
    "match_grade": "B+",
    "strengths": ["matching skill 1", "matching skill 2"],
    "gaps": ["missing skill 1"],
    "recommendation": "apply_now|upskill_first|stretch_goal|not_recommended",
    "honest_assessment": "1-2 sentences on realistic chances",
    "preparation_tips": ["tip1", "tip2"],
    "days_to_close_gaps": 30
}}"""

    return _safe_generate(prompt, {
        "match_score": 70, "match_grade": "B",
        "strengths": ["Problem Solving", "Python"],
        "gaps": ["System Design experience"],
        "recommendation": "apply_now",
        "honest_assessment": "Good foundation. Apply and prepare simultaneously.",
        "preparation_tips": ["Practice system design", "Review company's tech stack"],
        "days_to_close_gaps": 30
    })


# ═══════════════════════════════════════════════════════════════
# 7. ROADMAP GENERATION
# ═══════════════════════════════════════════════════════════════

async def generate_roadmap(target_career: str, current_skills: list, user_context: dict = None) -> dict:
    """Generate personalized learning roadmap"""
    ctx = ""
    if user_context:
        ctx = f"College tier: {user_context.get('college_tier', 'N/A')}, Stream: {user_context.get('stream', 'N/A')}, Year: {user_context.get('graduation_year', 'N/A')}, Hours/week available: {user_context.get('hours_per_week', 10)}"

    prompt = f"""You are SkillTen's AI Roadmap Generator for Indian students.

Target Career: {target_career}
Current Skills: {json.dumps(current_skills)}
{ctx}

Generate a detailed learning roadmap. Return ONLY raw JSON:
{{
    "total_months": 6,
    "phases": [
        {{
            "phase_number": 1,
            "title": "Foundation Phase",
            "description": "What and why",
            "duration_weeks": 4,
            "weekly_hours": 10,
            "milestones": [
                {{
                    "order": 1,
                    "skill_name": "Python Basics",
                    "resource_name": "CS50 Python (Harvard)",
                    "resource_url": "https://cs50.harvard.edu/python",
                    "is_free": true,
                    "estimated_hours": 20,
                    "project_to_build": "CLI expense tracker",
                    "why_companies_care": "Used in 90% of data science interviews",
                    "non_obvious_tip": "Focus on generators and decorators — interviewers love them"
                }}
            ]
        }}
    ]
}}

Rules:
1. Use REAL, accessible resources (NPTEL, Coursera, YouTube, freeCodeCamp, LeetCode)
2. Include actual URLs where possible
3. Each milestone must have a project to build
4. Include non-obvious tips that insiders know
5. Be realistic for Indian students (college schedules, competitive exams)
6. 3-5 phases, 2-4 milestones per phase"""

    return _safe_generate(prompt, _mock_roadmap(target_career))


# ═══════════════════════════════════════════════════════════════
# 8. INTERVIEW PREP
# ═══════════════════════════════════════════════════════════════

async def generate_interview_prep(company: str, role: str, round_type: str = "technical") -> dict:
    """Generate interview preparation guide"""
    prompt = f"""You are SkillTen's Interview Prep AI, specialized in Indian tech hiring.

Company: {company}
Role: {role}
Round Type: {round_type}

Generate an interview prep guide. Return ONLY raw JSON:
{{
    "company": "{company}",
    "role": "{role}",
    "overall_difficulty": 4,
    "expected_rounds": [
        {{"round": 1, "type": "Online Assessment", "duration": "90 min", "description": "...", "topics": ["DSA", "Aptitude"]}}
    ],
    "must_know_topics": ["topic1", "topic2"],
    "frequently_asked_questions": [
        {{"question": "...", "category": "DSA|System Design|Behavioral|HR", "difficulty": "easy|medium|hard", "hint": "..."}}
    ],
    "preparation_plan": {{
        "1_week_before": ["task1"],
        "day_before": ["task1"],
        "day_of": ["tip1"]
    }},
    "insider_tips": ["tip that most candidates don't know"],
    "common_mistakes": ["mistake1"],
    "resources": [{{"name": "...", "url": "...", "type": "video|article|practice"}}]
}}

Use real data about {company}'s interview process in India. Be specific."""

    return _safe_generate(prompt, _mock_interview_prep(company, role))


# ═══════════════════════════════════════════════════════════════
# 9. ROADMAP REROUTING ENGINE (Bible XF-08)
# ═══════════════════════════════════════════════════════════════

async def generate_reroute_options(
    original_roadmap: dict, completed_milestones: list, missed_milestones: list,
    student_profile: dict, available_hours_per_week: int, target_career: str,
    placement_deadline: str = None
) -> dict:
    """Generate 3 reroute options when student falls behind (Bible XF-08)"""
    prompt = f"""You are Viya's Roadmap Intelligence Engine (Bible XF-08).

A student is behind on their roadmap. Generate 3 honest reroute options.

Original Roadmap: {json.dumps(original_roadmap)}
Completed Milestones: {json.dumps(completed_milestones)}
Missed Milestones: {json.dumps(missed_milestones)}
Student: {json.dumps(student_profile)}
Available Hours/Week: {available_hours_per_week}
Target Career: {target_career}
Placement Deadline: {placement_deadline or 'No strict deadline'}

Return ONLY raw JSON:
{{
    "trigger_reason": "milestone_missed|speed_mismatch|burnout_signal|goal_change",
    "options": [
        {{
            "option_name": "Recovery",
            "description": "You missed 2 weeks. Here's how to catch up without overwhelming yourself.",
            "weeks_added_or_removed": 3,
            "placement_readiness_date": "Month Year",
            "what_changes": ["Change 1", "Change 2"],
            "what_stays_same": ["Core milestone 1 unchanged"],
            "honest_warning": "This only works if you commit X hours/week consistently",
            "probability_of_completion": "high",
            "intensity_level": "moderate"
        }},
        {{
            "option_name": "Adjusted Pace",
            "description": "Let's rebuild for your actual schedule.",
            "weeks_added_or_removed": 6,
            "placement_readiness_date": "Month Year",
            "what_changes": ["Longer timeline", "Same quality"],
            "what_stays_same": ["All high-value milestones intact"],
            "honest_warning": "At this pace, you'll be ready by [date]",
            "probability_of_completion": "high",
            "intensity_level": "relaxed"
        }},
        {{
            "option_name": "Sprint",
            "description": "Intensive catch-up if you have 2 free weeks.",
            "weeks_added_or_removed": -2,
            "placement_readiness_date": "Month Year",
            "what_changes": ["4-week sprint replacing 8 weeks", "Daily commitments"],
            "what_stays_same": ["Same final goal"],
            "honest_warning": "This is hard. Only choose this if you genuinely have the time.",
            "probability_of_completion": "medium",
            "intensity_level": "intensive"
        }}
    ],
    "encouragement": "Empathetic message acknowledging the struggle"
}}

Be honest. Don't sugar-coat. India-specific reality."""

    return _safe_generate(prompt, _mock_reroute_options())


# ═══════════════════════════════════════════════════════════════
# 10. PARENT REPORT GENERATION (Bible XF-10)
# ═══════════════════════════════════════════════════════════════

async def generate_parent_report(student_profile: dict, weekly_activity: dict) -> dict:
    """Generate parent-friendly weekly report (Bible XF-10)"""
    prompt = f"""You are SkillTen's Parent Report Generator. Write for Indian parents.

Student Profile: {json.dumps(student_profile)}
This Week's Activity: {json.dumps(weekly_activity)}

Generate a parent-friendly report. NO jargon. Plain language.
Return ONLY raw JSON:
{{
    "student_name": "First name",
    "week_label": "Week of Month Day, Year",
    "weekly_summary": {{
        "problems_solved": 12,
        "modules_completed": 2,
        "streak_days": 34,
        "hours_spent": 8
    }},
    "placement_readiness": {{
        "percentage": 68,
        "change_from_last_week": 5,
        "target_role": "Software Engineer",
        "readiness_label": "On Track"
    }},
    "this_weeks_focus": "What they worked on in plain language",
    "next_milestone": "What's coming next with deadline",
    "career_brief": {{
        "career_name": "Software Engineer at a tech company",
        "what_they_do": "Build and maintain software used by thousands of people",
        "salary_reality": "₹8-18 LPA in first 3 years (actual take-home, not CTC fantasy)",
        "job_security": "Very stable — demand exceeds supply in India",
        "typical_locations": "Bangalore, Pune, Hyderabad",
        "parent_concerns_answered": ["Is this a stable career?", "What does my child do all day?"]
    }},
    "is_on_track": "YES|PARTIALLY|NEEDS_ATTENTION",
    "reason_if_not_on_track": "Specific, compassionate reason (if applicable)",
    "positive_highlight": "One genuinely encouraging observation"
}}

RULES:
1. Never make the parent feel their child is failing
2. Always pair any concern with actionable context
3. Use ₹ for all financial references
4. No tech jargon — parents should understand every word"""

    return _safe_generate(prompt, _mock_parent_report(student_profile))


# ═══════════════════════════════════════════════════════════════
# 11. SALARY TRUTH CHECKER (Bible XF-10)
# ═══════════════════════════════════════════════════════════════

async def check_salary_truth(ctc_lpa: float, role: str, city: str, college_tier: int = 2) -> dict:
    """Help parents understand CTC vs in-hand salary (Bible XF-10)"""
    prompt = f"""You are SkillTen's Salary Truth Engine for Indian parents.

Offer CTC: ₹{ctc_lpa} LPA
Role: {role}
City: {city}
College Tier: {college_tier}

Break down the REAL take-home salary. Return ONLY raw JSON:
{{
    "ctc_lpa": {ctc_lpa},
    "monthly_inhand": "₹XX,XXX",
    "monthly_breakdown": {{
        "basic": "₹XX,XXX",
        "hra": "₹XX,XXX",
        "special_allowance": "₹XX,XXX",
        "pf_deduction": "₹XX,XXX",
        "income_tax_monthly": "₹XX,XXX",
        "net_monthly": "₹XX,XXX"
    }},
    "is_good_offer": true,
    "percentile_vs_similar": "Top 25% for Tier-{college_tier} {role} in {city}",
    "median_offer_lpa": 9.2,
    "cost_of_living": {{
        "rent_1bhk": "₹XX,XXX",
        "food_monthly": "₹XX,XXX",
        "transport": "₹XX,XXX",
        "savings_possible": "₹XX,XXX/month"
    }},
    "growth_trajectory": "Timeline to ₹20 LPA: X years if they perform well",
    "honest_verdict": "For a {role} from a Tier-{college_tier} college in {city}, this is [verdict]"
}}

Be BRUTALLY honest. Indian parents need truth, not comfort."""

    return _safe_generate(prompt, _mock_salary_truth(ctc_lpa, city))


# ═══════════════════════════════════════════════════════════════
# 12. SALARY NEGOTIATION SIMULATOR (Bible 05-D)
# ═══════════════════════════════════════════════════════════════

def salary_negotiation_simulator(
    company_type: str, role: str, initial_offer_lpa: float,
    budget_ceiling_lpa: float, scenario: str = "campus_placement",
    student_message: str = "", conversation_history: list = None
) -> dict:
    """AI plays Indian HR recruiter in salary negotiation roleplay (Bible 05-D)"""
    history_str = ""
    if conversation_history:
        history_str = "\n".join([f"{m['role']}: {m['content']}" for m in conversation_history[-8:]])

    prompt = f"""
You are an HR recruiter at a {company_type} company in India. Stay in this persona.
You are negotiating with a student for the role of {role}.

SCENARIO: {scenario}
INITIAL OFFER: ₹{initial_offer_lpa} LPA
BUDGET CEILING: ₹{budget_ceiling_lpa} LPA (NEVER reveal this)

CONVERSATION SO FAR:
{history_str}

STUDENT'S LATEST MESSAGE: {student_message}

RECRUITER BEHAVIOR:
→ Use real Indian HR tactics: "What's your current/expected CTC?"
→ Push back on counter-offers — don't fold immediately
→ If student makes data-backed case → show flexibility (up to ceiling, never above)
→ If student accepts immediately → proceed, flag for debrief
→ If student is aggressive → stay calm, slightly firmer

If the student says "debrief", SWITCH to career counselor mode:
1. 3 things they did well
2. 3 missed opportunities with EXACT alternative wording
3. The math: "Negotiating ₹1L more = ₹X L more over 10 years at 10% growth"
4. One thing to practice before their next real negotiation

Return JSON:
{{
    "recruiter_response": "...",
    "is_debrief": false,
    "negotiation_stage": "opening|counter|closing|accepted|debrief",
    "current_offer_lpa": {initial_offer_lpa},
    "tips": []
}}
"""
    return _safe_generate(prompt, {
        "recruiter_response": f"Thank you for your interest in the {role} position. We'd like to offer you ₹{initial_offer_lpa} LPA. This is competitive for {company_type} companies in this space.",
        "is_debrief": False,
        "negotiation_stage": "opening",
        "current_offer_lpa": initial_offer_lpa,
        "tips": []
    })


# ═══════════════════════════════════════════════════════════════
# 13. CAREER DAY SIMULATOR (Bible 05-G)
# ═══════════════════════════════════════════════════════════════

def career_day_simulator(
    career: str, company_type: str = "startup",
    city: str = "Bangalore", level: str = "fresher",
    student_choice: str = "", decision_number: int = 0,
    conversation_history: list = None
) -> dict:
    """Interactive day-in-the-life career simulation (Bible 05-G)"""
    history_str = ""
    if conversation_history:
        history_str = "\n".join([f"{m['role']}: {m['content']}" for m in conversation_history[-6:]])

    prompt = f"""
You are running a Career Day Simulation for: {career} at a {company_type} in {city} at {level} level.
Make it feel real — not the LinkedIn version, the real 9pm-when-deadline-hits version.

PREVIOUS CONVERSATION:
{history_str}

STUDENT'S CHOICE: {student_choice}
CURRENT DECISION NUMBER: {decision_number}

FLOW:
- If decision_number == 0: SET THE SCENE with specific realistic detail and present first decision (3-4 options)
- If decision_number 1-3: Show consequence of their choice + emotional reality + next decision
- If decision_number >= 4 or student says "end simulation": Run DEBRIEF

DAILY MOMENTS (ensure these appear across the simulation):
→ Realize they lack a skill they thought they had
→ Manager gives ambiguous direction
→ Deadline compresses by 2 days unexpectedly
→ One interpersonal friction

Return JSON:
{{
    "narrative": "...",
    "decision_prompt": "What do you do?",
    "options": ["Option A: ...", "Option B: ...", "Option C: ..."],
    "decision_number": {decision_number},
    "is_complete": false,
    "debrief": null
}}

For debrief, set is_complete=true and debrief to:
{{
    "mood_question": "How energized vs drained? Rate 1-5",
    "fit_analysis": "What your reactions reveal about fit...",
    "reality_note": "This used real scenarios from professionals",
    "next_action": "One action to explore further"
}}
"""
    if decision_number == 0:
        return _safe_generate(prompt, {
            "narrative": f"You are a {career} at a {company_type} in {city}. It's Monday, 9:07am. Your Slack shows 23 unread messages. Your standup is in 15 minutes but your manager just pinged: 'Can we talk before standup? Something came up over the weekend.' You haven't had coffee yet. Your laptop is loading. What do you prioritize?",
            "decision_prompt": "What do you do?",
            "options": [
                "Go talk to your manager immediately — they said it's urgent",
                "Quickly skim Slack first to see if the 'something' is already being discussed",
                "Get coffee first, then go. You need to be sharp for unexpected conversations",
                "Reply to manager: 'Sure, give me 5 mins' — use those 5 mins to check email"
            ],
            "decision_number": 0,
            "is_complete": False,
            "debrief": None
        })
    return _safe_generate(prompt, {
        "narrative": "The day continues...",
        "decision_prompt": "What do you do next?",
        "options": ["Option A", "Option B", "Option C"],
        "decision_number": decision_number,
        "is_complete": False,
        "debrief": None
    })


# ═══════════════════════════════════════════════════════════════
# 14. EMOTION-AWARE INTERVENTION (Bible 05-F)
# ═══════════════════════════════════════════════════════════════

def emotion_aware_intervention(
    signal_type: str, student_data: dict, positive_history: list = None
) -> dict:
    """Triggered by behavioral signals — wellbeing support (Bible 05-F)"""
    wins = ", ".join(positive_history[:3]) if positive_history else "completing their profile"
    streak = student_data.get("streak", 0)
    milestones = student_data.get("milestones_hit", 0)

    prompt = f"""
A student needs support right now. You are SkillSync's wellbeing layer.

SIGNAL TYPE: {signal_type}
STUDENT DATA: streak={streak}, milestones_hit={milestones}
POSITIVE HISTORY: {wins}

Follow this EXACT sequence — never skip a stage:

STAGE 1 — ACKNOWLEDGE (2-3 sentences)
"That sounds genuinely hard." + specific acknowledgment.
NEVER: "I understand how you feel."

STAGE 2 — NORMALIZE (1-2 sentences)
"Almost everyone on this exact path hits this wall at this stage."

STAGE 3 — REFRAME WITH DATA (1-2 sentences)
Reference their ACTUAL progress. NEVER generic encouragement.

STAGE 4 — ONE TINY ACTION (1 sentence)
NOT a plan. ONE frictionless, pressure-free suggestion.

ESCALATION (if {signal_type} in [hopeless, worthless, give_up]):
Gently mention: "Some people find it helps to talk to someone.
iCall helpline 9152987821 | Vandrevala Foundation 1860-2662-345"

Return JSON:
{{
    "message": "...",
    "needs_escalation": false,
    "helpline_shown": false,
    "suggested_action": "one tiny step"
}}
"""
    needs_escalation = signal_type in ["hopeless", "worthless", "give_up", "self_harm"]
    return _safe_generate(prompt, {
        "message": f"That sounds genuinely hard. {signal_type.replace('_', ' ').title()} is something almost everyone on this path experiences — it's not a signal you're failing, it's a signal you care about the outcome. You've already hit {milestones} milestones — that's real progress. When you're ready, even opening the app tomorrow counts as showing up.",
        "needs_escalation": needs_escalation,
        "helpline_shown": needs_escalation,
        "suggested_action": "Open the app tomorrow — that's enough"
    })


# ═══════════════════════════════════════════════════════════════
# MOCK/FALLBACK RESPONSES
# ═══════════════════════════════════════════════════════════════


def _mock_4d_assessment():
    return {
        "dimensions": {"analytical": 78, "interpersonal": 62, "creative": 55, "systematic": 70},
        "dominant_dimension": "analytical",
        "archetype": {"code": "AN", "name": "The Architect", "description": "You think in systems and patterns. You enjoy breaking complex problems into structured solutions and optimizing processes."},
        "consistency_score": 82,
        "top_careers": [
            {"slug": "software-engineer", "name": "Software Engineer", "match_score": 92, "driving_dimension": "analytical", "why": "Your analytical skills and systematic approach are perfect for building scalable software systems.", "salary_p50_lpa": 12, "timeline_months": 6},
            {"slug": "data-scientist", "name": "Data Scientist", "match_score": 87, "driving_dimension": "analytical", "why": "Strong analytical dimension combined with pattern recognition makes this a natural fit.", "salary_p50_lpa": 15, "timeline_months": 8},
            {"slug": "product-manager", "name": "Product Manager", "match_score": 78, "driving_dimension": "systematic", "why": "Your systematic approach and decent interpersonal skills work well in product management.", "salary_p50_lpa": 18, "timeline_months": 12},
            {"slug": "devops-engineer", "name": "DevOps Engineer", "match_score": 75, "driving_dimension": "systematic", "why": "Systematic thinking and analytical skills are core to infrastructure and automation.", "salary_p50_lpa": 14, "timeline_months": 6},
            {"slug": "cybersecurity-analyst", "name": "Cybersecurity Analyst", "match_score": 72, "driving_dimension": "analytical", "why": "Analytical mindset is essential for threat detection and security analysis.", "salary_p50_lpa": 10, "timeline_months": 8},
        ],
        "personality_summary": "You show strong analytical thinking with a systematic approach to problem-solving. You prefer structured environments but can adapt when needed.",
        "advice": "Focus on building deep technical skills in one area rather than spreading thin. For Indian market, DSA + System Design + one specialization (ML/Cloud/Security) will maximize your placement outcomes."
    }


def _mock_chat_response(message: str) -> str:
    msg_lower = message.lower()
    if any(k in msg_lower for k in ["salary", "pay", "ctc", "package"]):
        return "Great question about compensation! In India, fresher salaries vary widely:\n\n**Service companies (TCS, Infosys, Wipro):** ₹3.5-7 LPA\n**Product companies (Flipkart, Razorpay):** ₹15-30 LPA\n**FAANG (Google, Microsoft, Amazon):** ₹25-50+ LPA\n\nThe gap is massive, and it comes down to: DSA skills, system design knowledge, and real projects. College tier matters less than you think — I've seen tier-3 students crack Google. What specific role are you targeting?"
    elif any(k in msg_lower for k in ["dsa", "leetcode", "coding", "algorithm"]):
        return "For DSA preparation, here's what actually works:\n\n1. **Start with Striver's SDE Sheet** (free, structured, proven)\n2. **200 problems is enough** — don't chase 500+\n3. **Focus on patterns**: Sliding Window, Two Pointers, Binary Search, BFS/DFS, DP\n4. **Practice on LeetCode** but learn from YouTube (take U Forward, Neetcode)\n\nMost Indian companies (TCS NQT, Infosys, Wipro) test basic DSA. For product companies, you need medium-hard level. How much time do you have before placements?"
    elif any(k in msg_lower for k in ["intern", "internship"]):
        return "For internships in India, here's the truth:\n\n**Best platforms:** LinkedIn, Unstop, Internshala (filter for stipend > ₹10K)\n**Best time to apply:** August-October for summer internships\n**What matters most:** Projects > CGPA > College name\n\n**Pro tip:** Cold DM startup founders on LinkedIn with 'I built X using your tech stack, can I intern?' — this works better than formal applications. What domain interests you?"
    else:
        return f"That's a great question! As your SkillTen AI career advisor, I'm here to help you navigate the Indian job market.\n\nI can help you with:\n- 💼 Salary benchmarks & company insights\n- 📚 Skill development roadmaps\n- 💻 Coding interview preparation\n- 📝 Resume optimization\n- 🎯 Career path planning\n\nWhat specific aspect would you like to explore?"


def _mock_skill_gap(current_skills: list, target_career: str) -> dict:
    return {
        "target_career": target_career,
        "skill_match_percentage": 45,
        "required_skills": [
            {"skill": "Python", "importance": "critical", "has": "Python" in current_skills, "proficiency_needed": "advanced"},
            {"skill": "Data Structures", "importance": "critical", "has": "DSA" in current_skills, "proficiency_needed": "advanced"},
            {"skill": "System Design", "importance": "important", "has": False, "proficiency_needed": "intermediate"},
            {"skill": "SQL", "importance": "critical", "has": "SQL" in current_skills, "proficiency_needed": "intermediate"},
            {"skill": "Git", "importance": "important", "has": True, "proficiency_needed": "intermediate"},
        ],
        "missing_critical": ["Python", "DSA", "SQL"],
        "learning_path": [
            {"step": 1, "skill": "Python", "resource": "CS50 Python (Harvard)", "resource_url": "https://cs50.harvard.edu/python", "duration": "4 weeks", "type": "course", "free": True, "why_companies_care": "Used in 85% of Indian tech interviews"},
            {"step": 2, "skill": "DSA", "resource": "Striver SDE Sheet", "resource_url": "https://takeuforward.org/strivers-a2z-dsa-course", "duration": "8 weeks", "type": "practice", "free": True, "why_companies_care": "Gate-keeper for all product company interviews"},
            {"step": 3, "skill": "System Design", "resource": "System Design Primer (GitHub)", "resource_url": "https://github.com/donnemartin/system-design-primer", "duration": "4 weeks", "type": "course", "free": True, "why_companies_care": "Asked in 100% of SDE-2+ interviews"},
        ],
        "timeline_months": 5,
        "quick_wins": ["Start LeetCode Easy problems today", "Set up GitHub profile", "Complete SQL on HackerRank"],
        "estimated_readiness": "With 2 hours daily, you'll be ready for entry-level product company interviews in ~5 months.",
        "non_obvious_tips": ["Build one full-stack project and deploy it — this alone puts you ahead of 80% of candidates"]
    }


def _mock_resume_suggestions() -> dict:
    return {
        "ats_score": 68,
        "grade": "C+",
        "overall_feedback": "Your resume has decent structure but lacks quantified achievements and is missing key ATS keywords.",
        "section_scores": {
            "summary": {"score": 60, "feedback": "Add a 2-line professional summary with your target role and key skills"},
            "experience": {"score": 55, "feedback": "Use 'Developed X using Y, resulting in Z% improvement' format"},
            "skills": {"score": 75, "feedback": "Good coverage. Group into Technical, Tools, and Soft Skills"},
            "education": {"score": 80, "feedback": "Include relevant coursework and academic achievements"},
            "projects": {"score": 65, "feedback": "Add live links and quantify impact (users, performance, etc)"}
        },
        "improvements": [
            {"section": "summary", "priority": "high", "current": "missing", "suggested": "Results-driven Computer Science student with expertise in Python and React. Seeking SDE role to build scalable products.", "impact_on_score": "+10 points"},
            {"section": "projects", "priority": "high", "current": "Built a todo app", "suggested": "Developed a full-stack task management app using React + Node.js, serving 100+ users with 99.9% uptime", "impact_on_score": "+8 points"},
        ],
        "missing_keywords": ["data-driven", "scalable", "collaborative", "optimized", "deployed"],
        "strong_action_verbs": ["Developed", "Implemented", "Architected", "Optimized", "Automated", "Deployed"],
        "formatting_issues": ["Keep to 1 page", "Use consistent date format (MMM YYYY)"],
        "tips": ["Add GitHub and LinkedIn links at top", "List projects before education for freshers", "Use .pdf format for ATS compatibility"]
    }


def _mock_code_review(language: str) -> dict:
    return {
        "overall_quality": "good",
        "score": 75,
        "time_complexity": "O(n)",
        "space_complexity": "O(n)",
        "is_optimal": False,
        "feedback": [
            {"type": "optimization", "line_hint": "main logic", "message": "Consider using a hash map for O(1) lookups", "suggestion": "Replace the inner loop with a dictionary/set lookup"},
            {"type": "style", "line_hint": "variable naming", "message": "Use descriptive variable names", "suggestion": "Rename 'x' to 'target_sum' for clarity"},
            {"type": "best_practice", "line_hint": "edge cases", "message": "Add input validation", "suggestion": "Check for empty input and handle edge cases"}
        ],
        "better_approach": "Use a hash map to achieve O(n) time complexity instead of O(n²).",
        "interview_tip": "An interviewer would ask you to optimize this. Always mention the brute force first, then optimize.",
        "indian_company_relevance": "This pattern appears in Google, Amazon, and Flipkart interviews frequently."
    }


def _mock_roadmap(target_career: str) -> dict:
    return {
        "total_months": 6,
        "phases": [
            {
                "phase_number": 1, "title": "Foundation", "description": "Build core programming skills",
                "duration_weeks": 6, "weekly_hours": 10,
                "milestones": [
                    {"order": 1, "skill_name": "Python Mastery", "resource_name": "CS50 Python", "resource_url": "https://cs50.harvard.edu/python", "is_free": True, "estimated_hours": 30, "project_to_build": "CLI portfolio manager", "why_companies_care": "Python is the most tested language in Indian interviews", "non_obvious_tip": "Master list comprehensions and generators — they come up in every Python interview"},
                    {"order": 2, "skill_name": "Git & GitHub", "resource_name": "Git Tutorial by Kunal Kushwaha", "resource_url": "https://youtube.com/@KunalKushwaha", "is_free": True, "estimated_hours": 5, "project_to_build": "Set up GitHub profile with pinned repos", "why_companies_care": "Recruiters check your GitHub before your resume", "non_obvious_tip": "Green squares matter less than quality — 3 good repos beat 100 toy projects"},
                ]
            },
            {
                "phase_number": 2, "title": "Core Skills", "description": "DSA + System fundamentals",
                "duration_weeks": 8, "weekly_hours": 12,
                "milestones": [
                    {"order": 1, "skill_name": "Data Structures & Algorithms", "resource_name": "Striver's A2Z DSA Course", "resource_url": "https://takeuforward.org/strivers-a2z-dsa-course", "is_free": True, "estimated_hours": 100, "project_to_build": "Solve 150 LeetCode problems (50E + 80M + 20H)", "why_companies_care": "Gatekeeping skill for ALL product companies", "non_obvious_tip": "Focus on patterns, not problems. Learn sliding window, two pointers, BFS/DFS, DP, and you cover 80% of interviews"},
                    {"order": 2, "skill_name": "Database & SQL", "resource_name": "SQL on HackerRank", "resource_url": "https://hackerrank.com/domains/sql", "is_free": True, "estimated_hours": 15, "project_to_build": "Design schema for e-commerce app", "why_companies_care": "SQL is asked in 70% of backend and data roles", "non_obvious_tip": "Practice window functions and CTEs — these are the most common advanced SQL questions"},
                ]
            },
            {
                "phase_number": 3, "title": "Specialization & Projects", "description": "Build portfolio + apply",
                "duration_weeks": 10, "weekly_hours": 15,
                "milestones": [
                    {"order": 1, "skill_name": "Full-Stack Project", "resource_name": "Build & Deploy", "resource_url": "https://roadmap.sh", "is_free": True, "estimated_hours": 60, "project_to_build": "SaaS app with auth, payments, deployment (use Vercel/Railway)", "why_companies_care": "Shows you can ship, not just code", "non_obvious_tip": "Add analytics and monitoring — mentioning 'I tracked 500 daily active users' in interviews is powerful"},
                    {"order": 2, "skill_name": "System Design Basics", "resource_name": "System Design Primer", "resource_url": "https://github.com/donnemartin/system-design-primer", "is_free": True, "estimated_hours": 30, "project_to_build": "Design Twitter/WhatsApp on paper", "why_companies_care": "Required for SDE-1 at top companies, differentiator at mid companies", "non_obvious_tip": "Start every design with requirements → estimation → API → schema → architecture. This structure impresses interviewers."},
                ]
            }
        ]
    }


def _mock_interview_prep(company: str, role: str) -> dict:
    return {
        "company": company,
        "role": role,
        "overall_difficulty": 4,
        "expected_rounds": [
            {"round": 1, "type": "Online Assessment", "duration": "90 min", "description": "2-3 coding problems + MCQs", "topics": ["DSA", "Aptitude"]},
            {"round": 2, "type": "Technical Interview 1", "duration": "45 min", "description": "Live coding + DSA discussion", "topics": ["Arrays", "Trees", "DP"]},
            {"round": 3, "type": "Technical Interview 2", "duration": "45 min", "description": "System design + project discussion", "topics": ["System Design", "Projects"]},
            {"round": 4, "type": "HR/Behavioral", "duration": "30 min", "description": "Culture fit and behavioral questions", "topics": ["Teamwork", "Conflict Resolution"]}
        ],
        "must_know_topics": ["Arrays & Strings", "Binary Search", "Trees & Graphs", "Dynamic Programming", "System Design basics"],
        "frequently_asked_questions": [
            {"question": "Two Sum / Three Sum variations", "category": "DSA", "difficulty": "easy", "hint": "Use hash map for O(n)"},
            {"question": "Design a URL shortener", "category": "System Design", "difficulty": "medium", "hint": "Focus on hashing, database choice, and scaling"},
            {"question": "Tell me about a challenging project", "category": "Behavioral", "difficulty": "easy", "hint": "Use STAR format: Situation, Task, Action, Result"},
        ],
        "preparation_plan": {
            "1_week_before": ["Solve company-tagged problems on LeetCode", "Review system design fundamentals", "Prepare 3 STAR stories"],
            "day_before": ["Light revision only", "Review your resume", "Prepare questions to ask interviewer"],
            "day_of": ["Test your setup (camera/mic)", "Keep water and paper handy", "Join 5 min early"]
        },
        "insider_tips": [f"Focus on {company}'s core tech stack", "Interviewers value thought process over correct answer", "Ask clarifying questions before coding"],
        "common_mistakes": ["Jumping to code without discussing approach", "Not handling edge cases", "Not asking about time/space complexity requirements"],
        "resources": [
            {"name": "LeetCode Company Tag", "url": "https://leetcode.com/company/", "type": "practice"},
            {"name": "Glassdoor Interview Reviews", "url": "https://glassdoor.co.in", "type": "article"}
        ]
    }


def _mock_reroute_options():
    return {
        "trigger_reason": "milestone_missed",
        "options": [
            {
                "option_name": "Recovery",
                "description": "You missed 2 weeks, but that's okay. Here's a plan to catch up.",
                "weeks_added_or_removed": 2,
                "placement_readiness_date": "August 2026",
                "what_changes": ["Python basics compressed to 2 weeks (was 4)", "DSA starts immediately alongside"],
                "what_stays_same": ["System Design module unchanged", "Final project deadline same"],
                "honest_warning": "You need 12 hrs/week consistently for this to work",
                "probability_of_completion": "high",
                "intensity_level": "moderate"
            },
            {
                "option_name": "Adjusted Pace",
                "description": "Rebuild the roadmap around your real schedule. No shame in taking longer.",
                "weeks_added_or_removed": 6,
                "placement_readiness_date": "October 2026",
                "what_changes": ["Timeline extended 6 weeks", "More breathing room between modules"],
                "what_stays_same": ["Every core milestone intact", "Same quality, same depth"],
                "honest_warning": "If placements are in September, you might not be fully ready. Consider off-campus options.",
                "probability_of_completion": "very_high",
                "intensity_level": "relaxed"
            },
            {
                "option_name": "Sprint",
                "description": "2-week intensive bootcamp mode. Only if you have zero other commitments.",
                "weeks_added_or_removed": -4,
                "placement_readiness_date": "July 2026",
                "what_changes": ["4 hours/day coding, no exceptions", "Daily milestone checkpoints"],
                "what_stays_same": ["Same target outcome", "Same career goal"],
                "honest_warning": "This is genuinely hard. Don't pick this unless you can commit 4 hrs/day for 2 weeks.",
                "probability_of_completion": "medium",
                "intensity_level": "intensive"
            }
        ],
        "encouragement": "Missing a week doesn't mean you've failed — it means you're human. The roadmap adapts to you, not the other way around."
    }


def _mock_parent_report(student_profile: dict):
    name = student_profile.get("display_name", "Your child")
    return {
        "student_name": name.split(" ")[0] if name else "Student",
        "week_label": "Week of February 23, 2026",
        "weekly_summary": {
            "problems_solved": 8,
            "modules_completed": 1,
            "streak_days": 12,
            "hours_spent": 6
        },
        "placement_readiness": {
            "percentage": 62,
            "change_from_last_week": 4,
            "target_role": student_profile.get("target_role", "Software Engineer"),
            "readiness_label": "On Track"
        },
        "this_weeks_focus": f"{name.split(' ')[0] if name else 'Student'} worked on coding problems and completed a module on data structures. They are building the skills needed for tech company interviews.",
        "next_milestone": "Complete 20 more practice problems by March 2. This prepares them for the problem-solving round in interviews.",
        "career_brief": {
            "career_name": "Software Engineer at a tech company",
            "what_they_do": "Build and maintain the software and apps used by thousands of people daily",
            "salary_reality": "₹8-18 LPA in the first 3 years (this is the real take-home, not inflated CTC numbers)",
            "job_security": "Very stable career — there are more job openings than qualified candidates in India",
            "typical_locations": "Bangalore, Pune, Hyderabad, Chennai",
            "parent_concerns_answered": [
                "Is this a stable career? Yes — tech companies are actively hiring.",
                "What does my child do all day? They write code that powers apps and websites."
            ]
        },
        "is_on_track": "YES",
        "reason_if_not_on_track": "",
        "positive_highlight": f"{name.split(' ')[0] if name else 'Student'} has been consistent for 12 days straight — this kind of discipline is exactly what companies look for."
    }


def _mock_salary_truth(ctc_lpa: float, city: str):
    monthly_gross = round(ctc_lpa * 100000 / 12)
    basic = round(monthly_gross * 0.4)
    hra = round(monthly_gross * 0.2)
    special = round(monthly_gross * 0.25)
    pf = round(basic * 0.12)
    tax = round(monthly_gross * 0.08)
    net = monthly_gross - pf - tax

    return {
        "ctc_lpa": ctc_lpa,
        "monthly_inhand": f"₹{net:,.0f}",
        "monthly_breakdown": {
            "basic": f"₹{basic:,.0f}",
            "hra": f"₹{hra:,.0f}",
            "special_allowance": f"₹{special:,.0f}",
            "pf_deduction": f"₹{pf:,.0f}",
            "income_tax_monthly": f"₹{tax:,.0f}",
            "net_monthly": f"₹{net:,.0f}"
        },
        "is_good_offer": ctc_lpa >= 6,
        "percentile_vs_similar": f"{'Top 30%' if ctc_lpa >= 10 else 'Average' if ctc_lpa >= 5 else 'Below average'} for freshers in {city}",
        "median_offer_lpa": 7.5,
        "cost_of_living": {
            "rent_1bhk": f"₹{'15,000' if city.lower() in ['bangalore', 'mumbai', 'delhi'] else '8,000'}",
            "food_monthly": "₹6,000",
            "transport": "₹3,000",
            "savings_possible": f"₹{max(0, net - 24000):,.0f}/month"
        },
        "growth_trajectory": f"At ₹{ctc_lpa} LPA, expect ₹{round(ctc_lpa * 2.5, 1)} LPA in 3-4 years with good performance",
        "honest_verdict": f"For a fresher in {city}, ₹{ctc_lpa} LPA is {'solid' if ctc_lpa >= 8 else 'decent' if ctc_lpa >= 5 else 'below market'}. Focus on skill growth — your second job jump is where real salary growth happens."
    }

