import { NextRequest } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase";
import { db } from "@/lib/db";
import { store } from "@/lib/server-data";
import { jsonResponse } from "@/lib/server-auth";

export async function GET(req: NextRequest) {
    const category = req.nextUrl.searchParams.get("category") || undefined;

    if (isSupabaseConfigured()) {
        const openings = await db.getActiveOpenings(category);
        return jsonResponse({ openings });
    } else {
        let openings = store.getOpenings(true);
        if (category && category !== "all") {
            openings = openings.filter((o: any) => o.category === category);
        }
        return jsonResponse({ openings });
    }
}
