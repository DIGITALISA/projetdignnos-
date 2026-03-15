import { NextRequest, NextResponse } from "next/server";
import { generateDeepSeekChat } from "@/lib/deepseek";

interface Message {
    role: 'system' | 'assistant' | 'user';
    content: string;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { phase, history, report, language, phase1Data } = body;

        let systemPrompt = "";
        let userPrompt = "";

        // Total target: ~10 questions (Past) + ~5 scenarios (Future/Decision)
        const totalMessages = history.filter((m: Message) => m.role === 'assistant').length;

        if (phase === 'interview') {
            if (totalMessages >= 15) {
                // Trigger Evaluation
                systemPrompt = `You are a Master HR Strategic Auditor. You have completed a deep probe into the user's career logic.
                Analyze the transcript and provide a BRUTAL yet ELITE professional character report.
                Focus on: Is this person a "Mercenary" (money-driven), a "Builder" (growth-driven), or a "Stagnator" (comfort-driven)? 
                Do they have a real career plan or just reacting to life?
                
                Return ONLY a JSON object:
                {
                    "score": number (Strategic Maturity 0-100),
                    "summary": "Deep psychological & professional profile (4-5 sentences)",
                    "corrections": ["Specific mindset shifts needed"],
                    "alignmentNotes": ["Logic gaps identified in their career choices"],
                    "actionPlan": "A sharp 3-step strategy to fix their career trajectory",
                    "archetype": "Mercenary | Builder | Comfort-Seeker | Visionary"
                }
                Language: ${language || 'ar'}.`;
                userPrompt = `Full Transcript: ${JSON.stringify(history)}\nOriginal Report: ${JSON.stringify(report)}\nCareer History: ${JSON.stringify(phase1Data)}`;
            } else if (totalMessages < 10) {
                // Phase: Investigation (10 Questions)
                systemPrompt = `You are an Elite HR Strategic Auditor. Your goal is to dissect the user's professional history.
                Based on their career history (${JSON.stringify(phase1Data?.positions || [])}), ask ONE sharp, deep question at a time.
                Focus on:
                1. Logic of transitions (Why move from Job A to B?).
                2. Tenure duration (Why stay for X years? What held them there?).
                3. The "Trigger" (What exactly made them leave or stay?).
                
                Be direct, clinical, and high-level. Avoid pleasantries. 
                Current progress: ${totalMessages + 1}/10 investigative questions.
                Language: ${language || 'ar'}.`;
                userPrompt = `History: ${JSON.stringify(phase1Data)}\nTranscript: ${JSON.stringify(history)}`;
            } else {
                // Phase: 5 Scenarios (Future Decisions)
                systemPrompt = `You are a Master of Professional Scenarios. You have investigated their past, now test their FUTURE logic.
                Present ONE complex decision scenario at a time.
                Examples: 
                - "If you are in this role and get a 40% higher offer from a competitor but a toxic environment, what is your logic for the choice?"
                - "A startup offers you equity but 0 salary for 6 months. How do you evaluate this against your current plan?"
                
                The goal is to see if they choose growth, money, or comfort.
                Current progress: Scenario ${totalMessages - 9}/5.
                Language: ${language || 'ar'}.`;
                userPrompt = `Transcript: ${JSON.stringify(history)}`;
            }
        }

        const response = await generateDeepSeekChat([
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ]);

        const content = response.choices[0].message.content;
        if (!content) throw new Error("Empty response from AI");

        if (totalMessages >= 15) {
            const jsonStr = content.match(/\{[\s\S]*\}/)?.[0] || content;
            return NextResponse.json({ success: true, evaluation: JSON.parse(jsonStr) });
        }

        return NextResponse.json({ success: true, nextQuestion: content });

    } catch (error) {
        console.error("Simulation API Error:", error);
        return NextResponse.json({ success: false, error: "Internal Error" }, { status: 500 });
    }
}
