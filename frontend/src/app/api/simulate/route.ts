import { NextRequest } from "next/server";
import { jsonResponse, errorResponse } from "@/lib/server-auth";
import { simulateCareerDay } from "@/lib/server-ai";

export async function POST(req: NextRequest) {
    const { career, step, choice } = await req.json();
    if (!career) return errorResponse("Career is required");

    const result = await simulateCareerDay(career, Number(step) || 1, choice);
    return jsonResponse(result);
}
