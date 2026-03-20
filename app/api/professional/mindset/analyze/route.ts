import { NextRequest, NextResponse } from 'next/server';
import { analyzeMindsetResults } from '@/lib/deepseek';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
    try {
        const { messages, language } = await req.json();

        if (!messages || messages.length === 0) {
            return NextResponse.json({ success: false, error: "Missing transcript" }, { status: 400 });
        }

        const result = await analyzeMindsetResults(messages, language || 'en');

        if (result.success) {
            return NextResponse.json({ success: true, analysis: result.analysis });
        } else {
            return NextResponse.json({ success: false, error: result.error }, { status: 500 });
        }
    } catch (error) {
        console.error("Mindset analysis API failed:", error);
        return NextResponse.json({ success: false, error: "Analysis failed" }, { status: 500 });
    }
}
