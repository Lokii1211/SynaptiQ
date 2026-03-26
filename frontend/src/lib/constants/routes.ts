/**
 * Mentixy — Route Constants
 * Every navigation call must use ROUTES.XXX, never a string literal.
 */
export const ROUTES = {
    // Main
    HOME: '/',
    LOGIN: '/login',
    SIGNUP: '/signup',
    ONBOARDING: '/onboarding',
    DASHBOARD: '/dashboard',
    ASSESSMENT: '/assessment',
    RESULTS: '/results',
    SCORE: '/score',
    
    // Careers
    CAREERS: '/careers',
    CAREER: (slug: string) => `/careers/${slug}`,
    CAREER_DETAIL: (slug: string) => `/career/${slug}`,
    HONEST_MIRROR: '/honest-mirror',
    PLACEMENT_PROBABILITY: '/placement-probability',
    
    // Learn & Practice
    CODING: '/practice',
    CODING_PROBLEM: (slug: string) => `/practice/${slug}`,
    PROBLEMS: '/problems',
    APTITUDE: '/aptitude',
    LEARN: '/learn',
    ROADMAP: '/roadmap',
    SKILLS: '/skills',
    COURSES: '/courses',
    DAILY: '/daily',
    CHALLENGES: '/challenges',
    ACHIEVEMENTS: '/achievements',
    STUDY_GROUPS: '/study-groups',
    STUDY_PLANS: '/study-plans',
    CONCEPTS: '/concepts',
    
    // Opportunities
    JOBS: '/jobs',
    INTERNSHIPS: '/internships',
    RESUME: '/resume',
    COMPANIES: '/company-intel',
    COMPANY: (slug: string) => `/company-intel/${slug}`,
    COMPANY_DETAIL: (slug: string) => `/company/${slug}`,
    COMPANY_PREP: '/company-prep',
    NEGOTIATE: '/negotiate',
    SIMULATOR: '/simulator',
    MOCK_DRIVE: '/mock-drive',
    SIDE_INCOME: '/side-income',
    CERTIFICATIONS: '/certifications',
    CREATOR: '/creator',
    
    // Community
    CHAT: '/chat',
    NETWORK: '/network',
    MESSAGES: '/messages',
    COMMUNITY: '/community',
    LEADERBOARD: '/leaderboard',
    PEOPLE_LIKE_YOU: '/people-like-you',
    INTERVIEW_EXPERIENCES: '/interview-experiences',
    
    // Insights
    ANALYTICS: '/analytics',
    MARKET: '/skill-market',
    CAMPUS: '/campus',
    CAMPUS_COMMAND: '/campus-command',
    COLLEGE_ROI: '/college-roi',
    TRACKER: '/tracker',
    FIRST_90_DAYS: '/first-90-days',
    PARENT: '/parent',
    CONTESTS: '/contests',
    BATTLE: '/battle',
    
    // Settings & Profile
    SETTINGS: '/settings',
    PROFILE: (username: string) => `/u/${username}`,
    PROFILE_PAGE: '/profile',
    NOTIFICATIONS: '/notifications',
    REFER: '/refer',
    HELP: '/help',
    PRICING: '/pricing',
    PRIVACY: '/privacy',
    TERMS: '/terms',
    
    // Admin
    ADMIN: '/admin',
    TPO_DASHBOARD: '/tpo-dashboard',
    RECRUITER: '/recruiter',
    
    // Dynamic
    VERIFY: (hash: string) => `/verify/${hash}`,
    SALARY_TRUTH: '/salary-truth',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
} as const;

export const AUTH_ROUTES = [ROUTES.LOGIN, ROUTES.SIGNUP, ROUTES.ONBOARDING];
export const PUBLIC_ROUTES = [ROUTES.HOME, ROUTES.LOGIN, ROUTES.SIGNUP];

