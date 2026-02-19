import { NextRequest, NextResponse } from 'next/server';
import { analyzeCVWithAI } from '@/lib/deepseek';
import connectDB from '@/lib/mongodb';
import Diagnosis from '@/models/Diagnosis';
import mammoth from 'mammoth';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
    try {
        const contentType = request.headers.get('content-type') || '';
        let cvText = '';
        let language = 'en';
        let userId = '';
        let userName = '';

        let file: File | null = null;
        let buffer: Buffer | null = null;

        if (contentType.includes('multipart/form-data')) {
            const formData = await request.formData();
            file = formData.get('file') as File;
            language = (formData.get('language') as string) || 'en';
            userId = (formData.get('userId') as string) || '';
            userName = (formData.get('userName') as string) || '';

            if (!file) {
                return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
            }

            buffer = Buffer.from(await file.arrayBuffer());
            
            try {
                if (file.name.toLowerCase().endsWith('.pdf')) {
                    console.log('📄 Starting PDF extraction for:', file.name);
                    // @ts-expect-error - No types for internal file
                    const pdfParseModule = await import('pdf-parse/lib/pdf-parse');
                    const pdf = pdfParseModule.default || pdfParseModule;
                    
                    // Try with a stable version bundled with the library
                    let data = await pdf(buffer, { version: 'v2.0.550' });
                    console.log('📄 Extracted from v2.0.550 - Pages:', data.numpages, 'Text length:', data.text?.length || 0);
                    
                    if (!data.text || data.text.trim().length < 50) {
                        console.log('⚠️ PDF v2 extraction failed or too short, trying v1.10.88...');
                        data = await pdf(buffer, { version: 'v1.10.88' });
                        console.log('📄 Extracted from v1.10.88 - Pages:', data.numpages, 'Text length:', data.text?.length || 0);
                    }

                    if (!data.text || data.text.trim().length < 50) {
                        console.log('⚠️ PDF v1.10.88 extraction failed or too short, trying default...');
                        data = await pdf(buffer);
                        console.log('📄 Extracted from default - Pages:', data.numpages, 'Text length:', data.text?.length || 0);
                    }

                    cvText = data.text;
                    
                    if (!cvText || cvText.trim().length < 50) {
                        console.error('❌ All PDF extraction attempts failed for:', file.name);
                        // If it's still too short, it might be a scanned PDF or empty
                    }
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

        console.log(`📊 Analysis Request - File: ${file?.name || 'Text Input'}, Extracted Length: ${cvText?.length || 0}, Buffer Size: ${buffer?.length || 0}`);

        if (!cvText || cvText.trim().length < 50) {
            const isScanned = cvText && cvText.trim().length < 50 && cvText.trim().length > 0;
            return NextResponse.json(
                { 
                    error: isScanned 
                        ? 'The PDF seems to be an image or scanned document. Please upload a PDF with selectable text.' 
                        : 'Could not extract text from the CV. Please ensure the file is not corrupted or try a different format (Word/Plain Text).',
                    details: {
                        extractedLength: cvText?.length || 0,
                        fileName: file?.name,
                        bufferSize: buffer?.length || 0,
                        bufferPreview: buffer ? buffer.subarray(0, 50).toString('hex') : 'No buffer'
                    }
                },
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

        let finalTrialExpiry = null;

        // Save to MongoDB if user info is provided
        if (userId && userName) {
            try {
                await connectDB();
                
                // Get user plan from User model
                const User = (await import('@/models/User')).default;
                const user = await User.findOne({ 
                    $or: [
                        { email: { $regex: new RegExp(`^${userId}$`, 'i') } },
                        { fullName: { $regex: new RegExp(`^${userId}$`, 'i') } },
                        { email: userId },
                        { fullName: userName }
                    ]
                });
                
                const isFreeTier = !user || user.plan === "Free Trial" || user.plan === "None" || user.role === "Trial User" || user.role === "Free Tier";
                
                // ✅ INITIALIZE TRIAL ON FIRST CV UPLOAD
                if ((user?.role === "Trial User" || user?.role === "Free Tier") && !user.trialExpiry) {
                    const duration = user.trialDurationHours || 0.25; // Default 15 mins
                    const expiry = new Date();
                    expiry.setMinutes(expiry.getMinutes() + (duration * 60));
                    user.trialExpiry = expiry;
                    await user.save();
                    console.log(`⏱️ Trial started for user ${userId}. Expires at: ${expiry}`);
                }

                finalTrialExpiry = user?.trialExpiry;

                const existing = await Diagnosis.findOne({ 
                    $or: [
                        { userId: { $regex: new RegExp(`^${userId}$`, 'i') } },
                        { userId: userId.toString() }
                    ]
                }).sort({ updatedAt: -1 });

                // ... (rest of the block)
                if (isFreeTier && existing && (existing.completionStatus?.cvAnalysisComplete || existing.cvText)) {
                    return NextResponse.json({ 
                        error: 'ONE_ATTEMPT_LIMIT',
                        message: language === 'ar' 
                            ? 'لقد استخدمت محاولتك المجانية الوحيدة للتشخيص. يرجى الترقية لإجراء تحليل جديد.' 
                            : 'You have already used your one free diagnostic attempt. Please upgrade to Pro to perform a new analysis.' 
                    }, { status: 403 });
                }

                const referenceId = existing?.referenceId || `SCI-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

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
                        referenceId,
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
                if ((dbError as { message?: string }).message?.includes('ONE_ATTEMPT_LIMIT')) {
                    throw dbError; // Rethrow to be caught by outer catch
                }
            }
        }

        return NextResponse.json({
            success: true,
            analysis: result.analysis,
            trialExpiry: finalTrialExpiry
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        );
    }
}
