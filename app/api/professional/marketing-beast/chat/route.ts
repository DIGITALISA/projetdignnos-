import { NextResponse } from 'next/server';
import { getAIConfig } from '@/lib/config';

export const maxDuration = 120;

export async function POST(req: Request) {
    try {
        const { messages, diagnosisContext, targetScenario, language } = await req.json();
        const config = await getAIConfig();
        
        const isOpenAI = config.activeProvider === 'openai';
        const apiKey = isOpenAI ? config.openai.apiKey : config.deepseek.apiKey;
        const baseURL = isOpenAI ? 'https://api.openai.com/v1' : config.deepseek.baseURL;
        const model = isOpenAI ? 'gpt-4-turbo-preview' : 'deepseek-chat';

        const systemPrompt = `
You are a High-Level Decision Maker (Director or HR Manager).
A professional (the user) is sitting across from you. Their goal is to "Sell Themselves" to get a Promotion, a Salary Increase, or better Perks/Privileges.

USER CONTEXT (From Diagnosis):
${JSON.stringify(diagnosisContext)}

TARGET SCENARIO:
${targetScenario || "Negotiating for better career standing (Promotion/Raise/Perks)"}

YOUR MISSION (The "Marketing Beast" Simulation):
1. Act as a tough but fair executive. 
2. You know their diagnosis scores and strengths. 
3. Challenge them! Ask them why they think they deserve what they are asking for based on their impact.
4. Focus on ROI (Return on Investment) for the company.
5. Ask ONLY ONE question at a time.
6. Push them to quantify their achievements. If they are vague, call it out.

SIMULATION STYLE:
- Professional, sharp, and authoritative.
- Use the language: ${language === 'ar' ? 'Formal Arabic (Fusha)' : language === 'fr' ? 'French' : 'English'}.
- Always acknowledge their strengths from the diagnosis but ask for the "Next Level" proof.

FINAL TRIGGER:
When the user has convinced you (usually after 3-5 rounds), append "[SIMULATION_COMPLETE]" followed by a structured report:

1. EXECUTIVE VERDICT: (A short paragraph on their market standing).
2. PITCH STRATEGY: (Exact advice on how they should start the meeting/conversation for this scenario).
3. KEY VALUE PILLARS: (3 specific bullet points they must mention to sell themselves).
4. OBJECTION HANDLING: (Tips on how to answer the toughest questions mentioned during the simulation).

Use the language: ${language === 'ar' ? 'Formal Arabic (Fusha)' : language === 'fr' ? 'French' : 'English'}.
Make sure the tone of the final report is empowering but strategically sharp.
`;

        const payloadMessages = messages.length > 0 ? messages : [
            { role: 'user', content: language === 'ar' ? 'أنا جاهز لعرض قيمتي المهنية وتفاوض على مستقبلي.' : 'I am ready to demonstrate my professional value and negotiate my future.' }
        ];

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
                    ...payloadMessages
                ],
                temperature: 0.8,
            }),
        });

        const data = await response.json();
        return NextResponse.json({ 
            success: true, 
            message: data.choices[0].message.content 
        });

    } catch (error: unknown) {
        console.error("Marketing Beast API Error:", error);
        return NextResponse.json({ success: false, error: 'Simulation Error' }, { status: 500 });
    }
}
