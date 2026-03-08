import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Diagnosis from '@/models/Diagnosis';
import User from '@/models/User';
import { generateStudentExpertReport } from '@/lib/deepseek';

export const maxDuration = 120;

/**
 * POST: Generate a Student-specific expert diagnostic report
 * Called after a student has completed the core assessment stages.
 */
export async function POST(request: NextRequest) {
    try {
        const { userId, language = 'fr' } = await request.json();

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        await connectDB();

        // Fetch the student's full diagnosis data
        const diagnosis = await Diagnosis.findOne({ userId })
            .sort({ updatedAt: -1 })
            .lean();

        if (!diagnosis) {
            return NextResponse.json(
                { error: 'No diagnosis data found for this user' },
                { status: 404 }
            );
        }

        // Fetch the user record
        const user = await User.findOne({ email: userId }).lean();
        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Require at least CV analysis and interview to be complete
        const hasMinimumData =
            diagnosis.completionStatus?.cvAnalysisComplete &&
            diagnosis.completionStatus?.interviewComplete;

        if (!hasMinimumData) {
            return NextResponse.json(
                {
                    error: 'Student has not completed the minimum required stages (CV analysis + interview)',
                    completionStatus: diagnosis.completionStatus
                },
                { status: 400 }
            );
        }

        // Assemble the data payload for the AI
        const studentData = {
            userInfo: {
                name: user.fullName,
                email: user.email,
                plan: user.plan,
                joinedDate: user.createdAt
            },
            cvAnalysis: diagnosis.analysis,
            interviewEvaluation: diagnosis.interviewEvaluation,
            conversationHistory: diagnosis.conversationHistory,
            roleSuggestions: diagnosis.roleSuggestions,
            selectedRole: diagnosis.selectedRole,
            simulationResults: diagnosis.simulationResults,
            generatedDocuments: diagnosis.generatedDocuments
        };

        console.log('🎓 Generating Student Expert Report for:', userId);

        const result = await generateStudentExpertReport(studentData, language);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error || 'Failed to generate student expert report' },
                { status: 500 }
            );
        }

        // Save the report to MongoDB
        await Diagnosis.findOneAndUpdate(
            { userId },
            {
                studentExpertReport: result.report,
                studentExpertReportGeneratedAt: new Date(),
                'completionStatus.studentExpertReportGenerated': true
            },
            { new: true }
        );

        console.log('✅ Student Expert Report saved for:', userId);

        return NextResponse.json({
            success: true,
            report: result.report,
            reportType: 'STUDENT',
            generatedAt: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Error generating student expert report:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

/**
 * GET: Retrieve the saved Student Expert Report
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        await connectDB();

        const diagnosis = await Diagnosis.findOne({ userId })
            .sort({ updatedAt: -1 })
            .select('studentExpertReport studentExpertReportGeneratedAt completionStatus')
            .lean();

        if (!diagnosis) {
            return NextResponse.json({ error: 'No diagnosis data found' }, { status: 404 });
        }

        if (!diagnosis.studentExpertReport) {
            return NextResponse.json({
                hasReport: false,
                message: 'Student expert report not yet generated'
            });
        }

        return NextResponse.json({
            hasReport: true,
            report: diagnosis.studentExpertReport,
            reportType: 'STUDENT',
            generatedAt: diagnosis.studentExpertReportGeneratedAt
        });

    } catch (error) {
        console.error('❌ Error fetching student expert report:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
