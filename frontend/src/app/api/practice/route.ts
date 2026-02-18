import { NextRequest, NextResponse } from "next/server";
import { CODING_CHALLENGES } from "@/lib/server-data";

export async function GET(req: NextRequest) {
    const difficulty = req.nextUrl.searchParams.get("difficulty");
    const category = req.nextUrl.searchParams.get("category");
    let challenges = CODING_CHALLENGES;
    if (difficulty) challenges = challenges.filter(c => c.difficulty === difficulty);
    if (category) challenges = challenges.filter(c => c.category === category);
    return NextResponse.json({ challenges });
}

export async function POST(req: NextRequest) {
    const { challengeId, code } = await req.json();
    const challenge = CODING_CHALLENGES.find(c => c.id === challengeId);
    if (!challenge) return NextResponse.json({ error: "Challenge not found" }, { status: 404 });

    // Simple evaluation (in production you'd use a sandbox)
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
