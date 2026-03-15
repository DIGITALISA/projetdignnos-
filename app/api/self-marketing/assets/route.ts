import { NextResponse } from "next/server";
import { generateDeepSeekChat } from "@/lib/deepseek";
import OpenAI from "openai";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { chat, preferences, report, language, userId, evaluation } = body;

        const systemPrompt = `
        You are a Master Executive Assets Auditor.
        Your mission is to synthesize the results of a "Positioning Stress Test" and create a professional Audit Package.
        
        INPUT DATA:
        - Preliminary Audit: ${JSON.stringify(report)}
        - Target Ambition: ${preferences.job} at ${preferences.salary}
        - Stress-Test Verdict & Evaluation: ${JSON.stringify(evaluation)}
        
        PRODUCTS REQUIRED (Return as valid JSON):
        - assets: { cv: string (Markdown), report: string (Strategic Audit Report - Markdown) }

        AUDIT REPORT STRUCTURE:
        1. Executive Positioning Verdict: Based on the stress test.
        2. Leverage Points: What the candidate can use to win.
        3. Critical Risk Mitigation: Addressing the "Red Flags" found.
        4. Performance-to-Salary Alignment: Justifying the ${preferences.salary} ask or correcting it.
        5. Final Implementation Roadmap.

        TONE: Board-level, clinical, high-authority.
        LANGUAGE: ${language === 'ar' ? 'Arabic' : 'English'}.
        `;

        const response = (await generateDeepSeekChat([
            { role: "system", content: systemPrompt },
            { role: "user", content: "Synthesize the positioning audit and finalize the assets. Transcript: " + JSON.stringify(chat.slice(-10)) }
        ])) as OpenAI.Chat.Completions.ChatCompletion;

        const content = response.choices?.[0]?.message?.content || "";
        const jsonStr = content.match(/\{[\s\S]*\}/)?.[0] || content;
        const data = JSON.parse(jsonStr || "{}");

        // SAVE TO DB persistence
        if (userId && data.assets) {
            const connectDB = (await (import("@/lib/mongodb"))).default;
            const Diagnosis = (await (import("@/models/Diagnosis"))).default;
            await connectDB();
            await Diagnosis.findOneAndUpdate(
                { userId: userId },
                { 
                    $set: { 
                        marketingAssets: { ...data.assets, generatedAt: new Date() } 
                    } 
                },
                { upsert: true }
            );
        }

        return NextResponse.json({ success: true, assets: data.assets });
    } catch (error) {
        console.error("Asset Generation Error:", error);
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
    }
}
