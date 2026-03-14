import { NextRequest, NextResponse } from 'next/server';
import { generateUltimateMasterReport } from '@/lib/deepseek';

export async function POST(req: NextRequest) {
  try {
    const { auditResult, formData, interviewTranscript, portfolioTranscript, mcqResults, simulationResult, language } = await req.json();

    const result = await generateUltimateMasterReport(
      auditResult,
      formData,
      interviewTranscript,
      portfolioTranscript,
      mcqResults,
      simulationResult,
      language
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error('Finalize all route error:', error);
    return NextResponse.json({ success: false, error: 'Failed to generate ultimate report' }, { status: 500 });
  }
}
