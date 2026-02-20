import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Diagnosis from "@/models/Diagnosis";
import CorporateInquiry from "@/models/CorporateInquiry";

interface BasicUser {
    _id: string;
    fullName: string;
    updatedAt: string | Date;
    createdAt: string | Date;
}

export async function GET() {
    try {
        await connectDB();

        // Fetch recent items from different collections
        const [
            recentUsers, 
            recentDiagnosis, 
            recentInquiries,
            resetRequests,
            attestationRequests,
            scorecardRequests,
            workshopAccessRequests
        ] = await Promise.all([
            User.find({ role: { $ne: 'Admin' } }).sort({ createdAt: -1 }).limit(5),
            Diagnosis.find({ currentStep: 'completed' }).sort({ updatedAt: -1 }).limit(5),
            CorporateInquiry.find({}).sort({ createdAt: -1 }).limit(5),
            User.find({ resetRequested: true }).sort({ updatedAt: -1 }).limit(3),
            User.find({ workshopAttestationStatus: 'Requested' }).sort({ updatedAt: -1 }).limit(3),
            User.find({ scorecardRequested: true }).sort({ updatedAt: -1 }).limit(3),
            User.find({ "workshopAccessRequests.0": { $exists: true } }).sort({ updatedAt: -1 }).limit(3)
        ]);

        // Transform into a unified activity feed
        const activities = [
            ...recentUsers.map(u => ({
                id: `reg-${u._id}`,
                type: 'user_registration',
                title: 'New Participant Joined',
                description: `${u.fullName} created a new account.`,
                timestamp: u.createdAt,
                icon: 'user'
            })),
            ...recentDiagnosis.map(d => ({
                id: `diag-${d._id}`,
                type: 'diagnosis_complete',
                title: 'Diagnostic Finished',
                description: `${d.userName} completed their AI career analysis.`,
                timestamp: d.updatedAt,
                icon: 'brain'
            })),
            ...recentInquiries.map(i => ({
                id: `inq-${i._id}`,
                type: 'corporate_inquiry',
                title: 'B2B Inquiry Received',
                description: `${i.companyName} requested evaluation for ${i.targetPosition}.`,
                timestamp: i.createdAt,
                icon: 'building'
            })),
            ...resetRequests.map(u => ({
                id: `reset-${u._id}`,
                type: 'reset_request',
                title: 'Password Reset Req.',
                description: `${u.fullName} requested a password reset.`,
                timestamp: u.updatedAt,
                icon: 'user'
            })),
            ...attestationRequests.map(u => ({
                id: `attest-${u._id}`,
                type: 'attestation_request',
                title: 'Attestation Requested',
                description: `${u.fullName} requested a workshop certificate.`,
                timestamp: u.updatedAt,
                icon: 'user'
            })),
            ...scorecardRequests.map(u => ({
                id: `score-${u._id}`,
                type: 'scorecard_request',
                title: 'Scorecard Requested',
                description: `${u.fullName} requested their SCI scorecard.`,
                timestamp: u.updatedAt,
                icon: 'user'
            })),
            ...workshopAccessRequests.map((u: BasicUser) => ({
                id: `access-${u._id}`,
                type: 'access_request',
                title: 'Workshop Access Req.',
                description: `${u.fullName} requested access to a workshop.`,
                timestamp: u.updatedAt,
                icon: 'user'
            }))
        ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 15);

        return NextResponse.json({
            success: true,
            activities
        });
    } catch (err) {
        return NextResponse.json({ error: (err as Error).message }, { status: 500 });
    }
}
