import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import PerformanceProfile from '@/models/PerformanceProfile';
import Certificate from '@/models/Certificate';
import Diagnosis from '@/models/Diagnosis';
import Simulation from '@/models/Simulation';
import User from '@/models/User';
import Recommendation from '@/models/Recommendation';
import { generatePerformanceProfile, generateRecommendationLetter } from '@/lib/deepseek';

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        const { userId } = await params;
        const userIdParam = userId;
        const { expertNotes, language = 'fr' } = await request.json();

        await connectDB();

        // 1. Resolve User Identity
        const user = await User.findById(userIdParam);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        const identifier = user.email || user.fullName;

        // 2. Fetch Data Context
        const diagnosis = await Diagnosis.findOne({ userId: identifier });
        const certificates = await Certificate.find({ userId: identifier });
        const simulations = await Simulation.find({ userId: identifier, status: 'completed' });

        if (!diagnosis) {
            return NextResponse.json({ error: "User has no diagnosis data." }, { status: 400 });
        }

        // 3. Update/Save Expert Notes First (Stored in Profile for now)
        // We might want to store summary somewhere else, but let's assume we pass it directly to AI this time.

        // 4. GENERATE PROFILE with Expert Context
        // We need to update the AI function to accept expertNotes. 
        // For now, we'll append it to simulations or pass it specially.
        // Let's modify the simulations array to include a "virtual" simulation representing the expert's view if we don't want to change the signature yet, 
        // OR better: we update signature in a moment. I'll stick to passing it as a "Special Report" inside the prompt data.

        // Let's pretend the Expert Notes is a "Super Simulation" for the AI context
        const expertContext = {
            title: "EXPERT_SUPERVISOR_REVIEW",
            userDraft: expertNotes,
            expertFeedback: "VALIDATED BY HUMAN EXPERT",
            score: 100
        };
        const augmentedSimulations = [...simulations, expertContext];

        // A. Generate Profile
        const profileResult = await generatePerformanceProfile(
            { fullName: user.fullName, userId: identifier },
            certificates,
            diagnosis.analysis,
            augmentedSimulations, // Passing expert notes here
            language
        );

        if (!profileResult.success || !profileResult.profile) {
            throw new Error("AI Profile Generation Failed");
        }

        // B. Generate Recommendation
        const recResult = await generateRecommendationLetter(
            { fullName: user.fullName, userId: identifier },
            certificates,
            diagnosis.analysis,
            augmentedSimulations, // Passing expert notes here
            language
        );

        // 5. Save Results
        const referenceId = `EXEC-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

        // Save Profile
        await PerformanceProfile.findOneAndUpdate(
            { userId: identifier },
            {
                userName: user.fullName,
                summary: profileResult.profile.summary,
                competencies: profileResult.profile.competencies,
                verdict: profileResult.profile.verdict,
                expertNotes: expertNotes, // Store the manual notes
                language,
                referenceId
            },
            { upsert: true, new: true }
        );

        // Save Recommendation
        await Recommendation.create({
            userId: identifier,
            userName: user.fullName,
            subject: recResult.recommendation?.subject || "Letter of Recommendation",
            content: recResult.recommendation?.content || "Generated content...",
            keyEndorsements: recResult.recommendation?.keyEndorsements || [],
            language,
            referenceId
        });

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Profile Gen Error:", error);
        return NextResponse.json({ error: (error as Error).message || "Server Error" }, { status: 500 });
    }
}
