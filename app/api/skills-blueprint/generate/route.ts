import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getAIConfig } from "@/lib/config";

export const runtime = "nodejs";
export const maxDuration = 120;

async function getAI() {
  const config = await getAIConfig();
  const isOpenAI = config.activeProvider === "openai";
  return {
    client: new OpenAI({
      apiKey: isOpenAI ? config.openai.apiKey : config.deepseek.apiKey,
      baseURL: isOpenAI ? undefined : config.deepseek.baseURL,
    }),
    model: isOpenAI ? "gpt-4o" : "deepseek-chat",
  };
}

function safeParseJSON(text: string) {
  const cleaned = text.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  try { return JSON.parse(cleaned); } catch { /* ignore */ }
  const first = cleaned.indexOf("{");
  const last = cleaned.lastIndexOf("}");
  if (first !== -1 && last !== -1) {
    try { return JSON.parse(cleaned.substring(first, last + 1)); } catch { /* ignore */ }
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const { finalReport, formData, mcqResults, language } = await req.json();

    const gaps: string[] = finalReport?.gapAnalysis?.criticalCompetencyGaps || [];
    const weaknesses: string[] = finalReport?.swot?.weaknesses || [];
    const recommendedRoles: string[] = finalReport?.recommendedRoles || [];
    const strategicRadar = finalReport?.strategicRadar || null;
    const sectors: string = formData?.sectors || "";
    const hardScore: number = mcqResults?.hardScore ?? 0;
    const softScore: number = mcqResults?.softScore ?? 0;
    const lang = language || "en";

    const langInstruction =
      lang === "ar"
        ? "IMPORTANT: Respond entirely in Arabic. All text must be in Arabic."
        : lang === "fr"
        ? "IMPORTANT: Respond entirely in French. All text must be in French."
        : "Respond in English.";

    const systemPrompt = `You are an elite HR Development Strategist and Corporate Training Architect with 20+ years of experience at McKinsey, BCG, and top-tier talent firms.

Your mission: Create a precise, personalized Skills Development Blueprint for a professional based on their diagnostic data.

${langInstruction}

CRITICAL RULES:
- Every gap MUST map to a SPECIFIC, ACTIONABLE workshop and simulation
- Workshops should feel realistic and implementable (not generic)
- Simulations must be sector-specific (based on: ${sectors})
- Priority levels must reflect real career impact, not just competence gaps
- Include MATC (M.A Training & Consulting) as the workshop provider where relevant
- Hard Score: ${hardScore}% | Soft Score: ${softScore}% — use these to calibrate severity
- **LANGUAGE CLARITY:** Use simple, accessible, and direct language. Avoid complex buzzwords or academic jargon. Use general or context-relevant examples. Do NOT use irrelevant geographic examples (e.g., Nigerian). Keep the tone "easy to understand" (كلام ساهل).

RESPOND ONLY WITH VALID JSON — no markdown, no preamble:
{
  "overallDevelopmentScore": <number 0-100, current professional readiness>,
  "timeToOptimalReadiness": "<e.g. '4-6 months'>",
  "immediateAlert": "<one sentence — the most urgent career blocker>",
  "gaps": [
    {
      "name": "<gap name>",
      "category": "<'Technical' | 'Soft Skills' | 'Leadership' | 'Industry Knowledge'>",
      "priority": "<'Critical' | 'High' | 'Moderate' | 'Low'>",
      "impact": "<specific career consequence if not addressed>",
      "timeToClose": "<e.g. '6-8 weeks'>",
      "currentScore": <0-100>,
      "targetScore": <0-100>,
      "recommendedWorkshop": {
        "title": "<workshop title>",
        "duration": "<e.g. '16h over 2 days'>",
        "format": "<'Online Live' | 'In-Person' | 'Self-Paced'>",
        "provider": "M.A Training & Consulting",
        "priority": "<'Urgent' | 'Important' | 'Optional'>",
        "expectedROI": "<career impact after completion>"
      },
      "recommendedSimulation": {
        "title": "<simulation scenario title>",
        "duration": "<e.g. '90 minutes'>",
        "difficulty": "<'Beginner' | 'Intermediate' | 'Advanced'>",
        "tests": ["<skill1>", "<skill2>", "<skill3>"]
      },
      "quickAction": "<one specific action they can do THIS WEEK>"
    }
  ],
  "simulationCatalog": [
    {
      "title": "<scenario title>",
      "contextSector": "<sector-specific scenario context>",
      "duration": "<e.g. '60-90 minutes'>",
      "difficulty": "<'Beginner' | 'Intermediate' | 'Advanced'>",
      "tests": ["<skill1>", "<skill2>"],
      "whyRecommended": "<direct link to their diagnostic result>",
      "priority": <1-5, 1 = most urgent>
    }
  ],
  "developmentTimeline": [
    {
      "phase": "<e.g. 'Phase 1: Foundation'>",
      "duration": "<e.g. 'Month 1-2'>",
      "focus": "<main focus area>",
      "actions": ["<action1>", "<action2>", "<action3>"],
      "expectedOutcome": "<measurable change after this phase>"
    }
  ],
  "workshopRecommendations": {
    "technical": ["<workshop1>", "<workshop2>"],
    "softSkills": ["<workshop1>"],
    "leadership": ["<workshop1>"],
    "industryKnowledge": ["<workshop1>"]
  }
}`;

    const userPrompt = `Generate a Skills Development Blueprint for this professional:

SECTOR: ${sectors}
TARGET ROLES: ${recommendedRoles.join(", ")}
PROFILE MATURITY: ${finalReport?.maturityLevel || "N/A"}
FINAL VERDICT: ${finalReport?.finalVerdict || "N/A"}

CRITICAL COMPETENCY GAPS (from diagnostic):
${gaps.map((g: string, idx: number) => `${idx + 1}. ${g}`).join("\n")}

SWOT WEAKNESSES:
${weaknesses.map((w: string) => `- ${w}`).join("\n")}

MCQ PERFORMANCE:
- Hard Skills: ${hardScore}% (${hardScore < 60 ? "Below average — critical" : hardScore < 75 ? "Average — needs improvement" : "Good"})
- Soft Skills: ${softScore}% (${softScore < 60 ? "Below average — critical" : softScore < 75 ? "Average — needs improvement" : "Good"})

STRATEGIC RADAR:
${
  strategicRadar
    ? Object.entries(strategicRadar)
        .map(([k, v]) => `- ${k}: ${v}/10`)
        .join("\n")
    : "Not available"
}

Generate 4-6 gaps maximum. Make simulations vivid and sector-specific for: ${sectors}.`;

    const { client, model } = await getAI();
    const response = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.6,
      max_tokens: 4000,
    });

    const content = response.choices[0]?.message?.content || "";
    const blueprint = safeParseJSON(content);

    if (!blueprint) {
      return NextResponse.json({ error: "Failed to parse blueprint from AI response" }, { status: 500 });
    }

    return NextResponse.json({ success: true, blueprint });
  } catch (error) {
    console.error("Skills Blueprint API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
