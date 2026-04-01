/**
 * Mentixy — API Client
 * All frontend requests go through here to the Python backend.
 *
 * URL Strategy:
 * - Local dev: hits localhost:8000 directly (NEXT_PUBLIC_BACKEND_URL=http://localhost:8000)
 * - Production (Vercel): uses a RELATIVE path '' so requests go to same origin.
 *   The vercel.json rewrite then forwards /api/* → skillten.vercel.app/api/*
 *   This avoids CORS entirely since same-origin requests don't need CORS headers.
 */
function getBackendUrl(): string {
    // SSR: use env var
    if (typeof window === 'undefined') {
        return (process.env.NEXT_PUBLIC_BACKEND_URL || '').replace(/\/+$/, '');
    }
    // Local dev: use explicit env var (http://localhost:8000)
    if (process.env.NEXT_PUBLIC_BACKEND_URL && process.env.NEXT_PUBLIC_BACKEND_URL !== '') {
        return process.env.NEXT_PUBLIC_BACKEND_URL.replace(/\/+$/, '');
    }
    // localhost: direct to local backend
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:8000';
    }
    // Production: use EMPTY string = same origin, Vercel rewrite handles /api/* forwarding
    return '';
}
const BACKEND_URL = getBackendUrl();
export { BACKEND_URL }; // Export for Google OAuth redirect

class ApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

