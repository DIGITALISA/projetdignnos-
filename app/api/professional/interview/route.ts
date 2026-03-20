import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getAIConfig } from "@/lib/config";

export const maxDuration = 60;

export async function POST(req: Request) {
    try {
        const { narrative, auditResult, language } = await req.json();

        const aiConfig = await getAIConfig();
        const client = new OpenAI({
            apiKey: aiConfig.deepseek.apiKey || aiConfig.openai.apiKey,
            baseURL: aiConfig.activeProvider === 'deepseek' ? aiConfig.deepseek.baseURL : "https://api.openai.com/v1"
        });

        const model = aiConfig.activeProvider === 'deepseek' ? 'deepseek-chat' : 'gpt-4o';

        const systemPrompt = `You are a Senior Career Consultant and Market Analyst representing modern professional standards.
You are now entering "Phase 2: Strategic Interview" with a candidate.

CONTEXT:
Modern professional markets across all sectors and levels are seeking clarity, impact, and value. Your role is to guide the candidate to present themselves in a way that matches these standards—whether they are entry-level, mid-career, or senior professionals.

BACKGROUND:
The candidate submitted this career narrative: "${narrative}"
Our internal audit (Phase 1) identified them as: "${auditResult.professionalIdentity}".

YOUR TASK (The First Message):
You must open the interview with a high-impact, professional, and balanced message. 
1. OBSERVATION & FEEDBACK: Provide a firm, professional analysis of their introduction. Instead of an aggressive attack, use a constructive "Consultant-to-Professional" tone. Evaluate how well they communicated their value, clarity, and consistency.
2. MARKET INSIGHT: Explain what modern recruiters and companies—at their specific level and sector—actually look for (e.g., clarity of tasks, measurable results, specialized skills, or strategic vision).
3. GUIDANCE: Highlight specific areas where their narrative can be strengthened to better align with professional expectations (e.g., "Adding more focus on your specific contributions would help," or "Your transition between roles could be clearer to show growth").
4. OPENING QUESTION: Ask a sharp, relevant question to dive deeper into their experience or ask them to refine a specific part of their story.

Persona: Firm, Professional, Insightful, and Constructive. Avoid being overly aggressive or using "attack" language.
Language: ${language === 'ar' ? 'Arabic (Formal/Fus-ha)' : language === 'fr' ? 'French' : 'English'}.
Format: Return a clean character message. Do not use JSON here, just the text.`;

        const response = await client.chat.completions.create({
            model: model,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: "Open the interview session based on my previous audit." }
            ],
            temperature: 0.7
        });

        const firstMessage = response.choices[0]?.message?.content;

        return NextResponse.json({ success: true, message: firstMessage });

    } catch (error) {
        console.error("Interview API Error:", error);
        return NextResponse.json({ success: false, error: "Failed to initialize interview." }, { status: 500 });
    }
}
