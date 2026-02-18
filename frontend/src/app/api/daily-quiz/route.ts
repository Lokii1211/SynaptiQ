import { NextRequest, NextResponse } from "next/server";
import { DAILY_QUIZZES } from "@/lib/server-data";

export async function GET(req: NextRequest) {
    const category = req.nextUrl.searchParams.get("category") || "technology";
    const questions = DAILY_QUIZZES[category] || DAILY_QUIZZES["technology"];
    // Rotate based on day of year
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const dailyCount = 5;
    const startIdx = (dayOfYear * dailyCount) % questions.length;
    const daily = [];
    for (let i = 0; i < Math.min(dailyCount, questions.length); i++) {
        daily.push(questions[(startIdx + i) % questions.length]);
    }
    return NextResponse.json({ date: new Date().toISOString().split("T")[0], questions: daily, category });
}

export async function POST(req: NextRequest) {
    const { answers, category } = await req.json();
    const questions = DAILY_QUIZZES[category || "technology"] || DAILY_QUIZZES["technology"];
    let score = 0;
    let total = 0;
    const results: any[] = [];
    for (const [qId, ansIdx] of Object.entries(answers)) {
        const q = questions.find((q: any) => q.id === qId);
        if (q) {
            total++;
            const correct = q.correct === ansIdx;
            if (correct) score += q.points;
            results.push({ questionId: qId, correct, explanation: q.explanation, points: correct ? q.points : 0 });
        }
    }
    return NextResponse.json({ score, total, results, pointsEarned: score });
}
