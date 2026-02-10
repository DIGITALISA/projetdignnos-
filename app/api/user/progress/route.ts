import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Diagnosis from '@/models/Diagnosis';

/**
 * API للحصول على بيانات التقدم الكاملة للمستخدم
 * يستبدل الاعتماد على localStorage
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        await connectDB();
        console.log(`[PROGRESS-FETCH] Searching for userId: "${userId}"`);

        // جلب جميع سجلات التشخيص للمستخدم للمفاضلة بينهم
        const docs = await Diagnosis.find({ 
            $or: [
                { userId: { $regex: new RegExp(`^${userId}$`, 'i') } },
                { userId: userId.toString() }
            ]
        })
            .sort({ updatedAt: -1 })
            .lean();

        if (docs.length === 0) {
            console.log(`[PROGRESS-FETCH] No documents found for userId: "${userId}"`);
            return NextResponse.json({
                hasData: false,
                message: 'No diagnosis data found for this user'
            });
        }

        // إعطاء الأولوية للسجل الذي يحتوي على التقرير الاستراتيجي
        const diagnosis = docs.find(d => !!d.analysis?.sciReport) || docs[0];

        console.log(`[PROGRESS-FETCH] Picked document: ${diagnosis._id}, handledUserId: ${diagnosis.userId}, hasSCI: ${!!diagnosis.analysis?.sciReport}`);

        if (!diagnosis) {
            return NextResponse.json({
                hasData: false,
                message: 'No diagnosis data found for this user'
            });
        }

        // إرجاع جميع البيانات المطلوبة
        return NextResponse.json({
            hasData: true,
            data: {
                // بيانات التحليل
                cvAnalysis: diagnosis.analysis,
                language: diagnosis.language,
                
                // حالة التقدم
                currentStep: diagnosis.currentStep,
                completionStatus: diagnosis.completionStatus,
                
                // بيانات المقابلة
                interviewEvaluation: diagnosis.interviewEvaluation,
                conversationHistory: diagnosis.conversationHistory,
                totalQuestions: diagnosis.totalQuestions,
                
                // بيانات اكتشاف الأدوار
                roleSuggestions: diagnosis.roleSuggestions,
                selectedRole: diagnosis.selectedRole,
                roleDiscoveryConversation: diagnosis.roleDiscoveryConversation,
                
                // المستندات المولدة
                generatedDocuments: diagnosis.generatedDocuments,
                cvGenerationConversation: diagnosis.cvGenerationConversation,
                
                // معلومات إضافية
                createdAt: diagnosis.createdAt,
                updatedAt: diagnosis.updatedAt
            }
        });

    } catch (error) {
        console.error('❌ Error fetching user progress:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

/**
 * API لتحديث بيانات التقدم
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId, updateData } = body;

        if (!userId || !updateData) {
            return NextResponse.json(
                { error: 'userId and updateData are required' },
                { status: 400 }
            );
        }

        await connectDB();

        // تحديث البيانات (بحث غير حساس لحالة الأحرف لضمان تحديث السجل الصحيح)
        const updated = await Diagnosis.findOneAndUpdate(
            { 
                $or: [
                    { userId: { $regex: new RegExp(`^${userId}$`, 'i') } },
                    { userId: userId.toString() }
                ]
            },
            {
                ...updateData,
                updatedAt: new Date()
            },
            { new: true, upsert: false }
        ).sort({ updatedAt: -1 });

        if (!updated) {
            return NextResponse.json(
                { error: 'Diagnosis record not found' },
                { status: 404 }
            );
        }

        console.log('✅ Progress updated for user:', userId);

        return NextResponse.json({
            success: true,
            message: 'Progress updated successfully'
        });

    } catch (error) {
        console.error('❌ Error updating progress:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
