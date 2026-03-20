import { NextRequest, NextResponse } from 'next/server';
import { generateMindsetQuestion } from '@/lib/deepseek';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
    try {
        const { messages, language } = await req.json();

        const result = await generateMindsetQuestion(
            messages || [],
            language || 'en'
        );

        if (result.success) {
            return NextResponse.json({ success: true, message: result.question });
        } else {
            return NextResponse.json({ success: false, error: result.error }, { status: 500 });
        }
    } catch (error) {
        console.error("Mindset chat failed:", error);
        return NextResponse.json({ success: false, error: "Mindset chat failed" }, { status: 500 });
    }
}
