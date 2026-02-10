import { NextRequest, NextResponse } from 'next/server';
import { completeRoleDiscovery } from '@/lib/role-discovery';

export async function POST(request: NextRequest) {
    try {
        const { cvAnalysis, interviewEvaluation, conversationHistory, language = 'en', userId } = await request.json();

        if (!cvAnalysis || !interviewEvaluation || !conversationHistory) {
            return NextResponse.json(
                { error: 'CV analysis, interview evaluation, and conversation history are required' },
                { status: 400 }
            );
        }

        const result = await completeRoleDiscovery(cvAnalysis, interviewEvaluation, conversationHistory, language);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 500 }
            );
        }

        // Save to MongoDB if user info is provided
        if (userId) {
            try {
                const connectDB = (await import('@/lib/mongodb')).default;
                const Diagnosis = (await import('@/models/Diagnosis')).default;
                
                await connectDB();
                
                await Diagnosis.findOneAndUpdate(
                    { userId },
                    {
                        roleSuggestions: result.roles,
                        roleDiscoveryConversation: conversationHistory,
                        currentStep: 'role_discovery_complete',
                        'completionStatus.roleDiscoveryComplete': true,
                        updatedAt: new Date()
                    },
                    { 
                        upsert: false, 
                        new: true,
                        sort: { createdAt: -1 }
                    }
                );
                console.log('✅ Role discovery results saved to MongoDB for user:', userId);
            } catch (dbError) {
                console.error('❌ Database Error saving role suggestions:', dbError);
            }
        }

        return NextResponse.json({
            success: true,
            roles: result.roles,
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
