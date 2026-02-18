import { NextRequest } from "next/server";
import { getUserFromRequest, jsonResponse, errorResponse } from "@/lib/server-auth";
import { analyzeSkillGap } from "@/lib/server-ai";

export async function POST(req: NextRequest) {
    const userId = await getUserFromRequest(req);
    if (!userId) return errorResponse("Authentication required", 401);

    const { current_skills, target_career } = await req.json();
    if (!current_skills?.length || !target_career) return errorResponse("current_skills and target_career are required");

    const result = await analyzeSkillGap(current_skills, target_career);
    return jsonResponse(result);
}
