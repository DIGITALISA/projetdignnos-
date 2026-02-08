import OpenAI from 'openai';
import { getAIConfig } from './config';

async function getAI() {
    const config = await getAIConfig();
    const isOpenAI = config.activeProvider === 'openai';

    return {
        client: new OpenAI({
            apiKey: isOpenAI ? config.openai.apiKey : config.deepseek.apiKey,
            baseURL: isOpenAI ? undefined : config.deepseek.baseURL,
        }),
        model: isOpenAI ? 'gpt-4o' : 'deepseek-chat'
    };
}

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

        const { client, model } = await getAI();
        const response = await client.chat.completions.create({
            model: model,
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

export async function generateInterviewQuestion(cvAnalysis: unknown, conversationHistory: unknown[] = [], language: string = 'en') {
    try {
        // Language-specific instructions
        const languageInstructions: Record<string, string> = {
            'en': 'Respond in English. Be professional and conversational.',
            'fr': 'Répondez en français. Soyez professionnel et conversationnel.',
            'ar': 'أجب باللغة العربية. كن محترفًا وودودًا في الحوار.',
            'es': 'Responde en español. Sé profesional y conversacional.',
        };

        const languageInstruction = languageInstructions[language] || languageInstructions['en'];

        const { client, model } = await getAI();
        const response = await client.chat.completions.create({
            model: model,
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

export async function evaluateInterviewAnswer(question: string, answer: string, cvAnalysis: unknown) {
    try {
        const { client, model } = await getAI();
        const response = await client.chat.completions.create({
            model: model,
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

export async function startStructuredInterview(cvAnalysis: unknown, language: string = 'en') {
    try {
        const languageInstructions: Record<string, string> = {
            'en': 'Respond in English.',
            'fr': 'Répondez en français.',
            'ar': 'أجب باللغة العربية.',
            'es': 'Responde en español.',
        };

        const languageInstruction = languageInstructions[language] || languageInstructions['en'];

        const { client, model } = await getAI();
        const response = await client.chat.completions.create({
            model: model,
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
    cvAnalysis: unknown,
    conversationHistory: unknown[],
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

        const { client, model } = await getAI();
        const response = await client.chat.completions.create({
            model: model,
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

export async function evaluateInterview(cvAnalysis: unknown, conversationHistory: unknown[], language: string = 'en') {
    try {
        const languageInstructions: Record<string, string> = {
            'en': 'Respond in English. Provide all feedback in English.',
            'fr': 'Répondez en français. Fournissez tous les commentaires en français.',
            'ar': 'أجب باللغة العربية. قدم جميع الملاحظات باللغة العربية.',
            'es': 'Responde en español. Proporciona todos los comentarios en español.',
        };

        const languageInstruction = languageInstructions[language] || languageInstructions['en'];

        const { client, model } = await getAI();
        const response = await client.chat.completions.create({
            model: model,
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
  "verdict": "string (one-line summary)",
  "seniorityLevel": "string (Junior | Mid | Senior | Expert)",
  "suggestedRoles": ["string"],
  "expertCaseSummary": "string (A technical 300-word synthesis specifically for a human career coach. This must include: 1. Assessment of technical depth vs claims. 2. Behavioral red flags/green flags. 3. Immediate coaching priorities. 4. Strategic potential of this candidate.)"
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

        // Ensure expertCaseSummary is present
        if (!evaluation.expertCaseSummary) {
            evaluation.expertCaseSummary = evaluation.summary || evaluation.verdict;
        }
        if (!evaluation.executiveSummary) {
            evaluation.executiveSummary = evaluation.summary;
        }

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


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function chatWithExpert(messages: any[], language: string = 'en') {
    try {
        const languageInstructions: Record<string, string> = {
            'en': 'Respond in English.',
            'fr': 'Répondez en français.',
            'ar': 'أجب باللغة العربية.',
            'es': 'Responde en español.',
        };

        const languageInstruction = languageInstructions[language] || languageInstructions['en'];

        const { client, model } = await getAI();
        const response = await client.chat.completions.create({
            model: model,
            messages: [
                {
                    role: 'system',
                    content: `You are an AI Career Strategist and Expert. Your goal is to provide personalized career advice, help with career transitions, skill development, and salary negotiations.
                    
${languageInstruction}

**RULES:**
- Be professional, encouraging, and insightful.
- Provide actionable advice based on industry trends.
- If the user asks about specific roles, give details about market demand and required skills.
- Use a helpful and conversational tone.`
                },
                ...messages
            ],
            temperature: 0.7,
            max_tokens: 1000,
        });

        return {
            success: true,
            content: response.choices[0]?.message?.content || '',
        };
    } catch (error) {
        console.error('DeepSeek API Error:', error);
        return {
            success: false,
            error: 'Failed to get response from expert AI',
        };
    }
}

export async function generateRecommendationLetter(
    userProfile: unknown,
    completedCourses: unknown[],
    diagnosticResults: unknown,
    simulations: unknown[] = [],
    language: string = 'en'
) {
    try {
        const languageInstructions: Record<string, string> = {
            'en': 'Respond in English.',
            'fr': 'Répondez en français.',
            'ar': 'أجب باللغة العربية.',
        };

        const languageInstruction = languageInstructions[language] || languageInstructions['en'];

        const { client, model } = await getAI();
        const response = await client.chat.completions.create({
            model: model,
            messages: [
                {
                    role: 'system',
                    content: `You are a world-class Executive Search Consultant and Elite Career Strategist.
                    
**MISSION:**
Draft a "High-Stakes Strategic Recommendation Letter" for a candidate who has completed an advanced executive simulation program.

**TONE & STYLE:**
- **Elite & Authoritative:** Use the language of Fortune 500 Boards.
- **Evidence-Based:** Cite specific behaviors from the simulation (Decision making in crisis, operational precision).
- **Future-Ready:** Frame the candidate as a high-potential asset for C-Level or Senior Leadership roles.
- **NO FLUFF:** Every sentence must carry weight. Avoid generic praise like "hard worker". Use power phrases like "demonstrated high-order strategic thinking", "navigated complex volatility", "execution excellence".

**STRUCTURE:**
1. **The Executive Summary**: A powerful opening statement endorsing the candidate.
2. **The Simulation Evidence**: specifically mention their handling of the simulation missions (titles provided below).
3. **The Expert Verdict**: A final, definitive recommendation for recruitment.

${languageInstruction}

**OUTPUT FORMAT (JSON):**
{
  "subject": "string (A compelling, professional subject line, e.g., 'Confidential Executive Endorsement: [Name]')",
  "content": "string (The letter body. Use \\n\\n for paragraph breaks. Keep it between 300-400 words of pure value.)",
  "keyEndorsements": ["string (3-4 punchy, short bullet points for the sidebar, e.g., 'Crisis Management: Top 5%')", "string", "string"]
}`
                },
                {
                    role: 'user',
                    content: `User Profile: ${JSON.stringify(userProfile)}
TRAINING RECORD: ${JSON.stringify(completedCourses)}
DIAGNOSTIC BASELINE: ${JSON.stringify(diagnosticResults)}
SIMULATION & EXPERT REVIEW: ${JSON.stringify(simulations)}

Generate the Elite Executive Dossier in ${language}.`
                }
            ],
            temperature: 0.7,
            max_tokens: 2500,
        });

        const result = response.choices[0]?.message?.content;
        if (!result) throw new Error('No response from AI');

        const cleanedResult = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        return {
            success: true,
            recommendation: JSON.parse(cleanedResult),
        };
    } catch (error) {
        console.error('DeepSeek API Error:', error);
        return {
            success: false,
            error: 'Failed to generate recommendation letter',
        };
    }
}

export async function generateMentorGuidance(
    userProfile: unknown,
    diagnosticResults: unknown,
    language: string = 'en'
) {
    try {
        const languageInstructions: Record<string, string> = {
            'en': 'Respond in English.',
            'fr': 'Répondez en français.',
            'ar': 'أجب باللغة العربية.',
        };

        const languageInstruction = languageInstructions[language] || languageInstructions['en'];

        const { client, model } = await getAI();
        const response = await client.chat.completions.create({
            model: model,
            response_format: { type: 'json_object' },
            messages: [
                {
                    role: 'system',
                    content: `You are a world-class High-End Professional Mentor and Rector of an Elite AI Academy. Your mission is to transform diagnostic gaps into a MASSIVE, 5-Pillar Academic Architecture.

**THE ACADEMY MISSION:**
The participant has identified critical gaps. You will build exactly 2 "Academic Modules", each dedicated to a major theme from the diagnostic results.

**OUTPUT STRUCTURE (JSON):**
{
  "academyTitle": "string",
  "strategicFocus": ["string"],
  "modules": [
    {
      "id": number,
      "theme": "string",
      "title": "string",
      "content": "string (Concise & High-Precision: Strictly 200-300 words. Focus on technical frameworks.)",
      "practicalExercise": "string",
      "moduleQuiz": [
        {
          "question": "string",
          "options": ["string"],
          "correctAnswer": number,
          "explanation": "string"
        }
      ]
    }
  ],
  "globalCaseStudy": {
    "title": "string",
    "scenario": "string (High-stakes crisis)",
    "dilemma": "string",
    "expertSolution": "string"
  },
  "gamifiedSimulation": {
    "title": "string",
    "mission": "string",
    "challenges": [
      {
        "situation": "string",
        "choices": ["string"],
        "correctChoice": number,
        "consequence": "string"
      }
    ]
  },
  "actionPlan": [
    {
      "milestone": "string",
      "tasks": ["string (Limit to 2 tasks)"],
      "timeframe": "string"
    }
  ],
  "advice": ["string (Exactly 3 elite tips)"]
}

${languageInstruction}

**CRITICAL ACADEMIC DIRECTIVES:**
- **Technically Dense**: 200-300 words per content field maximum.
- **Strict Limit**: Return exactly 2 modules.
- **Interactive**: The Practical Exercise must be 1 sentence.
- **Short Simulation**: Limit to 3 challenges max.
- **No Truncation**: Keep answers concise to ensure valid JSON.`
                },
                {
                    role: 'user',
                    content: `User Profile: ${JSON.stringify(userProfile)}
Diagnostic Results: ${JSON.stringify(diagnosticResults)}

Generate the FULL ELITE ACADEMY in ${language}. Ensure each module is massive and technical.`
                }
            ],
            temperature: 0.7,
            max_tokens: 4096,
        });

        const result = response.choices[0]?.message?.content;
        if (!result) throw new Error('No response from AI');

        console.log('Raw Mentor AI Response:', result);

        try {
            const cleanedResult = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            return {
                success: true,
                guidance: JSON.parse(cleanedResult),
            };
        } catch (parseError: unknown) {
            console.error('JSON Parse Error in Mentor Guidance:', parseError);
            return {
                success: false,
                error: 'The AI generated an invalid content format. Please try again.'
            };
        }
    } catch (error) {
        console.error('DeepSeek API Error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to generate mentor guidance',
        };
    }
}

export async function generateAcademyStructure(
    userProfile: unknown,
    diagnosticResults: unknown,
    language: string = 'en'
) {
    try {
        const languageInstructions: Record<string, string> = {
            'en': 'Respond in English.',
            'fr': 'Répondez en français.',
            'ar': 'أجب باللغة العربية.',
        };

        const languageInstruction = languageInstructions[language] || languageInstructions['en'];

        const { client, model } = await getAI();
        const response = await client.chat.completions.create({
            model: model,
            response_format: { type: 'json_object' },
            messages: [
                {
                    role: 'system',
                    content: `You are an Academic Dean and Skill Gap Specialist. Your mission is to build a "Practical Knowledge Foundation" for a user based on their diagnostic gaps and EXPERIENCE LEVEL.

**ADAPTIVE PEDAGOGY LOGIC:**
- **For Beginners/Junior Profiles**: Focus on "Foundations", "Basics", and "Essential Frameworks".
- **For Experienced/Senior Profiles**: Focus on "Strategic Optimization", "Advanced Systems", and "Elite Leadership Methods".
- If the diagnostic showed an EXAGGERATION in a skill, the academy must "re-teach" it correctly at the proper level.

**OUTPUT STRUCTURE (JSON):**
{
  "themes": [
    {
      "id": number,
      "title": "string (Adaptive Title based on level, e.g., 'Foundations of Sales' vs 'Advanced Revenue Operations')",
      "description": "string (Directly tailored to the user's specific skill gap)",
      "sessions": [
        {
          "id": number,
          "title": "string (Instructional title)",
          "level": "Beginner | Intermediate | Advanced"
        }
      ]
    }
  ]
}

- Themes must feel like "Class Subjects" in a high-end university.
- Use the User Profile (Experience) and Diagnostic (Performance) to balance difficulty.
${languageInstruction}`
                },
                {
                    role: 'user',
                    content: `User Profile: ${JSON.stringify(userProfile)}
Diagnostic Results: ${JSON.stringify(diagnosticResults)}

Generate the Academy Structure in ${language}.`
                }
            ],
            temperature: 0.7,
        });

        const result = response.choices[0]?.message?.content;
        if (!result) throw new Error('No response');
        return { success: true, structure: JSON.parse(result) };
    } catch {
        return { success: false, error: 'Failed to generate academy structure' };
    }
}

export async function generateSessionSlides(
    topic: string,
    language: string = 'en'
) {
    try {
        const languageInstructions: Record<string, string> = {
            'en': 'Respond in English.',
            'fr': 'Répondez en français.',
            'ar': 'أجب باللغة العربية.',
        };

        const languageInstruction = languageInstructions[language] || languageInstructions['en'];

        const { client, model } = await getAI();
        const response = await client.chat.completions.create({
            model: model,
            response_format: { type: 'json_object' },
            messages: [
                {
                    role: 'system',
                    content: `You are a professional educational slide creator. Create a detailed "Slide-style" support for the given topic.

**OUTPUT STRUCTURE (JSON):**
{
  "title": "string",
  "slides": [
    {
      "slideNumber": number,
      "heading": "string",
      "bullets": ["string"],
      "expertInsight": "string",
      "visualKey": "string (A descriptive text for a visual representation)"
    }
  ],
  "summary": "string"
}

- Generate exactly 6 slides.
- Content must be high-yield and professional.
${languageInstruction}`
                },
                {
                    role: 'user',
                    content: `Topic: ${topic}
Language: ${language}`
                }
            ],
            temperature: 0.7,
        });

        const result = response.choices[0]?.message?.content;
        if (!result) throw new Error('No response');
        return { success: true, content: JSON.parse(result) };
    } catch {
        return { success: false, error: 'Failed to generate session content' };
    }
}

interface ComprehensiveData {
    userInfo: unknown;
    cvAnalysis: unknown;
    interviewEvaluation: unknown;
    conversationHistory: unknown;
    roleSuggestions: unknown;
    selectedRole: unknown;
    [key: string]: unknown;
}

/**
 * ✅ دالة جديدة: توليد تقرير تشخيصي شامل للخبراء/المدربين
 * يتم استدعاؤها بعد إكمال المشارك لجميع المراحل
 */
export async function generateExpertDiagnosticReport(
    comprehensiveData: ComprehensiveData,
    language: string = 'ar'
) {
    try {
        const languageInstructions: Record<string, string> = {
            'en': 'Respond in English. Provide all analysis in English.',
            'fr': 'Répondez en français. Fournissez toute l\'analyse en français.',
            'ar': 'أجب باللغة العربية. قدم جميع التحليلات باللغة العربية.',
            'es': 'Responde en español. Proporciona todo el análisis en español.',
        };

        const languageInstruction = languageInstructions[language] || languageInstructions['ar'];

        const { client, model } = await getAI();
        const response = await client.chat.completions.create({
            model: model,
            messages: [
                {
                    role: 'system',
                    content: `أنت خبير تطوير مهني ومدرب محترف متخصص في تحليل المواهب وتقييم القدرات.

**مهمتك:**
إنشاء تقرير تشخيصي شامل ومفصل للخبراء/المدربين بناءً على رحلة المشارك الكاملة في التقييم.

${languageInstruction}

**الهدف من التقرير:**
مساعدة الخبراء/المدربين على فهم:
1. **الوضع الحقيقي للمشارك** (قدراته الفعلية vs ما كتبه في السيرة الذاتية)
2. **نقاط القوة الحقيقية** التي يمكن البناء عليها
3. **الفجوات والضعف** التي تحتاج تدخل تدريبي
4. **الإمكانيات الكامنة** التي لم يكتشفها المشارك بعد
5. **استراتيجية التعامل المثلى** مع هذا المشارك

**بيانات المشارك المتاحة:**
- تحليل السيرة الذاتية الأولي
- نتائج المقابلة التفصيلية (15 سؤال)
- الأدوار المقترحة والدور المختار
- المستندات المولدة

**هيكل التقرير (JSON):**
{
  "executiveSummary": "string (ملخص تنفيذي من 4-5 جمل يعطي صورة سريعة عن المشارك)",
  
  "participantProfile": {
    "realLevel": "Junior | Mid-Level | Senior | Expert",
    "cvAccuracyAssessment": "string (تقييم دقة السيرة الذاتية: هل هي واقعية أم مبالغ فيها؟)",
    "honesty Score": number (0-100),
    "communicationQuality": "Excellent | Good | Average | Poor",
    "selfAwareness": "High | Medium | Low"
  },

  "coreStrengths": {
    "technical": ["string (مهارات تقنية مؤكدة من المقابلة)"],
    "behavioral": ["string (سلوكيات إيجابية ظهرت في الإجابات)"],
    "hidden": ["string (نقاط قوة لم يبرزها المشارك في سيرته الذاتية)"]
  },

  "criticalGaps": {
    "technical": ["string (فجوات تقنية تحتاج تدريب)"],
    "behavioral": ["string (سلوكيات سلبية أو علامات حمراء)"],
    "strategic": ["string (نقص في التفكير الاستراتيجي أو الرؤية)"]
  },

  "cvVsReality": {
    "exaggerations": ["string (ما تم المبالغة فيه في السيرة)"],
    "understatements": ["string (ما لم يبرزه رغم امتلاكه)"],
    "mismatches": ["string (تناقضات بين السيرة والمقابلة)"]
  },

  "interviewInsights": {
    "bestAnswers": ["string (أفضل 3 إجابات أظهرت قدرات حقيقية)"],
    "weakestAnswers": ["string (أضعف 3 إجابات كشفت فجوات)"],
    "redFlags": ["string (علامات تحذيرية ظهرت في المقابلة)"],
    "greenFlags": ["string (علامات إيجابية قوية)"]
  },

  "coachingStrategy": {
    "immediatePriorities": ["string (أولويات فورية للتدريب - الأهم أولاً)"],
    "mediumTermGoals": ["string (أهداف متوسطة المدى)"],
    "longTermPotential": "string (الإمكانيات طويلة المدى لهذا المشارك)",
    "recommendedApproach": "string (كيف يجب أن يتعامل المدرب مع هذا المشارك؟)",
    "motivationTriggers": ["string (ما الذي يحفز هذا المشارك؟)"]
  },

  "careerGuidance": {
    "bestFitRoles": ["string (الأدوار الأنسب بناءً على التقييم الشامل)"],
    "rolesTo Avoid": ["string (أدوار يجب تجنبها حالياً)"],
    "skillDevelopmentPath": ["string (مسار تطوير المهارات المقترح)"],
    "timelineToReadiness": "string (كم من الوقت يحتاج ليكون جاهزاً للدور المستهدف؟)"
  },

  "expertRecommendations": {
    "trainingModules": ["string (وحدات تدريبية محددة مطلوبة)"],
    "mentorshipAreas": ["string (مجالات تحتاج إرشاد مباشر)"],
    "practicalExercises": ["string (تمارين عملية مقترحة)"],
    "followUpActions": ["string (إجراءات متابعة للخبير)"]
  },

  "riskAssessment": {
    "employabilityRisk": "Low | Medium | High",
    "performanceRisk": "Low | Medium | High",
    "culturalFitConcerns": ["string (مخاوف من التوافق الثقافي/المؤسسي)"],
    "mitigationStrategies": ["string (استراتيجيات تخفيف المخاطر)"]
  },

  "strategicTransformationSteps": [
    {
      "phase": "string (المرحلة: فورية، قصيرة، متوسطة، طويلة)",
      "focus": "string (التركيز الرئيسي)",
      "actions": ["string (إجراءات محددة)"],
      "expectedOutcome": "string (النتيجة المتوقعة)",
      "timeframe": "string (الإطار الزمني)"
    }
  ],

  "finalVerdict": "string (حكم نهائي شامل من 200-300 كلمة للخبير - يجب أن يكون صريحاً ومباشراً وقابلاً للتنفيذ)"
}

**قواعد مهمة:**
- كن صريحاً ومباشراً - هذا التقرير للخبراء وليس للمشارك
- ركز على الأدلة من المقابلة والبيانات الفعلية
- قدم توصيات قابلة للتنفيذ وليست عامة
- حدد الأولويات بوضوح
- استخدم لغة مهنية ودقيقة`
                },
                {
                    role: 'user',
                    content: `بيانات المشارك الكاملة:

معلومات المستخدم:
${JSON.stringify(comprehensiveData.userInfo, null, 2)}

تحليل السيرة الذاتية:
${JSON.stringify(comprehensiveData.cvAnalysis, null, 2)}

نتائج المقابلة:
${JSON.stringify(comprehensiveData.interviewEvaluation, null, 2)}

سجل المحادثة الكامل:
${JSON.stringify(comprehensiveData.conversationHistory, null, 2)}

الأدوار المقترحة:
${JSON.stringify(comprehensiveData.roleSuggestions, null, 2)}

الدور المختار:
${JSON.stringify(comprehensiveData.selectedRole, null, 2)}

قم بتوليد تقرير تشخيصي شامل للخبراء باللغة ${language}.
التقرير يجب أن يكون عميقاً ومفصلاً ويساعد الخبير على فهم كيفية التعامل مع هذا المشارك بشكل فعال.`
                }
            ],
            temperature: 0.4, // توازن بين الدقة والإبداع
            max_tokens: 4000,
        });

        const result = response.choices[0]?.message?.content;
        if (!result) throw new Error('No response from AI');

        const cleanedResult = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const report = JSON.parse(cleanedResult);

        console.log('✅ Expert diagnostic report generated successfully');

        return {
            success: true,
            report,
        };
    } catch (error) {
        console.error('❌ DeepSeek API Error in generateExpertDiagnosticReport:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to generate expert diagnostic report',
        };
    }
}

export async function generatePerformanceProfile(
    userProfile: unknown,
    completedCourses: unknown[],
    diagnosticResults: unknown,
    simulations: unknown[] = [],
    language: string = 'en'
) {
    try {
        const languageInstructions: Record<string, string> = {
            'en': 'Respond in English.',
            'fr': 'Répondez en français.',
            'ar': 'أجب باللغة العربية.',
        };

        const languageInstruction = languageInstructions[language] || languageInstructions['en'];

        const { client, model } = await getAI();
        const response = await client.chat.completions.create({
            model: model,
            response_format: { type: 'json_object' },
            messages: [
                {
                    role: 'system',
                    content: `You are an Elite Executive Talent Analyst. Your mission is to analyze all data points of a participant to create a "Unified Executive Performance Profile".
                    
**INPUT DATA:**
1. Diagnostic baseline (Initial Audit).
2. Training History (Commitment to learning).
3. Simulation Performance (Real-world crisis execution).

**OUTPUT STRUCTURE (JSON):**
{
  "summary": "string (Executive summary of overall performance)",
  "competencies": [
    { "label": "Strategic Thinking", "score": number (0-100), "status": "string (Validated/Premium/Elite)" },
    { "label": "Operational Precision", "score": number (0-100), "status": "string (Validated/Premium/Elite)" },
    { "label": "Governance & Compliance", "score": number (0-100), "status": "string (Validated/Premium/Elite)" }
  ],
  "verdict": "string (ALPHA-1, BRAVO-2, etc. - elite classification)",
  "issueDate": "string (ISO Date)"
}

${languageInstruction}`
                },
                {
                    role: 'user',
                    content: `User Data to Analyze:
Profile: ${JSON.stringify(userProfile)}
Diagnostic: ${JSON.stringify(diagnosticResults)}
Courses: ${JSON.stringify(completedCourses)}
Simulations: ${JSON.stringify(simulations)}

Generate the Unified Executive Performance Profile in ${language}.`
                }
            ],
            temperature: 0.3,
        });

        const result = response.choices[0]?.message?.content;
        if (!result) throw new Error('No response');
        return { success: true, profile: JSON.parse(result) };
    } catch (error) {
        console.error('Performance Profile AI Error:', error);
        return { success: false, error: 'Failed to generate performance profile' };
    }
}
