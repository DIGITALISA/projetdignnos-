import { NextRequest, NextResponse } from 'next/server';
import { analyzeProfessionalSimulation } from '@/lib/deepseek';

export async function POST(req: NextRequest) {
  try {
    const { scenarios, answers, auditResult, formData, language } = await req.json();
    const result = await analyzeProfessionalSimulation(scenarios, answers, auditResult, formData, language);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Simulation analyze route error:', error);
    return NextResponse.json({ success: false, error: 'Failed to analyze simulation' }, { status: 500 });
  }
}
