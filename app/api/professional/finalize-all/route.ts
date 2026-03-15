import { NextRequest, NextResponse } from 'next/server';
import { generateUltimateMasterReport } from '@/lib/deepseek';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Diagnosis from '@/models/Diagnosis';

export const runtime = 'nodejs';
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  try {
    const {
      auditResult,
      formData,
      interviewTranscript,
      portfolioTranscript,
      mcqResults,
      simulationResult,
      language,
      userId, // email of the user
    } = await req.json();

    await connectDB();
    let interviewAnalysis = "";
    let expertNotes = "";

    if (userId) {
      const diagnosis = await Diagnosis.findOne({ userId }).lean() as any;
      if (diagnosis && diagnosis.analysis && diagnosis.analysis.finalStrategicReport) {
        interviewAnalysis = diagnosis.analysis.finalStrategicReport;
      } else if (diagnosis && diagnosis.professionalInterviewTranscript && diagnosis.professionalInterviewTranscript.length > 0) {
          // If no report but transcript exists, we could use that, 
          // but deepseek function will handle summary if analysis is missing.
      }
      
      if (diagnosis && diagnosis.professionalExpertNotes) {
          expertNotes = diagnosis.professionalExpertNotes;
      }
    }

    const result = await generateUltimateMasterReport(
      auditResult,
      formData,
      interviewTranscript,
      portfolioTranscript,
      mcqResults,
      simulationResult,
      language,
      interviewAnalysis,
      expertNotes
    );

    // ─── Persist to DB if userId provided ─────────────────────────────
    if (userId && result.success && result.report) {
      try {
        await connectDB();
        await User.findOneAndUpdate(
          { email: userId },
          {
            $set: {
              professionalFinalReport: result.report,
              professionalReportStatus: 'completed',
              professionalReportCompletedAt: new Date(),
              professionalAuditData: { auditResult, formData },
              'professionalProgress.finalReport': result.report,
              'professionalProgress.finalReportGeneratedAt': new Date(),
            }
          },
          { new: true }
        );

        // Also save to Diagnosis for long-term history and expert review
        await Diagnosis.findOneAndUpdate(
          { userId },
          {
            $set: {
              professionalFinalReport: result.report,
              professionalAuditResult: auditResult,
              professionalInterviewTranscript: interviewTranscript,
              professionalMCQResults: mcqResults,
              professionalSimulationResult: simulationResult,
              professionalExpertReviewStatus: 'completed',
              currentStep: 'completed',
              updatedAt: new Date()
            }
          },
          { upsert: true }
        );
      } catch (dbError) {
        console.error('DB save error (finalize-all):', dbError);
        // Non-blocking: return result to client even if DB save fails
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Finalize all route error:', error);
    return NextResponse.json({ success: false, error: 'Failed to generate ultimate report' }, { status: 500 });
  }
}
