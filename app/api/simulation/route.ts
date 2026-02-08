import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Simulation from "@/models/Simulation";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "UserId required" }, { status: 400 });
        }

        await connectDB();

        const activeMission = await Simulation.findOne({ userId, status: 'active' }).sort({ createdAt: -1 });
        const proposals = await Simulation.find({ userId, status: 'proposed' }).sort({ createdAt: -1 });
        const requested = await Simulation.findOne({ userId, status: 'requested' });

        return NextResponse.json({
            hasActiveMission: !!activeMission,
            mission: activeMission,
            proposals: proposals || [],
            hasPendingRequest: !!requested
        });

    } catch (error) {
        console.error("Simulation API GET Error:", error);
        // Fallback for safety during development
        return NextResponse.json({
            hasActiveMission: false,
            proposals: [],
            hasPendingRequest: false,
            error: "Database error"
        }, { status: 200 }); // Return 200 with error flag for better UX
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("POST /api/simulation - Body:", JSON.stringify(body, null, 2));
        const { userId, type } = body;

        if (!userId || !type) {
            return NextResponse.json({ error: "Missing userId or type" }, { status: 400 });
        }

        await connectDB();

        if (type === 'create_request') {
            const { missionType } = body;
            const newSim = await Simulation.create({
                userId,
                missionType: missionType || 'Executive Coaching',
                status: "requested"
            });
            return NextResponse.json({ success: true, mission: newSim });
        }

        if (type === 'assign_mission') {
            const { missionData } = body;

            // Ensure title is present, fallback if missing
            const missionToCreate = {
                userId,
                title: missionData.title || "Elite Simulation Mission",
                role: missionData.role || "Executive",
                company: missionData.company || "Leading Corporation",
                briefing: missionData.briefing || "No briefing provided.",
                objectives: (missionData.objectives || []).map((obj: any) => ({
                    title: typeof obj === 'string' ? obj : (obj.title || String(obj)),
                    status: obj.status || 'locked'
                })),
                price: missionData.price || 199,
                missionType: missionData.missionType || 'Executive Coaching',
                status: 'proposed',
                duration: "90 Days",
                difficulty: "High - Executive Level"
            };

            const newMission = await Simulation.create(missionToCreate);
            return NextResponse.json({ success: true, mission: newMission });
        }


        if (type === 'accept_mission') {
            const { missionId } = body;
            // Activate the specific mission
            const active = await Simulation.findByIdAndUpdate(missionId, { status: 'active' }, { new: true });
            // Close other proposals and requests for this user
            await Simulation.updateMany(
                { userId, _id: { $ne: missionId }, status: { $in: ['proposed', 'requested'] } },
                { status: 'completed' }
            );
            return NextResponse.json({ success: true, mission: active });
        }

        if (type === 'save_draft') {
            const { draft } = body;
            await Simulation.findOneAndUpdate(
                { userId, status: 'active' },
                {
                    currentDraft: draft,
                    lastDraftUpdate: new Date(),
                    draftViewedByAdmin: false
                },
                { sort: { createdAt: -1 } }
            );
            return NextResponse.json({ success: true });
        }

        if (type === 'submit_plan') {
            const { submittedLink } = body;
            await Simulation.findOneAndUpdate(
                { userId, status: 'active' },
                { status: 'completed', submittedLink }, // Or stay active until admin approves
                { sort: { createdAt: -1 } }
            );
            return NextResponse.json({ success: true });
        }

        if (type === 'update_objective') {
            const { missionId, objectives } = body;
            await Simulation.findByIdAndUpdate(missionId, { objectives });
            return NextResponse.json({ success: true });
        }

        if (type === 'send_message') {
            const { text } = body;
            await Simulation.findOneAndUpdate(
                { userId, status: 'active' },
                { $push: { messages: { text, sender: 'user', timestamp: new Date() } } },
                { sort: { createdAt: -1 } }
            );
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: "Invalid action type" }, { status: 400 });


    } catch (error: any) {
        console.error("Simulation API POST Error:", error);
        return NextResponse.json({
            error: "Internal Server Error",
            details: error.message || String(error),
            stack: error.stack
        }, { status: 500 });
    }
}

