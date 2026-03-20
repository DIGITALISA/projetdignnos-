import { NextResponse } from 'next/server';
import { getAIConfig } from '@/lib/config';

export const maxDuration = 120;

export async function POST(req: Request) {
    try {
        const { messages, targetJob, targetCompany, jobDescription, diagnosisContext, language, mode } = await req.json();
        const config = await getAIConfig();
        
        const isOpenAI = config.activeProvider === 'openai';
        const apiKey = isOpenAI ? config.openai.apiKey : config.deepseek.apiKey;
        const baseURL = isOpenAI ? 'https://api.openai.com/v1' : config.deepseek.baseURL;
        const model = isOpenAI ? 'gpt-4-turbo-preview' : 'deepseek-chat';

        let strategicFocus = "";
        let expertPersona = "Elite Executive Headhunter and ATS Specialist";

        if (mode === 'target') {
            strategicFocus = `
TARGET FOCUS & GAP ANALYSIS (SNIPER MODE):
- Job: ${targetJob || 'Not specified'}
- Company: ${targetCompany || 'Not specified'}
- Job Description:
"""
${jobDescription || 'Not provided. Rely on standard industry knowledge for this role.'}
"""
Your task: Identify the clinical gap between their diagnosis context and the required skills in the Job Description. Ask questions to extract specific metrics that bridge this gap perfectly.
`;
        } else if (mode === 'internal') {
            expertPersona = "Senior Corporate Growth Consultant and Internal Talent Architect";
            strategicFocus = `
INTERNAL ELEVATION & PROMOTION FOCUS:
The user is NOT looking to leave their company. They want to prepare for a PROMOTION or SALARY RAISE.
Your task: Focus on their "Internal ROI". Ask about their achievements in the last 12-24 months within their CURRENT organization. 
Extract data on: Cost savings, revenue generated, team growth, and cross-departmental impact. 
Don't ask about external market value; ask about their indispensability to the current firm.
`;
        } else {
            strategicFocus = `
GENERAL ATS STRATEGY (MASTER PROFILE):
The user wants a powerful, versatile executive profile for the global market.
Your task: Highlight their "Transferable Authority". Ask questions that reveal high-level leadership, strategic execution, and P&L responsibility.
Ensure the profile passes the most advanced ATS filters while maintaining an executive tone.
`;
        }

        const systemPrompt = `
You are a ${expertPersona}.
Your goal is to help the user build a world-class Professional Identity based on their high-score professional diagnosis.

USER CONTEXT (From Diagnosis):
${JSON.stringify(diagnosisContext)}

${strategicFocus}

INTERVIEW STYLE:
1. Act as a high-end consultant. 
2. Use the diagnosis data as a foundation. Don't ask for things you already know.
3. Focus on quantifying achievements (KPIs, numbers, impact).
4. Ask ONLY ONE powerful question at a time.
5. Provide brief feedback on their answer before moving to the next question.

FINAL TRIGGER:
When you have enough information to build the resume/pitch (usually after 3-4 deep questions), append "[READY_FOR_RESUME]" at the end of your message.

Language: ${language === 'ar' ? 'Formal Arabic (Fusha)' : language === 'fr' ? 'French' : 'English'}.
`;

        const payloadMessages = messages.length > 0 ? messages : [
            { role: 'user', content: language === 'ar' ? 'مرحباً، خذ وقتك في مراجعة التشخيص ثم تفضل بطرح أول سؤال لبناء سيرتي الذاتية.' : 'Hello, please review my diagnosis and ask the first question to build my resume.' }
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
                temperature: 0.7,
            }),
        });

        const data = await response.json();
        return NextResponse.json({ 
            success: true, 
            message: data.choices[0].message.content 
        });

    } catch (error: unknown) {
        console.error("Resume Studio API Error:", error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
    }
}
