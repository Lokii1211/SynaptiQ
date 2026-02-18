import { NextRequest, NextResponse } from "next/server";
import { COURSES } from "@/lib/server-data";

export async function GET(req: NextRequest) {
    const category = req.nextUrl.searchParams.get("category");
    const free = req.nextUrl.searchParams.get("free");
    let courses = COURSES;
    if (category) courses = courses.filter(c => c.category === category);
    if (free === "true") courses = courses.filter(c => c.free);
    return NextResponse.json({ courses });
}
