import { NextRequest } from "next/server";
import { store } from "@/lib/server-data";
import { jsonResponse, errorResponse } from "@/lib/server-auth";

// GET: fetch all active openings (public)
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;

    let openings = store.getOpenings(true); // active only

    if (category && category !== "all") {
        openings = openings.filter(o => o.category === category);
    }

    return jsonResponse({
        openings,
        total: openings.length,
        categories: ["technology", "business", "design", "finance", "marketing", "healthcare", "engineering"],
    });
}
