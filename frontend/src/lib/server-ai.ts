import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GOOGLE_API_KEY || "";
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

async function askGemini(prompt: string): Promise<string | null> {
    if (!genAI) return null;
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (e) {
        console.error("Gemini error:", e);
        return null;
    }
}

function parseJSON(text: string): Record<string, unknown> | null {
    try {
        let cleaned = text.trim();
        if (cleaned.startsWith("```")) {
            cleaned = cleaned.split("\n").slice(1).join("\n");
            cleaned = cleaned.replace(/```\s*$/, "").trim();
        }
        return JSON.parse(cleaned);
    } catch { return null; }
}

// ─── MASTER PERSONA ─────────────────────────────────────────
const MASTER_PERSONA = `You are SkillSync's AI Career Counselor — a trusted guide for Indian students aged 16-25.
Your personality is the combination of:
- A brilliant older sibling who took the unconventional path and succeeded
- A data scientist who knows the India job market cold
- A psychologist who understands the unique pressures of Indian families and education

Your communication principles:
1. HONEST BEFORE HOPEFUL — Never give false comfort. A hard truth delivered kindly is worth more than 100 encouragements.
2. SPECIFIC BEFORE GENERAL — "Apply to 3 specific companies" beats "Apply to companies."
3. INDIA-FIRST — All salary data in LPA. All examples from Indian context. Reference real Indian companies, colleges, cities.
4. ACKNOWLEDGE THE UNSAID — Indian students carry family pressure, financial anxiety, comparison stress. Acknowledge this without being preachy.
5. NEXT ACTION FOCUSED — End every substantive response with one specific, time-bound action the student can take today or this week.

Avoid: Western-centric career advice, Toxic positivity ("You can do anything!"), Vague advice ("Work hard and you'll succeed"), Making the student feel judged for their background or college.
Tone: Warm, direct, data-backed, never condescending.`;

// ─── 4D ASSESSMENT ANALYSIS ─────────────────────────────────
export async function analyzeAssessment(answers: Record<string, number>): Promise<Record<string, unknown>> {
    const prompt = `${MASTER_PERSONA}

You are analyzing a 4D psychometric assessment response from an Indian student.

The 4 Dimensions measured:
1. Intelligence Profile (how they think — logical, linguistic, spatial, interpersonal, intrapersonal, naturalistic)
2. Work Energy Profile (people vs ideas, structure vs ambiguity, burst vs deep-focus, leadership vs expertise)
3. Values Compass (security vs risk, impact vs income, independence vs stability, creative vs process)
4. Circumstance Reality Check (academic standing, finances, location, family, English proficiency)

Assessment Answers: ${JSON.stringify(answers)}

Your job is to produce a Career Profile Report that is:
- BRUTALLY HONEST — If the data suggests a mismatch between aspirations and profile, say so gently but clearly.
- MULTI-DIMENSIONAL — Go beyond "you're good at math." Describe the whole person.
- CULTURALLY AWARE — Factor in Indian educational context. A student from a Tier-3 city is NOT less valuable.
- FORWARD-LOOKING — Project 5 career paths with honest probability scores.

Return JSON (no markdown):
{
  "profile_type": "A 2-3 word archetype like 'Analytical Builder' or 'Creative Strategist'",
  "personality_summary": "3-4 sentence description that feels personal and insightful",
  "four_dimensions": {
    "intelligence_profile": {"dominant": "logical-mathematical", "secondary": "interpersonal", "description": "How they think"},
    "work_energy": {"style": "deep-focus builder", "prefers": "structure with creative freedom", "description": "How they work best"},
    "values_compass": {"primary": "impact-driven", "secondary": "growth-oriented", "description": "What drives them"},
    "circumstance_factors": {"strengths": ["strong academics"], "challenges": ["tier-2 city access"], "description": "Their context"}
  },
  "strengths": ["strength1", "strength2", "strength3", "strength4", "strength5"],
  "growth_areas": ["area1", "area2", "area3"],
  "work_style": "Detailed description of ideal work environment",
  "top_careers": [
    {
      "title": "Career Title",
      "match_score": 92,
      "why": "Specific, personal reason why this matches",
      "green_zone": "Natural advantages for this career",
      "yellow_zone": "Skills/effort required",
      "red_zone": "Honest challenges and barriers",
      "avg_salary": "₹X-Y LPA",
      "salary_percentiles": {"bottom_25": "₹X LPA", "median": "₹Y LPA", "top_25": "₹Z LPA"},
      "growth": "high/medium/low",
      "timeline_to_first_job": "X months/years",
      "education_path": "Specific education needed",
      "top_skills": ["skill1", "skill2", "skill3"],
      "top_companies_india": ["Company1", "Company2", "Company3"]
    }
  ],
  "personality_traits": {"analytical": 85, "creative": 55, "social": 45, "enterprising": 65, "conventional": 50, "realistic": 60},
  "advice": "Personalized career advice paragraph — honest, warm, specific, ending with one action for this week",
  "surprising_insight": "One unexpected career-relevant insight about their profile they wouldn't have expected"
}

Provide exactly 5 careers. Focus on Indian job market. Use ₹ LPA format. Be honest about challenges.`;

    const raw = await askGemini(prompt);
    if (raw) { const parsed = parseJSON(raw); if (parsed) return parsed; }
    return mockAssessmentResults();
}

// ─── SKILL GAP ANALYSIS ─────────────────────────────────────
export async function analyzeSkillGap(currentSkills: string[], targetCareer: string): Promise<Record<string, unknown>> {
    const prompt = `${MASTER_PERSONA}

A student has told you their current skills and target career. Produce a Personalized Learning Roadmap.

Current skills: ${JSON.stringify(currentSkills)}
Target career: ${targetCareer}

Rules:
1. BE REALISTIC ABOUT TIME — If closing this gap takes 18 months, say 18 months.
2. FREE RESOURCES FIRST — Most Indian students cannot afford $50/month subscriptions. Lead with free options (NPTEL, YouTube, GitHub, freeCodeCamp, Coursera audits).
3. SEQUENCE MATTERS — Don't give a list. Give a sequence. What must be learned before what.
4. PROJECTS OVER COURSES — For every topic, suggest one project that proves mastery.
5. WEEKLY STRUCTURE — Break the roadmap into weekly sprints realistic for a college student.
6. THE NON-OBVIOUS RESOURCES — Include unexpected, high-value resources most students don't know about.

Return JSON (no markdown):
{
  "target_career": "${targetCareer}",
  "required_skills": [{"skill": "Name", "importance": "critical/important/nice_to_have", "has": true/false}],
  "skill_match_percentage": 45,
  "missing_critical": ["skill1", "skill2"],
  "learning_path": [
    {"step": 1, "skill": "Skill", "resource": "Specific resource name & link", "duration": "2 weeks", "type": "course/project/certification", "free": true, "project_proof": "Build X to prove mastery", "phase": "Foundation/Core/Advanced/Visibility"}
  ],
  "timeline_months": 6,
  "estimated_readiness": "Honest timeline assessment with specific conditions",
  "quick_wins": ["Specific action 1 for today", "action 2", "action 3"],
  "non_obvious_tips": ["One insight most students miss", "Another unexpected advantage"],
  "weekly_hours_needed": 15
}
Provide 6-10 learning steps across 4 phases. Be specific about Indian resources.`;

    const raw = await askGemini(prompt);
    if (raw) { const parsed = parseJSON(raw); if (parsed) return parsed; }
    return mockSkillGap(currentSkills, targetCareer);
}

// ─── CAREER CHAT ─────────────────────────────────────────────
export async function careerChat(message: string, history: { role: string; content: string }[]): Promise<string> {
    const historyStr = history.slice(-8).map(m => `${m.role}: ${m.content}`).join("\n");
    const prompt = `${MASTER_PERSONA}

You are a 24/7 AI career counselor for Indian students. Students come to you with questions, anxieties, confusion, and sometimes just venting.

Response guidelines:
- SHORT ANSWERS for simple questions. Don't pad.
- STRUCTURED ANSWERS (with headers) for complex questions.
- EMPATHY FIRST when emotional content is present ("I failed my placement test" → acknowledge before advising)
- NEVER DISMISS family pressure concerns — acknowledge that it's real, and help students navigate it, not fight it
- PROACTIVELY ASK clarifying questions to give better advice
- India context always: AMCAT, eLitmus, Naukri, AngelList India, Internshala
- End every conversation with a "Suggested next step" — one specific action.

${historyStr ? `Previous conversation:\n${historyStr}\n` : ""}
User: ${message}

Respond with practical, specific career advice. Keep it under 400 words. Use Indian context.`;

    const raw = await askGemini(prompt);
    return raw || "I'm here to help with your career questions! I can advise on career paths, skills needed, salary expectations in India, and more. What would you like to know?";
}

// ─── SALARY NEGOTIATION SIMULATOR ────────────────────────────
export async function negotiationSimulator(scenario: { role: string; company_type: string; offer: string; experience: string; student_message: string }, history: { role: string; content: string }[]): Promise<Record<string, unknown>> {
    const historyStr = history.map(m => `${m.role}: ${m.content}`).join("\n");
    const prompt = `${MASTER_PERSONA}

You are simulating a salary negotiation for an Indian student/fresher. Act as the HR recruiter.

Scenario:
- Role: ${scenario.role}
- Company type: ${scenario.company_type}
- Initial offer: ${scenario.offer}
- Candidate experience: ${scenario.experience}

${historyStr ? `Conversation so far:\n${historyStr}\n` : ""}
Candidate says: "${scenario.student_message}"

Respond as the HR recruiter would — realistic, professional, sometimes pushing back.
Also provide coaching feedback on what the candidate did well/poorly.

Return JSON:
{
  "recruiter_response": "What the HR says next",
  "coaching_feedback": "What they did well and what to improve",
  "tip": "One specific negotiation tip for Indian context",
  "negotiation_score": 65,
  "is_final_offer": false
}`;

    const raw = await askGemini(prompt);
    if (raw) { const parsed = parseJSON(raw); if (parsed) return parsed; }
    return {
        recruiter_response: "That's an interesting point. Let me discuss this with my team and get back to you. Is there anything else you'd like to discuss about the role?",
        coaching_feedback: "Good start! You mentioned your value clearly. Next time, try asking about the complete compensation structure before discussing base salary.",
        tip: "In India, always ask about the variable pay structure — many companies offer 10-20% as variable which is often guaranteed in the first year.",
        negotiation_score: 55,
        is_final_offer: false,
    };
}

// ─── COLLEGE ROI CALCULATOR ──────────────────────────────────
export async function calculateCollegeROI(data: { college: string; course: string; annual_fee: number; duration_years: number; city: string }): Promise<Record<string, unknown>> {
    const prompt = `${MASTER_PERSONA}

A student wants to know the ROI of their education investment.

Details:
- College: ${data.college}
- Course: ${data.course}
- Annual Fee: ₹${data.annual_fee.toLocaleString()}
- Duration: ${data.duration_years} years
- City: ${data.city}

Provide an honest, data-based ROI analysis. Return JSON:
{
  "total_investment": "₹X lakhs (fees + living costs estimate)",
  "expected_salary_year1": {"bottom_25": "₹X LPA", "median": "₹Y LPA", "top_25": "₹Z LPA"},
  "break_even_months": 30,
  "roi_5_year": "X% return on investment",
  "placement_rate_estimate": "XX% (with confidence note)",
  "alternatives": [
    {"option": "Alternative path", "cost": "₹X", "expected_outcome": "description", "time": "X years"}
  ],
  "loan_simulation": {"monthly_emi": "₹X", "loan_duration_years": 5, "total_interest": "₹X"},
  "verdict": "Honest 2-3 sentence verdict — is this worth it?",
  "hidden_costs": ["Cost students forget 1", "Cost 2"],
  "tips": ["Money-saving tip 1", "tip 2"]
}
Be honest. If the ROI is poor, say so clearly but constructively.`;

    const raw = await askGemini(prompt);
    if (raw) { const parsed = parseJSON(raw); if (parsed) return parsed; }
    return mockCollegeROI(data);
}

// ─── CAREER SIMULATOR ────────────────────────────────────────
export async function simulateCareerDay(career: string, step: number, choice?: string): Promise<Record<string, unknown>> {
    const prompt = `${MASTER_PERSONA}

Create step ${step} of a "Day in the Life" interactive simulation for: ${career} in India.
${choice ? `The student chose: "${choice}" in the previous step.` : "This is the start of the day."}

Create a realistic scenario with a decision point. Return JSON:
{
  "time": "9:30 AM",
  "scenario": "Vivid 2-3 sentence description of what's happening",
  "feeling_check": "How does this typically feel? (energizing/neutral/draining)",
  "choices": [
    {"text": "Choice A description", "trait": "leadership/analytical/creative/social"},
    {"text": "Choice B description", "trait": "different_trait"},
    {"text": "Choice C description", "trait": "another_trait"}
  ],
  "reality_note": "One honest fact about this aspect of the job that most people don't know",
  "is_last_step": ${step >= 6}
  ${step >= 6 ? ',"day_summary": "Summary of what this day reveals about the career", "fit_indicators": {"energized_by": ["aspect1"], "drained_by": ["aspect2"], "surprised_by": ["aspect3"]}' : ""}
}`;

    const raw = await askGemini(prompt);
    if (raw) { const parsed = parseJSON(raw); if (parsed) return parsed; }
    return mockCareerSimulation(career, step);
}

// ─── PARENT TOOLKIT ──────────────────────────────────────────
export async function generateParentReport(assessmentResults: Record<string, unknown>, childName: string): Promise<Record<string, unknown>> {
    const prompt = `${MASTER_PERSONA}

Generate a "Parent Report" — a clear, respectful summary of a child's career assessment results designed for Indian parents.

Child's name: ${childName}
Assessment results: ${JSON.stringify(assessmentResults)}

The report should:
- Be respectful and not condescending toward parents
- Use data to support recommendations (parents trust numbers)
- Address common parental concerns (job security, salary, social status)
- Acknowledge that parents want the best for their child
- Show that the recommended path has real demand and good outcomes

Return JSON:
{
  "greeting": "Respectful opening addressing the parent",
  "child_strengths": ["Strength described in parent-friendly language"],
  "recommended_careers": [
    {"career": "Title", "why_good_fit": "Parent-friendly explanation", "job_security": "High/Medium", "salary_potential": "₹X-Y LPA by year 5", "companies_hiring": ["Name1", "Name2"], "success_stories": "Brief anonymized example"}
  ],
  "common_concerns_addressed": [
    {"concern": "Is this a stable career?", "answer": "Data-backed honest answer"},
    {"concern": "What will society think?", "answer": "Reframed positively"}
  ],
  "conversation_starters": ["A gentle way to discuss this with your child"],
  "faqs": [{"q": "Question parents ask", "a": "Clear answer"}],
  "next_steps_for_parents": ["Supportive action 1", "action 2"]
}`;

    const raw = await askGemini(prompt);
    if (raw) { const parsed = parseJSON(raw); if (parsed) return parsed; }
    return mockParentReport(childName);
}

// ─── MOCK FALLBACKS ──────────────────────────────────────────

function mockAssessmentResults(): Record<string, unknown> {
    return {
        profile_type: "Analytical Builder",
        personality_summary: "You are a highly analytical and technically inclined individual who gets deep satisfaction from creating systems that solve complex problems. You think in logical patterns and prefer depth over breadth. Your combination of technical aptitude and quiet determination makes you well-suited for roles where you can build and optimize.",
        four_dimensions: {
            intelligence_profile: { dominant: "logical-mathematical", secondary: "intrapersonal", description: "You think in systems and patterns. You're strongest when analyzing data and building logical solutions." },
            work_energy: { style: "deep-focus builder", prefers: "structure with creative freedom", description: "You do your best work in focused blocks with minimal interruption. Too many meetings drain you." },
            values_compass: { primary: "growth-oriented", secondary: "impact-driven", description: "You're motivated by mastery and seeing the tangible impact of your work." },
            circumstance_factors: { strengths: ["Strong technical foundation", "High self-motivation"], challenges: ["Limited industry exposure", "Networking gaps"], description: "Your academic foundation is solid. Focus on building real-world projects and industry connections." }
        },
        strengths: ["Analytical Thinking", "Problem Solving", "Technical Aptitude", "Self-Directed Learning", "Systematic Approach"],
        growth_areas: ["Networking & Communication", "Leadership in group settings", "Dealing with ambiguity"],
        work_style: "You thrive in environments with clear goals but flexible methods. Ideal: a role where you solve complex problems independently, with periodic collaboration.",
        top_careers: [
            { title: "Software Developer", match_score: 92, why: "Your analytical nature and love for building systems make software development a natural fit.", green_zone: "Strong logical thinking, enjoy problem-solving, self-motivated learner", yellow_zone: "Need to build portfolio projects and learn system design", red_zone: "Competitive field — requires consistent upskilling. Initial salaries at service companies may be modest.", avg_salary: "₹6-25 LPA", salary_percentiles: { bottom_25: "₹4.2 LPA", median: "₹7.8 LPA", top_25: "₹14 LPA" }, growth: "high", timeline_to_first_job: "6-12 months with focused preparation", education_path: "B.Tech CS or equivalent + strong portfolio", top_skills: ["DSA", "System Design", "Full Stack"], top_companies_india: ["Google", "Microsoft", "Flipkart", "Razorpay"] },
            { title: "Data Scientist", match_score: 88, why: "Your love for patterns and data aligns perfectly with data science.", green_zone: "Mathematical thinking, analytical mindset, attention to detail", yellow_zone: "Need ML/DL skills, statistics depth, and domain knowledge", red_zone: "Overhyped field — entry is competitive. Many 'data scientist' roles are actually analyst roles.", avg_salary: "₹8-35 LPA", salary_percentiles: { bottom_25: "₹5.5 LPA", median: "₹10 LPA", top_25: "₹20 LPA" }, growth: "high", timeline_to_first_job: "8-14 months", education_path: "B.Tech/M.Tech + Kaggle projects", top_skills: ["Python", "ML", "Statistics", "SQL"], top_companies_india: ["Amazon", "Flipkart", "Swiggy", "PhonePe"] },
            { title: "AI/ML Engineer", match_score: 85, why: "Combines your technical depth with cutting-edge technology.", green_zone: "Strong math foundation, programming aptitude", yellow_zone: "Requires deep learning expertise and research papers understanding", red_zone: "Most AI roles require M.Tech/MS minimum. Pure AI roles are fewer than advertised.", avg_salary: "₹10-40 LPA", salary_percentiles: { bottom_25: "₹8 LPA", median: "₹15 LPA", top_25: "₹30 LPA" }, growth: "high", timeline_to_first_job: "12-18 months", education_path: "M.Tech AI/ML or strong self-study + publications", top_skills: ["PyTorch", "Deep Learning", "Mathematics"], top_companies_india: ["Google DeepMind", "Microsoft Research", "NVIDIA"] },
            { title: "Product Manager", match_score: 78, why: "Your systematic approach translates well — but you'll need to develop people skills.", green_zone: "Analytical thinking, structured problem-solving", yellow_zone: "Need strong communication, user empathy, and business sense", red_zone: "PM roles at good companies are extremely competitive for freshers. Most paths require 2-3 years of engineering first.", avg_salary: "₹12-40 LPA", salary_percentiles: { bottom_25: "₹8 LPA", median: "₹18 LPA", top_25: "₹35 LPA" }, growth: "high", timeline_to_first_job: "2-3 years (usually after engineering experience)", education_path: "B.Tech + MBA or APM programs", top_skills: ["Analytics", "Strategy", "Communication"], top_companies_india: ["Razorpay", "CRED", "Swiggy", "Google"] },
            { title: "Cybersecurity Analyst", match_score: 75, why: "Your attention to detail and problem-solving suit security work.", green_zone: "Logical thinking, enjoy finding flaws in systems", yellow_zone: "Need networking knowledge, security tools, and certifications", red_zone: "Requires continuous learning as threats evolve daily. On-call duties are common.", avg_salary: "₹6-25 LPA", salary_percentiles: { bottom_25: "₹4.5 LPA", median: "₹8 LPA", top_25: "₹18 LPA" }, growth: "high", timeline_to_first_job: "8-12 months with CEH/CompTIA", education_path: "B.Tech CS + security certifications", top_skills: ["Network Security", "SIEM", "Python"], top_companies_india: ["Palo Alto", "CrowdStrike", "Deloitte"] },
        ],
        personality_traits: { analytical: 85, creative: 55, social: 45, enterprising: 65, conventional: 50, realistic: 60 },
        advice: "Your profile strongly suggests careers in technology. Here's the honest truth: your analytical strength is your biggest asset, but the gap between 'good with logic' and 'gets hired at a product company' is filled with projects, DSA practice, and system design knowledge. Don't just take courses — build things. Your action for this week: Create a GitHub profile and push one project. Even a simple one. That single action puts you ahead of 70% of students who only have certificates.",
        surprising_insight: "Your intrapersonal intelligence is unusually high — you process and learn best through self-reflection. Most students with your profile thrive with self-paced learning over classroom instruction. Consider structured self-study programs over coaching classes — you'll learn faster and save money."
    };
}

function mockSkillGap(currentSkills: string[], targetCareer: string): Record<string, unknown> {
    const hasSkill = (keyword: string) => currentSkills.some(s => s.toLowerCase().includes(keyword.toLowerCase()));
    const requiredSkills = [
        { skill: "Python Programming", importance: "critical", has: hasSkill("python") },
        { skill: "Data Structures & Algorithms", importance: "critical", has: hasSkill("dsa") || hasSkill("algorithm") || hasSkill("data structure") },
        { skill: "System Design", importance: "important", has: hasSkill("system") },
        { skill: "Git & Version Control", importance: "important", has: hasSkill("git") },
        { skill: "SQL & Databases", importance: "important", has: hasSkill("sql") || hasSkill("database") },
        { skill: "Problem Solving", importance: "critical", has: hasSkill("problem") || hasSkill("competitive") },
        { skill: "Communication Skills", importance: "nice_to_have", has: hasSkill("communication") },
    ];
    const matched = requiredSkills.filter(s => s.has).length;
    return {
        target_career: targetCareer,
        required_skills: requiredSkills,
        skill_match_percentage: Math.round((matched / requiredSkills.length) * 100),
        missing_critical: requiredSkills.filter(s => !s.has && s.importance === "critical").map(s => s.skill),
        learning_path: [
            { step: 1, skill: "Python Fundamentals", resource: "NPTEL Python for Data Science (Free, IIT Madras)", duration: "4 weeks", type: "course", free: true, project_proof: "Build a CLI expense tracker with file I/O", phase: "Foundation" },
            { step: 2, skill: "Data Structures", resource: "Striver's A2Z DSA Sheet (Free, YouTube)", duration: "8 weeks", type: "course", free: true, project_proof: "Solve 150 problems across all pattern types", phase: "Foundation" },
            { step: 3, skill: "SQL & Databases", resource: "SQLBolt (Free) + Mode Analytics SQL Tutorial", duration: "2 weeks", type: "course", free: true, project_proof: "Design a database schema for a food delivery app", phase: "Core" },
            { step: 4, skill: "Git & GitHub", resource: "GitHub Skills (Free interactive courses)", duration: "1 week", type: "course", free: true, project_proof: "Contribute to one open-source project", phase: "Core" },
            { step: 5, skill: "Build 3 Projects", resource: "Build projects relevant to target role", duration: "6 weeks", type: "project", free: true, project_proof: "Full-stack app + API project + domain-specific project", phase: "Advanced" },
            { step: 6, skill: "System Design Basics", resource: "System Design Primer (GitHub — Free)", duration: "3 weeks", type: "course", free: true, project_proof: "Design Twitter/WhatsApp at a whiteboard", phase: "Advanced" },
            { step: 7, skill: "Interview Preparation", resource: "LeetCode (Free tier) + Pramp (Free mock interviews)", duration: "4 weeks", type: "practice", free: true, project_proof: "Complete 3 mock interviews with feedback", phase: "Visibility" },
            { step: 8, skill: "LinkedIn & Portfolio", resource: "Build online presence", duration: "1 week", type: "project", free: true, project_proof: "LinkedIn profile + GitHub portfolio + one technical blog post", phase: "Visibility" },
        ],
        timeline_months: 6,
        estimated_readiness: `With 2-3 hours of daily focused practice, you can be interview-ready for ${targetCareer} roles in approximately 6 months. This assumes consistent effort — missing weeks adds up fast.`,
        quick_wins: [
            "Create a GitHub profile and push your first project TODAY — even a 50-line script counts",
            "Solve 2 easy LeetCode problems right now to build the habit",
            "Follow 5 people in your target role on LinkedIn and study their career paths"
        ],
        non_obvious_tips: [
            "The NPTEL certification from IIT actually carries weight in Indian interviews. Most students ignore it — don't.",
            "Contributing to even one open-source project puts you in the top 5% of Indian engineering graduates. Most don't even try."
        ],
        weekly_hours_needed: 15
    };
}

function mockCollegeROI(data: { college: string; course: string; annual_fee: number; duration_years: number; city: string }): Record<string, unknown> {
    const totalFees = data.annual_fee * data.duration_years;
    const livingCost = data.duration_years * 120000;
    return {
        total_investment: `₹${((totalFees + livingCost) / 100000).toFixed(1)} lakhs (fees + estimated living costs)`,
        expected_salary_year1: { bottom_25: "₹3.5 LPA", median: "₹5.5 LPA", top_25: "₹9 LPA" },
        break_even_months: Math.round((totalFees + livingCost) / (550000 / 12)),
        roi_5_year: "120-180% estimated",
        placement_rate_estimate: "65-75% (varies significantly by branch and year — verify with recent alumni, not college website)",
        alternatives: [
            { option: "Self-learning + certifications + freelancing", cost: "₹50,000-1L", expected_outcome: "Viable for tech roles if you're disciplined, but lacks network and structure", time: "12-18 months" },
            { option: "Government college + competitive prep", cost: "₹2-5L total", expected_outcome: "Better ROI if you clear the entrance, but opportunity cost of prep year", time: "5-6 years" },
        ],
        loan_simulation: { monthly_emi: `₹${Math.round(totalFees * 1.08 / 60).toLocaleString()}`, loan_duration_years: 5, total_interest: `₹${Math.round(totalFees * 0.4 / 100000).toFixed(1)} lakhs` },
        verdict: `At ₹${(data.annual_fee / 100000).toFixed(1)}L/year, this is ${data.annual_fee > 200000 ? "a significant investment. Make sure you supplement academics with projects, internships, and real skills — the degree alone won't guarantee the ROI." : "relatively affordable. Focus on maximizing the experience through projects, internships, and networking."}`,
        hidden_costs: ["Hostel/PG rent increases yearly", "Semester exam fees", "Lab/material fees", "Placement preparation costs", "Laptop and software"],
        tips: ["Apply for merit scholarships every semester", "Start freelancing from year 2 to offset costs", "Use college alumni network — it's the most underused asset"]
    };
}

function mockCareerSimulation(career: string, step: number): Record<string, unknown> {
    const scenarios = [
        { time: "9:00 AM", scenario: `You arrive at the office. Your team lead has called an urgent standup — there's a critical bug in production that's affecting 10,000 users. Your task for the morning just changed.`, feeling_check: "high-pressure but energizing for problem-solvers", choices: [{ text: "Dive straight into debugging the logs", trait: "analytical" }, { text: "Coordinate with the team to divide the investigation", trait: "leadership" }, { text: "Document the issue and communicate status to stakeholders", trait: "communication" }], reality_note: "Production incidents happen regularly. How you handle them defines your reputation faster than any project." },
        { time: "11:00 AM", scenario: `The bug is fixed. Now you're back to your sprint task — building a new feature. The product spec is vague on edge cases. You need to decide how to handle them.`, feeling_check: "neutral — requires focus and decision-making", choices: [{ text: "Make reasonable assumptions and document them", trait: "pragmatic" }, { text: "Schedule a quick call with the PM to clarify before writing code", trait: "thorough" }, { text: "Build the core flow now and handle edge cases in the next sprint", trait: "agile" }], reality_note: "80% of engineering time is spent on edge cases and maintenance, not building shiny new features." },
        { time: "1:30 PM", scenario: `After lunch, you have a code review session. A junior developer's PR has significant issues — the approach works but won't scale and doesn't follow team patterns.`, feeling_check: "requires empathy and technical judgment", choices: [{ text: "Write detailed comments explaining what to change and why", trait: "mentorship" }, { text: "Have a quick pair-programming session to refactor together", trait: "collaborative" }, { text: "Approve with minor comments — they'll learn from experience", trait: "pragmatic" }], reality_note: "Good code review is the most underrated skill. Engineers who review well get promoted faster." },
        { time: "3:00 PM", scenario: `Your manager pings you — there's an opportunity to present your team's work to the engineering director next week. It could increase your visibility significantly.`, feeling_check: "exciting or anxiety-inducing depending on personality", choices: [{ text: "Volunteer immediately — great visibility opportunity", trait: "enterprising" }, { text: "Suggest a joint presentation with your teammate who helped", trait: "collaborative" }, { text: "Politely decline — you'd rather let the work speak for itself", trait: "reserved" }], reality_note: "In Indian tech companies, technical skill gets you hired, but communication and visibility get you promoted." },
        { time: "4:30 PM", scenario: `You have 90 minutes before end of day. You can either finish your sprint task (you're slightly behind) or attend an optional tech talk on a new framework that could be useful for your career growth.`, feeling_check: "tension between immediate deadlines and long-term growth", choices: [{ text: "Finish the sprint task — reliability matters", trait: "conventional" }, { text: "Attend the tech talk — sprint can catch up tomorrow", trait: "growth-oriented" }, { text: "Watch the recording later tonight at home", trait: "disciplined" }], reality_note: "The best engineers protect time for learning. But they also never miss deadlines. Welcome to the balancing act." },
        { time: "6:00 PM", scenario: `Day is ending. Your team lead mentions weekend plans. A coworker invites you to a hackathon this Saturday. Your friend from college wants to catch up. You also haven't exercised all week.`, feeling_check: "work-life balance tension", choices: [{ text: "Join the hackathon — great for learning and networking", trait: "ambitious" }, { text: "Meet your college friend — relationships matter", trait: "social" }, { text: "Take the day off — rest and health come first", trait: "balanced" }], reality_note: "Burnout is real in Indian tech. The smartest career move is sometimes doing nothing career-related." },
    ];

    const s = scenarios[Math.min(step - 1, scenarios.length - 1)];
    return {
        ...s,
        is_last_step: step >= 6,
        ...(step >= 6 ? {
            day_summary: `A day as a ${career} involves constant context-switching between deep technical work, collaboration, communication, and career management. The best in this role master all four — not just the coding.`,
            fit_indicators: {
                energized_by: ["Solving complex problems", "Building things that ship to real users", "Learning new technologies"],
                drained_by: ["Too many meetings", "Vague requirements", "Repetitive maintenance work"],
                surprised_by: ["How much communication matters", "That coding is only 40% of the job", "The importance of code review skills"]
            }
        } : {})
    };
}

function mockParentReport(childName: string): Record<string, unknown> {
    return {
        greeting: `Dear Parent, thank you for taking the time to understand ${childName}'s career assessment results. Your support in their career journey is invaluable.`,
        child_strengths: [
            "Strong analytical and logical thinking ability",
            "Self-motivated learner who can study independently",
            "Good problem-solving skills under pressure",
            "Systematic approach to tasks"
        ],
        recommended_careers: [
            { career: "Software Development", why_good_fit: `${childName} has strong logical thinking and enjoys building things — these are exactly the traits top tech companies look for.`, job_security: "Very High", salary_potential: "₹8-25 LPA by year 5", companies_hiring: ["Google", "Microsoft", "TCS", "Infosys", "Flipkart", "Razorpay"], success_stories: "A student from a similar profile (Tier-2 college, 7.5 CGPA) got placed at Flipkart at ₹14 LPA after 18 months of focused preparation." },
            { career: "Data Science / AI", why_good_fit: "Strong mathematical aptitude combined with curiosity makes this a great fit. This is one of the highest-paid fields globally.", job_security: "High", salary_potential: "₹10-35 LPA by year 5", companies_hiring: ["Amazon", "Google", "Swiggy", "PhonePe", "Mu Sigma"], success_stories: "Data scientists are among the highest-paid professionals in India. Demand exceeds supply by 3x." }
        ],
        common_concerns_addressed: [
            { concern: "Is this a stable career?", answer: "Software and data roles have been growing 25-30% year-over-year in India for the past decade. India's IT industry alone employs 5+ million people. This is among the most stable career paths available." },
            { concern: "What about government jobs?", answer: "Government jobs offer security but the competition ratio is 1:500+. Tech careers offer comparable or better salaries with much higher probability of success. Many tech professionals also have the option of government tech roles (NIC, UIDAI, etc.)." },
            { concern: "Will they get a job?", answer: "With focused preparation (6-12 months of project building + interview prep), employability in tech roles is significantly higher than most other fields. The key is practical skills, not just the degree." }
        ],
        conversation_starters: [
            `"I looked at your career assessment. It shows some really interesting strengths. Can we talk about what you're thinking about your future?"`,
            `"I want to understand what excites you about these career options. Help me see what you see."`,
        ],
        faqs: [
            { q: "How much can they earn starting out?", a: "Starting salaries in tech range from ₹3.5 LPA (service companies) to ₹15+ LPA (product companies). The difference depends on skills and preparation, not just the college name." },
            { q: "Do they need an MBA after B.Tech?", a: "Not necessarily. In tech, skills and experience often matter more than an MBA. Many top professionals skip MBA entirely. However, MBA from a top 20 institute can open management/leadership paths." }
        ],
        next_steps_for_parents: [
            "Support their learning journey — invest in a good laptop and internet connection rather than coaching classes",
            "Encourage project-building over just exam preparation",
            "Connect them with family friends or relatives in tech for mentorship conversations"
        ]
    };
}
