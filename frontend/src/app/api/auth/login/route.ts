import { NextRequest } from "next/server";
import { store } from "@/lib/server-data";
import { verifyPassword, createToken, jsonResponse, errorResponse } from "@/lib/server-auth";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();
        if (!email || !password) return errorResponse("Email and password are required");

        const user = store.getUserByEmail(email);
        if (!user || !verifyPassword(password, user.passwordHash)) {
            return errorResponse("Invalid email or password", 401);
        }

        const token = await createToken({ sub: user.id, email: user.email });
        return jsonResponse({
            token,
            user: { id: user.id, email: user.email, name: user.name, role: user.role || "student", age: user.age, education_level: user.education_level, city: user.city },
        });
    } catch {
        return errorResponse("Invalid request", 400);
    }
}
