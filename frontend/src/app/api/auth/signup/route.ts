import { NextRequest } from "next/server";
import { store } from "@/lib/server-data";
import { hashPassword, createToken, jsonResponse, errorResponse } from "@/lib/server-auth";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, name, password, age, education_level, city } = body;

        if (!email || !name || !password) return errorResponse("Email, name and password are required");
        if (password.length < 6) return errorResponse("Password must be at least 6 characters");

        const existing = store.getUserByEmail(email);
        if (existing) return errorResponse("Email already registered", 409);

        const id = crypto.randomUUID();
        store.addUser({ id, email, name, passwordHash: hashPassword(password), age, education_level, city });

        const token = await createToken({ sub: id, email });
        return jsonResponse({ token, user: { id, email, name, age, education_level, city } });
    } catch {
        return errorResponse("Invalid request", 400);
    }
}
