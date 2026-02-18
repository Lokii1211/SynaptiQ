import { NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase";
import { db } from "@/lib/db";
import { store } from "@/lib/server-data";
import { verifyPassword, createToken, jsonResponse, errorResponse } from "@/lib/server-auth";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();
        if (!email || !password) return errorResponse("Email and password are required");

        const useSupabase = isSupabaseConfigured();
        console.log(`[Login] Attempt for: ${email} (mode: ${useSupabase ? "supabase" : "file"})`);

        // ─── Try Supabase first (if configured) ───
        if (useSupabase) {
            const dbUser = await db.getUserByEmail(email);
            if (dbUser) {
                if (!verifyPassword(password, dbUser.password_hash)) {
                    console.log(`[Login/DB] FAILED: Wrong password: ${email}`);
                    return errorResponse("Incorrect password. Please try again.", 401);
                }
                const token = await createToken({ sub: dbUser.id, email: dbUser.email });
                console.log(`[Login/DB] SUCCESS: ${email} (role: ${dbUser.role})`);
                return jsonResponse({
                    token,
                    user: { id: dbUser.id, email: dbUser.email, name: dbUser.name, role: dbUser.role || "student", age: dbUser.age, education_level: dbUser.education_level, city: dbUser.city },
                });
            }
        }

        // ─── Try file-based store (always check as fallback) ───
        const fileUser = store.getUserByEmail(email);
        if (fileUser) {
            if (!verifyPassword(password, fileUser.passwordHash)) {
                console.log(`[Login/File] FAILED: Wrong password: ${email}`);
                return errorResponse("Incorrect password. Please try again.", 401);
            }

            // If Supabase is configured, migrate this user to Supabase automatically
            if (useSupabase) {
                console.log(`[Login/Migrate] Migrating ${email} from file store to Supabase...`);
                const migrated = await db.createUser({
                    email: fileUser.email,
                    name: fileUser.name,
                    password_hash: fileUser.passwordHash,
                    role: fileUser.role as any || "student",
                    age: fileUser.age,
                    education_level: fileUser.education_level,
                    city: fileUser.city,
                    institution: fileUser.institution,
                    career_choice: fileUser.careerChoice,
                });
                if (migrated) {
                    const token = await createToken({ sub: migrated.id, email: migrated.email });
                    console.log(`[Login/Migrate] SUCCESS: ${email} migrated to Supabase`);
                    return jsonResponse({
                        token,
                        user: { id: migrated.id, email: migrated.email, name: migrated.name, role: migrated.role || "student", age: migrated.age, education_level: migrated.education_level, city: migrated.city },
                    });
                }
            }

            // Pure file-based login
            const token = await createToken({ sub: fileUser.id, email: fileUser.email });
            console.log(`[Login/File] SUCCESS: ${email} (role: ${fileUser.role})`);
            return jsonResponse({
                token,
                user: { id: fileUser.id, email: fileUser.email, name: fileUser.name, role: fileUser.role || "student", age: fileUser.age, education_level: fileUser.education_level, city: fileUser.city },
            });
        }

        // ─── User not found anywhere ───
        console.log(`[Login] FAILED: User not found: ${email}`);
        return errorResponse("No account found with this email. Please sign up first.", 401);
    } catch (err) {
        console.error("[Login] Error:", err);
        return errorResponse("Invalid request", 400);
    }
}
