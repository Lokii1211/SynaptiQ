import { NextRequest } from "next/server";
import { getUserFromRequest, jsonResponse, errorResponse } from "@/lib/server-auth";
import { generateParentReport } from "@/lib/server-ai";
import { store } from "@/lib/server-data";

export async function POST(req: NextRequest) {
    const userId = await getUserFromRequest(req);
    if (!userId) return errorResponse("Authentication required", 401);

    const user = store.getUserById(userId);
    const assessment = store.getLatestAssessment(userId);

    const { child_name } = await req.json();
    const name = child_name || user?.name || "Your Child";

    const result = await generateParentReport(assessment?.results || {}, name);
    return jsonResponse(result);
}
