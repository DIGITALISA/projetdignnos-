import { NextRequest, NextResponse } from "next/server";
import { generateDeepSeekChat } from "@/lib/deepseek";

interface Message {
    role: 'system' | 'assistant' | 'user';
    content: string;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { phase, formData, report, history, language } = body as {
            phase: 'init' | 'scenario' | 'probe',
            formData: { sector: string, goals: string, tasks: string },
            report: unknown,
            history: Message[],
            language: string
        };

        let systemPrompt = "";
        let userPrompt = "";

        if (phase === 'init') {
            systemPrompt = `You are a Senior Strategic Auditor. Review the user's job sector, goals, and tasks. 
            Provide a CONCISE (2-3 sentences), BRUTAL summary of whether they actually understand their role or if they are just doing "busy work".
            Be direct and elite. Language: ${language || 'ar'}.`;
            userPrompt = `SECTOR: ${formData.sector}\nGOALS: ${formData.goals}\nTASKS: ${formData.tasks}\nPREVIOUS_DIAGNOSTIC: ${JSON.stringify(report)}`;
        } 
        
        else if (phase === 'scenario') {
            systemPrompt = `You are a Master of Professional Simulations. Based on the user's role and previous diagnostic, generate ONE highly realistic, complex, and urgent scenario that could happen in their specific sector (${formData.sector}) TODAY.
            The scenario must test their strategic alignment with their goals: ${formData.goals}.
            End the scenario by asking: "List exactly the 3-5 major actions you would take in the first 24 hours to handle this."
            Language: ${language || 'ar'}.`;
            userPrompt = `DATA: ${JSON.stringify(formData)}\nAUDIT: ${JSON.stringify(report)}`;
        }

        else if (phase === 'probe') {
            // Check if it's time to end the simulation (e.g. after 3-4 questions)
            const assistantMessages = history.filter(m => m.role === 'assistant').length;
            
            if (assistantMessages >= 4) {
                // Return Final Evaluation
                systemPrompt = `You are the Final Strategic Judge. provide a BRUTAL EVALUATION of the user's performance in the simulation.
                Return ONLY a JSON object:
                {
                    "score": number (0-100),
                    "summary": "Masterful executive summary of their performance",
                    "corrections": ["list of brutal strategic corrections"],
                    "alignmentNotes": ["how their actions matched or failed their goals"],
                    "actionPlan": "A short, sharp 3-step growth plan"
                }
                Language: ${language || 'ar'}.`;
                userPrompt = `Transcript: ${JSON.stringify(history)}\nOriginal Goals: ${formData.goals}`;
            } else {
                // Ask next probing question
                systemPrompt = `You are probing the user's action plan. Pick ONE action they mentioned and challenge it. 
                Ask a deep, strategic question that forces them to defend the logic behind that action.
                Be concise and authoritative. Language: ${language || 'ar'}.`;
                userPrompt = `Transcript: ${JSON.stringify(history)}`;
            }
        }

        const response = await generateDeepSeekChat([
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ]);

        const content = response.choices[0].message.content;
        if (!content) throw new Error("Empty response from AI");

        if (phase === 'probe' && history.filter(m => m.role === 'assistant').length >= 4) {
            const jsonStr = content.match(/\{[\s\S]*\}/)?.[0] || content;
            return NextResponse.json({ success: true, evaluation: JSON.parse(jsonStr) });
        }

        if (phase === 'init') return NextResponse.json({ success: true, feedback: content });
        if (phase === 'scenario') return NextResponse.json({ success: true, scenario: content });
        if (phase === 'probe') return NextResponse.json({ success: true, nextQuestion: content });

        return NextResponse.json({ success: false });
    } catch (error) {
        console.error("Simulation API Error:", error);
        const errMsg = error instanceof Error ? error.message : "Internal Error";
        return NextResponse.json({ success: false, error: errMsg }, { status: 500 });
    }
}
