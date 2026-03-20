import { NextResponse } from 'next/server';
import { getAIConfig } from '@/lib/config';

export const maxDuration = 120;

export async function POST(req: Request) {
    try {
        const fullDataContext = await req.json();
        const { language } = fullDataContext;
        const config = await getAIConfig();
        
        const isOpenAI = config.activeProvider === 'openai';
        const apiKey = isOpenAI ? config.openai.apiKey : config.deepseek.apiKey;
        const baseURL = isOpenAI ? 'https://api.openai.com/v1' : config.deepseek.baseURL;
        const model = isOpenAI ? 'gpt-4-turbo-preview' : 'deepseek-chat';

        const systemPrompt = `
You are a World-Class Executive Consultant and Career Psychologist.
Your task is to synthesize the ENTIRE professional diagnostic journey into one MASTER COMPREHENSIVE REPORT for ${fullDataContext.userName || 'the user'}.

CONCLUDING MESSAGE REQUIREMENT:
The user has just finished a multi-stage diagnostic (Experience Audit, Skill Assessment, Mindset Analysis, Strategic Challenges). 
Start the executive summary with a high-end appreciative message: "We hope you enjoyed this diagnostic journey...".
Explain that this comprehensive analysis is not just a result, but the Foundation for their customized PRO experience.

PRO MODULES TO TEASE (Paid/Exclusive):
1. **Premium 1-on-1 Simulations**: Advanced Job interview and corporate scenario simulations based on the gaps identified here.
2. **Personalized Dynamic Roadmap 2.0**: An evolving professional growth map that updates automatically with their progress.
3. **Executive Simulation Studio**: Real-time stress-testing of strategic decisions.

JSON STRUCTURE REQUIRED:
{
  "executiveSummary": "A powerful 2-3 paragraph synthesis. Integrate the appreciation and explain how this foundation drives the upcoming PRO modules.",
  "holisticScore": 85,
  "pillarAnalysis": {
    "technical": "Assessment of technical depth (referencing MCQ results)",
    "strategic": "Analysis of their chosen path and business logic",
    "psychological": "Analysis of mindset, adaptability, and leadership potential"
  },
  "marketabilityVerdict": "Elite view on their current market value and positioning.",
  "premiumOpportunity": "Explicitly explain how the PRO simulations and dynamic roadmaps will turn these insights into competitive advantages.",
  "finalCallToAction": "A final high-end, inspirational closer."
}

Guidelines:
- McKinsey/BCG Elite Consulting Tone.
- Language: ${language === 'ar' ? 'Formal Arabic (Fusha)' : language === 'fr' ? 'French' : 'English'}.
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
                    { role: 'user', content: `Generate the final master report for: ${JSON.stringify(fullDataContext)}` }
                ],
                response_format: { type: 'json_object' },
                temperature: 0.7,
            }),
        });

        const data = await response.json();
        let content = data.choices[0].message.content;
        
        // Robust JSON extraction
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            content = jsonMatch[0];
        }

        return NextResponse.json(JSON.parse(content));

    } catch (error: unknown) {
        console.error("Master Report Error:", error);
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ error: errorMsg }, { status: 500 });
    }
}