async function request<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('mentixy_token') : null;

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
        console.error(`[Mentixy] Network error hitting ${BACKEND_URL}/api${endpoint}`, networkError);
        throw new ApiError(
            'Cannot connect to server. Please check your internet connection and try again.',
            0
        );
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

    forgotPassword: (email: string) =>
        request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),

    resetPassword: (token: string, new_password: string) =>
        request('/auth/reset-password', { method: 'POST', body: JSON.stringify({ token, new_password }) }),

    changePassword: (current_password: string, new_password: string) =>
        request('/auth/change-password', { method: 'POST', body: JSON.stringify({ current_password, new_password }) }),

    // ═══════════ NOTIFICATIONS ═══════════
    getNotifications: (unread_only: boolean = false, page: number = 1) =>
        request(`/notifications/?unread_only=${unread_only}&page=${page}`),

    markRead: (notification_id: string) =>
        request('/notifications/mark-read', { method: 'POST', body: JSON.stringify({ notification_id }) }),

    markAllRead: () =>
        request('/notifications/mark-all-read', { method: 'POST' }),

    clearNotifications: () =>
        request('/notifications/clear', { method: 'DELETE' }),

    // ═══════════ COMMUNITY ═══════════
    getCommunityPosts: (category?: string, page: number = 1, limit: number = 20) =>
        request(`/community/posts?page=${page}&limit=${limit}${category ? `&category=${category}` : ''}`),

    createCommunityPost: (data: { title?: string; content: string; category?: string; tags?: string[] }) =>
        request('/community/posts', { method: 'POST', body: JSON.stringify(data) }),

    likePost: (post_id: string) =>
        request(`/community/posts/${post_id}/like`, { method: 'POST' }),

    commentOnPost: (post_id: string, content: string) =>
        request(`/community/posts/${post_id}/comments`, { method: 'POST', body: JSON.stringify({ content }) }),

    getCommunityCategories: () => request('/community/categories'),

    // ═══════════ CONNECTIONS ═══════════
    getPeers: (search?: string, page: number = 1) =>
        request(`/connections/peers?page=${page}${search ? `&search=${search}` : ''}`),

    getConnections: (status: string = 'accepted') =>
        request(`/connections/connections?status=${status}`),

    sendConnectionRequest: (receiver_id: string, message?: string) =>
        request('/connections/connect', { method: 'POST', body: JSON.stringify({ receiver_id, message }) }),

    getConnectionStats: () => request('/connections/stats'),

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

    runCode: (slug: string, data: { language: string; code: string; custom_input?: string }) =>
        request(`/coding/problems/${slug}/run`, { method: 'POST', body: JSON.stringify(data) }),

    submitCode: (slug: string, data: { language: string; code: string }) =>
        request(`/coding/problems/${slug}/submit`, { method: 'POST', body: JSON.stringify(data) }),

    getSubmissions: (slug: string) => request(`/coding/problems/${slug}/submissions`),

    getSubmissionCode: (submissionId: string) => request(`/coding/submissions/${submissionId}/code`),

    getCodingStats: () => request('/coding/stats/me'),

    // ═══════════ APTITUDE ═══════════
    startAptitude: (data: { section?: string; difficulty?: string }) =>
        request('/aptitude/start', { method: 'POST', body: JSON.stringify(data) }),

    submitAptitude: (data: { session_id: string; answers: { question_id: string; selected_option: string; time_spent_ms: number }[] }) =>
        request('/aptitude/submit', { method: 'POST', body: JSON.stringify(data) }),

    aptitudeHistory: () => request('/aptitude/history'),

    aptitudeProfile: () => request('/aptitude/profile'),

    practiceCheck: (data: { question_id: string; selected_option: string; time_spent_ms: number }) =>
        request('/aptitude/practice/check', { method: 'POST', body: JSON.stringify(data) }),

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

    // ═══════════ NETWORK (Legacy) ═══════════
    findPeers: () => request('/connections/peers'),

    connectPeer: (user_id: string) => request('/connections/connect', { method: 'POST', body: JSON.stringify({ user_id }) }),

    disconnectPeer: (user_id: string) => request('/connections/disconnect', { method: 'DELETE', body: JSON.stringify({ user_id }) }),

    addComment: (post_id: string, content: string) =>
        request(`/community/posts/${post_id}/comment`, { method: 'POST', body: JSON.stringify({ content }) }),

    markNotificationRead: (id: string) =>
        request('/notifications/mark-read', { method: 'POST', body: JSON.stringify({ notification_id: id }) }),


    getResumes: () => request('/resume/'),

    createResume: (data: { title: string; template?: string; content: any; target_role: string }) =>
        request('/resume/', { method: 'POST', body: JSON.stringify(data) }),

    listResumes: () => request('/resume/'),

    // ═══════════ CHAT ═══════════
    chat: (data: { message: string; session_id?: string }) =>
        request('/chat', { method: 'POST', body: JSON.stringify(data) }),

    getChatSessions: () => request('/chat/sessions'),

    getChatSession: (id: string) => request(`/chat/sessions/${id}`),



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

    // ═══════════ LEADERBOARD & CAMPUS WARS ═══════════
    getLeaderboard: (metric: string = 'mentixy_score', period: string = 'all') =>
        request(`/leaderboard/individual?metric=${metric}&period=${period}`),

    getLeaderboardOverview: () => request('/leaderboard'),

    getCampusWars: (state?: string, tier?: number) => {
        const params = new URLSearchParams();
        if (state) params.set('state', state);
        if (tier) params.set('tier', String(tier));
        const q = params.toString() ? `?${params.toString()}` : '';
        return request(`/leaderboard/campus-wars${q}`);
    },

    getMyCollegeRank: () => request('/leaderboard/my-college'),

    getTodayContribution: () => request('/leaderboard/today-contribution'),

    // ═══════════ 1v1 BATTLE ═══════════
    getBattleStats: () => request('/battle/stats/me'),

    getBattleHistory: (limit: number = 10) => request(`/battle/history?limit=${limit}`),

    getFriendsOnline: () => request('/battle/friends-online'),

    startBattle: (data: { difficulty: string; time_limit: number; topic: string; mode: 'random' | 'friend'; friend_id?: string }) =>
        request('/battle/start', { method: 'POST', body: JSON.stringify(data) }),

    submitBattle: (battle_id: string, data: { language: string; code: string }) =>
        request(`/battle/${battle_id}/submit`, { method: 'POST', body: JSON.stringify(data) }),
};

// Auth helpers
export const auth = {
    setToken: (token: string) => {
        if (typeof window !== 'undefined') localStorage.setItem('mentixy_token', token);
    },
    getToken: () => {
        if (typeof window !== 'undefined') return localStorage.getItem('mentixy_token');
        return null;
    },
    clearToken: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('mentixy_token');
            localStorage.removeItem('mentixy_user');
        }
    },
    setUser: (user: any) => {
        if (typeof window !== 'undefined') localStorage.setItem('mentixy_user', JSON.stringify(user));
    },
    getUser: () => {
        if (typeof window !== 'undefined') {
            const u = localStorage.getItem('mentixy_user');
            return u ? JSON.parse(u) : null;
        }
        return null;
    },
    isLoggedIn: () => {
        if (typeof window !== 'undefined') return !!localStorage.getItem('mentixy_token');
        return false;
    },
};
