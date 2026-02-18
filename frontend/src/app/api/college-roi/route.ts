import { NextRequest } from "next/server";
import { jsonResponse, errorResponse } from "@/lib/server-auth";
import { calculateCollegeROI } from "@/lib/server-ai";

export async function POST(req: NextRequest) {
    const { college, course, annual_fee, duration_years, city } = await req.json();
    if (!college || !course || !annual_fee) return errorResponse("College, course, and annual_fee are required");

    const result = await calculateCollegeROI({
        college, course,
        annual_fee: Number(annual_fee),
        duration_years: Number(duration_years) || 4,
        city: city || "Unknown",
    });
    return jsonResponse(result);
}
