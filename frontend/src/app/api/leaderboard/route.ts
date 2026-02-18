import { NextResponse } from "next/server";
import { store } from "@/lib/server-data";

export async function GET() {
    const leaderboard = store.getLeaderboard();
    return NextResponse.json({ leaderboard });
}
