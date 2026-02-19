import { NextRequest, NextResponse } from 'next/server';
import { completeCVGeneration } from '@/lib/cv-generation';

export const maxDuration = 90; // Longer duration for document generation

export async function POST(request: NextRequest) {
    const startTime = Date.now();
    console.log('[API] /api/cv-generation/complete - Request received');
    
    try {
        const body = await request.json();
        const {
            cvAnalysis,
            interviewEvaluation,
            selectedRole,
            conversationHistory,
            language = 'en'
        } = body;

        console.log('[API] Request params:', {
            hasCV: !!cvAnalysis,
            hasEvaluation: !!interviewEvaluation,
            hasRole: !!selectedRole,
            roleTitle: selectedRole?.title,
            historyLength: conversationHistory?.length || 0,
            language
        });

        const missingParams = [];
        if (!cvAnalysis) missingParams.push('cvAnalysis');
        if (!interviewEvaluation) missingParams.push('interviewEvaluation');
        if (!selectedRole) missingParams.push('selectedRole');
        if (!conversationHistory) missingParams.push('conversationHistory');

        if (missingParams.length > 0) {
            console.error('[API] Missing parameters:', missingParams);
            return NextResponse.json(
                { success: false, error: `Missing parameters: ${missingParams.join(', ')}` },
                { status: 400 }
            );
        }

        console.log('[API] Calling completeCVGeneration...');
        const result = await completeCVGeneration(
            cvAnalysis,
            interviewEvaluation,
            selectedRole,
            conversationHistory,
            language
        );

        const duration = Date.now() - startTime;
        console.log(`[API] Document generation completed in ${duration}ms`, {
            success: result.success,
            hasDocuments: !!result.documents,
            hasCompletionMessage: !!result.completionMessage,
            messageLength: result.completionMessage?.length || 0
        });

        if (!result.success) {
            console.error('[API] Document generation failed:', result.error);
            return NextResponse.json(
                { success: false, error: result.error || 'Failed to generate documents' },
                { status: 500 }
            );
        }

        if (!result.documents || !result.completionMessage) {
            console.error('[API] Incomplete response from AI');
            return NextResponse.json(
                { success: false, error: 'AI returned incomplete documents' },
                { status: 500 }
            );
        }

        // ✅ حفظ الوثائق المُولَّدة في MongoDB
        const userId = body.userId;
        if (userId && result.documents) {
            try {
                const connectDB = (await import('@/lib/mongodb')).default;
                const Diagnosis = (await import('@/models/Diagnosis')).default;
                await connectDB();

                await Diagnosis.findOneAndUpdate(
                    {
                        $or: [
                            { userId: { $regex: new RegExp(`^${userId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } },
                            { userId: userId.toString() }
                        ]
                    },
                    {
                        generatedDocuments: result.documents,
                        currentStep: 'cv_generation',
                        'completionStatus.cvGenerationComplete': true,
                        updatedAt: new Date()
                    },
                    { upsert: false, new: true, sort: { updatedAt: -1 } }
                );
                console.log('✅ CV generation documents saved to MongoDB for user:', userId);
            } catch (dbErr) {
                console.error('❌ Failed to save CV docs to MongoDB:', dbErr);
                // Don't block response — CV was generated, just not saved
            }
        }

        return NextResponse.json({
            success: true,
            documents: result.documents,
            completionMessage: result.completionMessage,
        });
    } catch (error) {
        const duration = Date.now() - startTime;
        console.error(`[API] Error after ${duration}ms:`, error);
        console.error('[API] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
        
        return NextResponse.json(
            { 
                success: false, 
                error: error instanceof Error ? error.message : 'Internal server error',
                details: 'Check server logs for more information'
            },
            { status: 500 }
        );
    }
}
