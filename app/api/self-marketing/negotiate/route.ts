import { NextResponse } from "next/server";
import { generateDeepSeekChat } from "@/lib/deepseek";
import OpenAI from "openai";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { message, preferences, report, language, history, userId } = body;

        const isEvaluationPhase = history.length >= 8; // Roughly 4 rounds of Q&A

        const systemPrompt = `
        You are a Master Executive Headhunter and Global Compensation Auditor.
        Your goal is to perform a "Market Value & Positioning Stress Test" on this professional.
        
        CONTEXT:
        - Current Audit Data: ${JSON.stringify(report)}
        - User's Target: Role (${preferences.job}), Target Salary (${preferences.salary}), Perks (${preferences.benefits})
        - Motivation for Move: ${preferences.motivation}

        YOUR TASK:
        1. Probe the gap between their "Ambition" and their "Data-Driven Reality".
        2. Challenge their ROI. Ask: "If a company pays you ${preferences.salary}, what is the 3X value you bring in the first 12 months?"
        3. Audit their exit/entry logic. Are they overvaluing themselves or playing it too safe?
        4. Detect "Mercenary" vs "Strategic Leader" patterns.
        
        CRITICAL RULES:
        - TONE: Clinical, elite, skeptical. You are a gatekeeper for top-tier roles.
        - NO SYMPATHY. Focus only on Market Value, Leverage, and Risk.
        - Respond in ${language === 'ar' ? 'Arabic' : 'English'}.
        
        ${isEvaluationPhase ? `
        EVALUATION MODE TRIGGERED:
        You must now conclude the stress test. 
        Provide a final "Positioning Verdict" in JSON format at the end of your message:
        { "verdict": "string", "marketAlignmentScore": 0-100, "leveragePoints": [], "redFlags": [], "readyForAssets": true }
        ` : 'Continue the probe with one sharp, investigative question.'}
        `;

        const response = (await generateDeepSeekChat([
            { role: "system", content: systemPrompt },
            ...history,
            { role: "user", content: message }
        ])) as OpenAI.Chat.Completions.ChatCompletion;

        const content = response.choices?.[0]?.message?.content || "";
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        const evaluation = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
        const reply = content.replace(/\{[\s\S]*\}/, "").trim();

        // SAVE TO DB persistence
        if (userId) {
            const connectDB = (await (import("@/lib/mongodb"))).default;
            const Diagnosis = (await (import("@/models/Diagnosis"))).default;
            await connectDB();
            await Diagnosis.findOneAndUpdate(
                { userId: userId },
                { 
                    $set: { 
                        positioningAuditHistory: [...history, { role: 'user', content: message }, { role: 'assistant', content: reply }] 
                    } 
                },
                { upsert: true }
            );
        }

        return NextResponse.json({ 
            success: true, 
            reply, 
            evaluation,
            readyForAssets: !!evaluation?.readyForAssets 
        });
    } catch (error) {
        console.error("Positioning Audit Error:", error);
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}
