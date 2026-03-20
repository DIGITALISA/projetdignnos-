import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getAIConfig } from '@/lib/config';

export async function POST(req: NextRequest) {
    try {
        const { narrative, auditResult, messages, language } = await req.json();

        const aiConfig = await getAIConfig();

        const client = new OpenAI({
            apiKey: aiConfig.deepseek.apiKey || aiConfig.openai.apiKey,
            baseURL: aiConfig.activeProvider === 'deepseek' ? aiConfig.deepseek.baseURL : "https://api.openai.com/v1"
        });

        const model = aiConfig.activeProvider === 'deepseek' ? 'deepseek-chat' : 'gpt-4o';

        const systemPrompt = `You are a Senior Strategic Career Auditor. Your task is to generate a final, objective, and highly professional career report for a candidate.

DATA SOURCES:
1. Original Narrative: "${narrative}"
2. Preliminary Audit: ${JSON.stringify(auditResult)}
3. Strategic Interview History: ${JSON.stringify(messages)}

YOUR OBJECTIVE:
Synthesize all data into a definitive professional audit. You must be realistic and evidence-based. If the candidate was vague in the interview, reflect that. If they provided strong examples, highlight them.

STRUCTURE OF THE JSON RESPONSE:
{
    "executiveVerdict": "A neutral, powerful summary of the candidate's market standing.",
    "level1Analysis": {
        "score": 0-100,
        "consistency": "Objective evaluation of how truthful and consistent their story was.",
        "presentationQuality": "Feedback on their professional communication style."
    },
    "level2Analysis": {
        "hardSkills": ["List of skills validated by practical examples in the chat"],
        "softSkills": ["Observed behavior like analytical thinking, leadership, etc."],
        "criticalGaps": ["Specific technical or behavioral weaknesses discovered"]
    },
    "level3Analysis": {
        "alignmentScore": 0-100,
        "pathAnalysis": "Is the candidate in the right job? Is their ambition realistic?",
        "marketValue": "High/Medium/Developing"
    },
    "actionPlan": {
        "immediate": ["Tactical steps to improve current status"],
        "strategic": ["Long-term steps for career growth"]
    },
    "finalScore": 0-100
}

Tone: Professional, expert, and strictly data-driven.
Language: ${language === 'ar' ? 'Arabic (Formal/Fus-ha)' : language === 'fr' ? 'French' : 'English'}.
Strictly return ONLY valid JSON.`;

        const response = await client.chat.completions.create({
            model: model,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: "Generate the final comprehensive strategic report based on the full session data." }
            ],
            response_format: { type: 'json_object' }
        });

        const result = JSON.parse(response.choices[0].message.content || '{}');

        return NextResponse.json({
            success: true,
            report: result
        });
    } catch (error) {
        console.error("Final report generation failed:", error);
        return NextResponse.json({ success: false, error: "Report generation failed" }, { status: 500 });
    }
}
