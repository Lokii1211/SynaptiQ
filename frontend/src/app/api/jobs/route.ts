import { NextRequest, NextResponse } from "next/server";
import { JOB_LISTINGS } from "@/lib/server-data";

export async function GET(req: NextRequest) {
    const category = req.nextUrl.searchParams.get("category");
    const type = req.nextUrl.searchParams.get("type");
    const search = req.nextUrl.searchParams.get("search")?.toLowerCase();
    let jobs = JOB_LISTINGS;
    if (category) jobs = jobs.filter(j => j.category === category);
    if (type) jobs = jobs.filter(j => j.type === type);
    if (search) jobs = jobs.filter(j => j.title.toLowerCase().includes(search) || j.company.toLowerCase().includes(search) || j.skills.some(s => s.toLowerCase().includes(search)));
    return NextResponse.json({ jobs, total: jobs.length });
}
