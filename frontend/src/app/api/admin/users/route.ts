import { NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase";
import { db } from "@/lib/db";
import { store } from "@/lib/server-data";
import { getUserFromRequest, jsonResponse, errorResponse } from "@/lib/server-auth";

export async function GET(req: NextRequest) {
    const userId = await getUserFromRequest(req);
    if (!userId) return errorResponse("Authentication required", 401);

    if (isSupabaseConfigured()) {
        const admin = await db.getUserById(userId);
        if (!admin || admin.role !== "admin") return errorResponse("Admin access required", 403);
        const users = await db.getAllUsers();
        return jsonResponse({ users: users.map(u => ({ id: u.id, email: u.email, name: u.name, role: u.role, points: u.points, created_at: u.created_at })) });
    } else {
        const admin = store.getUserById(userId);
        if (!admin || admin.role !== "admin") return errorResponse("Admin access required", 403);
        const users = store.getAllUsers();
        return jsonResponse({ users: users.map(u => ({ id: u.id, email: u.email, name: u.name, role: u.role, points: u.points })) });
    }
}

export async function PUT(req: NextRequest) {
    const userId = await getUserFromRequest(req);
    if (!userId) return errorResponse("Authentication required", 401);

    if (isSupabaseConfigured()) {
        const admin = await db.getUserById(userId);
        if (!admin || admin.role !== "admin") return errorResponse("Admin access required", 403);

        const { userId: targetId, role } = await req.json();
        if (!targetId || !["student", "admin", "mentor"].includes(role)) return errorResponse("Invalid user ID or role");

        const user = await db.updateUserRole(targetId, role);
        if (!user) return errorResponse("User not found", 404);
        return jsonResponse({ success: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    } else {
        const admin = store.getUserById(userId);
        if (!admin || admin.role !== "admin") return errorResponse("Admin access required", 403);

        const { userId: targetId, role } = await req.json();
        if (!targetId || !["student", "admin", "mentor"].includes(role)) return errorResponse("Invalid user ID or role");

        const user = store.updateUserRole(targetId, role);
        if (!user) return errorResponse("User not found", 404);
        return jsonResponse({ success: true, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    }
}
