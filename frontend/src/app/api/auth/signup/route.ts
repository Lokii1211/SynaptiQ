import { NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase";
import { db } from "@/lib/db";
import { store } from "@/lib/server-data";
import { hashPassword, createToken, jsonResponse, errorResponse } from "@/lib/server-auth";

export async function POST(req: NextRequest) {
    try {
        const { email, name, password, age, education_level, city, institution, careerInterest } = await req.json();
        if (!email || !name || !password) return errorResponse("Email, name and password are required");
        if (password.length < 6) return errorResponse("Password must be at least 6 characters");

        const passwordHash = hashPassword(password);

        if (isSupabaseConfigured()) {
            // ─── Supabase Path ───
            const existing = await db.getUserByEmail(email);
            if (existing) return errorResponse("Email already registered", 409);

            const user = await db.createUser({
                email, name, password_hash: passwordHash,
                role: "student", age, education_level, city, institution,
                career_choice: careerInterest,
            });
            if (!user) return errorResponse("Failed to create account. Please try again.", 500);

            const token = await createToken({ sub: user.id, email: user.email });
            console.log(`[Signup/DB] SUCCESS: ${email}`);
            return jsonResponse({
                token,
                user: { id: user.id, email: user.email, name: user.name, role: user.role },
            });
        } else {
            // ─── File-based fallback ───
            if (store.getUserByEmail(email)) return errorResponse("Email already registered", 409);

            const id = crypto.randomUUID();
            store.addUser({
                id, email, name, passwordHash, role: "student",
                age, education_level, city, institution, careerChoice: careerInterest,
            });

            const token = await createToken({ sub: id, email });
            console.log(`[Signup/File] SUCCESS: ${email}`);
            return jsonResponse({
                token,
                user: { id, email, name, role: "student" },
            });
        }
    } catch (err) {
        console.error("[Signup] Error:", err);
        return errorResponse("Invalid request", 400);
    }
}
