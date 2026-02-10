import { NextRequest, NextResponse } from 'next/server';
import { analyzeCVWithAI } from '@/lib/deepseek';
import connectDB from '@/lib/mongodb';
import Diagnosis from '@/models/Diagnosis';

export async function POST(request: NextRequest) {
    try {
        const { cvText, language = 'en', userId, userName } = await request.json();

        if (!cvText) {
            return NextResponse.json(
                { error: 'CV text is required' },
                { status: 400 }
            );
        }

        const result = await analyzeCVWithAI(cvText, language);

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
                // ✅ استخدام findOneAndUpdate لتحديث السجل الموجود أو إنشاء جديد
                await Diagnosis.findOneAndUpdate(
                    { 
                        $or: [
                            { userId: { $regex: new RegExp(`^${userId}$`, 'i') } },
                            { userId: userId.toString() }
                        ]
                    }, // البحث عن السجل بواسطة userId (غير حساس للحالة)
                    {
                        userId,
                        userName,
                        cvText,
                        analysis: result.analysis,
                        language,
                        currentStep: 'analysis_complete',
                        // Reset progress for new analysis
                        interviewEvaluation: null,
                        roleSuggestions: [],
                        selectedRole: null,
                        conversationHistory: [],
                        roleDiscoveryConversation: [],
                        simulationConversation: [],
                        simulationResults: [],
                        'completionStatus.cvAnalysisComplete': true,
                        'completionStatus.interviewComplete': false,
                        'completionStatus.roleDiscoveryComplete': false,
                        'completionStatus.roleSelected': false,
                        'completionStatus.simulationComplete': false,
                        updatedAt: new Date()
                    },
                    { 
                        upsert: true, // إنشاء سجل جديد إذا لم يكن موجود
                        new: true, // إرجاع السجل المحدث
                        setDefaultsOnInsert: true, // تطبيق القيم الافتراضية عند الإنشاء
                        sort: { updatedAt: -1 } // التحديث على الأحدث
                    }
                );
                console.log('✅ CV Analysis saved to MongoDB for user:', userId);
            } catch (dbError) {
                console.error('❌ Database Error:', dbError);
                // We don't block the response even if saving fails, 
                // but in a production app we might want to ensure consistency
            }
        }

        return NextResponse.json({
            success: true,
            analysis: result.analysis,
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
