import { NextRequest } from "next/server";
import { store } from "@/lib/server-data";
import { getUserFromRequest, jsonResponse, errorResponse } from "@/lib/server-auth";
import type { Opening } from "@/lib/server-data";

// Middleware: verify admin role
async function requireAdmin(req: NextRequest) {
    const userId = await getUserFromRequest(req);
    if (!userId) return null;
    const user = store.getUserById(userId);
    if (!user || user.role !== "admin") return null;
    return user;
}

// GET: fetch all openings (including inactive) — admin only
export async function GET(req: NextRequest) {
    const admin = await requireAdmin(req);
    if (!admin) return errorResponse("Admin access required", 403);

    const openings = store.getOpenings(false); // all openings
    const users = store.getAllUsers();

    return jsonResponse({
        openings,
        stats: {
            totalOpenings: openings.length,
            activeOpenings: openings.filter(o => o.isActive).length,
            totalUsers: users.length,
            students: users.filter(u => u.role === "student").length,
            mentors: users.filter(u => u.role === "mentor").length,
            admins: users.filter(u => u.role === "admin").length,
        },
        users: users.map(u => ({
            id: u.id, email: u.email, name: u.name, role: u.role,
            points: u.points || 0, lastActive: u.lastActive,
        })),
    });
}

// POST: create a new opening — admin only
export async function POST(req: NextRequest) {
    const admin = await requireAdmin(req);
    if (!admin) return errorResponse("Admin access required", 403);

    try {
        const body = await req.json();
        const { title, company, location, type, salary, experience, skills, description, applyUrl, category, isUrgent, deadline } = body;

        if (!title || !company || !category) return errorResponse("Title, company, and category are required");

        const opening: Opening = {
            id: `op-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            title, company,
            location: location || "India",
            type: type || "Full-time",
            salary: salary || "Not Disclosed",
            experience: experience || "0+ years",
            skills: skills || [],
            description: description || "",
            applyUrl: applyUrl || "#",
            category: category || "technology",
            isActive: true,
            isUrgent: isUrgent || false,
            postedBy: admin.id,
            postedAt: new Date().toISOString(),
            deadline: deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            applicants: 0,
        };

        store.addOpening(opening);
        return jsonResponse({ opening, message: "Opening created successfully" });
    } catch {
        return errorResponse("Invalid request", 400);
    }
}

// PUT: update an opening — admin only
export async function PUT(req: NextRequest) {
    const admin = await requireAdmin(req);
    if (!admin) return errorResponse("Admin access required", 403);

    try {
        const body = await req.json();
        const { id, ...data } = body;
        if (!id) return errorResponse("Opening ID is required");

        const updated = store.updateOpening(id, data);
        if (!updated) return errorResponse("Opening not found", 404);

        return jsonResponse({ opening: updated, message: "Opening updated successfully" });
    } catch {
        return errorResponse("Invalid request", 400);
    }
}

// DELETE: delete an opening — admin only
export async function DELETE(req: NextRequest) {
    const admin = await requireAdmin(req);
    if (!admin) return errorResponse("Admin access required", 403);

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return errorResponse("Opening ID is required");

    store.deleteOpening(id);
    return jsonResponse({ message: "Opening deleted successfully" });
}
