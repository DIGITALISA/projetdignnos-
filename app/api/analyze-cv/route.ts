import { NextRequest, NextResponse } from 'next/server';
import { analyzeCVWithAI } from '@/lib/deepseek';
import connectDB from '@/lib/mongodb';
import Diagnosis from '@/models/Diagnosis';
import mammoth from 'mammoth';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    try {
        const contentType = request.headers.get('content-type') || '';
        let cvText = '';
        let language = 'en';
        let userId = '';
        let userName = '';

        if (contentType.includes('multipart/form-data')) {
            const formData = await request.formData();
            const file = formData.get('file') as File;
            language = (formData.get('language') as string) || 'en';
            userId = (formData.get('userId') as string) || '';
            userName = (formData.get('userName') as string) || '';

            if (!file) {
                return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
            }

            const buffer = Buffer.from(await file.arrayBuffer());
            
            try {
                if (file.name.toLowerCase().endsWith('.pdf')) {
                    // Import directly from lib/pdf-parse to bypass the "debug mode" check in index.js 
                    // which tries to read a non-existent local file (./test/data/...)
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
            } catch (parseError: unknown) {
                console.error('File Parsing Error:', parseError);
                const errorMessage = parseError instanceof Error ? parseError.message : 'Unknown parsing error';
                return NextResponse.json({ 
                    error: `Failed to extract text from file: ${errorMessage}` 
                }, { status: 400 });
            }
        } else {
            const body = await request.json();
            cvText = body.cvText;
            language = body.language || 'en';
            userId = body.userId;
            userName = body.userName;
        }

        if (!cvText || cvText.trim().length < 50) {
            return NextResponse.json(
                { error: 'CV text is too short or could not be extracted' },
                { status: 400 }
            );
        }

        // ✅ Prevent context length errors: Truncate to a reasonable character limit
        // 30,000 characters is roughly 7,500 - 10,000 tokens, which is plenty for any CV
        if (cvText.length > 30000) {
            console.log(`Truncating CV from ${cvText.length} to 30000 characters`);
            cvText = cvText.substring(0, 30000) + "\n\n[Content truncated for length]";
        }

        const result = await analyzeCVWithAI(cvText, language);

        if (!result.success) {
            return NextResponse.json(
                { error: result.error },
                { status: 500 }
            );
        }

        // Save to MongoDB if user info is provided
        if (userId && userName) {
            try {
                await connectDB();
                await Diagnosis.findOneAndUpdate(
                    { 
                        $or: [
                            { userId: { $regex: new RegExp(`^${userId}$`, 'i') } },
                            { userId: userId.toString() }
                        ]
                    },
                    {
                        userId,
                        userName,
                        cvText,
                        analysis: result.analysis,
                        language,
                        currentStep: 'analysis_complete',
                        interviewEvaluation: null,
                        roleSuggestions: [],
                        selectedRole: null,
                        conversationHistory: [],
                        roleDiscoveryConversation: [],
                        simulationConversation: [],
                        simulationResults: [],
                        'completionStatus.cvAnalysisComplete': true,
                        'completionStatus.interviewComplete': false,
                        'completionStatus.roleDiscoveryComplete': false,
                        'completionStatus.roleSelected': false,
                        'completionStatus.simulationComplete': false,
                        updatedAt: new Date()
                    },
                    { 
                        upsert: true,
                        new: true,
                        setDefaultsOnInsert: true,
                        sort: { updatedAt: -1 }
                    }
                );
                console.log('✅ CV Analysis saved to MongoDB for user:', userId);
            } catch (dbError) {
                console.error('❌ Database Error:', dbError);
            }
        }

        return NextResponse.json({
            success: true,
            analysis: result.analysis,
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        );
    }
}
