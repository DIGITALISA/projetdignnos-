import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Certificate from "@/models/Certificate";
import Recommendation from "@/models/Recommendation";
import PerformanceProfile from "@/models/PerformanceProfile";
import JobAlignment from "@/models/JobAlignment";
import Diagnosis from "@/models/Diagnosis";
import User from "@/models/User";
import Simulation from "@/models/Simulation";

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id")?.trim().toUpperCase();

        if (!id) {
            return NextResponse.json({ error: "Reference ID is required" }, { status: 400 });
        }

        // 1. Try to find if it's a Member ID (User Global ID)
        const userByMemberId = await User.findOne({ memberId: id });
        if (userByMemberId) {
            return NextResponse.json({
                success: true,
                data: {
                    type: 'member',
                    userName: userByMemberId.fullName,
                    title: "Executive Strategic Member",
                    date: userByMemberId.createdAt,
                    status: `${userByMemberId.plan || 'Free'} Tier`,
                    referenceId: id
                }
            });
        }

        // 2. Search in Certificates (Workshop Attestations)
        const cert = await Certificate.findOne({ certificateId: id });
        if (cert) {
            return NextResponse.json({
                success: true,
                data: {
                    type: 'workshop_attestation',
                    userName: cert.userName,
                    title: cert.courseTitle || "Executive Workshop",
                    date: cert.createdAt,
                    status: 'Verified Credentials',
                    referenceId: id
                }
            });
        }

        // 3. Search in Performance Profiles
        const profile = await PerformanceProfile.findOne({ referenceId: id });
        if (profile) {
            return NextResponse.json({
                success: true,
                data: {
                    type: 'performance_profile',
                    userName: profile.userName,
                    title: "Executive Performance Profile",
                    date: profile.createdAt,
                    status: 'Verified Analytics',
                    referenceId: id
                }
            });
        }

        // 4. Search in Recommendations
        const rec = await Recommendation.findOne({ referenceId: id });
        if (rec) {
            return NextResponse.json({
                success: true,
                data: {
                    type: 'recommendation',
                    userName: rec.userName,
                    title: rec.subject || "Executive Recommendation",
                    date: rec.createdAt,
                    status: 'Official Endorsement',
                    referenceId: id
                }
            });
        }

        // 5. Search in Job Alignments
        const alignment = await JobAlignment.findOne({ referenceId: id });
        if (alignment) {
            return NextResponse.json({
                success: true,
                data: {
                    type: 'role_alignment',
                    userName: alignment.userName,
                    title: `Strategic Role Alignment Audit`,
                    date: alignment.createdAt,
                    status: `Alignment: ${alignment.score}%`,
                    referenceId: id
                }
            });
        }

        // 6. Search in Diagnosis (SCI)
        const diagnosis = await Diagnosis.findOne({ referenceId: id });
        if (diagnosis) {
            return NextResponse.json({
                success: true,
                data: {
                    type: 'career_intelligence',
                    userName: diagnosis.userName,
                    title: "Strategic Career Intelligence (SCI)",
                    date: diagnosis.createdAt,
                    status: `Mastery: ${diagnosis.analysis?.overallScore || 'Audited'}%`,
                    referenceId: id
                }
            });
        }

        // 7. Search in Simulations (Scorecard)
        const simulation = await Simulation.findOne({ referenceId: id });
        if (simulation) {
            // Try to find the user's real name since Simulation only stores userId
            const isObjectId = simulation.userId?.length === 24 && /^[0-9a-fA-F]{24}$/.test(simulation.userId);
            const user = await User.findOne(
                isObjectId 
                    ? { $or: [{ _id: simulation.userId }, { email: simulation.userId }] } 
                    : { email: simulation.userId }
            );

            const displayName = user?.fullName || simulation.userId;

            return NextResponse.json({
                success: true,
                data: {
                    type: 'career_intelligence', 
                    userName: displayName,
                    title: `Executive Performance Scorecard: ${simulation.title}`,
                    date: simulation.updatedAt,
                    status: `Overall Score: ${simulation.performanceMetrics?.overallScore || 0}%`,
                    referenceId: id
                }
            });
        }

        return NextResponse.json({ error: "Verification failed: Document or Member ID not found" }, { status: 404 });
    } catch (error: unknown) {
        console.error("Verification Error:", error);
        return NextResponse.json({ error: "Verification system offline" }, { status: 500 });
    }
}
