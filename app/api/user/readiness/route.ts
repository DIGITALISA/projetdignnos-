import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Diagnosis from '@/models/Diagnosis';
import Simulation from '@/models/Simulation';

export async function GET(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        // Check Diagnosis
        const diagnosis = await Diagnosis.findOne({ userId, currentStep: 'completed' });

        // Check Simulation
        const simulation = await Simulation.findOne({ userId, status: 'completed' });

        const isReady = !!diagnosis && !!simulation;

        return NextResponse.json({
            success: true,
            isReady,
            details: {
                hasDiagnosis: !!diagnosis,
                hasSimulation: !!simulation,
                auditStatus: diagnosis ? 'Completed' : 'Pending',
                simulationStatus: simulation ? 'Completed' : 'Pending'
            }
        });

    } catch (error) {
        console.error('Readiness API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
