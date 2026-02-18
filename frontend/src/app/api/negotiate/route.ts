import { NextRequest } from "next/server";
import { getUserFromRequest, jsonResponse, errorResponse } from "@/lib/server-auth";
import { negotiationSimulator } from "@/lib/server-ai";

export async function POST(req: NextRequest) {
    const userId = await getUserFromRequest(req);
    if (!userId) return errorResponse("Authentication required", 401);

    const { role, company_type, offer, experience, message, history } = await req.json();
    if (!message) return errorResponse("Message is required");

    const result = await negotiationSimulator(
        { role: role || "Software Developer", company_type: company_type || "Product Company", offer: offer || "₹6 LPA", experience: experience || "Fresher", student_message: message },
        history || []
    );
    return jsonResponse(result);
}
