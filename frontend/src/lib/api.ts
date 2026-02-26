/**
 * SkillTen — API Client
 * All frontend requests go through here to the Python backend
 */

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

class ApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

async function request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('skillten_token') : null;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    let res: Response;
    try {
        res = await fetch(`${BACKEND_URL}/api${endpoint}`, {
            ...options,
            headers,
        });
    } catch (networkError) {
        console.error('Network error — is the backend running?', networkError);
        throw new ApiError('Cannot connect to server. Please check your internet connection or try again later.', 0);
    }

    if (!res.ok) {
        const error = await res.json().catch(() => ({ detail: 'Something went wrong' }));
        throw new ApiError(error.detail || `HTTP ${res.status}`, res.status);
    }

    return res.json();
}

export const api = {
    // ═══════════ AUTH ═══════════
    signup: (data: { email: string; password: string; display_name: string; username: string }) =>
        request('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),

    login: (data: { email: string; password: string }) =>
        request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),

    getMe: () => request('/auth/me'),

    updateProfile: (data: Record<string, any>) =>
        request('/auth/profile', { method: 'PATCH', body: JSON.stringify(data) }),

    // ═══════════ ASSESSMENT ═══════════
    startAssessment: (device_type: string = 'web') =>
        request('/assessment/start', { method: 'POST', body: JSON.stringify({ device_type }) }),

    submitAssessment: (session_id: string, answers: any[]) =>
        request('/assessment/submit', { method: 'POST', body: JSON.stringify({ session_id, answers }) }),

    getAssessmentProfile: () => request('/assessment/profile'),

    getQuestions: () => request('/assessment/questions'),

    getResults: () => request('/assessment/results'),

    // ═══════════ CAREERS ═══════════
    getCareers: () => request('/careers/'),

    getCareerDetail: (slug: string) => request(`/careers/${slug}`),

    getCategories: () => request('/careers/categories'),

    // ═══════════ JOBS ═══════════
    getJobs: (params?: Record<string, string>) => {
        const q = params ? '?' + new URLSearchParams(params).toString() : '';
        return request(`/jobs/${q}`);
    },

    getJobDetail: (id: string) => request(`/jobs/${id}`),

    applyJob: (job_id: string) =>
        request('/jobs/apply', { method: 'POST', body: JSON.stringify({ job_id }) }),

    getMyApplications: () => request('/jobs/applications/me'),

    // ═══════════ INTERNSHIPS ═══════════
    getInternships: () => request('/internships/'),

    // ═══════════ CODING ═══════════
    getCodingProblems: (params?: Record<string, string>) => {
        const q = params ? '?' + new URLSearchParams(params).toString() : '';
        return request(`/coding/problems${q}`);
    },

    getCodingProblem: (slug: string) => request(`/coding/problems/${slug}`),

    submitCode: (slug: string, data: { language: string; code: string }) =>
        request(`/coding/problems/${slug}/submit`, { method: 'POST', body: JSON.stringify(data) }),

    getCodingStats: () => request('/coding/stats/me'),

    // ═══════════ LEARNING ═══════════
    getMyRoadmaps: () => request('/learning/roadmaps'),

    getRoadmap: (id: string) => request(`/learning/roadmaps/${id}`),

    // ═══════════ CHALLENGES ═══════════
    getChallenges: () => request('/challenges/'),

    getChallengeDetail: (slug: string) => request(`/challenges/${slug}`),

    registerChallenge: (challenge_id: string) =>
        request('/challenges/register', { method: 'POST', body: JSON.stringify({ challenge_id }) }),

    // ═══════════ COMPANIES ═══════════
    getCompanies: (params?: Record<string, string>) => {
        const q = params ? '?' + new URLSearchParams(params).toString() : '';
        return request(`/companies/${q}`);
    },

    getCompanyDetail: (slug: string) => request(`/companies/${slug}`),

    getCompanyReviews: (slug: string) => request(`/companies/${slug}/reviews`),

    // ═══════════ NETWORK ═══════════
    getConnections: () => request('/connections/connections'),

    findPeers: () => request('/connections/peers'),

    connectPeer: (user_id: string) => request('/connections/connect', { method: 'POST', body: JSON.stringify({ user_id }) }),

    disconnectPeer: (user_id: string) => request('/connections/disconnect', { method: 'DELETE', body: JSON.stringify({ user_id }) }),

    getCommunityPosts: (category?: string) => request(`/community/posts${category ? `?category=${category}` : ''}`),

    createCommunityPost: (data: { title: string; content: string; category?: string; tags?: string[] }) =>
        request('/community/posts', { method: 'POST', body: JSON.stringify(data) }),

    likePost: (post_id: string) => request(`/community/posts/${post_id}/like`, { method: 'POST' }),

    addComment: (post_id: string, content: string) =>
        request(`/community/posts/${post_id}/comment`, { method: 'POST', body: JSON.stringify({ content }) }),

    // ═══════════ RESUME ═══════════
    getResumes: () => request('/resume/'),

    createResume: (data: { title: string; template?: string; content: any; target_role: string }) =>
        request('/resume/', { method: 'POST', body: JSON.stringify(data) }),

    listResumes: () => request('/resume/'),

    // ═══════════ CHAT ═══════════
    chat: (data: { message: string; session_id?: string }) =>
        request('/chat/', { method: 'POST', body: JSON.stringify(data) }),

    getChatSessions: () => request('/chat/sessions'),

    getChatSession: (id: string) => request(`/chat/sessions/${id}`),

    // ═══════════ NOTIFICATIONS ═══════════
    getNotifications: (unread_only?: boolean) =>
        request(`/notifications/?unread_only=${unread_only || false}`),

    markNotificationRead: (id: string) =>
        request('/notifications/mark-read', { method: 'POST', body: JSON.stringify({ notification_id: id }) }),

    markAllRead: () =>
        request('/notifications/mark-all-read', { method: 'POST' }),

    // ═══════════ CAMPUS ═══════════
    getColleges: () => request('/campus/colleges'),

    getPlacements: () => request('/campus/placements'),

    getInterviewExperiences: () => request('/campus/interviews'),

    // ═══════════ MARKET ═══════════
    getMarketInsights: () => request('/market/insights'),

    getTrendingSkills: () => request('/market/trending-skills'),

    getSalaryInsights: (role?: string) => {
        const q = role ? `?role=${encodeURIComponent(role)}` : '';
        return request(`/market/salary-insights${q}`);
    },

    // ═══════════ AI ENGINE ═══════════
    aiSkillGap: (data: { current_skills: string[]; target_career: string }) =>
        request('/ai/skill-gap', { method: 'POST', body: JSON.stringify(data) }),

    aiResumeReview: (data: { resume_data: Record<string, any>; target_role: string }) =>
        request('/ai/resume-review', { method: 'POST', body: JSON.stringify(data) }),

    aiCodeReview: (data: { code: string; language: string; problem_title?: string }) =>
        request('/ai/code-review', { method: 'POST', body: JSON.stringify(data) }),

    aiJobMatch: (job_id: string) =>
        request('/ai/job-match', { method: 'POST', body: JSON.stringify({ job_id }) }),

    aiGenerateRoadmap: (data: { target_career: string; current_skills?: string[]; hours_per_week?: number }) =>
        request('/ai/generate-roadmap', { method: 'POST', body: JSON.stringify(data) }),

    aiInterviewPrep: (data: { company: string; role: string; round_type?: string }) =>
        request('/ai/interview-prep', { method: 'POST', body: JSON.stringify(data) }),

    // ═══════════ AI ENGINE — Bible XF-08/XF-10 ═══════════
    aiRerouteRoadmap: (data: { target_career: string; missed_milestones?: string[]; available_hours_per_week?: number; placement_deadline?: string }) =>
        request('/ai/reroute-roadmap', { method: 'POST', body: JSON.stringify(data) }),

    aiParentReport: () =>
        request('/ai/parent-report'),

    aiSalaryTruth: (data: { ctc_lpa: number; role: string; city: string }) =>
        request('/ai/salary-truth', { method: 'POST', body: JSON.stringify(data) }),

    // ═══════════ AI ENGINE — Bible 05-D/05-G/05-F ═══════════
    aiNegotiateSalary: (data: { company_type: string; role: string; initial_offer_lpa: number; budget_ceiling_lpa: number; scenario?: string; student_message: string; conversation_history?: any[] }) =>
        request('/ai/negotiate-salary', { method: 'POST', body: JSON.stringify(data) }),

    aiCareerDaySimulator: (data: { career: string; company_type?: string; city?: string; level?: string; student_choice?: string; decision_number?: number; conversation_history?: any[] }) =>
        request('/ai/career-day-simulator', { method: 'POST', body: JSON.stringify(data) }),

    aiWellbeingCheck: (data: { signal_type: string; student_data?: any; positive_history?: string[] }) =>
        request('/ai/wellbeing-check', { method: 'POST', body: JSON.stringify(data) }),

    // ═══════════ MOCK PLACEMENT DRIVE ═══════════
    startMockDrive: (data: { target_company: string; target_role: string }) =>
        request('/mock-drive/start', { method: 'POST', body: JSON.stringify(data) }),

    submitMockRound: (data: { drive_id: string; round_number: number; answers: any[] }) =>
        request('/mock-drive/submit-round', { method: 'POST', body: JSON.stringify(data) }),

    getMockResults: (data: { drive_id: string; round_scores: any[] }) =>
        request('/mock-drive/results', { method: 'POST', body: JSON.stringify(data) }),

    // ═══════════ BACKWARD COMPAT (old pages) ═══════════
    skillGapAnalysis: (data: { current_skills: string[]; target_career: string }) =>
        request('/ai/skill-gap', { method: 'POST', body: JSON.stringify(data) }),

    // ═══════════ ACHIEVEMENTS ═══════════
    getAchievements: () => request('/achievements/'),

    // ═══════════ STREAK TRACKER ═══════════
    getStreak: () => request('/tracker/'),
    streakCheckIn: () => request('/tracker/check-in', { method: 'POST' }),
    useStreakFreeze: () => request('/tracker/freeze', { method: 'POST', body: JSON.stringify({ use_freeze: true }) }),

    // ═══════════ REFERRAL SYSTEM ═══════════
    getReferrals: () => request('/referral/'),
    applyReferral: (code: string) => request('/referral/apply', { method: 'POST', body: JSON.stringify({ ref_code: code }) }),
};

// Auth helpers
export const auth = {
    setToken: (token: string) => {
        if (typeof window !== 'undefined') localStorage.setItem('skillten_token', token);
    },
    getToken: () => {
        if (typeof window !== 'undefined') return localStorage.getItem('skillten_token');
        return null;
    },
    clearToken: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('skillten_token');
            localStorage.removeItem('skillten_user');
        }
    },
    setUser: (user: any) => {
        if (typeof window !== 'undefined') localStorage.setItem('skillten_user', JSON.stringify(user));
    },
    getUser: () => {
        if (typeof window !== 'undefined') {
            const u = localStorage.getItem('skillten_user');
            return u ? JSON.parse(u) : null;
        }
        return null;
    },
    isLoggedIn: () => {
        if (typeof window !== 'undefined') return !!localStorage.getItem('skillten_token');
        return false;
    },
};
