import { NextResponse } from "next/server";
import OpenAI from "openai";
import { getAIConfig } from "@/lib/config";

export const maxDuration = 60; // Set timeout for AI processing

export async function POST(req: Request) {
    try {
        const { narrative, language } = await req.json();

        if (!narrative || narrative.length < 50) {
            return NextResponse.json({ 
                success: false, 
                error: language === 'ar' ? "النص قصير جداً لإجراء تدقيق استراتيجي ذي معنى." : "Narrative too short for a meaningful strategic audit." 
            }, { status: 400 });
        }

        const aiConfig = await getAIConfig();
        
        // Ensure we are using the correct provider (DeepSeek by default as per user request)
        const client = new OpenAI({
            apiKey: aiConfig.deepseek.apiKey || aiConfig.openai.apiKey,
            baseURL: aiConfig.activeProvider === 'deepseek' ? aiConfig.deepseek.baseURL : "https://api.openai.com/v1"
        });

        const model = aiConfig.activeProvider === 'deepseek' ? 'deepseek-chat' : 'gpt-4o';

        // 1. Precise Prompt for DeepSeek - The AI is the ONLY author of this audit
        const systemPrompt = `You are the Lead Strategic HR Auditor at MA-TRAINING-CONSULTING, powered by DeepSeek AI.
Your mission is to analyze the provided "Career Narrative" and generate a comprehensive, data-driven, and highly critical Professional Audit Report.

CRITICAL INSTRUCTIONS:
- Do not just summarize what they did; analyze the **Impact** (ROI, savings, scale, growth).
- Identify and extract **Strategic Impact & Case Studies** hidden in their experience.
- Do not be afraid to point out flaws, inconsistencies, or lack of strategic ambition.

OUTPUT STRUCTURE (JSON ONLY):
{
  "professionalIdentity": "A sharp, 3-5 word definition (e.g., 'Stagnant Middle-Management Profile')",
  "executiveSummary": "A sophisticated 3-sentence summary of their current career standing.",
  "strategicCriticism": "A powerful, honest critique of their trajectory, highlighting gaps in leadership, skills, or storytelling.",
  "basicData": {
    "field": "The professional domain",
    "specialization": "Specific niche/focus",
    "education": "Highest academic qualification detected",
    "trainingType": "Academic / Professional / Mixed",
    "yearsOfExperience": "Estimated years based on dates/stages",
    "sector": "e.g., Industrial, Financial, Tech"
  },
  "dimensions": {
    "careerProgression": "Positive Growth / Stable / Declining",
    "progressionIcon": "up / stable / down",
    "responsibilityLevel": "Execution / Expert / Supervisor / Manager / Executive",
    "marketPosition": "Emerging / Competitive / Advanced / Elite",
    "leadershipSignal": "None / Emerging / Proven / Strategic"
  },
  "learningSignals": ["Key Insight 1 derived from their stages", "Key Insight 2..."],
  "indicators": [
    {"label": "Profile Integrity", "score": 0-100, "value": "e.g. Low/High", "color": "rose"},
    {"label": "Strategic Impact", "score": 0-100, "value": "e.g. High ROI", "color": "emerald"},
    {"label": "Executive Readiness", "score": 0-100, "value": "e.g. Strategic", "color": "amber"},
    {"label": "Market Value", "score": 0-100, "value": "e.g. Elite", "color": "indigo"}
  ],
  "strategicImpactInfo": "A deep analysis of their ROI and tangible value delivered in previous roles.",
  "caseStudyPotential": "Identify 2-3 specific achievements that can be transformed into high-impact business case studies.",
  "skills": {
    "detected": ["Skill 1", "Skill 2", "Skill 3"],
    "gaps": ["Critical Missing Skill 1", "Missing Skill 2"]
  },
  "timeline": [
    {"year": "Period", "event": "Internship/Job Title", "duration": "Duration (e.g. 2 years)"}
  ],
  "textAnalysis": {
    "tone": "Descriptive / Passive / Expert / Assertive",
    "clarity": "High / Medium / Low",
    "consistency": "Strong / Fragmented / Contradictory"
  },
  "actionPlan": ["Action 1: Immediate next step", "Action 2: Long term", "Action 3: Skill gap fix"]
}

Language for the report: ${language === 'ar' ? 'Arabic (Formal/Strategic)' : language === 'fr' ? 'French (Management style)' : 'English (High-end Executive style)'}.
RETURN ONLY THE JSON OBJECT. NO MARKDOWN, NO PREAMBLE.`;

        const response = await client.chat.completions.create({
            model: model,
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: `Analyze this Career Narrative:\n\n${narrative}` }
            ],
            response_format: { type: "json_object" },
            temperature: 0.1 // Lower temperature for more stable audit results
        });

        const reportContent = response.choices[0]?.message?.content;

        if (!reportContent) {
            throw new Error("AI returned empty content");
        }

        const analysis = JSON.parse(reportContent);

        return NextResponse.json({
            success: true,
            analysis: analysis
        });

    } catch (error) {
        console.error("Critical Audit API Error:", error);
        return NextResponse.json({ 
            success: false, 
            error: "Failed to connect to DeepSeek AI Core. Please check API configuration." 
        }, { status: 500 });
    }
}
