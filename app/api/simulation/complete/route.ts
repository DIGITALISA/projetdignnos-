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
            
            // Update the user's profile
            // Mark diagnosis as complete and store the full report
            const user = await User.findOneAndUpdate(
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

            if (!user) {
                console.warn(`[Simulation Complete] User with email ${email} not found.`);
                // We don't fail the request here, as the user still gets their report on screen
            } else {
                console.log(`[Simulation Complete] User ${email} diagnosis marked as complete.`);
            }
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
