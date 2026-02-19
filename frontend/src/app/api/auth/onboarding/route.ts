import { NextRequest } from "next/server";
import { jsonResponse, errorResponse, getUserFromRequest } from "@/lib/server-auth";

export async function POST(req: NextRequest) {
    const userId = await getUserFromRequest(req);
    if (!userId) return errorResponse("Unauthorized", 401);

    try {
        const body = await req.json();
        const { education_level, stream, college_year, mobility_pref, life_goal_text } = body;

        // In production, this would update the user record in Supabase
        // For now, we log and acknowledge
        console.log(`[Onboarding] User ${userId}:`, {
            education_level,
            stream,
            college_year,
            mobility_pref,
            life_goal_text: life_goal_text ? `${life_goal_text.slice(0, 20)}...` : undefined,
        });

        return jsonResponse({ success: true, message: "Onboarding completed" });
    } catch {
        return errorResponse("Failed to save onboarding data", 500);
    }
}
