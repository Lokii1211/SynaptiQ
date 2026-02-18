import { NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase";
import { db } from "@/lib/db";
import { store } from "@/lib/server-data";
import { verifyPassword, createToken, jsonResponse, errorResponse } from "@/lib/server-auth";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();
        if (!email || !password) return errorResponse("Email and password are required");

        console.log(`[Login] Attempt for: ${email} (mode: ${isSupabaseConfigured() ? "supabase" : "file"})`);

        if (isSupabaseConfigured()) {
            // ─── Supabase Path ───
            const user = await db.getUserByEmail(email);
            if (!user) {
                console.log(`[Login/DB] FAILED: User not found: ${email}`);
                return errorResponse("No account found with this email. Please sign up first.", 401);
            }

            if (!verifyPassword(password, user.password_hash)) {
                console.log(`[Login/DB] FAILED: Wrong password: ${email}`);
                return errorResponse("Incorrect password. Please try again.", 401);
            }

            const token = await createToken({ sub: user.id, email: user.email });
            console.log(`[Login/DB] SUCCESS: ${email} (role: ${user.role})`);
            return jsonResponse({
                token,
                user: { id: user.id, email: user.email, name: user.name, role: user.role || "student", age: user.age, education_level: user.education_level, city: user.city },
            });
        } else {
            // ─── File-based fallback ───
            const user = store.getUserByEmail(email);
            if (!user) {
                console.log(`[Login/File] FAILED: User not found: ${email}`);
                return errorResponse("No account found with this email. Please sign up first.", 401);
            }

            if (!verifyPassword(password, user.passwordHash)) {
                console.log(`[Login/File] FAILED: Wrong password: ${email}`);
                return errorResponse("Incorrect password. Please try again.", 401);
            }

            const token = await createToken({ sub: user.id, email: user.email });
            console.log(`[Login/File] SUCCESS: ${email} (role: ${user.role})`);
            return jsonResponse({
                token,
                user: { id: user.id, email: user.email, name: user.name, role: user.role || "student", age: user.age, education_level: user.education_level, city: user.city },
            });
        }
    } catch (err) {
        console.error("[Login] Error:", err);
        return errorResponse("Invalid request", 400);
    }
}
