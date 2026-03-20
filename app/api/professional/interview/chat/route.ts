import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getAIConfig } from "@/lib/config";

export const maxDuration = 120;

export async function POST(req: Request) {
    try {
        const { messages, language } = await req.json();

        const aiConfig = await getAIConfig();
        const client = new OpenAI({
            apiKey: aiConfig.deepseek.apiKey || aiConfig.openai.apiKey,
            baseURL: aiConfig.activeProvider === 'deepseek' ? aiConfig.deepseek.baseURL : "https://api.openai.com/v1"
        });

        const model = aiConfig.activeProvider === 'deepseek' ? 'deepseek-chat' : 'gpt-4o';

        const systemPrompt = `You are a Senior Career Consultant and Market Analyst.
You are conducting a strategic interview structured in 3 distinct levels. 
Your goal is to reach 5 rounds of interaction (10 messages total) before concluding.

STRUCTURE:
- Round 1-2 (Level 1): Verify Consistency & Self-Presentation. Challenge their narrative and clarify their background.
- Round 3-4 (Level 2): Deep-dive into Skills & Gaps. Ask about specific Hard Skills (tools, techniques) and Soft Skills (leadership, teamwork). Identify what they lack to reach the next level.
- Round 5 (Level 3): Job Fit & Ambition. Assess if their current path matches their long-term goals.

TONE:
Firm, professional, and balanced. Redirect them if they are vague. Focus on measurable impact.

STRICT RULES:
1. Count the messages. After 5 rounds of interaction, you MUST conclude the interview.
2. When concluding, provide a final summarizing thought and append the token "[COMPLETED]" at the very end of your final sentence.
3. NEVER mention any specific company like MA-TRAINING. You represent the global market.

Language: ${language === 'ar' ? 'Arabic (Formal/Fus-ha)' : language === 'fr' ? 'French' : 'English'}.`;

        const response = await client.chat.completions.create({
            model: model,
            messages: [
                { role: "system", content: systemPrompt },
                ...messages
            ],
            temperature: 0.7
        });

        const reply = response.choices[0]?.message?.content;

        return NextResponse.json({ success: true, message: reply });

    } catch (error) {
        console.error("Chat API Error:", error);
        return NextResponse.json({ success: false, error: "Failed to process chat." }, { status: 500 });
    }
}
