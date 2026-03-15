import { NextRequest, NextResponse } from "next/server";
import { generateDeepSeekChat } from "@/lib/deepseek";


interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { messages, history, report, language, captureAmbition } = body;

        const systemPrompt = `You are an elite Executive Strategic Coach and Auditor conducting a "Fierce Phase 2 Verification Interview". 
Your mission is to deep-dive into the professional's data to ensure the Strategic Roadmap is built on concrete, verified TRUTHS.

CONTEXT:
- Professional's Data (Positions, Years): ${JSON.stringify(history)}
- Initial Diagnostic Report (Analysis, Strengths, Weaknesses, Goals from Phase 1): ${JSON.stringify(report)}

INSTRUCTIONS:
1. THE OPENING (Message 1): Start with a comprehensive summary of their profile. Mention their positions, years of experience, the goals they stated, and their long-term vision. Ask them if they confirm this map of their career so far.
2. THE DEEP PROBE (Probing Phase): You must scrutinize every major claim. For each key mission or role:
   - Ask what the specific TASK/MISSION was.
   - Ask for the CONCRETE RESULT (KPIs, impact, numbers).
   - Ask for their REACTION (How they handled the challenge, leadership decisions made).
3. THE COACH PERSONA: Act as a mentor. Analyze their responses. If a claim is vague, challenge it. If it's strong, explain why it's strategically valuable but suggest how to sharpen it further for elite selection. Give ADVICE and CORRECTIONS during the conversation.
4. INTEGRATED VERIFICATION: Your goal is not just to "check boxes" but to "develop their profile" through this conversation.
5. AMBITION CAPTURE: If not clearly stated yet, ask for their ultimate "Dream Role" or ambition.
6. CONTINUITY: Only when you have hyper-verified their history, coached them on their gaps, and captured their ambition, should you append [VERIFICATION_COMPLETE].
7. FORMATTING: Wrap any captured ambition in double square brackets: [[AMBITION: Text Here]].
8. TONE: Professional, demanding, yet growth-oriented. "Board-Level Mentorship".

Language: ${language || 'ar'}. Respond only in this language.`;

        const response = await generateDeepSeekChat([
            { role: "system", content: systemPrompt },
            ...messages.map((m: ChatMessage) => ({ role: m.role, content: m.content }))
        ]);

        const content = response.choices[0].message.content || "";
        
        let capturedAmbition = null;
        if (captureAmbition) {
            const match = content.match(/\[\[AMBITION:\s*(.*?)\]\]/);
            if (match) {
                capturedAmbition = match[1];
            }
        }

        return NextResponse.json({ 
            content: content.replace(/\[\[AMBITION:.*?\]\]/g, ""), 
            capturedAmbition 
        });
    } catch (error) {
        console.error("Roadmap Interview Error:", error);
        return NextResponse.json({ error: "Failed to process interview step" }, { status: 500 });
    }
}
