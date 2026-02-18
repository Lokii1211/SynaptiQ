import { NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase";
import { db } from "@/lib/db";
import { store } from "@/lib/server-data";
import { getUserFromRequest, jsonResponse, errorResponse } from "@/lib/server-auth";

export async function GET(req: NextRequest) {
    const userId = await getUserFromRequest(req);
    if (!userId) return errorResponse("Authentication required", 401);

    if (isSupabaseConfigured()) {
        const assessment = await db.getLatestAssessment(userId);
        if (!assessment) return jsonResponse({ has_results: false });
        return jsonResponse({
            has_results: true,
            scores: assessment.scores,
            top_careers: assessment.top_careers,
            recommendations: assessment.recommendations,
        });
    } else {
        const assessment = store.getLatestAssessment(userId);
        if (!assessment) return jsonResponse({ has_results: false });
        return jsonResponse({ has_results: true, ...assessment.results });
    }
}
