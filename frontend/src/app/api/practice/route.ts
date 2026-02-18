import { NextRequest, NextResponse } from "next/server";
import { CODING_CHALLENGES } from "@/lib/server-data";

export async function GET(req: NextRequest) {
    const difficulty = req.nextUrl.searchParams.get("difficulty");
    const category = req.nextUrl.searchParams.get("category");
    const company = req.nextUrl.searchParams.get("company");
    const career = req.nextUrl.searchParams.get("career");
    const search = req.nextUrl.searchParams.get("search");

    let challenges = CODING_CHALLENGES;
    if (difficulty) challenges = challenges.filter(c => c.difficulty === difficulty);
    if (category) challenges = challenges.filter(c => c.category === category);
    if (company) challenges = challenges.filter(c => c.company?.includes(company));
    if (career) challenges = challenges.filter(c => c.career === career);
    if (search) {
        const q = search.toLowerCase();
        challenges = challenges.filter(c =>
            c.title.toLowerCase().includes(q) ||
            c.tags.some(t => t.toLowerCase().includes(q)) ||
            c.company?.some(co => co.toLowerCase().includes(q))
        );
    }

    // Extract unique companies and categories for filters
    const allCompanies = Array.from(new Set(CODING_CHALLENGES.flatMap(c => c.company || [])));
    const allCategories = Array.from(new Set(CODING_CHALLENGES.map(c => c.category)));

    return NextResponse.json({ challenges, meta: { total: challenges.length, allCompanies, allCategories } });
}

export async function POST(req: NextRequest) {
    const { challengeId, code, language = "javascript" } = await req.json();
    const challenge = CODING_CHALLENGES.find(c => c.id === challengeId);
    if (!challenge) return NextResponse.json({ error: "Challenge not found" }, { status: 404 });

    // Only JavaScript evaluation is supported on server (other langs show mock results)
    if (language !== "javascript" || challenge.testCases.length === 0) {
        return NextResponse.json({
            passed: 0, total: challenge.testCases.length,
            allPassed: false,
            results: challenge.testCases.map(tc => ({
                input: JSON.stringify(tc.input),
                expected: JSON.stringify(tc.expected),
                got: language !== "javascript" ? `[${language} evaluation requires sandbox]` : "No test cases available",
                passed: false,
            })),
            points: 0,
            message: language !== "javascript"
                ? `Server-side execution for ${language} requires a sandboxed runtime. JavaScript runs natively.`
                : "No test cases available for this problem.",
        });
    }

    // Simple evaluation for JavaScript (in production you'd use a sandbox)
    let passed = 0;
    const total = challenge.testCases.length;
    const results: any[] = [];

    for (const tc of challenge.testCases) {
        try {
            const fn = new Function("return " + code)();
            const result = fn(...tc.input);
            const pass = JSON.stringify(result) === JSON.stringify(tc.expected);
            if (pass) passed++;
            results.push({ input: JSON.stringify(tc.input), expected: JSON.stringify(tc.expected), got: JSON.stringify(result), passed: pass });
        } catch (e: any) {
            results.push({ input: JSON.stringify(tc.input), expected: JSON.stringify(tc.expected), got: e.message, passed: false });
        }
    }

    return NextResponse.json({
        passed, total,
        allPassed: passed === total && total > 0,
        results,
        points: passed === total && total > 0 ? challenge.points : 0,
    });
}
