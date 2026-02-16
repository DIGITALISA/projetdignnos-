import { NextRequest, NextResponse } from 'next/server';
import { completeSimulation } from '@/lib/simulation';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(request: NextRequest) {
    try {
        const {
            email,
            selectedRole,
            cvAnalysis,
            scenarioResults,
            language = 'en'
        } = await request.json();

        if (!selectedRole || !cvAnalysis || !scenarioResults) {
            return NextResponse.json(
                { error: 'All parameters are required' },
                { status: 400 }
            );
        }

        // 1. Generate the Report via AI
        const result = await completeSimulation(
            selectedRole,
            cvAnalysis,
            scenarioResults,
            language
        );

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 500 }
            );
        }

        // 2. Save to Database if email is provided
        if (email) {
            await connectDB();
            
            const Diagnosis = (await import('@/models/Diagnosis')).default;
            
            // Update the diagnosis record with simulation report
            await Diagnosis.findOneAndUpdate(
                { userId: email },
                { 
                    $set: { 
                        simulationReport: result.report,
                        'completionStatus.simulationComplete': true,
                        currentStep: 'completed'
                    } 
                },
                { new: true, upsert: false }
            );

            // Also update User model for backward compatibility
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
                },
                { new: true }
            );
        }

        return NextResponse.json({
            success: true,
            report: result.report,
            completionMessage: result.completionMessage,
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
