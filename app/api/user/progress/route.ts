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
        
        // Find best matching diagnosis document
        const docs = await Diagnosis.find({ 
            $or: [
                { userId: { $regex: new RegExp(`^${userId}$`, 'i') } },
                { userId: userId.toString() }
            ]
        })
        .sort({ updatedAt: -1 })
        .lean();

        if (docs.length === 0) {
            return NextResponse.json({
                hasData: false,
                message: 'No diagnosis data found'
            });
        }

        // Prioritize documents with critical data (SCI Report > Selected Role > Recent)
        const diagnosis = docs.find(d => !!d.analysis?.sciReport) || 
                         docs.find(d => !!d.selectedRole) || 
                         docs[0];

        let evaluation = diagnosis.interviewEvaluation;
        
        // --- DATA MIGRATION CHECK ---
        // If interview evaluation is missing in Diagnosis but might exist in legacy InterviewResult
        if (!evaluation && (diagnosis.currentStep === 'interview_complete' || diagnosis.currentStep === 'completed')) {
            try {
                const InterviewResult = (await import('@/models/InterviewResult')).default;
                const legacyResult = await InterviewResult.findOne({ 
                    $or: [
                        { userId: { $regex: new RegExp(`^${userId}$`, 'i') } },
                        { userId: userId.toString() }
                    ]
                }).sort({ createdAt: -1 });
                
                if (legacyResult?.evaluation) {
                    console.log(`[MIGRATION] Migrating InterviewResult for user ${userId} to Diagnosis`);
                    
                    evaluation = legacyResult.evaluation;
                    
                    // SAVE back to Diagnosis for future consistency
                    await Diagnosis.findByIdAndUpdate(diagnosis._id, {
                        $set: { interviewEvaluation: evaluation }
                    });
                }
            } catch (evalError) {
                console.warn('[MIGRATION-SKIP] Could not migrate legacy interview data:', evalError);
            }
        }

        return NextResponse.json({
            hasData: true,
            data: {
                // Analysis
                cvAnalysis: diagnosis.analysis,
                language: diagnosis.language || 'fr',
                
                // Progress & Status
                currentStep: diagnosis.currentStep,
                completionStatus: diagnosis.completionStatus || {},
                
                // Interview
                interviewEvaluation: evaluation,
                conversationHistory: diagnosis.conversationHistory,
                totalQuestions: diagnosis.totalQuestions,
                
                // Role Discovery
                roleSuggestions: diagnosis.roleSuggestions,
                selectedRole: diagnosis.selectedRole,
                roleDiscoveryConversation: diagnosis.roleDiscoveryConversation,
                
                // Documents & AI Reports
                generatedDocuments: diagnosis.generatedDocuments,
                cvGenerationConversation: diagnosis.cvGenerationConversation,
                
                // Simulation
                simulationConversation: diagnosis.simulationConversation,
                simulationResults: diagnosis.simulationResults,
                simulationReport: diagnosis.simulationReport,
                
                // Metadata
                createdAt: diagnosis.createdAt,
                updatedAt: diagnosis.updatedAt
            }
        });

    } catch (error) {
        console.error('❌ Error fetching user progress:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
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
