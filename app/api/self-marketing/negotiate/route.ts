import { NextResponse } from "next/server";
import { generateDeepSeekChat } from "@/lib/deepseek";
import OpenAI from "openai";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { message, preferences, report, language, history, userId } = body;

        const systemPrompt = `
        You are a Top-Tier Executive Career Negotiator and Market Strategist.
        Your goal is to have a realistic, blunt, and highly strategic negotiation with a high-level professional.
        
        CONTEXT:
        - User's Current Profile (Audit Report): ${JSON.stringify(report)}
        - User's Desired Target: Role (${preferences.job}), Salary (${preferences.salary}), Benefits (${preferences.benefits})
        - User's Motivation: ${preferences.motivation}

        RULES:
        1. NO FLATTERY. You must be realistic. If their profile doesn't match their salary expectation, tell them why.
        2. Negotiate and challenge them. Ask deep questions: Why do they deserve this? Is it the right timing? Are they running away from a problem or moving towards a goal?
        3. Use a tone of an elite headhunter (McKinsey/Bain style).
        4. Provide advice based on market friction vs. their current "Value Weight".
        5. If they seem "ready" or have defended their position well, you can acknowledge it, but always keep a "higher standard" bar.
        6. Response must be in ${language === 'ar' ? 'Arabic' : 'English'}.
        7. Keep responses concise but powerful.
        `;

        const response = (await generateDeepSeekChat([
            { role: "system", content: systemPrompt },
            ...history,
            { role: "user", content: message }
        ])) as OpenAI.Chat.Completions.ChatCompletion;

        const reply = response.choices?.[0]?.message?.content || 
                      (language === 'ar' ? "عذراً، لم أستطع تحليل طلبك. حاول مجدداً." : "Sorry, I couldn't process that. Try again.");

        // SAVE TO DB persistence
        if (userId) {
            const connectDB = (await (import("@/lib/mongodb"))).default;
            const Diagnosis = (await (import("@/models/Diagnosis"))).default;
            await connectDB();
            await Diagnosis.findOneAndUpdate(
                { userId: userId },
                { 
                    $set: { 
                        negotiationHistory: [...history, { role: 'user', content: message, timestamp: new Date() }, { role: 'assistant', content: reply, timestamp: new Date() }] 
                    } 
                },
                { upsert: true }
            );
        }

        return NextResponse.json({ success: true, reply });
    } catch (error) {
        console.error("Negotiation Error:", error);
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}
