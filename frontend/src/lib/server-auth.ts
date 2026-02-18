import { SignJWT, jwtVerify } from "jose";
import { hashSync, compareSync } from "bcryptjs";
import { NextRequest } from "next/server";

const SECRET = new TextEncoder().encode(process.env.SECRET_KEY || "skillsync-default-secret-key-2026");

export function hashPassword(password: string): string {
    return hashSync(password, 10);
}

export function verifyPassword(password: string, hash: string): boolean {
    return compareSync(password, hash);
}

export async function createToken(payload: Record<string, unknown>): Promise<string> {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(SECRET);
}

export async function verifyToken(token: string): Promise<Record<string, unknown> | null> {
    try {
        const { payload } = await jwtVerify(token, SECRET);
        return payload as Record<string, unknown>;
    } catch {
        return null;
    }
}

export async function getUserFromRequest(req: NextRequest): Promise<string | null> {
    const auth = req.headers.get("authorization");
    if (!auth?.startsWith("Bearer ")) return null;
    const token = auth.slice(7);
    const payload = await verifyToken(token);
    return payload?.sub as string || null;
}

export function jsonResponse(data: unknown, status = 200) {
    return Response.json(data, { status });
}

export function errorResponse(message: string, status = 400) {
    return Response.json({ detail: message }, { status });
}
