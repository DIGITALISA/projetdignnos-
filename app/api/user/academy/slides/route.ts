import { NextRequest, NextResponse } from 'next/server';
import { generateSessionSlides } from '@/lib/deepseek';

export async function POST(request: NextRequest) {
    try {
        const { topic, language = 'en' } = await request.json();

        if (!topic) {
            return NextResponse.json({ error: 'Topic required' }, { status: 400 });
        }

        const result = await generateSessionSlides(topic, language);

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 500 });
        }

        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
