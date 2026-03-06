import { NextRequest, NextResponse } from "next/server";
import { performProfessionalAudit } from "@/lib/deepseek";
import connectDB from "@/lib/mongodb";
import Diagnosis from "@/models/Diagnosis";
import mammoth from 'mammoth';

export const runtime = 'nodejs';
export const maxDuration = 120; // 2 minutes for deep analysis

export async function POST(req: NextRequest) {
    try {
        const contentType = req.headers.get('content-type') || '';
        let sectors = "";
        let positions = [];
        let vision = "";
        let cvText = "";
        let careerStory = "";
        let language = "en";
        let userId = "";
        let userName = "";

        if (contentType.includes('multipart/form-data')) {
            const formData = await req.formData();
            sectors = (formData.get('sectors') as string) || "";
            positions = JSON.parse((formData.get('positions') as string) || "[]");
            vision = (formData.get('vision') as string) || "";
            careerStory = (formData.get('careerStory') as string) || "";
            language = (formData.get('language') as string) || "en";
            userId = (formData.get('userId') as string) || "";
            userName = (formData.get('userName') as string) || "";

            const file = formData.get('cv') as File;
            if (file) {
                const buffer = Buffer.from(await file.arrayBuffer());
                if (file.name.toLowerCase().endsWith('.pdf')) {
                    // @ts-expect-error - No types for internal file
                    const pdfParseModule = await import('pdf-parse/lib/pdf-parse');
                    const pdf = pdfParseModule.default || pdfParseModule;
                    const data = await pdf(buffer);
                    cvText = data.text;
                } else if (file.name.toLowerCase().endsWith('.docx') || file.name.toLowerCase().endsWith('.doc')) {
                    const result = await mammoth.extractRawText({ buffer });
                    cvText = result.value;
                } else {
                    cvText = buffer.toString('utf-8');
                }
            }
        } else {
            const body = await req.json();
            sectors = body.sectors;
            positions = body.positions;
            vision = body.vision;
            cvText = body.cvText;
            careerStory = body.careerStory;
            language = body.language || 'en';
            userId = body.userId;
            userName = body.userName;
        }

        if (!sectors || !positions || !vision) {
            return NextResponse.json({ error: "Missing required audit fields" }, { status: 400 });
        }

        const result = await performProfessionalAudit({ 
            sectors, 
            positions, 
            vision, 
            cvText, 
            careerStory 
        }, language || 'en');

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 500 });
        }

        // Save to MongoDB if possible
        if (userId) {
            try {
                await connectDB();
                const referenceId = `AUDIT-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
                
                await Diagnosis.findOneAndUpdate(
                    { userId },
                    {
                        userId,
                        userName: userName || "Professional Participant",
                        analysis: {
                            professionalAudit: result.audit,
                            originalData: { sectors, positions, vision, careerStory }
                        },
                        language: language || 'en',
                        currentStep: 'professional_audit_complete',
                        referenceId,
                        updatedAt: new Date()
                    },
                    { upsert: true, new: true }
                );
            } catch (dbError) {
                console.error("Database save error:", dbError);
            }
        }

        return NextResponse.json(result);
    } catch (error) {
        console.error("Strategic Audit API Error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
