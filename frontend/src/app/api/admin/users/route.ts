import { NextRequest } from "next/server";
import { store } from "@/lib/server-data";
import { getUserFromRequest, jsonResponse, errorResponse } from "@/lib/server-auth";

// PUT: update user role — admin only
export async function PUT(req: NextRequest) {
    const adminId = await getUserFromRequest(req);
    if (!adminId) return errorResponse("Authentication required", 401);

    const admin = store.getUserById(adminId);
    if (!admin || admin.role !== "admin") return errorResponse("Admin access required", 403);

    try {
        const { userId, role } = await req.json();
        if (!userId || !role) return errorResponse("userId and role are required");
        if (!["student", "admin", "mentor"].includes(role)) return errorResponse("Invalid role");

        const updated = store.updateUserRole(userId, role);
        if (!updated) return errorResponse("User not found", 404);

        return jsonResponse({ message: "User role updated", user: { id: updated.id, email: updated.email, name: updated.name, role: updated.role } });
    } catch {
        return errorResponse("Invalid request", 400);
    }
}
