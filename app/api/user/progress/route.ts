import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Diagnosis from '@/models/Diagnosis';
import User from '@/models/User';

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
        
        // Find best matching diagnosis and user document
        const [docs, user] = await Promise.all([
            Diagnosis.find({ 
                $or: [
                    { userId: { $regex: new RegExp(`^${userId}$`, 'i') } },
                    { userId: userId.toString() }
                ]
            }).sort({ updatedAt: -1 }).lean(),
            User.findOne({ email: userId }).lean()
        ]);

        if (docs.length === 0 && !user) {
            return NextResponse.json({
                hasData: false,
                message: 'No data found'
            });
        }

        // Prioritize documents with critical data if multiple exist
        const bestDoc = docs.find(d => !!d.analysis?.sciReport) || 
                       docs.find(d => !!d.selectedRole) || 
                       docs[0] || {};

        let evaluation = bestDoc.interviewEvaluation;
        
        // --- DATA MIGRATION CHECK ---
        // If interview evaluation is missing in Diagnosis but might exist in legacy InterviewResult
        if (!evaluation && (bestDoc.currentStep === 'interview_complete' || bestDoc.currentStep === 'completed')) {
            try {
                const InterviewResult = (await import('@/models/InterviewResult')).default;
                const legacyResult = await InterviewResult.findOne({ 
                    $or: [
                        { userId: { $regex: new RegExp(`^${userId}$`, 'i') } },
                        { userId: userId.toString() }
                    ]
                }).sort({ createdAt: -1 });
                
                if (legacyResult?.evaluation) {
                    evaluation = legacyResult.evaluation;
                    
                    // SAVE back to Diagnosis for future consistency
                    if (bestDoc._id) {
                        await Diagnosis.findByIdAndUpdate(bestDoc._id, {
                            $set: { interviewEvaluation: evaluation }
                        });
                    }
                }
            } catch (evalError) {
                console.warn('[MIGRATION-SKIP] Could not migrate legacy interview data:', evalError);
            }
        }

        return NextResponse.json({
            hasData: !!bestDoc._id || !!user,
            data: {
                // Analysis
                cvAnalysis: bestDoc.analysis,
                language: bestDoc.language || 'fr',
                
                // Progress & Status
                currentStep: bestDoc.currentStep,
                completionStatus: bestDoc.completionStatus || {},
                
                // Interview
                interviewEvaluation: evaluation,
                conversationHistory: bestDoc.conversationHistory,
                totalQuestions: bestDoc.totalQuestions,
                
                // Role Discovery
                roleSuggestions: bestDoc.roleSuggestions,
                selectedRole: bestDoc.selectedRole,
                roleDiscoveryConversation: bestDoc.roleDiscoveryConversation,
                
                // Documents & AI Reports
                generatedDocuments: bestDoc.generatedDocuments,
                cvGenerationConversation: bestDoc.cvGenerationConversation,
                
                // Simulation
                simulationConversation: bestDoc.simulationConversation,
                simulationResults: bestDoc.simulationResults,
                simulationReport: bestDoc.simulationReport,
                
                // Live Sessions (Prioritize User model as it's the most reliable source for account-level data)
                liveSessions: user?.liveSessions || bestDoc.liveSessions || [],
                
                // Metadata
                createdAt: bestDoc.createdAt || user?.createdAt,
                updatedAt: bestDoc.updatedAt || user?.updatedAt
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
        const diagnosis = await Diagnosis.findOne({ 
            $or: [
                { userId: { $regex: new RegExp(`^${userId}$`, 'i') } },
                { userId: userId.toString() }
            ]
        }).sort({ updatedAt: -1 });

        if (!diagnosis) {
            return NextResponse.json(
                { error: 'Diagnosis record not found' },
                { status: 404 }
            );
        }

        const updated = await Diagnosis.findByIdAndUpdate(
            diagnosis._id,
            {
                $set: {
                    ...updateData,
                    updatedAt: new Date()
                }
            },
            { new: true }
        );

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
