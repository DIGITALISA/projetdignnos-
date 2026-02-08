import { NextRequest, NextResponse } from 'next/server';
import { evaluateInterview } from '@/lib/deepseek';
import connectDB from '@/lib/mongodb';
import InterviewResult from '@/models/InterviewResult';

export async function POST(request: NextRequest) {
    try {
        const { cvAnalysis, conversationHistory, language = 'en', userId, userName } = await request.json();

        if (!cvAnalysis || !conversationHistory) {
            return NextResponse.json(
                { error: 'CV analysis and conversation history are required' },
                { status: 400 }
            );
        }

        const result = await evaluateInterview(cvAnalysis, conversationHistory, language);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 500 }
            );
        }

        // Save to MongoDB if user info is provided
        if (userId && userName) {
            try {
                await connectDB();
                
                const Diagnosis = (await import('@/models/Diagnosis')).default;
                const User = (await import('@/models/User')).default;

                // ✅ حفظ نتيجة المقابلة في Diagnosis
                await Diagnosis.findOneAndUpdate(
                    { userId },
                    {
                        interviewEvaluation: result.evaluation,
                        conversationHistory,
                        currentStep: 'interview_complete',
                        'completionStatus.interviewComplete': true,
                        updatedAt: new Date()
                    },
                    { upsert: false, new: true } // لا نريد إنشاء سجل جديد، فقط تحديث الموجود
                );
                
                // حفظ في InterviewResult أيضاً (للتوافق مع الكود القديم)
                await InterviewResult.create({
                    userId,
                    userName,
                    cvAnalysis,
                    conversationHistory,
                    evaluation: result.evaluation,
                    language
                });

                // ✅ تحديث حالة المستخدم
                await User.findOneAndUpdate(
                    { email: userId },
                    {
                        isDiagnosisComplete: true,
                        diagnosisData: {
                            cvAnalysis,
                            interviewEvaluation: result.evaluation,
                            completedAt: new Date()
                        }
                    }
                );

                console.log('✅ Interview evaluation saved to MongoDB for user:', userId);
            } catch (dbError) {
                console.error('❌ Database Error:', dbError);
            }
        }

        return NextResponse.json({
            success: true,
            evaluation: result.evaluation,
            closingMessage: result.closingMessage,
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
