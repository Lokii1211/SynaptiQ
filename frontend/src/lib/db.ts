// ─── SkillSync AI — Supabase Database Layer ───
// Production-grade database operations using Supabase (PostgreSQL)
// Falls back to file-based store if Supabase is not configured

import { getSupabaseAdmin } from "./supabase";

// Helper to get the admin client — only call this inside functions, never at module level
function supabaseAdmin() {
    return getSupabaseAdmin();
}

// ─── Type Definitions ───
export interface DBUser {
    id: string;
    email: string;
    name: string;
    password_hash: string;
    role: "student" | "admin" | "mentor";
    age?: number;
    education_level?: string;
    city?: string;
    institution?: string;
    career_choice?: string;
    points: number;
    created_at?: string;
    updated_at?: string;
}

export interface DBOpening {
    id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    salary: string;
    category: string;
    description: string;
    skills: string[];
    apply_link: string;
    is_urgent: boolean;
    is_active: boolean;
    deadline?: string;
    applicants: number;
    created_at?: string;
}

export interface DBAssessment {
    id?: string;
    user_id: string;
    scores: Record<string, number>;
    top_careers: any[];
    recommendations: any[];
    created_at?: string;
}

export interface DBChatSession {
    id: string;
    user_id: string;
    messages: any[];
    created_at?: string;
    updated_at?: string;
}

export interface DBCommunityPost {
    id: string;
    user_id?: string;
    user_name: string;
    title: string;
    content: string;
    category: string;
    tags: string[];
    likes: number;
    created_at?: string;
    comments?: any[];
}

export interface DBQuizHistory {
    user_id: string;
    quiz_date: string;
    score: number;
    total: number;
}

