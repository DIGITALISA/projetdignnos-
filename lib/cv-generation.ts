import OpenAI from 'openai';

const deepseek = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1',
});

export async function startCVGeneration(
    cvAnalysis: any,
    interviewEvaluation: any,
    selectedRole: any,
    language: string = 'en'
) {
    try {
        const languageInstructions: Record<string, string> = {
            'en': 'Respond in English.',
            'fr': 'Répondez en français.',
            'ar': 'أجب باللغة العربية.',
            'es': 'Responde en español.',
        };

        const languageInstruction = languageInstructions[language] || languageInstructions['en'];

        const response = await deepseek.chat.completions.create({
            model: 'deepseek-chat',
            messages: [
                {
                    role: 'system',
                    content: `You are a Senior HR Expert and Professional CV Writer specializing in ATS-optimized documents.

${languageInstruction}

**YOUR EXPERTISE:**
- 15+ years in recruitment and talent acquisition
- Expert in Applicant Tracking Systems (ATS)
- Specialized in CV optimization and personal branding
- Deep understanding of what recruiters look for

**CONTEXT:**
You have access to:
1. **CV Analysis**: Original skills, experience, education
2. **Interview Evaluation**: Real capabilities vs CV claims
3. **Selected Role**: The specific position they're targeting - "${selectedRole.title}"

**YOUR MISSION:**
Conduct a focused 6-question interview to gather ADDITIONAL information needed to create:
1. An ATS-optimized CV tailored for "${selectedRole.title}"
2. A compelling cover letter
3. Professional marketing tips for their profile

**WHAT YOU NEED TO DISCOVER:**
1. **Quantifiable Achievements**: Specific metrics, numbers, results they've achieved
2. **Key Projects**: Detailed examples of relevant work
3. **Technical Tools**: Specific software, tools, methodologies they've used
4. **Soft Skills Examples**: Real situations demonstrating leadership, teamwork, problem-solving
5. **Career Motivation**: Why they want this specific role
6. **Unique Value Proposition**: What makes them stand out

**APPROACH:**
- Ask strategic questions that reveal concrete, quantifiable information
- Focus on details that will make their CV stand out
- Gather information that's relevant to "${selectedRole.title}"
- Help them articulate their value in recruiter-friendly language
 
**CRITICAL: You MUST respond ONLY with valid JSON. No explanatory text, no markdown, just pure JSON.**
**IMPORTANT: The language instruction applies ONLY to the text content INSIDE the JSON fields.**`
                },
                {
                    role: 'user',
                    content: `CV Analysis: ${JSON.stringify(cvAnalysis)}

Interview Evaluation: ${JSON.stringify(interviewEvaluation)}

Selected Role: ${JSON.stringify(selectedRole)}

Generate:
1. A professional welcome message (2-3 sentences) explaining this CV generation phase
2. The first strategic question to gather information for their CV

Respond in JSON format:
{
  "welcomeMessage": "string",
  "firstQuestion": "string"
}`
                }
            ],
            temperature: 0.7,
            max_tokens: 2000,
        });

        const result = response.choices[0]?.message?.content;
        if (!result) throw new Error('No response from AI');

        const cleanedResult = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const parsed = JSON.parse(cleanedResult);

        return {
            success: true,
            welcomeMessage: parsed.welcomeMessage,
            firstQuestion: parsed.firstQuestion,
        };
    } catch (error) {
        console.error('DeepSeek API Error:', error);
        return {
            success: false,
            error: 'Failed to start CV generation',
        };
    }
}

