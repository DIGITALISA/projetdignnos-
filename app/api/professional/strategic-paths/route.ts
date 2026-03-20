import { NextRequest, NextResponse } from 'next/server';
import { generateStrategicPaths } from '@/lib/deepseek';

export const maxDuration = 60; // AI path analysis can take time

export async function POST(req: NextRequest) {
    try {
        const { grandReport, language, simulationContext } = await req.json();

        if (!grandReport) {
            return NextResponse.json({ error: 'Missing diagnostic data' }, { status: 400 });
        }

        const result = await generateStrategicPaths(grandReport, language, simulationContext);

        if (result.success) {
            return NextResponse.json(result.analysis);
        } else {
            return NextResponse.json({ error: result.error }, { status: 500 });
        }
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
