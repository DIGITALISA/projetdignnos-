import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Diagnosis from '@/models/Diagnosis';

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function POST(request: NextRequest) {
    try {
        const { userId, messages, results, currentScenario, totalScenarios, selectedRole, cvAnalysis } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        await connectDB();
        
        const escapedUserId = escapeRegExp(userId);
        
        const diagnosis = await Diagnosis.findOne({ 
            $or: [
                { userId: { $regex: new RegExp(`^${escapedUserId}$`, 'i') } },
                { userId: userId.toString() }
            ]
        }).sort({ updatedAt: -1 });

        const isComplete = currentScenario > totalScenarios;
        const updateData: Record<string, unknown> = {
            userId: userId, 
            simulationConversation: messages,
            simulationResults: results,
            updatedAt: new Date(),
            ...(selectedRole && { selectedRole }),
            ...(cvAnalysis && { analysis: cvAnalysis })
        };

        if (diagnosis) {
            // SAFE UPDATE for completionStatus
            const currentStatus = diagnosis.completionStatus;
            let finalStatus: Record<string, boolean> = { simulationComplete: isComplete };

            if (currentStatus && typeof currentStatus === 'object' && !Array.isArray(currentStatus)) {
                finalStatus = { ...currentStatus, simulationComplete: isComplete };
            }
            
            updateData.completionStatus = finalStatus;
            await Diagnosis.findByIdAndUpdate(diagnosis._id, { $set: updateData });
        } else {
            // New entry
            updateData.completionStatus = { simulationComplete: isComplete };
            updateData.currentStep = 'simulation_in_progress';
            updateData.createdAt = new Date();
            // Ensure required fields for new creation
            updateData.userName = userId;
            updateData.cvText = "Initial simulation creation";
            await Diagnosis.create(updateData);
        }

        return NextResponse.json({ success: true });
    } catch (error: unknown) {
        console.error('❌ Error saving simulation progress:', error);
        return NextResponse.json({ 
            error: 'Internal Server Error', 
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        await connectDB();
        
        const escapedUserId = escapeRegExp(userId);
        const diagnosis = await Diagnosis.findOne({ 
             $or: [
                  { userId: { $regex: new RegExp(`^${escapedUserId}$`, 'i') } },
                  { userId: userId.toString() }
             ]
        }).sort({ updatedAt: -1 });

        if (!diagnosis) {
            return NextResponse.json({ hasProgress: false });
        }

        let isComplete = false;
        if (diagnosis.completionStatus) {
            if (typeof diagnosis.completionStatus === 'object') {
                isComplete = !!diagnosis.completionStatus.simulationComplete;
            } else if (typeof diagnosis.completionStatus === 'string') {
                isComplete = diagnosis.completionStatus === 'complete';
            }
        }

        return NextResponse.json({
            hasProgress: !!(diagnosis.simulationConversation && diagnosis.simulationConversation.length > 0),
            data: {
                messages: diagnosis.simulationConversation || [],
                results: diagnosis.simulationResults || [],
                currentScenario: (diagnosis.simulationResults?.length || 0) + 1,
                isComplete: isComplete,
                selectedRole: diagnosis.selectedRole,
                cvAnalysis: diagnosis.analysis,
                language: diagnosis.language,
                completionStatus: diagnosis.completionStatus
            }
        });
    } catch (error: unknown) {
        console.error('❌ Error fetching simulation progress:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
