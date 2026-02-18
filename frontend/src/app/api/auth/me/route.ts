import { NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase";
import { db } from "@/lib/db";
import { store } from "@/lib/server-data";
import { getUserFromRequest, jsonResponse, errorResponse } from "@/lib/server-auth";

export async function GET(req: NextRequest) {
    const userId = await getUserFromRequest(req);
    if (!userId) return errorResponse("Authentication required", 401);

    // Try Supabase first
    if (isSupabaseConfigured()) {
        const user = await db.getUserById(userId);
        if (user) {
            return jsonResponse({
                id: user.id, email: user.email, name: user.name, role: user.role || "student",
                age: user.age, education_level: user.education_level, city: user.city,
            });
        }
    }

    // Fallback to file-based store (handles users created before Supabase was configured)
    const fileUser = store.getUserById(userId);
    if (fileUser) {
        return jsonResponse({
            id: fileUser.id, email: fileUser.email, name: fileUser.name, role: fileUser.role || "student",
            age: fileUser.age, education_level: fileUser.education_level, city: fileUser.city,
        });
    }

    return errorResponse("User not found", 404);
}
