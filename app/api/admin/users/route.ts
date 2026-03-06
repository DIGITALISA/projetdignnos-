import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Diagnosis from "@/models/Diagnosis";
import Simulation from "@/models/Simulation";
import InterviewResult from "@/models/InterviewResult";
import PerformanceProfile from "@/models/PerformanceProfile";
import Certificate from "@/models/Certificate";
import Recommendation from "@/models/Recommendation";
import JobAlignment from "@/models/JobAlignment";
import bcrypt from "bcryptjs";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDB();
        const users = await User.find({}).sort({ createdAt: -1 });
        return NextResponse.json(users);
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        console.log("Creating/Updating user with plan:", body.plan);
        const { fullName, email, password, role, status, whatsapp, plan, canAccessCertificates, canAccessRecommendations, canAccessScorecard, canAccessSCI, memberId, activationType } = body;

        if (!fullName || !email || !password) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const existing = await User.findOne({ email });
        if (existing) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Auto-assign role and status if activation is Unlimited or plan is Professional
        let finalRole = role || "Trial User";
        if ((plan === "Professional" || activationType === "Unlimited") && (finalRole === "Trial User" || finalRole === "Free Tier")) {
            finalRole = "Premium Member";
        }

        const user = await User.create({
            fullName,
            email,
            password: hashedPassword,
            role: finalRole,
            status: status || "Active",
            whatsapp: whatsapp || "",
            plan: plan || "Professional",
            paymentStatus: activationType === "Unlimited" ? "Paid" : "Unpaid",
            accountType: activationType === "Unlimited" ? "Premium" : "Free",
            canAccessCertificates: !!canAccessCertificates,
            canAccessRecommendations: !!canAccessRecommendations,
            canAccessScorecard: !!canAccessScorecard,
            canAccessSCI: !!canAccessSCI,
            memberId: memberId || undefined,
            activationType: activationType || "Limited"
        });

        return NextResponse.json(user, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        await connectDB();
        const body = await req.json();
        console.log("Updating user ID:", body.id, "to plan:", body.plan);
        const { id, fullName, email, password, role, status, whatsapp, plan, canAccessCertificates, canAccessRecommendations, canAccessScorecard, canAccessSCI, memberId, activationType } = body;

        if (!id) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const updateData: Record<string, unknown> = {
            fullName,
            email,
            role,
            status,
            whatsapp,
            plan,
            canAccessCertificates: !!canAccessCertificates,
            canAccessRecommendations: !!canAccessRecommendations,
            canAccessScorecard: !!canAccessScorecard,
            canAccessSCI: !!canAccessSCI,
            paymentStatus: body.paymentStatus,
            memberId: memberId,
            activationType: activationType,
            trialExpiry: body.trialExpiry
        };

        // Sync role and status if activation is set to Unlimited
        if (activationType === "Unlimited") {
            if (role === "Trial User" || role === "Free Tier" || !role) {
                updateData.role = "Premium Member";
            }
            updateData.paymentStatus = "Paid";
            updateData.accountType = "Premium";
        }

        // Auto-upgrade role if plan is Professional or setting to Unlimited
        if ((plan === "Professional" || activationType === "Unlimited") && (role === "Trial User" || role === "Free Tier" || !role)) {
            updateData.role = "Premium Member";
        }
        if (password && password.trim() !== "") {
            updateData.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });

        if (!updatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(updatedUser);
    } catch (error) {
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const action = searchParams.get("action");

        // --- NEW: DELETE ALL LOGIC ---
        if (action === 'deleteAll') {
            // Delete all users EXCEPT Admins and Moderators to prevent lockout
            const usersToDelete = await User.find({ role: { $nin: ['Admin', 'Moderator'] } });
            
            if (usersToDelete.length === 0) {
                return NextResponse.json({ message: "No eligible users found to delete" });
            }

            const identifiers = usersToDelete.map(u => u.email || u.fullName);
            const userIds = usersToDelete.map(u => u._id);

            // Construct global filter for related collections
            const bulkFilter = {
                $or: [
                    { userId: { $in: identifiers } }, // Matches by email/name
                    { userId: { $in: userIds.map(id => id.toString()) } } // Matches by ID string
                ]
            };

            await Promise.all([
                Diagnosis.deleteMany(bulkFilter),
                Simulation.deleteMany(bulkFilter),
                InterviewResult.deleteMany(bulkFilter),
                PerformanceProfile.deleteMany(bulkFilter),
                Certificate.deleteMany(bulkFilter),
                Recommendation.deleteMany(bulkFilter),
                JobAlignment.deleteMany(bulkFilter),
                User.deleteMany({ _id: { $in: userIds } })
            ]);

            return NextResponse.json({ message: `Successfully deleted ${usersToDelete.length} users and all related data.` });
        }

        // --- EXISTING: SINGLE DELETE LOGIC ---
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        // 1. Find user to get identifier (email/fullName) for cascade delete
        const user = await User.findById(id);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const identifier = user.email || user.fullName;

        // 2. Cascade delete all related data across collections
        const filter = { 
            $or: [
                { userId: { $regex: new RegExp(`^${identifier}$`, 'i') } },
                { userId: identifier.toString() }
            ]
        };

        await Promise.all([
            Diagnosis.deleteMany(filter),
            Simulation.deleteMany(filter),
            InterviewResult.deleteMany(filter),
            PerformanceProfile.deleteMany(filter),
            Certificate.deleteMany(filter),
            Recommendation.deleteMany(filter),
            JobAlignment.deleteMany(filter),
            User.findByIdAndDelete(id)
        ]);

        return NextResponse.json({ message: "User and all related data purged successfully" });
    } catch (error) {
        console.error("Delete Error:", error);
        return NextResponse.json({ error: (error as Error).message }, { status: 500 });
    }
}