// ─── Database Operations ───
export const db = {
    // ═══ USER OPERATIONS ═══
    async createUser(user: {
        email: string;
        name: string;
        password_hash: string;
        role?: string;
        age?: number;
        education_level?: string;
        city?: string;
        institution?: string;
        career_choice?: string;
    }): Promise<DBUser | null> {
        const { data, error } = await supabaseAdmin()
            .from("users")
            .insert({
                email: user.email,
                name: user.name,
                password_hash: user.password_hash,
                role: user.role || "student",
                age: user.age,
                education_level: user.education_level,
                city: user.city,
                institution: user.institution,
                career_choice: user.career_choice,
                points: 0,
            })
            .select()
            .single();

        if (error) {
            console.error("[DB] Error creating user:", error.message);
            return null;
        }
        return data;
    },

    async getUserByEmail(email: string): Promise<DBUser | null> {
        const { data, error } = await supabaseAdmin()
            .from("users")
            .select("*")
            .eq("email", email)
            .single();

        if (error) return null;
        return data;
    },

    async getUserById(id: string): Promise<DBUser | null> {
        const { data, error } = await supabaseAdmin()
            .from("users")
            .select("*")
            .eq("id", id)
            .single();

        if (error) return null;
        return data;
    },

    async getAllUsers(): Promise<DBUser[]> {
        const { data, error } = await supabaseAdmin()
            .from("users")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) return [];
        return data || [];
    },

    async updateUserRole(userId: string, role: "student" | "admin" | "mentor"): Promise<DBUser | null> {
        const { data, error } = await supabaseAdmin()
            .from("users")
            .update({ role })
            .eq("id", userId)
            .select()
            .single();

        if (error) return null;
        return data;
    },

    async updateUserPoints(userId: string, points: number): Promise<void> {
        await supabaseAdmin()
            .from("users")
            .update({ points })
            .eq("id", userId);
    },

    // ═══ OPENINGS OPERATIONS ═══
    async getActiveOpenings(category?: string): Promise<DBOpening[]> {
        let query = supabaseAdmin()
            .from("openings")
            .select("*")
            .eq("is_active", true)
            .order("created_at", { ascending: false });

        if (category && category !== "all") {
            query = query.eq("category", category);
        }

        const { data, error } = await query;
        if (error) return [];
        return data || [];
    },

    async getAllOpenings(): Promise<DBOpening[]> {
        const { data, error } = await supabaseAdmin()
            .from("openings")
            .select("*")
            .order("created_at", { ascending: false });

        if (error) return [];
        return data || [];
    },

    async createOpening(opening: Omit<DBOpening, "id" | "created_at" | "applicants">): Promise<DBOpening | null> {
        const { data, error } = await supabaseAdmin()
            .from("openings")
            .insert({
                title: opening.title,
                company: opening.company,
                location: opening.location || "Remote",
                type: opening.type || "Full-time",
                salary: opening.salary,
                category: opening.category || "technology",
                description: opening.description,
                skills: opening.skills || [],
                apply_link: opening.apply_link,
                is_urgent: opening.is_urgent || false,
                is_active: opening.is_active !== false,
                deadline: opening.deadline,
                applicants: 0,
            })
            .select()
            .single();

        if (error) {
            console.error("[DB] Error creating opening:", error.message);
            return null;
        }
        return data;
    },

    async updateOpening(id: string, updates: Partial<DBOpening>): Promise<DBOpening | null> {
        const { data, error } = await supabaseAdmin()
            .from("openings")
            .update(updates)
            .eq("id", id)
            .select()
            .single();

        if (error) return null;
        return data;
    },

    async deleteOpening(id: string): Promise<boolean> {
        const { error } = await supabaseAdmin()
            .from("openings")
            .delete()
            .eq("id", id);

        return !error;
    },

    // ═══ ASSESSMENT OPERATIONS ═══
    async saveAssessment(assessment: DBAssessment): Promise<DBAssessment | null> {
        const { data, error } = await supabaseAdmin()
            .from("assessments")
            .insert({
                user_id: assessment.user_id,
                scores: assessment.scores,
                top_careers: assessment.top_careers,
                recommendations: assessment.recommendations,
            })
            .select()
            .single();

        if (error) {
            console.error("[DB] Error saving assessment:", error.message);
            return null;
        }
        return data;
    },

    async getLatestAssessment(userId: string): Promise<DBAssessment | null> {
        const { data, error } = await supabaseAdmin()
            .from("assessments")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

        if (error) return null;
        return data;
    },

    // ═══ CHAT OPERATIONS ═══
    async getOrCreateChat(sessionId: string, userId: string): Promise<DBChatSession> {
        const { data: existing } = await supabaseAdmin()
            .from("chat_sessions")
            .select("*")
            .eq("id", sessionId)
            .single();

        if (existing) return existing;

        const { data, error } = await supabaseAdmin()
            .from("chat_sessions")
            .insert({ id: sessionId, user_id: userId, messages: [] })
            .select()
            .single();

        if (error) {
            console.error("[DB] Error creating chat:", error.message);
            return { id: sessionId, user_id: userId, messages: [] };
        }
        return data;
    },

    async updateChatMessages(sessionId: string, messages: any[]): Promise<void> {
        await supabaseAdmin()
            .from("chat_sessions")
            .update({ messages })
            .eq("id", sessionId);
    },

    async getUserChats(userId: string): Promise<DBChatSession[]> {
        const { data, error } = await supabaseAdmin()
            .from("chat_sessions")
            .select("*")
            .eq("user_id", userId)
            .order("updated_at", { ascending: false });

        if (error) return [];
        return data || [];
    },

    // ═══ COMMUNITY OPERATIONS ═══
    async getCommunityPosts(category?: string): Promise<DBCommunityPost[]> {
        let query = supabaseAdmin()
            .from("community_posts")
            .select("*, post_comments(*)")
            .order("created_at", { ascending: false });

        if (category) {
            query = query.eq("category", category);
        }

        const { data, error } = await query;
        if (error) return [];

        // Transform comments from related table
        return (data || []).map((post: any) => ({
            ...post,
            comments: post.post_comments || [],
        }));
    },

    async createCommunityPost(post: {
        user_id?: string;
        user_name: string;
        title: string;
        content: string;
        category: string;
        tags: string[];
    }): Promise<DBCommunityPost | null> {
        const { data, error } = await supabaseAdmin()
            .from("community_posts")
            .insert({
                user_id: post.user_id,
                user_name: post.user_name,
                title: post.title,
                content: post.content,
                category: post.category,
                tags: post.tags,
                likes: 0,
            })
            .select()
            .single();

        if (error) return null;
        return data;
    },

    async likePost(postId: string): Promise<void> {
        const { data: post } = await supabaseAdmin()
            .from("community_posts")
            .select("likes")
            .eq("id", postId)
            .single();

        if (post) {
            await supabaseAdmin()
                .from("community_posts")
                .update({ likes: (post.likes || 0) + 1 })
                .eq("id", postId);
        }
    },

    async addComment(postId: string, comment: {
        user_id?: string;
        user_name: string;
        content: string;
    }): Promise<void> {
        await supabaseAdmin()
            .from("post_comments")
            .insert({
                post_id: postId,
                user_id: comment.user_id,
                user_name: comment.user_name,
                content: comment.content,
            });
    },

    // ═══ QUIZ HISTORY OPERATIONS ═══
    async saveQuizResult(result: DBQuizHistory): Promise<void> {
        await supabaseAdmin()
            .from("quiz_history")
            .insert({
                user_id: result.user_id,
                quiz_date: result.quiz_date,
                score: result.score,
                total: result.total,
            });
    },

    async getQuizHistory(userId: string): Promise<DBQuizHistory[]> {
        const { data, error } = await supabaseAdmin()
            .from("quiz_history")
            .select("*")
            .eq("user_id", userId)
            .order("quiz_date", { ascending: false });

        if (error) return [];
        return data || [];
    },

    // ═══ STATS ═══
    async getStats(): Promise<{ totalUsers: number; students: number; admins: number; mentors: number; activeOpenings: number }> {
        const { data: users } = await supabaseAdmin().from("users").select("role");
        const { count: activeOpenings } = await supabaseAdmin().from("openings").select("*", { count: "exact", head: true }).eq("is_active", true);

        const allUsers = users || [];
        return {
            totalUsers: allUsers.length,
            students: allUsers.filter(u => u.role === "student").length,
            admins: allUsers.filter(u => u.role === "admin").length,
            mentors: allUsers.filter(u => u.role === "mentor").length,
            activeOpenings: activeOpenings || 0,
        };
    },
};
