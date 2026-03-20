import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Diagnosis from '@/models/Diagnosis';

export const runtime = 'nodejs';

/**
 * POST: Save professional diagnostic progress
 */
export async function POST(req: NextRequest) {
  try {
    const { email, progressData } = await req.json();

    if (!email || !progressData) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    await connectDB();

    // Use updateOne or findOneAndUpdate with upsert
    await Diagnosis.findOneAndUpdate(
      { userId: email }, // Assuming userId is the email based on the schema
      {
        $set: {
          professionalProgress: progressData,
          updatedAt: new Date()
        }
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Progress saved successfully',
    });

  } catch (error) {
    console.error('Save professional progress error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * GET: Get professional diagnostic progress
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required' }, { status: 400 });
    }

    await connectDB();
    const userDiag = await Diagnosis.findOne({ userId: email }).lean();

    if (!userDiag) {
      return NextResponse.json({ success: true, progress: null });
    }

    const u = userDiag as Record<string, unknown>;
    return NextResponse.json({
      success: true,
      progress: u.professionalProgress || null,
    });

  } catch (error) {
    console.error('Get professional progress error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
