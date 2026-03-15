/**
 * Mentixy — Auth Store (Zustand)
 */
import { create } from 'zustand';
import { api, auth } from '@/lib/api';

interface User {
    id: string;
    email: string;
    role: string;
    profile?: {
        display_name: string;
        username: string;
        college_name?: string;
        college_tier?: number;
        stream?: string;
        graduation_year?: number;
        target_role?: string;
        archetype_name?: string;
        mentixy_score: number;
        streak_days: number;
        avatar_url?: string;
    };
}

interface AuthState {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;

    login: (email: string, password: string) => Promise<void>;
    signup: (data: { email: string; password: string; display_name: string; username: string }) => Promise<void>;
    logout: () => void;
    fetchUser: () => Promise<void>;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: auth.getUser(),
    token: auth.getToken(),
    loading: false,
    error: null,

    login: async (email, password) => {
        set({ loading: true, error: null });
        try {
            const data = await api.login({ email, password });
            auth.setToken(data.token);
            auth.setUser(data.user);
            set({ token: data.token, user: data.user, loading: false });
        } catch (e: any) {
            set({ error: e.message, loading: false });
            throw e;
        }
    },

    signup: async (data) => {
        set({ loading: true, error: null });
        try {
            const res = await api.signup(data);
            auth.setToken(res.token);
            auth.setUser(res.user);
            set({ token: res.token, user: res.user, loading: false });
        } catch (e: any) {
            set({ error: e.message, loading: false });
            throw e;
        }
    },

    logout: () => {
        auth.clearToken();
        set({ user: null, token: null });
        if (typeof window !== 'undefined') window.location.href = '/login';
    },

    fetchUser: async () => {
        try {
            const user = await api.getMe();
            auth.setUser(user);
            set({ user });
        } catch {
            auth.clearToken();
            set({ user: null, token: null });
        }
    },

    clearError: () => set({ error: null }),
}));
