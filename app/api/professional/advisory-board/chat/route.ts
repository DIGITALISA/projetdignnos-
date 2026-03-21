import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Diagnosis from '@/models/Diagnosis';
import { getAI } from '@/lib/deepseek';

const EXPERT_PROMPTS: Record<string, string> = {
    hr: `You are Dr. Salem, an Elite HR & Career Transition Strategist.
Your role: Protect the user's career path, advise on salary negotiations, and perform risk analysis before resignations.
Tone: Honest, realistic, analytical, and highly protective. Do not sugarcoat risks.`,
    branding: `You are Ms. Nada, a Premium Personal Branding & Market Positioning Expert.
Your role: Build digital identity, strategize LinkedIn presence, teach skill marketing, and increase their market value.
Tone: Energetic, visionary, marketing-focused, empowering.`,
    technical: `You are Eng. Tarek, a Technical & Domain Knowledge Mentor.
Your role: Explain complex theoretical or technical concepts clearly, provide best practices, and demystify methodologies like Agile, Scrum, or deep technical architecture.
Tone: Academic, clear, structured, and pedagogical.`,
    strategic: `You are Dr. Omar, an Executive Crisis Solver & Strategist.
Your role: Solve complex work problems, fix team productivity issues, and put out operational fires.
Behavior: Do NOT just give a generic answer. Ask clarifying, surgical questions first, then deliver a comprehensive, actionable battle plan.
Tone: Executive, sharp, no-nonsense, clinical.`
};

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, expertId, messages, language = 'en' } = body;

        if (!email || !expertId || !messages) {
            return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
        }

        const basePrompt = EXPERT_PROMPTS[expertId];
        if (!basePrompt) {
            return NextResponse.json({ success: false, error: 'Expert not found' }, { status: 404 });
        }

        await connectDB();
        const userDiag = await Diagnosis.findOne({ userId: email }).lean();

        let diagnosticContext = "No prior diagnosis found.";
        if (userDiag) {
            const prog = userDiag.professionalProgress || {};
            
            diagnosticContext = JSON.stringify({
                original_cv: userDiag.cvText,
                audit_analysis: prog.result, // This contains the strategic audit
                competency_assessment: prog.assessmentAnalysis,
                mindset_analysis: prog.mindsetAnalysis,
                strategic_paths: prog.strategicPaths,
                global_synthesis: prog.finalMasterReport || prog.grandFinalReport
            }, null, 2);
        }

        const systemMessage = `
${basePrompt}

**CRITICAL DIRECTIVE**: You are speaking DIRECTLY to the user based on their CONFIDENTIAL Diagnosis Report provided below.
**Language**: You MUST respond in ${language}.

**Confidential Diagnosis Data:**
${diagnosticContext}

**Instructions**:
- Start addressing their last message directly. 
- Use the diagnosis context silently to make your advice extremely personalized. Do not say "According to your JSON data..."
- Keep responses professional and well-formatted in markdown.
`;

        const { client, model } = await getAI();

        const response = await client.chat.completions.create({
            model: model,
            messages: [
                { role: 'system', content: systemMessage },
                ...messages
            ],
            temperature: 0.7,
            max_tokens: 2000
        });

        const reply = response.choices[0]?.message?.content;

        return NextResponse.json({ success: true, reply });
    } catch (error) {
        console.error('Advisory Chat Error:', error);
        return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
    }
}
