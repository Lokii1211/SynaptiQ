import { NextRequest } from "next/server";
import { store } from "@/lib/server-data";
import { verifyPassword, createToken, jsonResponse, errorResponse } from "@/lib/server-auth";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();
        if (!email || !password) return errorResponse("Email and password are required");

        console.log(`[Login] Attempt for: ${email}`);
        console.log(`[Login] Users in store: ${store.getAllUsers().map(u => u.email).join(", ") || "none"}`);

        const user = store.getUserByEmail(email);
        if (!user) {
            console.log(`[Login] FAILED: User not found for email: ${email}`);
            return errorResponse("No account found with this email. Please sign up first.", 401);
        }

        const passwordValid = verifyPassword(password, user.passwordHash);
        console.log(`[Login] Password check for ${email}: ${passwordValid}`);

        if (!passwordValid) {
            console.log(`[Login] FAILED: Wrong password for: ${email}`);
            return errorResponse("Incorrect password. Please try again.", 401);
        }

        const token = await createToken({ sub: user.id, email: user.email });
        console.log(`[Login] SUCCESS: ${email} (role: ${user.role})`);
        return jsonResponse({
            token,
            user: { id: user.id, email: user.email, name: user.name, role: user.role || "student", age: user.age, education_level: user.education_level, city: user.city },
        });
    } catch (err) {
        console.error("[Login] Error:", err);
        return errorResponse("Invalid request", 400);
    }
}
