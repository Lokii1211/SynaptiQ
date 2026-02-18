import { NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase";
import { db } from "@/lib/db";
import { store } from "@/lib/server-data";
import { getUserFromRequest, jsonResponse, errorResponse } from "@/lib/server-auth";

async function verifyAdmin(req: NextRequest) {
    const userId = await getUserFromRequest(req);
    if (!userId) return null;

    if (isSupabaseConfigured()) {
        const user = await db.getUserById(userId);
        return user?.role === "admin" ? user : null;
    } else {
        const user = store.getUserById(userId);
        return user?.role === "admin" ? user : null;
    }
}

export async function GET(req: NextRequest) {
    const admin = await verifyAdmin(req);
    if (!admin) return errorResponse("Admin access required", 403);

    if (isSupabaseConfigured()) {
        const openings = await db.getAllOpenings();
        const stats = await db.getStats();
        return jsonResponse({ openings, stats });
    } else {
        const openings = store.openings;
        const users = store.getAllUsers();
        return jsonResponse({
            openings,
            stats: {
                totalUsers: users.length,
                students: users.filter(u => u.role === "student").length,
                admins: users.filter(u => u.role === "admin").length,
                mentors: users.filter(u => u.role === "mentor").length,
                activeOpenings: store.getOpenings(true).length,
            },
        });
    }
}

export async function POST(req: NextRequest) {
    const admin = await verifyAdmin(req);
    if (!admin) return errorResponse("Admin access required", 403);

    const body = await req.json();

    if (isSupabaseConfigured()) {
        const opening = await db.createOpening({
            title: body.title, company: body.company,
            location: body.location || "Remote", type: body.type || "Full-time",
            salary: body.salary, category: body.category || "technology",
            description: body.description || "", skills: body.skills || [],
            apply_link: body.applyLink || body.apply_link || "",
            is_urgent: body.isUrgent || body.is_urgent || false,
            is_active: true, deadline: body.deadline,
        });
        if (!opening) return errorResponse("Failed to create opening", 500);
        return jsonResponse({ opening });
    } else {
        const opening: any = {
            id: crypto.randomUUID(),
            title: body.title, company: body.company,
            location: body.location || "Remote", type: body.type || "Full-time",
            salary: body.salary || "", category: body.category || "technology",
            description: body.description || "", skills: body.skills || [],
            applyUrl: body.applyLink || body.applyUrl || "",
            isUrgent: body.isUrgent || false, isActive: true,
            deadline: body.deadline || "", applicants: 0,
            postedBy: "admin", postedAt: new Date().toISOString(),
            experience: body.experience || "",
        };
        store.addOpening(opening);
        return jsonResponse({ opening });
    }
}

export async function PUT(req: NextRequest) {
    const admin = await verifyAdmin(req);
    if (!admin) return errorResponse("Admin access required", 403);

    const { id, ...updates } = await req.json();
    if (!id) return errorResponse("Opening ID required");

    if (isSupabaseConfigured()) {
        // Map camelCase to snake_case
        const dbUpdates: any = {};
        if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive;
        if (updates.isUrgent !== undefined) dbUpdates.is_urgent = updates.isUrgent;
        if (updates.title) dbUpdates.title = updates.title;
        if (updates.company) dbUpdates.company = updates.company;

        const opening = await db.updateOpening(id, dbUpdates);
        if (!opening) return errorResponse("Opening not found", 404);
        return jsonResponse({ opening });
    } else {
        const opening = store.updateOpening(id, updates);
        if (!opening) return errorResponse("Opening not found", 404);
        return jsonResponse({ opening });
    }
}

export async function DELETE(req: NextRequest) {
    const admin = await verifyAdmin(req);
    if (!admin) return errorResponse("Admin access required", 403);

    const { id } = await req.json();
    if (!id) return errorResponse("Opening ID required");

    if (isSupabaseConfigured()) {
        const success = await db.deleteOpening(id);
        if (!success) return errorResponse("Failed to delete", 500);
        return jsonResponse({ success: true });
    } else {
        store.deleteOpening(id);
        return jsonResponse({ success: true });
    }
}
