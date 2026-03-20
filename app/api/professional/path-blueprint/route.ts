import { NextResponse } from 'next/server';
import { getAIConfig } from '@/lib/config';

export const maxDuration = 120;

export async function POST(req: Request) {
    try {
        const { selectedPath, pathContext, grandReport, language } = await req.json();
        const config = await getAIConfig();
        
        const isOpenAI = config.activeProvider === 'openai';
        const apiKey = isOpenAI ? config.openai.apiKey : config.deepseek.apiKey;
        const baseURL = isOpenAI ? 'https://api.openai.com/v1' : config.deepseek.baseURL;
        const model = isOpenAI ? 'gpt-4-turbo-preview' : 'deepseek-chat';

        const systemPrompt = `
You are a Senior Career Implementation Strategist. Your task is to generate a detailed "Implementation Blueprint" for the user's chosen path: "${selectedPath.title}".

This blueprint must be based on:
1. Their full diagnostic report: ${JSON.stringify(grandReport)}
2. Its Synthesis: ${grandReport?.expertSynthesis}
3. Their final deep-dive interview context: ${JSON.stringify(pathContext)}

JSON STRUCTURE REQUIRED:
{
  "tacticalWins": [
    { "title": "Immediate Action Name", "action": "Clear 90-day execution step" },
    { "title": "The Network Move", "action": "Who to talk to and why" }
  ],
  "suggestedRoles": [
    { "title": "Role Title 1", "matchingWhy": "Why this specific role fits their personality and skills" },
    { "title": "Role Title 2", "matchingWhy": "..." }
  ],
  "gapBridge": {
    "skills": ["Skill to learn/fix 1", "Skill 2"],
    "summary": "Deep executive summary of how to bridge their current gaps to reach this goal.",
    "riskWarning": "Critical warning about what could derail them personally.",
    "goldenAdvice": "One powerful piece of wisdom for this specific person."
  }
}

Guidelines:
- If "New Job": Focus on market positioning and interview readiness.
- If "Promotion/Internal": Focus on political capital and project leadership.
- If "Freelance": Focus on client acquisition and low-risk testing.
- Be BLUNT and REALISTIC. Use the diagnostic facts (e.g., if they have low leadership score, do not suggest VP roles yet).

Language: ${language === 'ar' ? 'Arabic' : language === 'fr' ? 'French' : 'English'}.
`;

        const response = await fetch(`${baseURL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: model,
                messages: [{ role: 'system', content: systemPrompt }],
                response_format: { type: 'json_object' },
                temperature: 0.7,
            }),
        });

        const data = await response.json();
        return NextResponse.json(JSON.parse(data.choices[0].message.content));

    } catch (error: unknown) {
        console.error("Path Blueprint Error:", error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown internal error';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
