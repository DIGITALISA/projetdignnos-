import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Certificate from "@/models/Certificate";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        await connectDB();
        
        // البحث عن المعرف المحدد بالضبط
        const cert = await Certificate.findOne({ certificateId: 'CERT-2026-439675' })
            .lean();

        // محاولة البحث عن جزء من المعرف (مثل 439675)
        const partialCert = await Certificate.findOne({ certificateId: { $regex: '439675', $options: 'i' } })
            .lean();

        return NextResponse.json({
            foundExact: !!cert,
            certExact: cert,
            foundPartial: !!partialCert,
            certPartial: partialCert,
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