export async function generateNextCVQuestion(
    cvAnalysis: any,
    interviewEvaluation: any,
    selectedRole: any,
    conversationHistory: any[],
    language: string = 'en',
    questionNumber: number,
    totalQuestions: number
) {
    try {
        const languageInstructions: Record<string, string> = {
            'en': 'Respond in English.',
            'fr': 'Répondez en français.',
            'ar': 'أجب باللغة العربية.',
            'es': 'Responde en español.',
        };

        const languageInstruction = languageInstructions[language] || languageInstructions['en'];

        const response = await deepseek.chat.completions.create({
            model: 'deepseek-chat',
            messages: [
                {
                    role: 'system',
                    content: `You are an HR Expert gathering information for CV and cover letter creation.

${languageInstruction}

**CURRENT STATUS:** Question ${questionNumber} of ${totalQuestions}

**TARGET ROLE:** ${selectedRole.title}

**YOUR TASK:**
Based on their previous answers, ask the next strategic question to gather information that will:
- Make their CV stand out to recruiters
- Provide concrete, quantifiable achievements
- Highlight relevant skills for "${selectedRole.title}"
- Create a compelling narrative

**QUESTION FOCUS BY STAGE:**

**Questions 1-2 (Achievements):**
- Quantifiable results and metrics
- Specific projects and their impact
- Awards, recognition, or notable accomplishments

**Questions 3-4 (Skills & Tools):**
- Technical proficiencies relevant to the role
- Methodologies and frameworks used
- Certifications or specialized training

**Questions 5-6 (Motivation & Differentiation):**
- Why this specific role/company type
- What makes them uniquely qualified
- Their professional vision and goals

**RULES:**
- Ask ONE specific question
- Focus on gathering concrete, usable information
- Help them think in terms of achievements, not just responsibilities
- Guide them to provide recruiter-friendly responses`
                },
                {
                    role: 'user',
                    content: `CV Analysis: ${JSON.stringify(cvAnalysis)}

Interview Evaluation: ${JSON.stringify(interviewEvaluation)}

Selected Role: ${JSON.stringify(selectedRole)}

Conversation so far: ${JSON.stringify(conversationHistory)}

Generate the next question (Question ${questionNumber}/${totalQuestions}).
Respond with just the question text, no JSON.`
                }
            ],
            temperature: 0.8,
            max_tokens: 300,
        });

        return {
            success: true,
            question: response.choices[0]?.message?.content || '',
        };
    } catch (error) {
        console.error('DeepSeek API Error:', error);
        return {
            success: false,
            error: 'Failed to generate question',
        };
    }
}

