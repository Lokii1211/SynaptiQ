import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase";
import { db } from "@/lib/db";
import { store } from "@/lib/server-data";

export async function GET() {
    if (isSupabaseConfigured()) {
        const users = await db.getAllUsers();
        const leaderboard = users
            .filter(u => u.role !== "admin")
            .map(u => ({ name: u.name, points: u.points || 0, streak: 0 }))
            .sort((a, b) => b.points - a.points)
            .slice(0, 20);
        return NextResponse.json({ leaderboard });
    } else {
        const leaderboard = store.getLeaderboard();
        return NextResponse.json({ leaderboard });
    }
}
