import { NextRequest } from "next/server";
import { store } from "@/lib/server-data";
import { getUserFromRequest, jsonResponse, errorResponse } from "@/lib/server-auth";
import { analyzeAssessment } from "@/lib/server-ai";

export async function POST(req: NextRequest) {
    const userId = await getUserFromRequest(req);
    if (!userId) return errorResponse("Authentication required", 401);

    const { answers } = await req.json();
    if (!answers) return errorResponse("Answers are required");

    const results = await analyzeAssessment(answers);

    store.addAssessment(userId, {
        id: crypto.randomUUID(),
        userId,
        answers,
        results,
    });

    return jsonResponse({ has_results: true, ...results });
}
