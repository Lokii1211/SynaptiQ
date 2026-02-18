const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

async function request(endpoint: string, options: RequestInit = {}) {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
    });

    if (!res.ok) {
        const error = await res.json().catch(() => ({ detail: "Something went wrong" }));
        throw new Error(error.detail || `HTTP ${res.status}`);
    }

    return res.json();
}

export const api = {
    // Auth
    signup: (data: { email: string; name: string; password: string; age?: number; education_level?: string; city?: string; institution?: string; careerInterest?: string }) =>
        request("/auth/signup", { method: "POST", body: JSON.stringify(data) }),

    login: (data: { email: string; password: string }) =>
        request("/auth/login", { method: "POST", body: JSON.stringify(data) }),

    getMe: () => request("/auth/me"),

    // Assessment
    getQuestions: () => request("/assessment/questions"),

    submitAssessment: (answers: Record<string, number>) =>
        request("/assessment/submit", { method: "POST", body: JSON.stringify({ answers }) }),

    getResults: () => request("/assessment/results"),

    // Careers
    getCareers: (category?: string, search?: string) => {
        const params = new URLSearchParams();
        if (category) params.set("category", category);
        if (search) params.set("search", search);
        const q = params.toString();
        return request(`/careers${q ? `?${q}` : ""}`);
    },

    getCategories: () => request("/careers/categories"),

    getCareerDetail: (slug: string) => request(`/careers/${slug}`),

    // Skills
    skillGapAnalysis: (data: { current_skills: string[]; target_career: string }) =>
        request("/skills/gap-analysis", { method: "POST", body: JSON.stringify(data) }),

    // Resume
    createResume: (data: { content: Record<string, unknown>; target_role: string; template?: string }) =>
        request("/resume/create", { method: "POST", body: JSON.stringify(data) }),

    listResumes: () => request("/resume/list"),

    // Chat
    chat: (data: { message: string; session_id?: string }) =>
        request("/chat", { method: "POST", body: JSON.stringify(data) }),

    getChatSessions: () => request("/chat/sessions"),

    // Market
    getTrendingSkills: () => request("/market/trending-skills"),

    getSalaryInsights: (role?: string) => {
        const q = role ? `?role=${encodeURIComponent(role)}` : "";
        return request(`/market/salary-insights${q}`);
    },
};
