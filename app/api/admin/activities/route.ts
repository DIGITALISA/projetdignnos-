import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Diagnosis from "@/models/Diagnosis";
import CorporateInquiry from "@/models/CorporateInquiry";

export async function GET() {
    try {
        await connectDB();

        // Fetch recent items from different collections
        const [recentUsers, recentDiagnosis, recentInquiries] = await Promise.all([
            User.find({ role: { $ne: 'Admin' } }).sort({ createdAt: -1 }).limit(5),
            Diagnosis.find({ currentStep: 'completed' }).sort({ updatedAt: -1 }).limit(5),
            CorporateInquiry.find({}).sort({ createdAt: -1 }).limit(5)
        ]);

        // Transform into a unified activity feed
        const activities = [
            ...recentUsers.map(u => ({
                id: u._id,
                type: 'user_registration',
                title: 'New Participant Joined',
                description: `${u.fullName} created a new account.`,
                timestamp: u.createdAt,
                icon: 'user'
            })),
            ...recentDiagnosis.map(d => ({
                id: d._id,
                type: 'diagnosis_complete',
                title: 'Diagnostic Finished',
                description: `${d.userName} completed their AI career analysis.`,
                timestamp: d.updatedAt,
                icon: 'brain'
            })),
            ...recentInquiries.map(i => ({
                id: i._id,
                type: 'corporate_inquiry',
                title: 'B2B Inquiry Received',
                description: `${i.companyName} requested evaluation for ${i.targetPosition}.`,
                timestamp: i.createdAt,
                icon: 'building'
            }))
        ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 10);

        return NextResponse.json({
            success: true,
            activities
        });
    } catch (err) {
        return NextResponse.json({ error: (err as Error).message }, { status: 500 });
    }
}
