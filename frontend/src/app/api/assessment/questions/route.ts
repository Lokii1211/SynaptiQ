import { ASSESSMENT_QUESTIONS } from "@/lib/server-data";
import { jsonResponse } from "@/lib/server-auth";

export async function GET() {
    return jsonResponse({
        questions: ASSESSMENT_QUESTIONS,
        total_questions: ASSESSMENT_QUESTIONS.length,
    });
}
