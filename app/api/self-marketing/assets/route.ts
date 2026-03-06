import { NextResponse } from "next/server";
import { generateDeepSeekChat } from "@/lib/deepseek";
import OpenAI from "openai";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { chat, preferences, report, language, userId } = body;

        const systemPrompt = `
        You are a Top-Tier Executive Career Asset Generator.
        Analyze the previous conversation history, the user's audit report (${JSON.stringify(report)}), and their desires (Target: ${preferences.job}, Salary: ${preferences.salary}) to generate two professional products.

        PRODUCTS (Must be returned in valid JSON):
        - assets: { cv: string (Markdown formatted), report: string (Strategic text - Markdown formatted) }

        CV RULES:
        - Must be highly ATS-optimized.
        - Must highlight achievements over duties.
        - Must focus on the "Value Weight" required for a ${preferences.job}.
        - Format the CV with a header, profile, experience, education, and skills.
        
        REPORT RULES:
        - This is NOT just advice; it is a "Comprehensive Executive Strategic Report" (التقرير الاستراتيجي التنفيذي الشامل).
        - Structure it as a formal document to be presented to a Board of Directors or Elite Hiring Committees.
        - Sections must include: I. Executive Summary, II. Strategic Maturity & Value Prop, III. Leadership Impact Analysis (based on audit data), IV. Market Positioning & Synergy, V. Five-Year Strategic Roadmap.
        - Integrate the participant's "Value Weight", leadership fingerprint, and audit results to prove their readiness for ${preferences.job}.
        - Use evidence-based language. It should justify why they deserve ${preferences.salary}.
        - Format with professional markdown headers and clean structure.
        
        TONE: Formal, High-Level, Analytical, Uncompromisingly Professional.
        LANGUAGE: ${language === 'ar' ? 'Arabic' : 'English'}.
        `;

        const response = (await generateDeepSeekChat([
            { role: "system", content: systemPrompt },
            { role: "user", content: "Analyze our negotiation and generate the final assets. Previous Chat: " + JSON.stringify(chat) }
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
