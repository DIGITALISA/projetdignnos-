import { NextResponse } from 'next/server';
import { getAIConfig } from '@/lib/config';

export const maxDuration = 120;

export async function POST(req: Request) {
    try {
        const { targetJob, targetCompany, jobDescription, diagnosisContext, interviewMessages, language } = await req.json();
        const config = await getAIConfig();
        
        const isOpenAI = config.activeProvider === 'openai';
        const apiKey = isOpenAI ? config.openai.apiKey : config.deepseek.apiKey;
        const baseURL = isOpenAI ? 'https://api.openai.com/v1' : config.deepseek.baseURL;
        const model = isOpenAI ? 'gpt-4-turbo-preview' : 'deepseek-chat';

        const hasTarget = targetJob || targetCompany || jobDescription;
        const targetFocus = hasTarget 
            ? `The content must be perfectly aligned with the TARGET JOB: "${targetJob || 'N/A'}" at COMPANY: "${targetCompany || 'N/A'}". Use the job description if provided: """${jobDescription || ''}""" to perform GAP ANALYSIS and embed ATS keywords.` 
            : `Generate a powerful, universally-appealing foundational executive resume. There is no specific target job so focus purely on maximizing the impact of the user's past achievements.`;

        const systemPrompt = `
You are an Elite Executive Document Designer. Generate a comprehensive Professional Identity Data set in JSON format.
This data will populate a Strategic Portfolio, an ATS-optimized Resume, and a high-impact Motivation Letter.

${targetFocus}

Use the provided Diagnosis Context and Interview Messages to extract ALL relevant details. 

JSON STRUCTURE REQUIRED:
{
  "personalInfo": { 
    "fullName": "", 
    "title": "", 
    "summary": "Executive summary with strong focus on value proposition",
    "contactInfo": {
      "email": "",
      "phone": "",
      "linkedin": "",
      "whatsapp": "",
      "location": ""
    }
  },
  "experience": [
    { "role": "", "company": "", "duration": "", "achievements": ["Use numbers, percentages, and quantifiable impact"] }
  ],
  "skills": { "technical": ["Specific tools/tech"], "leadership": ["Strategic assets"], "soft": ["Core traits"] },
  "portfolioStructure": {
    "title": "A theme that unites their case studies",
    "caseStudies": [
      { "name": "Project/Mission Title", "challenge": "The problem solved", "solution": "The strategic steps/action", "impact": "The quantifiable result" }
    ]
  },
  "coverLetter": "A high-end executive cover letter (300-400 words) focusing on their value to the role or market."
}

Ensure the tone is sophisticated and elite.
Language: ${language === 'ar' ? 'Formal Arabic (Fusha)' : language === 'fr' ? 'French' : 'English'}.
`;

        const response = await fetch(`${baseURL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: `Generate the final document based on this context: ${JSON.stringify({ diagnosisContext, interviewMessages })}` }
                ],
                response_format: { type: 'json_object' },
                temperature: 0.7,
            }),
        });

        const data = await response.json();
        return NextResponse.json(JSON.parse(data.choices[0].message.content));

    } catch (error: unknown) {
        console.error("Resume Generation Error:", error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
    }
}
