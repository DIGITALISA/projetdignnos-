import { NextResponse } from 'next/server';
import { getAIConfig } from '@/lib/config';

export const maxDuration = 120;

export async function POST(req: Request) {
    try {
        const { messages, path, grandReport, language } = await req.json();
        const config = await getAIConfig();
        
        const isOpenAI = config.activeProvider === 'openai';
        const apiKey = isOpenAI ? config.openai.apiKey : config.deepseek.apiKey;
        const baseURL = isOpenAI ? 'https://api.openai.com/v1' : config.deepseek.baseURL;
        const model = isOpenAI ? 'gpt-4-turbo-preview' : 'deepseek-chat';

        const systemPrompt = `
You are a High-Stakes Career Strategist and Implementation Coach.
The user has JUST selected a specific strategic path: "${path.title}".

PATH DESCRIPTION: ${path.description}
DIAGNOSTIC CONTEXT:
- Mindset: ${grandReport?.mindsetAnalysis?.mindsetType}
- Analysis Highlights: ${grandReport?.expertSynthesis}

YOUR GOAL in this "Path Deep-Dive":
1. START THE CONVERSATION IMMEDIATELY. Analyze the user's diagnostic profile against this specific path.
2. Be a tough but fair mentor. Challenge their readiness.
3. IMPORTANT: Ask ONLY ONE tactical question at a time. Do NOT list multiple questions.
4. Keep the pace conversational. After the user answers, provide feedback and then ask the NEXT question.
5. In total, ask about 3-4 deep questions to fully vet their readiness.
6. MANDATORY: When you feel the user is ready and has a clear plan, append "[READY_FOR_BLUEPRINT]" to the end of your last message to trigger the final document generation.

Tone: Serious, tactical, high-stakes advisor.
Language: ${language === 'ar' ? 'Formal Arabic (Fusha)' : language === 'fr' ? 'French' : 'English'}.
`;

        const startTrigger = language === 'ar' 
            ? `ابدأ جلسة تعميق المسار الاستراتيجي: ${path.title}. حلل ملفي وتحدَّ جاهزيتي.` 
            : language === 'fr'
            ? `Commencez la session d'approfondissement pour le parcours : ${path.title}. Analysez mon profil et défiez ma préparation.`
            : `Start the path deep-dive session for: ${path.title}. Analyze my profile and challenge my readiness.`;

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
                    ...(messages && messages.length > 0 ? messages : [{ role: 'user', content: startTrigger }])
                ],
                temperature: 0.7,
            }),
        });

        const data = await response.json();
        
        if (!data.choices || data.choices.length === 0) {
            console.error("AI Provider Error:", data);
            throw new Error(data.error?.message || 'Invalid AI response or provider error');
        }

        return NextResponse.json({ 
            success: true, 
            message: data.choices[0].message.content 
        });

    } catch (error: unknown) {
        console.error("Path Simulation Error:", error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown internal error';
        return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
    }
}
