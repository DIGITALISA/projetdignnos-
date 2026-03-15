import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Diagnosis from '@/models/Diagnosis';

export const runtime = 'nodejs';

/**
 * GET: List all Professional reports pending/completed review (for Admin)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get('status') || 'pending_review';

    await connectDB();

    const query = statusFilter === 'all'
      ? { plan: 'Professional', professionalReportStatus: { $exists: true, $ne: 'not_started' } }
      : { plan: 'Professional', professionalReportStatus: statusFilter };

    const users = await User.find(query)
      .select('fullName email professionalReportStatus professionalReportCompletedAt professionalFinalReport professionalAuditData professionalInterviewTranscript professionalExpertNotes professionalExpertReviewedAt professionalExpertReviewedBy')
      .sort({ professionalReportCompletedAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      count: users.length,
      reports: users.map((u) => {
        const user = u as Record<string, unknown>;
        return {
          email: user.email,
          fullName: user.fullName,
          status: user.professionalReportStatus,
          completedAt: user.professionalReportCompletedAt,
          hasReport: !!user.professionalFinalReport,
          hasAudit: !!user.professionalAuditData,
          interviewCount: Array.isArray(user.professionalInterviewTranscript)
            ? (user.professionalInterviewTranscript as unknown[]).length
            : 0,
          expertNotes: user.professionalExpertNotes || null,
          reviewedAt: user.professionalExpertReviewedAt || null,
          reviewedBy: user.professionalExpertReviewedBy || null,
        };
      }),
    });

  } catch (error) {
    console.error('Admin reports list error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * PATCH: Admin marks a report as reviewed and adds expert notes
 */
export async function PATCH(req: NextRequest) {
  try {
    const { targetEmail, adminEmail, action, expertNotes } = await req.json();

    if (!targetEmail || !adminEmail || !action) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    const newStatus = action === 'approve' ? 'reviewed' : action === 'reject' ? 'rejected' : null;
    if (!newStatus) {
      return NextResponse.json({ success: false, error: 'Invalid action. Use approve or reject' }, { status: 400 });
    }

    await connectDB();

    const updated = await User.findOneAndUpdate(
      { email: targetEmail },
      {
        $set: {
          professionalReportStatus: newStatus,
          professionalExpertNotes: expertNotes || '',
          professionalExpertReviewedAt: new Date(),
          professionalExpertReviewedBy: adminEmail,
        }
      },
      { new: true }
    ).select('fullName email professionalReportStatus');

    if (!updated) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Update Diagnosis record as well
    await Diagnosis.findOneAndUpdate(
      { userId: targetEmail },
      {
        $set: {
          professionalExpertReviewStatus: newStatus,
          professionalExpertNotes: expertNotes || '',
          professionalExpertReviewedAt: new Date(),
          professionalExpertReviewedBy: adminEmail,
          updatedAt: new Date()
        }
      }
    );

    return NextResponse.json({
      success: true,
      message: `Report ${newStatus} successfully`,
      user: { email: updated.email, status: (updated as Record<string, unknown>).professionalReportStatus },
    });

  } catch (error) {
    console.error('Admin review action error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