export async function completeCVGeneration(
    cvAnalysis: any,
    interviewEvaluation: any,
    selectedRole: any,
    conversationHistory: any[],
    language: string = 'en'
) {
    try {
        const languageInstructions: Record<string, string> = {
            'en': 'Respond in English. Provide all content in English.',
            'fr': 'Répondez en français. Fournissez tout le contenu en français.',
            'ar': 'أجب باللغة العربية. قدم كل المحتوى باللغة العربية.',
            'es': 'Responde en español. Proporciona todo el contenido en español.',
        };

        const languageInstruction = languageInstructions[language] || languageInstructions['en'];

        const response = await deepseek.chat.completions.create({
            model: 'deepseek-chat',
            messages: [
                {
                    role: 'system',
                    content: `You are a Senior HR Expert creating professional documents.

**CRITICAL: You MUST respond ONLY with valid JSON. No explanatory text, no markdown, just pure JSON.**

${languageInstruction}
**IMPORTANT: The language instruction above applies ONLY to the text content INSIDE the JSON fields. The JSON structure itself must be valid JSON.**

**YOUR TASK:**
Based on ALL the information you have:
1. Original CV Analysis
2. Interview Evaluation (real capabilities)
3. Selected Role: "${selectedRole.title}"
4. Additional information from conversation

Create THREE professional documents:

**1. ATS-OPTIMIZED CV:**
- Format for Applicant Tracking Systems
- Use relevant keywords for "${selectedRole.title}"
- Quantify achievements with metrics
- Highlight skills matching the role
- Professional summary tailored to the role
- Clear, scannable structure
- Action verbs and impact statements

**2. COVER LETTER:**
- Compelling opening that grabs attention
- Specific examples demonstrating fit for "${selectedRole.title}"
- Show enthusiasm and cultural fit
- Address why they're the ideal candidate
- Professional closing with call to action
- 250-350 words

**3. PROFESSIONAL MARKETING TIPS:**
- How to present their profile to companies
- Key selling points to emphasize
- Red flags to avoid
- LinkedIn optimization tips
- Interview preparation pointers
- Networking strategies

**ATS OPTIMIZATION RULES:**
✓ Use standard section headings (Experience, Education, Skills)
✓ Include relevant keywords naturally
✓ Use simple, clean formatting (no tables, graphics)
✓ Quantify achievements (numbers, percentages, metrics)
✓ Match job description language
✓ Include both hard and soft skills
✓ Use industry-standard job titles

**OUTPUT FORMAT (JSON):**
{
  "cv": {
    "personalDetails": {
        "fullName": "string",
        "jobTitle": "targeted role title",
        "email": "string",
        "phone": "string",
        "location": "string",
        "linkedin": "string"
    },
    "professionalSummary": "string (impactful 3-4 lines)",
    "experience": [
        {
            "title": "string",
            "company": "string",
            "location": "string",
            "period": "string",
            "highlights": ["array of 3-4 bullet points with metrics and impact"]
        }
    ],
    "skills": {
        "technical": ["array of hard skills"],
        "tools": ["array of software/tools"],
        "soft": ["array of interpersonal skills"]
    },
    "education": [
        {
            "degree": "string",
            "institution": "string",
            "location": "string",
            "period": "string"
        }
    ],
    "languages": ["string"],
    "certifications": ["string"]
  },
  "coverLetter": "string (complete cover letter)",
  "professionalTips": "string (marketing and presentation tips)",
  "keywords": ["array of key terms used for ATS optimization"]
}`
                },
                {
                    role: 'user',
                    content: `CV Analysis: ${JSON.stringify(cvAnalysis)}

Interview Evaluation: ${JSON.stringify(interviewEvaluation)}

Selected Role: ${JSON.stringify(selectedRole)}

Conversation History: ${JSON.stringify(conversationHistory)}

IMPORTANT: You MUST respond with VALID JSON only. The structure must be exactly as specified in the OUTPUT FORMAT above.
All text content INSIDE the JSON must be in ${language}.
Do NOT add any text before or after the JSON. Do NOT wrap it in markdown code blocks.

Create the complete CV, cover letter, and professional tips now.`
                }
            ],
            temperature: 0.4,
            max_tokens: 3500,
        });

        const result = response.choices[0]?.message?.content;
        if (!result) throw new Error('No response from AI');

        console.log('[CV Generation] Raw AI response:', result.substring(0, 200));

        // Clean the result
        let cleanedResult = result.trim();
        cleanedResult = cleanedResult.replace(/```json\s*/g, '').replace(/```\s*/g, '');

        const jsonMatch = cleanedResult.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            cleanedResult = jsonMatch[0];
        }

        console.log('[CV Generation] Cleaned result:', cleanedResult.substring(0, 200));

        let parsed;
        try {
            parsed = JSON.parse(cleanedResult);
        } catch (parseError) {
            console.error('[CV Generation] JSON Parse Error:', parseError);
            console.error('[CV Generation] Failed to parse:', cleanedResult);
            throw new Error(`Failed to parse AI response as JSON: ${parseError}`);
        }

        const completionMessages: Record<string, string> = {
            'en': `Excellent! I've created your professional CV and cover letter optimized for "${selectedRole.title}". Review them below and download when ready.`,
            'fr': `Excellent ! J'ai créé votre CV professionnel et votre lettre de motivation optimisés pour "${selectedRole.title}". Consultez-les ci-dessous et téléchargez-les quand vous êtes prêt.`,
            'ar': `ممتاز! لقد أنشأت سيرتك الذاتية المهنية ورسالة التحفيز المحسّنة لـ "${selectedRole.title}". راجعها أدناه وقم بتنزيلها عندما تكون جاهزاً.`,
            'es': `¡Excelente! He creado tu CV profesional y carta de presentación optimizados para "${selectedRole.title}". Revísalos a continuación y descárgalos cuando estés listo.`,
        };

        return {
            success: true,
            documents: {
                cv: parsed.cv,
                coverLetter: parsed.coverLetter,
                professionalTips: parsed.professionalTips,
                keywords: parsed.keywords || [],
            },
            completionMessage: completionMessages[language] || completionMessages['en'],
        };
    } catch (error) {
        console.error('DeepSeek API Error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to generate documents',
        };
    }
}
