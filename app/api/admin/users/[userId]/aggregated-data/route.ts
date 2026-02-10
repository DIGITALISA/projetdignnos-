import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PerformanceProfile from '@/models/PerformanceProfile';
import Certificate from '@/models/Certificate';
import Diagnosis from '@/models/Diagnosis';
import Simulation from '@/models/Simulation';
import InterviewResult from '@/models/InterviewResult';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        await connectDB();
        const { userId } = await params;

        if (!userId) {
            return NextResponse.json({ error: "No User ID provided" }, { status: 400 });
        }

        let user = null;

        // 1. Try finding by MongoDB _id
        if (mongoose.Types.ObjectId.isValid(userId)) {
            user = await User.findById(userId);
        }

        // 2. If not found, maybe userId is actually the email (legacy support)
        if (!user) {
            user = await User.findOne({ email: userId });
        }

        // 3. Last resort: check if it matches a fullName (unlikely but possible identifier)
        if (!user) {
            user = await User.findOne({ fullName: userId });
        }

        if (!user) {
            return NextResponse.json({
                error: `User not found with ID: ${userId}`,
                debug: "Checked _id, email, and fullName"
            }, { status: 404 });
        }

        // 4. Determine the identifier used in other collections
        const identifier = user.email || user.fullName;

        // Fetch related data using the identifier (Case-insensitive)
        const [diagnosis, interviewResult, certificates, simulations, profile] = await Promise.all([
            Diagnosis.findOne({ 
                $or: [
                    { userId: { $regex: new RegExp(`^${identifier}$`, 'i') } },
                    { userId: identifier.toString() }
                ]
            }).sort({ updatedAt: -1 }),
            InterviewResult.findOne({ 
                $or: [
                    { userId: { $regex: new RegExp(`^${identifier}$`, 'i') } },
                    { userId: identifier.toString() }
                ]
            }).sort({ createdAt: -1 }),
            Certificate.find({ 
                $or: [
                    { userId: { $regex: new RegExp(`^${identifier}$`, 'i') } },
                    { userId: identifier.toString() }
                ]
            }),
            Simulation.find({ 
                $or: [
                    { userId: { $regex: new RegExp(`^${identifier}$`, 'i') } },
                    { userId: identifier.toString() }
                ]
            }),
            PerformanceProfile.findOne({ 
                $or: [
                    { userId: { $regex: new RegExp(`^${identifier}$`, 'i') } },
                    { userId: identifier.toString() }
                ]
            })
        ]);

        return NextResponse.json({
            success: true,
            user,
            diagnosis,
            interviewResult,
            certificates,
            simulations,
            profile
        });

    } catch (error: unknown) {
        console.error("Aggregated Data API Error:", error);
        const err = error as Error;
        return NextResponse.json({
            error: err.message || "Internal Server Error",
            stack: err.stack
        }, { status: 500 });
    }
}
