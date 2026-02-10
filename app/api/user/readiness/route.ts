import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Diagnosis from '@/models/Diagnosis';
import Simulation from '@/models/Simulation';
import User from '@/models/User';

export async function GET(req: Request) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        // Check User specific overrides (like Elite members or manual validation)
        const user = await User.findOne({ 
            $or: [
                { email: { $regex: new RegExp(`^${userId}$`, 'i') } },
                { fullName: { $regex: new RegExp(`^${userId}$`, 'i') } }
            ]
        }).lean();

        // Check Diagnosis (Case-insensitive)
        const diagnosis = await Diagnosis.findOne({ 
            $or: [
                { userId: { $regex: new RegExp(`^${userId}$`, 'i') } },
                { userId: userId.toString() }
            ]
        }).sort({ updatedAt: -1 }).lean();

        // Check Simulation (Case-insensitive)
        const simulation = await Simulation.findOne({ 
            $or: [
                { userId: { $regex: new RegExp(`^${userId}$`, 'i') } },
                { userId: userId.toString() }
            ],
            status: 'completed'
        }).sort({ updatedAt: -1 }).lean();

        // Any of these can trigger readiness, but manual override is absolute
        const hasDiagnosis = !!diagnosis;
        const hasSimulation = !!simulation;
        const isElite = user?.plan === 'Elite Full Pack';
        
        // Specific overrides
        const manualCert = user?.canAccessCertificates === true;
        const manualRec = user?.canAccessRecommendations === true;

        // Global isReady for backward compatibility (if either is specifically allowed or both steps done)
        const isReady = isElite || (manualCert && manualRec) || (hasDiagnosis && hasSimulation);

        // Individual readiness
        const certReady = isElite || manualCert || (hasDiagnosis && hasSimulation);
        const recReady = isElite || manualRec || (hasDiagnosis && hasSimulation);

        return NextResponse.json({
            success: true,
            isReady, // Keep for legacy
            certReady,
            recReady,
            details: {
                hasDiagnosis: hasDiagnosis,
                hasSimulation: hasSimulation,
                auditStatus: (hasDiagnosis) ? 'Completed' : 'Pending',
                simulationStatus: (hasSimulation) ? 'Completed' : 'Pending',
                isElite: isElite,
                manualCert,
                manualRec
            }
        });
        

    } catch (error) {
        console.error('Readiness API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
