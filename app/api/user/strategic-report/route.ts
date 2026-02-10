import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Diagnosis from "@/models/Diagnosis";

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');

        if (!userId) {
            return NextResponse.json({ success: false, error: "User ID is required" }, { status: 400 });
        }

        await connectDB();
        
        console.log(`[SCI-FETCH] Searching for userId: "${userId}"`);

        // Fetch all matching documents to find the one with the report
        const docs = await Diagnosis.find({ 
            $or: [
                { userId: { $regex: new RegExp(`^${userId}$`, 'i') } },
                { userId: userId.toString() } 
            ]
        }).sort({ updatedAt: -1 }).lean();

        if (docs.length === 0) {
            console.log(`[SCI-FETCH] No documents found for userId: "${userId}"`);
            return NextResponse.json({ 
                success: true, 
                report: null,
                message: "No strategic report generated yet." 
            });
        }

        // Prioritize the one with a report
        const diagnosis = docs.find(d => !!d.analysis?.sciReport) || docs[0];

        console.log(`[SCI-FETCH] Picked document: ${diagnosis._id}, userId: ${diagnosis.userId}, hasReport: ${!!diagnosis.analysis?.sciReport}`);

        if (!diagnosis.analysis?.sciReport) {
            console.log(`[SCI-FETCH] Total documents found: ${docs.length}`);
            return NextResponse.json({ 
                success: true, 
                report: null,
                message: "No strategic report generated yet." 
            });
        }

        return NextResponse.json({ 
            success: true, 
            report: diagnosis.analysis.sciReport 
        });

    } catch (error) {
        console.error("Error fetching SCI Report:", error);
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
    }
}
