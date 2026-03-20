import { NextResponse } from 'next/server';
import { getAIConfig } from '@/lib/config';

export const maxDuration = 120;

export async function POST(req: Request) {
    try {
        const { messages, grandReport, assessmentAnalysis, mindsetAnalysis, language } = await req.json();
        const config = await getAIConfig();
        
        const isOpenAI = config.activeProvider === 'openai';
        const apiKey = isOpenAI ? config.openai.apiKey : config.deepseek.apiKey;
        const baseURL = isOpenAI ? 'https://api.openai.com/v1' : config.deepseek.baseURL;
        const model = isOpenAI ? 'gpt-4-turbo-preview' : 'deepseek-chat';

        const systemPrompt = `
You are a Senior Executive Career Coach and HR Strategist. 
You are conducting a "Strategic Mirror Session" after a full professional diagnosis.

CORE CONTEXT FROM DIAGNOSIS:
- Grand Report Synthesis: ${JSON.stringify(grandReport?.expertSynthesis)}
- Technical/Assessment Score: ${assessmentAnalysis?.score}/${assessmentAnalysis?.total}
- Mindset Type: ${mindsetAnalysis?.mindsetType}
- Psychological Profile: ${JSON.stringify(mindsetAnalysis?.psychologicalProfile)}

YOUR GOAL:
1. Be a "Strategic Mirror". Use the user's own data to challenge or validate their next move.
2. Maintain realism. Do NOT promise market success. Focus on "Profile Readiness".
3. If this is the START (no messages), present the user with 4 Realistic Pillars based on their profile:
   A. Internal Growth (Promotion/Salary increase in current company).
   B. Strategic Stability (Staying to upskill and fix gaps).
   C. External Market Leap (Job hunting for a better role).
   D. Tactical Pivot (Freelancing or starting a project).
4. Ask the user: "Looking at your diagnosis, which of these paths resonates with your current ambition?"
5. Engage in a brief dialogue (3-4 turns). Challenge them. E.g., if their MCQ score was low but they want a promotion, ask how they plan to handle the technical responsibility.
6. Be transparent: "I don't know your specific boss or market, but your profile readiness suggests..."
7. IMPORTANT: When you feel the user has clarified their intent and the simulation is sufficient, append "[READY_FOR_PATHS]" at the end of your message.

Tone: Professional, direct, analytical, and empathetic but firm.
Language: ${language === 'ar' ? 'Formal Arabic (Fusha)' : language === 'fr' ? 'French' : 'English'}.
`;

        const response = await fetch(`${baseURL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    ...(messages || [])
                ],
                temperature: 0.7,
            }),
        });

        const data = await response.json();
        
        if (!data.choices || data.choices.length === 0) {
            throw new Error('Invalid AI response');
        }

        return NextResponse.json({ 
            success: true, 
            message: data.choices[0].message.content 
        });

    } catch (error: unknown) {
        console.error("Simulation Chat Error:", error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
    }
}
