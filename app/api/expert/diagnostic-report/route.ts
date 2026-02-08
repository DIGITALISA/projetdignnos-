import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Diagnosis from '@/models/Diagnosis';
import User from '@/models/User';
import { generateExpertDiagnosticReport } from '@/lib/deepseek';

/**
 * API لتوليد تقرير تشخيصي شامل للخبراء
 * يتم استدعاؤه بعد إكمال المشارك لجميع المراحل
 */
export async function POST(request: NextRequest) {
    try {
        const { userId, language = 'ar' } = await request.json();

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        await connectDB();

        // جلب بيانات التشخيص الكاملة
        const diagnosis = await Diagnosis.findOne({ userId })
            .sort({ updatedAt: -1 })
            .lean();

        if (!diagnosis) {
            return NextResponse.json(
                { error: 'No diagnosis data found for this user' },
                { status: 404 }
            );
        }

        // جلب بيانات المستخدم
        const user = await User.findOne({ email: userId }).lean();

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // التحقق من اكتمال جميع المراحل
        const isComplete = 
            diagnosis.completionStatus?.cvAnalysisComplete &&
            diagnosis.completionStatus?.interviewComplete &&
            diagnosis.completionStatus?.roleDiscoveryComplete;

        if (!isComplete) {
            return NextResponse.json(
                { 
                    error: 'User has not completed all assessment stages',
                    completionStatus: diagnosis.completionStatus
                },
                { status: 400 }
            );
        }

        // تجميع البيانات للذكاء الاصطناعي
        const comprehensiveData = {
            // معلومات المستخدم الأساسية
            userInfo: {
                name: user.fullName,
                email: user.email,
                role: user.role,
                plan: user.plan,
                joinedDate: user.createdAt
            },

            // تحليل السيرة الذاتية
            cvAnalysis: diagnosis.analysis,

            // نتائج المقابلة
            interviewEvaluation: diagnosis.interviewEvaluation,
            conversationHistory: diagnosis.conversationHistory,

            // الأدوار المقترحة والمختارة
            roleSuggestions: diagnosis.roleSuggestions,
            selectedRole: diagnosis.selectedRole,

            // المستندات المولدة
            generatedDocuments: diagnosis.generatedDocuments,

            // حالة الإكمال
            completionStatus: diagnosis.completionStatus,

            // التواريخ
            assessmentStarted: diagnosis.createdAt,
            assessmentCompleted: diagnosis.updatedAt
        };

        console.log('🤖 Generating expert diagnostic report for:', userId);

        // توليد التقرير التشخيصي بواسطة AI
        const result = await generateExpertDiagnosticReport(comprehensiveData, language);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error || 'Failed to generate diagnostic report' },
                { status: 500 }
            );
        }

        // حفظ التقرير في قاعدة البيانات
        await Diagnosis.findOneAndUpdate(
            { userId },
            {
                expertDiagnosticReport: result.report,
                'completionStatus.expertReportGenerated': true,
                expertReportGeneratedAt: new Date()
            },
            { new: true }
        );

        console.log('✅ Expert diagnostic report generated and saved');

        return NextResponse.json({
            success: true,
            report: result.report,
            generatedAt: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Error generating expert diagnostic report:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

/**
 * GET: جلب التقرير التشخيصي المحفوظ
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json(
                { error: 'User ID is required' },
                { status: 400 }
            );
        }

        await connectDB();

        const diagnosis = await Diagnosis.findOne({ userId })
            .sort({ updatedAt: -1 })
            .select('expertDiagnosticReport expertReportGeneratedAt completionStatus')
            .lean();

        if (!diagnosis) {
            return NextResponse.json(
                { error: 'No diagnosis data found' },
                { status: 404 }
            );
        }

        if (!diagnosis.expertDiagnosticReport) {
            return NextResponse.json(
                { 
                    hasReport: false,
                    message: 'Expert diagnostic report not yet generated'
                }
            );
        }

        return NextResponse.json({
            hasReport: true,
            report: diagnosis.expertDiagnosticReport,
            generatedAt: diagnosis.expertReportGeneratedAt
        });

    } catch (error) {
        console.error('❌ Error fetching expert diagnostic report:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
