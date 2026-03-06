import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export const maxDuration = 300; // Increased to 5 minutes
import connectDB from '@/lib/mongodb';
import Diagnosis from '@/models/Diagnosis';

const deepseek = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1',
});

export async function POST(req: NextRequest) {
    try {
        const { userId, language = 'en' } = await req.json();

        if (!userId) {
            return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
        }

        console.log(`[ComprehensiveReport] Generating for user: ${userId} in ${language}`);

        // Connect to database and fetch all diagnosis data
        await connectDB();
        const diagnosisData = await Diagnosis.findOne({ userId }).lean();

        if (!diagnosisData) {
            console.error(`[ComprehensiveReport] No data found for user: ${userId}`);
            return NextResponse.json({ success: false, error: 'No diagnosis data found' }, { status: 404 });
        }

        console.log(`[ComprehensiveReport] Data fetched successfully. Starting AI generation...`);

        // Language instructions
        const languageInstructions: Record<string, string> = {
            'en': 'Respond in English.',
            'fr': 'Répondez en français.',
            'ar': 'أجب باللغة العربية.',
        };

        const languageInstruction = languageInstructions[language] || languageInstructions['en'];

        // Generate comprehensive report using AI
        const response = await deepseek.chat.completions.create({
            model: 'deepseek-chat',
            messages: [
                {
                    role: 'system',
                    content: `You are a Senior Career Development Expert and Strategic HR Consultant at MA-TRAINING-CONSULTING.

${languageInstruction}

Your mission: Generate a COMPREHENSIVE FINAL DIAGNOSTIC REPORT that synthesizes ALL stages of the candidate's assessment journey.

**CRITICAL PRINCIPLES TO INCLUDE:**
1. **Diagnosis-Driven Approach**: Emphasize that all future services/steps are precisely tailored based on this initial assessment results.
2. **Human Expertise**: All Workshops and simulations are conducted with human experts, not just AI.
3. **Strategic Tools**: Mention the AI Strategic Advisor (24/7 support), Knowledge Base, and Resource Center (with expert-curated models).
4. **Corporate Value**: Explain how this report provides objective verification for companies (for hiring/promotions) and participants.

**REPORT SECTIONS (Markdown):**
1. **Executive Summary**: High-level overview of readiness.
2. **Detailed Competency Analysis**: Synthesizing CV, Interview, and Simulation data.
3. **Strategic Role Alignment**: Analysis of the candidate vs. the target job description.
4. **Strategic Roadmap (MANDATORY FORMAT)**:
   - **3 Months**: Initial rehabilitation phase (Individual/Group Workshops).
   - **6 Months**: Supervised training and specialized simulations.
   - **12 Months**: Mastery of provable core skills.
   - **18 Months**: Full readiness for senior/specialized roles with complete credibility.
5. **Next Steps & Professional Portfolio**: Using the AI Roadmap document and expert consultation to bridge gaps.
6. **Final Consultative Verdict**: Clear recommendation for the career trajectory.

Be authoritative, highly professional, and formal. This report is an official career advisory document representing MA-TRAINING-CONSULTING. Use clear headings, formal syntax, and ensure the roadmap is presented as a high-stakes strategic execution plan. Use bolding and lists to maintain clarity and impact. Structure it as a formal "Strategic Success Protocol" (بروتوكول النجاح الاستراتيجي).`
                },
                {
                    role: 'user',
                    content: `Generate a comprehensive final diagnostic report based on the following complete assessment data:

**CV Analysis:**
${JSON.stringify(diagnosisData.analysis, null, 2)}

**Interview Evaluation:**
${JSON.stringify(diagnosisData.interviewEvaluation, null, 2)}

**Selected Role:**
${JSON.stringify(diagnosisData.selectedRole, null, 2)}

**Role Simulation Results:**
${JSON.stringify(diagnosisData.simulationResults, null, 2)}

**Simulation Final Report:**
${JSON.stringify(diagnosisData.simulationReport, null, 2)}

Create a detailed, professional report that synthesizes all this information into actionable insights.`
                }
            ],
            temperature: 0.4,
            max_tokens: 3000,
        });

        const reportContent = response.choices[0]?.message?.content;

        if (!reportContent) {
            console.error(`[ComprehensiveReport] AI returned empty content`);
            throw new Error('No response from AI');
        }

        console.log(`[ComprehensiveReport] Report generated successfully. Length: ${reportContent.length}`);

        // Save the comprehensive report back to the database
        await Diagnosis.findOneAndUpdate(
            { userId },
            { 
                comprehensiveReport: reportContent,
                comprehensiveReportGeneratedAt: new Date()
            }
        );

        return NextResponse.json({
            success: true,
            report: reportContent,
            message: language === 'ar' ? 'تم إنشاء التقرير الشامل بنجاح' :
                     language === 'fr' ? 'Rapport complet généré avec succès' :
                     'Comprehensive report generated successfully'
        });

    } catch (error) {
        console.error('Error generating comprehensive report:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to generate comprehensive report'
        }, { status: 500 });
    }
}
