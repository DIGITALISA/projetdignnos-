import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Diagnosis from "@/models/Diagnosis";
import Simulation from "@/models/Simulation";
import User from "@/models/User";
import { generateSCIReport } from "@/lib/deepseek";

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        await connectDB();
        const { userId } = await params;
        const { expertNotes, language = 'en' } = await request.json();

        // 1. Resolve User Identity
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }
        const identifier = user.email || user.fullName;

        // 2. Fetch all relevant data (Case-insensitive search)
        const diagnosis = await Diagnosis.findOne({ 
            $or: [
                { userId: { $regex: new RegExp(`^${identifier}$`, 'i') } },
                { userId: identifier.toString() }
            ]
        }).sort({ updatedAt: -1 }).lean();

        const simulations = await Simulation.find({ 
            $or: [
                { userId: { $regex: new RegExp(`^${identifier}$`, 'i') } },
                { userId: identifier.toString() }
            ]
        }).lean();

        if (!diagnosis) {
            return NextResponse.json({ success: false, error: "Diagnosis not found" }, { status: 404 });
        }

        console.log(`[SCI-GEN] Found diagnosis: ${diagnosis._id} for ${identifier}`);

        // 2. Prepare data for AI
        const userName = diagnosis.userName || user.fullName;
        const diagnosisData = diagnosis.analysis;
        const simulationData = simulations.map(s => ({
            title: s.title,
            status: s.status,
            draft: s.currentDraft
        }));

        // 3. Generate SCI Report via AI
        const sciReport = await generateSCIReport(
            userName,
            diagnosisData,
            simulationData,
            expertNotes,
            language
        );

        // 4. Update Diagnosis with the new report (Atomic Update)
        const updated = await Diagnosis.findByIdAndUpdate(
            diagnosis._id, 
            {
                $set: { 
                    'analysis.sciReport': sciReport,
                    'completionStatus.strategicReportComplete': true,
                    'updatedAt': new Date()
                }
            },
            { new: true }
        );

        if (!updated) {
            throw new Error(`Failed to update diagnosis document with ID ${diagnosis._id}`);
        }

        return NextResponse.json({
            success: true,
            message: "SCI Report generated and published successfully",
            report: sciReport
        });

    } catch (error) {
        console.error("API SCI Generation Error:", error);
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
    }
}
