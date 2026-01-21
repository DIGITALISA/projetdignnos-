import OpenAI from 'openai';

const deepseek = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1',
});

export async function analyzeCVWithAI(cvText: string, language: string = 'en') {
    try {
        // Language-specific instructions
        const languageInstructions: Record<string, string> = {
            'en': 'Respond in English. Provide all feedback in English.',
            'fr': 'Répondez en français. Fournissez tous les commentaires en français.',
            'ar': 'أجب باللغة العربية. قدم جميع الملاحظات باللغة العربية.',
            'es': 'Responde en español. Proporciona todos los comentarios en español.',
        };

        const languageInstruction = languageInstructions[language] || languageInstructions['en'];

        const response = await deepseek.chat.completions.create({
            model: 'deepseek-chat',
            messages: [
                {
                    role: 'system',
                    content: `You are a senior HR manager and career strategist with 15+ years of experience reviewing thousands of CVs. Your role is to provide BRUTALLY HONEST, NO-NONSENSE feedback.

**LANGUAGE REQUIREMENT:**
${languageInstruction}

**Your Analysis Must Include:**
1. **Overview**: Quick summary of candidate profile (2-3 sentences max)
2. **Key Strengths**: What stands out positively (bullet points, be specific)
3. **Critical Weaknesses**: What's missing or poorly presented (be direct, no sugar-coating)
4. **Skills Assessment**: 
   - Technical/Hard skills identified
   - Soft skills evident from experience
   - Skills gaps that need addressing
5. **Experience Evaluation**: Years of experience, career progression quality
6. **Education**: Relevance and quality of educational background
7. **Recommended Actions**: Top 3 immediate improvements needed
8. **Career Path Suggestions**: Best-fit roles based on current profile

**IMPORTANT RULES:**
- Be CONCISE and DIRECT - no fluff or corporate jargon
- Point out red flags immediately (employment gaps, lack of achievements, vague descriptions)
- Focus on ACTIONABLE feedback
- Use a professional but straightforward tone
- Respond ONLY in valid JSON format
- ALL text content MUST be in the specified language (${language})

**JSON Structure:**
{
  "overview": "string",
  "strengths": ["string"],
  "weaknesses": ["string"],
  "skills": {
    "technical": ["string"],
    "soft": ["string"],
    "gaps": ["string"]
  },
  "experience": {
    "years": number,
    "quality": "Junior/Mid-level/Senior/Expert",
    "progression": "string (assessment of career growth)"
  },
  "education": {
    "level": "string",
    "relevance": "High/Medium/Low",
    "notes": "string"
  },
  "immediateActions": ["string"],
  "careerPaths": ["string"],
  "overallScore": number (0-100),
  "verdict": "string (one-line honest summary)"
}`
                },
                {
                    role: 'user',
                    content: `Analyze this CV with complete honesty - no politeness, just facts. Provide ALL feedback in ${language}:\n\n${cvText}`
                }
            ],
            temperature: 0.3, // Lower temperature for more consistent, factual analysis
            max_tokens: 2500,
        });

        const analysis = response.choices[0]?.message?.content;

        if (!analysis) {
            throw new Error('No response from AI');
        }

        // Try to parse JSON, handling potential markdown code blocks
        let parsedAnalysis;
        try {
            // Remove markdown code blocks if present
            const cleanedAnalysis = analysis.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            parsedAnalysis = JSON.parse(cleanedAnalysis);
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError);
            console.error('Raw response:', analysis);
            throw new Error('Failed to parse AI response as JSON');
        }

        return {
            success: true,
            analysis: parsedAnalysis,
        };
    } catch (error) {
        console.error('DeepSeek API Error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to analyze CV',
        };
    }
}

