import { NextRequest, NextResponse } from 'next/server';
import { analyzeCVWithAI } from '@/lib/deepseek';
import connectDB from '@/lib/mongodb';
import Diagnosis from '@/models/Diagnosis';

export async function POST(request: NextRequest) {
    try {
        const { cvText, language = 'en', userId, userName } = await request.json();

        if (!cvText) {
            return NextResponse.json(
                { error: 'CV text is required' },
                { status: 400 }
            );
        }

        const result = await analyzeCVWithAI(cvText, language);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 500 }
            );
        }

        // Save to MongoDB if user info is provided
        if (userId && userName) {
            try {
                await connectDB();
                await Diagnosis.create({
                    userId,
                    userName,
                    cvText,
                    analysis: result.analysis,
                    language
                });
            } catch (dbError) {
                console.error('Database Error:', dbError);
                // We don't block the response even if saving fails, 
                // but in a production app we might want to ensure consistency
            }
        }

        return NextResponse.json({
            success: true,
            analysis: result.analysis,
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
