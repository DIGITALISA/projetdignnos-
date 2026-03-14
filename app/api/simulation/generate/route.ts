import { NextRequest, NextResponse } from 'next/server';
import { generateProfessionalSimulation } from '@/lib/deepseek';

export async function POST(req: NextRequest) {
  try {
    const { auditResult, formData, mcqResults, language } = await req.json();
    const result = await generateProfessionalSimulation(auditResult, formData, mcqResults, language);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Simulation generate route error:', error);
    return NextResponse.json({ success: false, error: 'Failed to generate simulations' }, { status: 500 });
  }
}
