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
            cleaned = cleaned.replace(/```$/, "").trim();
        }
        return JSON.parse(cleaned);
    } catch { return null; }
}

export async function analyzeAssessment(answers: Record<string, number>): Promise<Record<string, unknown>> {
    const prompt = `You are an expert career counselor AI for Indian students.
Analyze these psychometric assessment answers and provide career guidance.
Assessment Answers: ${JSON.stringify(answers)}
Return a JSON response with this EXACT structure (no markdown, just raw JSON):
{
  "personality_summary": "2-3 sentence personality description",
  "strengths": ["strength1", "strength2", "strength3", "strength4", "strength5"],
  "work_style": "description of ideal work environment",
  "top_careers": [
    {"title": "Career Title", "match_score": 92, "why": "Why this matches", "avg_salary": "₹X-Y LPA", "growth": "high/medium/low", "education_path": "Required education", "top_skills": ["skill1", "skill2", "skill3"]}
  ],
  "personality_traits": {"analytical": 75, "creative": 60, "social": 45, "enterprising": 80, "conventional": 30, "realistic": 55},
  "advice": "Personalized career advice paragraph"
}
Provide exactly 5 careers. Focus on Indian job market. Use Indian Rupees (LPA format).`;

    const raw = await askGemini(prompt);
    if (raw) {
        const parsed = parseJSON(raw);
        if (parsed) return parsed;
    }
    return mockAssessmentResults();
}

export async function analyzeSkillGap(currentSkills: string[], targetCareer: string): Promise<Record<string, unknown>> {
    const prompt = `You are an expert career advisor for Indian students.
Current skills: ${JSON.stringify(currentSkills)}
Target career: ${targetCareer}
Analyze the skill gap and return JSON (no markdown):
{
  "target_career": "${targetCareer}",
  "required_skills": [{"skill": "Skill Name", "importance": "critical/important/nice_to_have", "has": true/false}],
  "skill_match_percentage": 45,
  "missing_critical": ["skill1", "skill2"],
  "learning_path": [{"step": 1, "skill": "Skill", "resource": "Resource name & link", "duration": "2 weeks", "type": "course/project/certification", "free": true}],
  "timeline_months": 6,
  "estimated_readiness": "With consistent effort, you can be job-ready in X months.",
  "quick_wins": ["action1", "action2", "action3"]
}
Be specific. Use Indian resources (NPTEL, Coursera, etc). Provide 5-8 learning steps.`;

    const raw = await askGemini(prompt);
    if (raw) { const parsed = parseJSON(raw); if (parsed) return parsed; }
    return mockSkillGap(currentSkills, targetCareer);
}

export async function careerChat(message: string, history: { role: string; content: string }[]): Promise<string> {
    const historyStr = history.slice(-6).map(m => `${m.role}: ${m.content}`).join("\n");
    const prompt = `You are an expert AI career counselor for Indian students. Be helpful, specific, and data-driven. Focus on Indian job market.
${historyStr ? `Previous conversation:\n${historyStr}\n` : ""}
User: ${message}
Respond with practical, specific career advice. Keep it under 300 words.`;

    const raw = await askGemini(prompt);
    return raw || "I'm here to help with your career questions! I can advise on career paths, skills needed, salary expectations, and more. What would you like to know?";
}

function mockAssessmentResults(): Record<string, unknown> {
    return {
        personality_summary: "You are a highly analytical and technically inclined individual with strong problem-solving abilities. You thrive in environments that challenge your intellect and value continuous learning.",
        strengths: ["Analytical Thinking", "Problem Solving", "Technical Aptitude", "Systematic Approach", "Continuous Learning"],
        work_style: "You prefer structured environments with clear goals and the freedom to solve complex problems independently.",
        top_careers: [
            { title: "Software Developer", match_score: 92, why: "Your analytical nature and technical aptitude make software development a natural fit.", avg_salary: "₹6-25 LPA", growth: "high", education_path: "B.Tech CS / BCA + practice", top_skills: ["Programming", "Data Structures", "System Design"] },
            { title: "Data Scientist", match_score: 88, why: "Your love for data and analytical thinking aligns perfectly with data science.", avg_salary: "₹8-35 LPA", growth: "high", education_path: "B.Tech/M.Tech + ML courses", top_skills: ["Python", "Machine Learning", "Statistics"] },
            { title: "AI/ML Engineer", match_score: 85, why: "Combines your technical skills with cutting-edge AI technology.", avg_salary: "₹10-40 LPA", growth: "high", education_path: "M.Tech AI/ML", top_skills: ["Deep Learning", "Python", "Mathematics"] },
            { title: "Product Manager", match_score: 78, why: "Your systematic approach and analytical skills translate well to product management.", avg_salary: "₹12-40 LPA", growth: "high", education_path: "B.Tech + MBA", top_skills: ["Strategy", "Analytics", "Communication"] },
            { title: "Cybersecurity Analyst", match_score: 75, why: "Your problem-solving skills and attention to detail suit cybersecurity.", avg_salary: "₹6-25 LPA", growth: "high", education_path: "B.Tech CS + certifications", top_skills: ["Network Security", "Python", "Incident Response"] },
        ],
        personality_traits: { analytical: 85, creative: 55, social: 45, enterprising: 65, conventional: 50, realistic: 60 },
        advice: "Your profile strongly suggests careers in technology and data. Consider pursuing a B.Tech in Computer Science or related field. Start building projects early — contribute to open source, participate in hackathons, and develop a strong GitHub portfolio. The Indian tech industry values practical skills alongside academic credentials."
    };
}

function mockSkillGap(currentSkills: string[], targetCareer: string): Record<string, unknown> {
    const requiredSkills = [
        { skill: "Python Programming", importance: "critical", has: currentSkills.some(s => s.toLowerCase().includes("python")) },
        { skill: "Data Structures & Algorithms", importance: "critical", has: currentSkills.some(s => s.toLowerCase().includes("dsa") || s.toLowerCase().includes("algorithm")) },
        { skill: "System Design", importance: "important", has: currentSkills.some(s => s.toLowerCase().includes("system")) },
        { skill: "Git & Version Control", importance: "important", has: currentSkills.some(s => s.toLowerCase().includes("git")) },
        { skill: "Communication Skills", importance: "nice_to_have", has: currentSkills.some(s => s.toLowerCase().includes("communication")) },
    ];
    const matched = requiredSkills.filter(s => s.has).length;
    return {
        target_career: targetCareer,
        required_skills: requiredSkills,
        skill_match_percentage: Math.round((matched / requiredSkills.length) * 100),
        missing_critical: requiredSkills.filter(s => !s.has && s.importance === "critical").map(s => s.skill),
        learning_path: [
            { step: 1, skill: "Python Fundamentals", resource: "NPTEL Python for Data Science", duration: "4 weeks", type: "course", free: true },
            { step: 2, skill: "Data Structures", resource: "GeeksforGeeks DSA Self-Paced", duration: "6 weeks", type: "course", free: false },
            { step: 3, skill: "Projects", resource: "Build 3 real-world projects on GitHub", duration: "4 weeks", type: "project", free: true },
            { step: 4, skill: "System Design", resource: "System Design Primer (GitHub)", duration: "3 weeks", type: "course", free: true },
            { step: 5, skill: "Interview Prep", resource: "LeetCode + Mock Interviews", duration: "4 weeks", type: "practice", free: true },
        ],
        timeline_months: 5,
        estimated_readiness: `With consistent effort of 2-3 hours daily, you can be ready for ${targetCareer} roles in approximately 5 months.`,
        quick_wins: ["Create a GitHub profile and push your first project today", "Start solving 2 coding problems daily on LeetCode", "Join a tech community on Discord or LinkedIn"],
    };
}
