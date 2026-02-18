import { NextRequest } from "next/server";
import { store } from "@/lib/server-data";
import { getUserFromRequest, jsonResponse, errorResponse } from "@/lib/server-auth";

export async function GET(req: NextRequest) {
    const userId = await getUserFromRequest(req);
    if (!userId) return errorResponse("Authentication required", 401);

    const assessment = store.getLatestAssessment(userId);
    if (!assessment) return jsonResponse({ has_results: false });

    return jsonResponse({ has_results: true, ...assessment.results });
}
