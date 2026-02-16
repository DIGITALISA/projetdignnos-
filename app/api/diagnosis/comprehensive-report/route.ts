import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
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

        // Connect to database and fetch all diagnosis data
        await connectDB();
        const diagnosisData = await Diagnosis.findOne({ userId }).lean();

        if (!diagnosisData) {
            return NextResponse.json({ success: false, error: 'No diagnosis data found' }, { status: 404 });
        }

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
                    content: `You are a Senior Career Development Expert and Strategic HR Consultant.

${languageInstruction}

Your mission: Generate a COMPREHENSIVE FINAL DIAGNOSTIC REPORT that synthesizes ALL stages of the candidate's assessment journey.

This report must be:
- Professional and actionable
- Data-driven with specific insights
- Forward-looking with clear next steps
- Formatted in clear sections with markdown

The report should cover:
1. **Executive Summary**: High-level overview of the candidate's profile and readiness
2. **CV Analysis Insights**: Key findings from the initial CV review
3. **Interview Performance**: Evaluation of their responses and communication skills
4. **Role Simulation Results**: Performance in practical scenarios
5. **Competency Matrix**: Detailed breakdown of skills and capabilities
6. **Gap Analysis**: What's missing for their target role
7. **Strategic Roadmap**: Concrete steps to bridge gaps and advance career
8. **Final Recommendation**: Overall assessment and career trajectory advice

Be specific, cite examples from their data, and provide actionable recommendations.`
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

**CV Generation Conversation:**
${diagnosisData.cvGenerationConversation ? diagnosisData.cvGenerationConversation.map((m: { role: string, content: string }) => `${m.role}: ${m.content}`).join('\n') : 'Not available'}

Create a detailed, professional report that synthesizes all this information into actionable insights.`
                }
            ],
            temperature: 0.7,
            max_tokens: 4000,
        });

        const reportContent = response.choices[0]?.message?.content;

        if (!reportContent) {
            throw new Error('No response from AI');
        }

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
