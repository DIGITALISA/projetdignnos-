import { NextRequest, NextResponse } from 'next/server';
import { completeSimulation } from '@/lib/simulation';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Diagnosis from '@/models/Diagnosis';

export const maxDuration = 60;

function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export async function POST(request: NextRequest) {
    try {
        console.log('🏁 [COMPLETION-API] Starting completion process...');
        const body = await request.json();
        const {
            email,
            selectedRole,
            cvAnalysis,
            scenarioResults,
            language = 'en'
        } = body;

        if (!selectedRole || !cvAnalysis || !scenarioResults) {
            console.error('❌ [COMPLETION-API] Missing parameters:', { email, selectedRole: !!selectedRole, cvAnalysis: !!cvAnalysis, results: !!scenarioResults });
            return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
        }

        // 1. Generate report via AI
        console.log('🤖 [COMPLETION-API] Generating AI report...');
        const result = await completeSimulation(
            selectedRole,
            cvAnalysis,
            scenarioResults,
            language
        );

        if (!result.success) {
            console.error('❌ [COMPLETION-API] AI failed:', result.error);
            return NextResponse.json({ error: result.error }, { status: 500 });
        }
        console.log('✅ [COMPLETION-API] AI report generated');

        // 2. Database operations
        if (email) {
            await connectDB();
            
            // Find existing diagnosis
            const diagnosis = await Diagnosis.findOne({ 
                $or: [
                    { userId: { $regex: new RegExp(`^${escapeRegExp(email)}$`, 'i') } },
                    { userId: email.toString() }
                ]
            }).sort({ updatedAt: -1 });

            // Prepare update data
            const completionStatusUpdate = {
                cvAnalysisComplete: true,
                interviewComplete: true,
                roleDiscoveryComplete: true,
                roleSelected: true,
                simulationComplete: true,
                strategicReportComplete: true
            };

            if (diagnosis) {
                console.log('📝 [COMPLETION-API] Updating existing record:', diagnosis._id);
                
                // Merge with existing status
                const currentStatus = diagnosis.completionStatus || {};
                
                await Diagnosis.findByIdAndUpdate(diagnosis._id, { 
                    $set: {
                        simulationReport: result.report,
                        currentStep: 'completed',
                        updatedAt: new Date(),
                        completionStatus: { ...currentStatus, ...completionStatusUpdate }
                    }
                });
            } else {
                console.log('🆕 [COMPLETION-API] Creating new diagnosis record');
                await Diagnosis.create({
                    userId: email,
                    userName: email, // Fallback
                    cvText: "Generated upon simulation completion (No CV)", 
                    simulationReport: result.report,
                    currentStep: 'completed',
                    completionStatus: completionStatusUpdate,
                    selectedRole: selectedRole,
                    analysis: cvAnalysis
                });
            }

            // Sync User Profile
            try {
                await User.findOneAndUpdate(
                    { email },
                    { 
                        $set: { 
                            isDiagnosisComplete: true,
                            diagnosisData: {
                                report: result.report,
                                selectedRole,
                                completedAt: new Date()
                            }
                        } 
                    }
                );
            } catch (userErr) {
                console.warn('⚠️ [COMPLETION-API] User sync warning:', userErr);
            }
        }

        console.log('🎉 [COMPLETION-API] Done');
        return NextResponse.json({
            success: true,
            report: result.report,
            completionMessage: result.completionMessage,
        });
    } catch (error: unknown) {
        console.error('💥 [COMPLETION-API] Fatal Error:', error);
        return NextResponse.json({ 
            error: 'Internal server error',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}
