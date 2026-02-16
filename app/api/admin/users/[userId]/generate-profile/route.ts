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
        const { expertNotes, language = 'fr', type } = await request.json();

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

        const referenceId = `EXEC-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

        // Handle generation based on type
        if (type === 'assessment') {
            const profileResult = await generatePerformanceProfile(
                { fullName: user.fullName, userId: identifier },
                certificates,
                diagnosis.analysis,
                simulations, 
                language,
                expertNotes
            );

            if (!profileResult.success || !profileResult.profile) {
                throw new Error("AI Performance Profile Generation Failed");
            }

            await PerformanceProfile.findOneAndUpdate(
                { userId: identifier },
                {
                    userName: user.fullName,
                    summary: profileResult.profile.summary,
                    competencies: profileResult.profile.competencies,
                    verdict: profileResult.profile.verdict,
                    expertNotes: expertNotes, 
                    language,
                    referenceId
                },
                { upsert: true, new: true }
            );
        } 
        else if (type === 'recommendation') {
            const recResult = await generateRecommendationLetter(
                { fullName: user.fullName, userId: identifier },
                certificates,
                diagnosis.analysis,
                simulations, 
                language,
                expertNotes
            );

            if (!recResult.success || !recResult.recommendation) {
                throw new Error("AI Recommendation Generation Failed");
            }

            await Recommendation.findOneAndUpdate(
                { userId: identifier },
                {
                    userName: user.fullName,
                    subject: recResult.recommendation?.subject || "Letter of Recommendation",
                    content: recResult.recommendation?.content || "Generated content...",
                    keyEndorsements: recResult.recommendation?.keyEndorsements || [],
                    language,
                    referenceId
                },
                { upsert: true }
            );
        }
        else if (type === 'scorecard') {
            // Need a base profile for scores or derive from AI
            // We use generatePerformanceProfile briefly to get metrics
            const profileResult = await generatePerformanceProfile(
                { fullName: user.fullName, userId: identifier },
                certificates,
                diagnosis.analysis,
                simulations, 
                language,
                expertNotes
            );

            if (profileResult.profile) {
                const compMap = new Map(profileResult.profile.competencies.map((c: { label: string; score: number }) => [c.label.toLowerCase(), c.score]));
                
                await Simulation.findOneAndUpdate(
                    { userId: identifier, status: 'completed' },
                    {
                        $set: {
                            performanceMetrics: {
                                leadership: compMap.get('strategic leadership') || compMap.get('leadership') || 8.5,
                                strategy: compMap.get('operational strategy') || compMap.get('strategy') || 8.0,
                                communication: compMap.get('executive communication') || compMap.get('communication') || 9.0,
                                problemSolving: compMap.get('complex problem solving') || compMap.get('problem solving') || 8.2,
                                decisionSpeed: 8.8,
                                overallScore: profileResult.profile.competencies.reduce((acc: number, c: { score: number }) => acc + c.score, 0) / profileResult.profile.competencies.length
                            }
                        }
                    },
                    { sort: { updatedAt: -1 } }
                );
            }
        }
        else {
            return NextResponse.json({ error: "Invalid generation type" }, { status: 400 });
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Profile Gen Error:", error);
        return NextResponse.json({ error: (error as Error).message || "Server Error" }, { status: 500 });
    }
}
