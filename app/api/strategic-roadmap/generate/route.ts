import { NextRequest, NextResponse } from "next/server";
import { generateDeepSeekChat } from "@/lib/deepseek";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { history, ambition, report, language } = body;

        const systemPrompt = `You are an elite Executive Strategy Consultant (McKinsey/BCG level) with 100 years of experience. 
Your goal is to provide a "Brutal Mirror" (No flattery) career analysis.
You will receive:
1. Career History (Positions and durations)
2. Career Ambition (Where they want to go)
3. Advanced Diagnostic (Full X-Ray with strengths, weaknesses, maturity level, etc.)

Your response MUST be in JSON format with the following structure:
{
  "currentRoleAnalysis": {
    "strengths": ["list of strengths for current role"],
    "weaknesses": ["list of brutal weaknesses for current role"],
    "missingHardSkills": ["technical skills missing for mastery"],
    "missingSoftSkills": ["leadership/soft skills missing for mastery"]
  },
  "ambitionPathway": {
    "viability": "A brutal honest assessment of the ambition viability",
    "steps": [
      { "phase": "Phase Description", "actions": ["detailed list of aggressive actions"] }
    ]
  },
  "ultimateRoadmap": {
    "immediateActions": ["actions for next 30 days"],
    "strategicFocus": "Core focus for career acceleration",
    "milestones": ["key success milestones"]
  }
}

Be direct, rigorous, and professional. Use the language: ${language || 'ar'}.
**LANGUAGE CLARITY:** Use simple, accessible, and direct language. Avoid complex buzzwords or academic jargon. Use general or context-relevant examples. Do NOT use irrelevant geographic examples (e.g., Nigerian). Keep the tone "easy to understand" (كلام ساهل).
`;

        const userPrompt = `
HISTORY: ${JSON.stringify(history)}
AMBITION: ${ambition}
DIAGNOSTIC REPORT: ${JSON.stringify(report)}

Analyze this profile against their history and ambition. Give them the "Mirror of Truth".`;

        const response = await generateDeepSeekChat([
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ]);

        // Extract JSON from response (handling potential markdown)
        const content = response.choices[0].message.content;
        if (!content) {
            throw new Error("Empty response from AI engine");
        }
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        const result = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(content);

        return NextResponse.json({ success: true, result });
    } catch (error) {
        console.error("Roadmap Generation Error:", error);
        const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
    }
}
