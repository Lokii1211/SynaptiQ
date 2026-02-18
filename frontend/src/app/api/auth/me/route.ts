import { NextRequest } from "next/server";
import { store } from "@/lib/server-data";
import { getUserFromRequest, jsonResponse, errorResponse } from "@/lib/server-auth";

export async function GET(req: NextRequest) {
    const userId = await getUserFromRequest(req);
    if (!userId) return errorResponse("Authentication required", 401);

    const user = store.getUserById(userId);
    if (!user) return errorResponse("User not found", 404);

    return jsonResponse({
        id: user.id, email: user.email, name: user.name,
        age: user.age, education_level: user.education_level, city: user.city,
    });
}
