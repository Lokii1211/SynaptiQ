import { CAREERS } from "@/lib/server-data";
import { jsonResponse, errorResponse } from "@/lib/server-auth";

function formatSalary(min: number, max: number) {
    const fmtLPA = (v: number) => (v >= 100000 ? `₹${(v / 100000).toFixed(0)}L` : `₹${v}`);
    return { min, max, formatted: `${fmtLPA(min)} - ${fmtLPA(max)} PA` };
}

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const career = CAREERS.find(c => c.slug === slug);
    if (!career) return errorResponse("Career not found", 404);

    return jsonResponse({
        ...career,
        salary_range: formatSalary(career.salary_range_min, career.salary_range_max),
    });
}
