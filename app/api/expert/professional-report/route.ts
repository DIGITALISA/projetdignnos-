import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Diagnosis from '@/models/Diagnosis';
import User from '@/models/User';
import mongoose from 'mongoose';
import { generateProfessionalExpertReport } from '@/lib/deepseek';

export const maxDuration = 120;

/**
 * POST: Generate a Professional-specific expert intelligence brief
 * Called after a professional has completed their executive assessment stages.
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

        // Resolve user first to handle both MongoDB _id and email
        let user = null;
        if (mongoose.Types.ObjectId.isValid(userId)) {
            user = await User.findById(userId).lean();
        }
        if (!user) {
            user = await User.findOne({ email: userId }).lean();
        }

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        const identifier = user.email || userId;

        // Fetch the professional's diagnosis/profile data
        const diagnosis = await Diagnosis.findOne({ userId: identifier })
            .sort({ updatedAt: -1 })
            .lean();

        if (!diagnosis) {
            return NextResponse.json(
                { error: 'No professional assessment data found for this user' },
                { status: 404 }
            );
        }

        // Extract professional assessment data from the diagnosis document
        // Professional data is stored in different fields compared to student data
        const diagnosisAny = diagnosis as Record<string, unknown>;

        const auditResult = diagnosisAny.auditResult || diagnosisAny.professionalAudit || diagnosisAny.professionalAuditResult || {};
        const formData = diagnosisAny.formData || diagnosisAny.professionalFormData || (diagnosisAny.professionalAuditData as Record<string, unknown>)?.formData || {};
        const interviewTranscript = (diagnosisAny.professionalInterviewTranscript as unknown[]) ||
                                    (diagnosisAny.conversationHistory as unknown[]) || [];
        const mcqResults = (diagnosisAny.mcqResults as unknown[]) || (diagnosisAny.professionalMCQResults as unknown[]) || [];
        const ultimateReport = diagnosisAny.ultimateStrategicReport || diagnosisAny.ultimateReport || diagnosisAny.professionalFinalReport || null;
        const portfolioAnalysis = diagnosisAny.portfolioAnalysis || null;

        // Require at minimum an audit result
        if ((!auditResult || Object.keys(auditResult).length === 0) && !ultimateReport) {
            return NextResponse.json(
                {
                    error: 'Professional has not completed the minimum required stages',
                    available: {
                        hasAudit: !!auditResult && Object.keys(auditResult).length > 0,
                        hasInterview: interviewTranscript.length > 0,
                        hasMCQ: mcqResults.length > 0,
                        hasUltimateReport: !!ultimateReport
                    }
                },
                { status: 400 }
            );
        }

        // Assemble the data payload
        const professionalData = {
            userInfo: {
                name: user.fullName,
                email: user.email,
                plan: user.plan,
                joinedDate: user.createdAt
            },
            auditResult: auditResult as Parameters<typeof generateProfessionalExpertReport>[0]['auditResult'],
            formData: formData as Parameters<typeof generateProfessionalExpertReport>[0]['formData'],
            interviewTranscript: interviewTranscript as Parameters<typeof generateProfessionalExpertReport>[0]['interviewTranscript'],
            mcqResults: mcqResults as Parameters<typeof generateProfessionalExpertReport>[0]['mcqResults'],
            ultimateReport,
            portfolioAnalysis
        };

        console.log('💼 Generating Professional Expert Report for:', identifier);

        const result = await generateProfessionalExpertReport(professionalData, language);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error || 'Failed to generate professional expert report' },
                { status: 500 }
            );
        }

        // Save the report to MongoDB
        await Diagnosis.findOneAndUpdate(
            { userId: identifier },
            {
                professionalExpertReport: result.report,
                professionalExpertReportGeneratedAt: new Date(),
                'completionStatus.professionalExpertReportGenerated': true
            },
            { upsert: true, new: true }
        );

        // Create a notification for the user
        try {
            const Notification = (await import('@/models/Notification')).default;
            await Notification.create({
                title: language === 'ar' ? 'تمت مراجعة تقريرك' : 'Report Reviewed',
                message: language === 'ar' 
                    ? 'لقد قام خبير بمراجعة ملفك الشخصي وإصدار تقرير التقييم النهائي.' 
                    : 'An expert has reviewed your profile and issued your final evaluation report.',
                type: 'success',
                recipientEmail: user.email,
                metadata: {
                    type: 'expert_review',
                    reportType: 'PROFESSIONAL'
                }
            });
        } catch (notificationError) {
            console.error('Failed to create notification:', notificationError);
            // Don't fail the whole request if notification fails
        }

        console.log('✅ Professional Expert Report saved for:', identifier);

        return NextResponse.json({
            success: true,
            report: result.report,
            reportType: 'PROFESSIONAL',
            generatedAt: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Error generating professional expert report:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

/**
 * GET: Retrieve the saved Professional Expert Report
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        await connectDB();

        // Resolve user first
        let user = null;
        if (mongoose.Types.ObjectId.isValid(userId)) {
            user = await User.findById(userId).lean();
        }
        if (!user) {
            user = await User.findOne({ email: userId }).lean();
        }

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const identifier = user.email || userId;

        const diagnosis = await Diagnosis.findOne({ userId: identifier })
            .sort({ updatedAt: -1 })
            .select('professionalExpertReport professionalExpertReportGeneratedAt completionStatus')
            .lean();

        if (!diagnosis) {
            return NextResponse.json({ error: 'No assessment data found' }, { status: 404 });
        }

        const diagnosisAny = diagnosis as Record<string, unknown>;

        if (!diagnosisAny.professionalExpertReport) {
            return NextResponse.json({
                hasReport: false,
                message: 'Professional expert report not yet generated'
            });
        }

        return NextResponse.json({
            hasReport: true,
            report: diagnosisAny.professionalExpertReport,
            reportType: 'PROFESSIONAL',
            generatedAt: diagnosisAny.professionalExpertReportGeneratedAt
        });

    } catch (error) {
        console.error('❌ Error fetching professional expert report:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
