import { NextRequest, NextResponse } from "next/server";
import { generateDeepSeekChat } from "@/lib/deepseek";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { report, language, phase1Data } = body;

        const systemPrompt = `You are a Master HR Technical Evaluator and Strategic Auditor.
        Based on the user's Professional Profile and Phase 1 Diagnostic, you must generate a deep-dive Technical & Strategic Assessment (QCM).
        The goal is to probe their real technical depth, strategic mindset, and professional maturity.

        TASKS:
        1. Analyze the provided user data (Career history, Audit results, etc.).
        2. Generate 10 personalized Multiple Choice Questions (QCM). Each question should have:
           - A scenario or technical concept relevant to their level/role.
           - 4 options (A, B, C, D) with ONE correct answer.
           - A "Strategic Logic" explanation for the correct answer.
        3. Provide a "Preliminary Technical Insight" (2-3 sentences) based on their data before they take the test.

        Return ONLY a JSON object:
        {
          "assessmentTitle": "Personalized Title (e.g., Senior Management Strategic Vetting)",
          "technicalInsight": "Assessment of their current data-profile",
          "questions": [
            {
              "id": number,
              "question": "...",
              "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
              "correctAnswer": "A|B|C|D",
              "strategicLogic": "Explanation of why this is the elite choice"
            }
          ],
          "archetypeTarget": "The professional archetype this test is targeting (e.g., Executive Strategist)"
        }
        Language: ${language || 'ar'}. Be elite, clinical, and precise. Avoid generic questions.`;

        const userPrompt = `USER_DATA_PROFILE: ${JSON.stringify(phase1Data)}
        DIAGNOSTIC_REPORT_SUMMARY: ${JSON.stringify(report)}`;

        const response = await generateDeepSeekChat([
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ]);

        const content = response.choices[0].message.content;
        if (!content) throw new Error("No content from AI");
        const jsonStr = content.match(/\{[\s\S]*\}/)?.[0] || content;
        const assessment = JSON.parse(jsonStr);

        return NextResponse.json({ success: true, academy: assessment });
    } catch (error) {
        console.error("Academy API Error:", error);
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}
