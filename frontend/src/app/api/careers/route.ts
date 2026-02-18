import { NextRequest } from "next/server";
import { CAREERS } from "@/lib/server-data";
import { jsonResponse } from "@/lib/server-auth";

function formatSalary(min: number, max: number): string {
    const fmtLPA = (v: number) => (v >= 100000 ? `₹${(v / 100000).toFixed(0)}L` : `₹${v}`);
    return `${fmtLPA(min)} - ${fmtLPA(max)} PA`;
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    let filtered = [...CAREERS];
    if (category) filtered = filtered.filter(c => c.category === category);
    if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(c =>
            c.title.toLowerCase().includes(q) ||
            c.description.toLowerCase().includes(q) ||
            c.category.toLowerCase().includes(q)
        );
    }

    const careers = filtered.map(c => ({
        id: c.id, title: c.title, slug: c.slug, category: c.category,
        description: c.description.substring(0, 150) + "...",
        salary_range: formatSalary(c.salary_range_min, c.salary_range_max),
        growth_outlook: c.growth_outlook, demand_score: c.demand_score, icon: c.icon,
    }));

    return jsonResponse({ careers, total: careers.length });
}
