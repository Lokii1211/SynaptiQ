import { NextRequest } from "next/server";
import { store } from "@/lib/server-data";
import { getUserFromRequest, jsonResponse, errorResponse } from "@/lib/server-auth";
import { careerChat } from "@/lib/server-ai";

export async function POST(req: NextRequest) {
    const userId = await getUserFromRequest(req);
    if (!userId) return errorResponse("Authentication required", 401);

    const { message, session_id } = await req.json();
    if (!message) return errorResponse("Message is required");

    const sessionId = session_id || crypto.randomUUID();
    const session = store.getOrCreateChat(sessionId, userId);

    session.messages.push({ role: "user", content: message, timestamp: new Date().toISOString() });

    const response = await careerChat(message, session.messages.slice(0, -1));

    session.messages.push({ role: "assistant", content: response, timestamp: new Date().toISOString() });

    return jsonResponse({ response, session_id: sessionId });
}