export async function generateInterviewQuestion(cvAnalysis: any, conversationHistory: any[] = [], language: string = 'en') {
    try {
        // Language-specific instructions
        const languageInstructions: Record<string, string> = {
            'en': 'Respond in English. Be professional and conversational.',
            'fr': 'Répondez en français. Soyez professionnel et conversationnel.',
            'ar': 'أجب باللغة العربية. كن محترفًا وودودًا في الحوار.',
            'es': 'Responde en español. Sé profesional y conversacional.',
        };

        const languageInstruction = languageInstructions[language] || languageInstructions['en'];

        const response = await deepseek.chat.completions.create({
            model: 'deepseek-chat',
            messages: [
                {
                    role: 'system',
                    content: `You are a professional career interviewer conducting an assessment interview. 
                    
${languageInstruction}

Based on the candidate's CV analysis, ask relevant, insightful questions to understand their:
- Experience and achievements
- Career motivations and goals
- Skills and competencies
- Areas for development

**IMPORTANT RULES:**
- Ask ONE question at a time
- Be conversational and supportive
- Tailor questions based on their CV and previous answers
- Focus on understanding their career journey and aspirations
- Keep questions clear and concise`
                },
                {
                    role: 'user',
                    content: `CV Analysis: ${JSON.stringify(cvAnalysis)}\n\nConversation so far: ${JSON.stringify(conversationHistory)}\n\nGenerate the next interview question in ${language}.`
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

export async function evaluateInterviewAnswer(question: string, answer: string, cvAnalysis: any) {
    try {
        const response = await deepseek.chat.completions.create({
            model: 'deepseek-chat',
            messages: [
                {
                    role: 'system',
                    content: `You are evaluating interview answers. Provide constructive feedback on the candidate's response, highlighting strengths and areas for improvement. Be encouraging but honest.`
                },
                {
                    role: 'user',
                    content: `Question: ${question}\nAnswer: ${answer}\nCV Context: ${JSON.stringify(cvAnalysis)}\n\nProvide feedback as JSON with: score (0-10), strengths, improvements, nextQuestion`
                }
            ],
            temperature: 0.7,
            max_tokens: 500,
        });

        const feedback = response.choices[0]?.message?.content;
        return {
            success: true,
            feedback: feedback ? JSON.parse(feedback) : null,
        };
    } catch (error) {
        console.error('DeepSeek API Error:', error);
        return {
            success: false,
            error: 'Failed to evaluate answer',
        };
    }
}

// ===== NEW STRUCTURED INTERVIEW FUNCTIONS =====

export async function startStructuredInterview(cvAnalysis: any, language: string = 'en') {
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
                    content: `You are a senior HR manager conducting a professional CV verification interview.

${languageInstruction}

**YOUR ROLE:**
You will conduct a structured interview with 15 targeted questions to:
1. Verify the accuracy of information in the candidate's CV
2. Assess their real capabilities vs what's written
3. Identify exaggerations or gaps between CV and reality
4. Understand their true skill level and experience

**INTERVIEW STRUCTURE:**
- Start with a warm, professional welcome message
- Ask 15 strategic questions covering:
  * Technical skills mentioned in CV (verify depth of knowledge)
  * Work experience claims (ask for specific examples)
  * Achievements listed (verify with details)
  * Skills gaps identified in analysis
  * Career goals and motivations

**IMPORTANT:**
- Be professional but direct
- Ask specific, probing questions
- Focus on verification, not just conversation
- Each question should help assess CV accuracy`
                },
                {
                    role: 'user',
                    content: `CV Analysis: ${JSON.stringify(cvAnalysis)}

Generate:
1. A professional welcome message (2-3 sentences) explaining the interview purpose
2. The first strategic question to start verifying their CV

Respond in JSON format:
{
  "welcomeMessage": "string",
  "firstQuestion": "string"
}`
                }
            ],
            temperature: 0.7,
            max_tokens: 500,
        });

        const result = response.choices[0]?.message?.content;
        if (!result) throw new Error('No response from AI');

        const cleanedResult = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const parsed = JSON.parse(cleanedResult);

        return {
            success: true,
            welcomeMessage: parsed.welcomeMessage,
            firstQuestion: parsed.firstQuestion,
            totalQuestions: 15,
        };
    } catch (error) {
        console.error('DeepSeek API Error:', error);
        return {
            success: false,
            error: 'Failed to start interview',
        };
    }
}

export async function generateNextInterviewQuestion(
    cvAnalysis: any,
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
                    content: `You are conducting a CV verification interview.

${languageInstruction}

**CURRENT STATUS:** Question ${questionNumber} of ${totalQuestions}

**YOUR TASK:**
Based on the candidate's previous answers and their CV analysis:
1. Generate the next strategic question
2. Focus on areas not yet covered
3. Probe deeper into suspicious or vague CV claims
4. Verify technical skills with specific questions
5. Ask for concrete examples of achievements

**QUESTION TYPES TO ROTATE:**
- Technical depth verification
- Experience validation (ask for specific projects/results)
- Achievement verification (ask for metrics/outcomes)
- Skills gap exploration
- Problem-solving scenarios related to their claimed expertise

**RULES:**
- ONE question only
- Be specific and targeted
- Reference their CV or previous answers when relevant
- Aim to uncover truth, not trick them`
                },
                {
                    role: 'user',
                    content: `CV Analysis: ${JSON.stringify(cvAnalysis)}

Conversation so far: ${JSON.stringify(conversationHistory)}

Generate the next interview question (Question ${questionNumber}/${totalQuestions}).
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

export async function evaluateInterview(cvAnalysis: any, conversationHistory: any[], language: string = 'en') {
    try {
        const languageInstructions: Record<string, string> = {
            'en': 'Respond in English. Provide all feedback in English.',
            'fr': 'Répondez en français. Fournissez tous les commentaires en français.',
            'ar': 'أجب باللغة العربية. قدم جميع الملاحظات باللغة العربية.',
            'es': 'Responde en español. Proporciona todos los comentarios en español.',
        };

        const languageInstruction = languageInstructions[language] || languageInstructions['en'];

        const response = await deepseek.chat.completions.create({
            model: 'deepseek-chat',
            messages: [
                {
                    role: 'system',
                    content: `You are a senior HR expert providing final interview evaluation.

${languageInstruction}

**YOUR TASK:**
Analyze the entire interview conversation and provide:

1. **CV Accuracy Score (0-100%)**: How accurate is their CV compared to their real capabilities?
2. **Overall Rating (0-10)**: General performance and honesty
3. **Detailed Comparison**: CV claims vs. reality revealed in interview
4. **Strengths Confirmed**: What from their CV is genuinely strong
5. **Exaggerations Detected**: What was overstated in CV
6. **Hidden Strengths**: Capabilities they have but didn't highlight in CV
7. **CV Improvement Recommendations**: Specific advice to make CV more accurate and effective
8. **Skill Development Priorities**: What they should actually focus on improving

**BE BRUTALLY HONEST:**
- Point out discrepancies clearly
- Identify exaggerations or vague claims
- Recognize genuine strengths
- Provide actionable CV rewrite suggestions

**OUTPUT FORMAT (JSON):**
{
  "accuracyScore": number (0-100),
  "overallRating": number (0-10),
  "summary": "string (3-4 sentences)",
  "cvVsReality": {
    "confirmedStrengths": ["string"],
    "exaggerations": ["string"],
    "hiddenStrengths": ["string"]
  },
  "cvImprovements": ["string"],
  "skillDevelopmentPriorities": ["string"],
  "verdict": "string (one honest sentence)"
}`
                },
                {
                    role: 'user',
                    content: `CV Analysis: ${JSON.stringify(cvAnalysis)}

Full Interview Conversation: ${JSON.stringify(conversationHistory)}

Provide comprehensive evaluation comparing CV claims with interview reality.
ALL content must be in ${language}.`
                }
            ],
            temperature: 0.3,
            max_tokens: 2000,
        });

        const result = response.choices[0]?.message?.content;
        if (!result) throw new Error('No response from AI');

        const cleanedResult = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const evaluation = JSON.parse(cleanedResult);

        // Generate closing message
        const closingMessages: Record<string, string> = {
            'en': `Thank you for completing the interview! I've analyzed your responses and compared them with your CV. Your accuracy score is ${evaluation.accuracyScore}%. Click below to see your detailed evaluation and personalized CV improvement recommendations.`,
            'fr': `Merci d'avoir terminé l'entretien ! J'ai analysé vos réponses et les ai comparées avec votre CV. Votre score de précision est de ${evaluation.accuracyScore}%. Cliquez ci-dessous pour voir votre évaluation détaillée et vos recommandations personnalisées d'amélioration du CV.`,
            'ar': `شكراً لإكمال المقابلة! لقد حللت إجاباتك وقارنتها بسيرتك الذاتية. نسبة الدقة الخاصة بك هي ${evaluation.accuracyScore}٪. انقر أدناه لرؤية التقييم التفصيلي والتوصيات المخصصة لتحسين سيرتك الذاتية.`,
            'es': `¡Gracias por completar la entrevista! He analizado tus respuestas y las he comparado con tu CV. Tu puntuación de precisión es del ${evaluation.accuracyScore}%. Haz clic abajo para ver tu evaluación detallada y recomendaciones personalizadas para mejorar tu CV.`,
        };

        return {
            success: true,
            evaluation,
            closingMessage: closingMessages[language] || closingMessages['en'],
        };
    } catch (error) {
        console.error('DeepSeek API Error:', error);
        return {
            success: false,
            error: 'Failed to evaluate interview',
        };
    }
}


