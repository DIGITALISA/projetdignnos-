import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import Diagnosis from '@/models/Diagnosis';
import Notification from '@/models/Notification';

export const runtime = 'nodejs';

/**
 * POST: Participant submits their completed professional report for expert review
 */
export async function POST(req: NextRequest) {
  try {
    const { email, finalReport, auditResult, formData, interviewTranscript } = await req.json();

    if (!email || !finalReport) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    // Update user with report data + status = pending_review
    const updatedUser = await User.findOneAndUpdate(
      { email },
      {
        $set: {
          professionalReportStatus: 'pending_review',
          professionalReportCompletedAt: new Date(),
          professionalFinalReport: finalReport,
          professionalAuditData: { auditResult, formData },
          professionalInterviewTranscript: interviewTranscript || [],
        }
      },
      { new: true }
    ).select('fullName email professionalReportStatus');

    if (!updatedUser) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Also update Diagnosis for expert review data
    await Diagnosis.findOneAndUpdate(
      { userId: email },
      {
        $set: {
          professionalFinalReport: finalReport,
          professionalInterviewTranscript: interviewTranscript || [],
          professionalExpertReviewStatus: 'pending_review',
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    // Create admin notification
    try {
      // Check if there's already an unread notification for this user to avoid duplicates
      const existingNotif = await Notification.findOne({
        type: 'professional_report_pending_review',
        "metadata.userEmail": email,
        read: false
      });

      if (!existingNotif) {
        await Notification.create({
          type: 'professional_report_pending_review',
          title: 'تقرير Professional جديد للمراجعة',
          message: `${updatedUser.fullName || email} أتم تقريره الاستراتيجي وينتظر المراجعة.`,
          recipientRole: 'Admin',
          metadata: { userEmail: email, userName: updatedUser.fullName },
          read: false,
          createdAt: new Date(),
        });
      } else {
        // Optionally update the timestamp of the existing one
        existingNotif.createdAt = new Date();
        await existingNotif.save();
      }
    } catch (notifError) {
      // Non-blocking: notification failure doesn't block submission
      console.warn('Notification creation failed:', notifError);
    }

    return NextResponse.json({
      success: true,
      message: 'Report submitted for expert review successfully',
      status: 'pending_review',
    });

  } catch (error) {
    console.error('Submit for review error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * GET: Check current review status
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email })
      .select('professionalReportStatus professionalReportCompletedAt professionalExpertNotes professionalExpertReviewedAt')
      .lean();

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    const u = user as Record<string, unknown>;
    return NextResponse.json({
      success: true,
      status: u.professionalReportStatus || 'not_started',
      completedAt: u.professionalReportCompletedAt || null,
      expertNotes: u.professionalExpertNotes || null,
      reviewedAt: u.professionalExpertReviewedAt || null,
    });

  } catch (error) {
    console.error('Get review status error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
