import OpenAI from 'openai';
import { getAIConfig } from './config';
import { AI_PROMPTS } from './ai-prompts';

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
  "expertAdvice": {
    "suggestedWorkshops": ["string"],
    "suggestedTrainings": ["string"],
    "strategicBrief": "string (Internal high-level summary for career experts)",
    "evolutionNote": "string (Specific goal for the candidate's next development phase)"
  },
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
        console.log(`[AI] Starting structured interview with ${model}...`);
        const startTime = Date.now();
        const response = await client.chat.completions.create({
            model: model,
            messages: [
                {
                    role: 'system',
                    content: `You are an AI Executive Strategic Expert from MA-TRAINING-CONSULTING conducting a professional CV verification interview.

${languageInstruction}

**YOUR IDENTITY:**
You must identify yourself as an "AI Strategic Advisor" or "Executive Expert" from MA-TRAINING-CONSULTING. Do NOT use generic names or other company names.

**YOUR ROLE:**
You will conduct a structured interview with 15 targeted questions to:
1. Verify the accuracy of information in the candidate's CV
2. Assess their real capabilities vs what's written
3. Identify exaggerations or gaps between CV and reality
4. Understand their true skill level and experience

**INTERVIEW STRUCTURE:**
- Start with a professional welcome message where you introduce yourself as an expert from MA-TRAINING-CONSULTING.
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
1. A professional welcome message (2-3 sentences) where you introduce yourself as an AI Strategic Expert from MA-TRAINING-CONSULTING and explain the interview purpose.
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
        console.log(`[AI] Start interview response received in ${Date.now() - startTime}ms`);
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
    const startTime = Date.now();
    console.log('[AI] generateNextInterviewQuestion called', {
        language,
        questionNumber,
        totalQuestions,
        historyLength: Array.isArray(conversationHistory) ? conversationHistory.length : 0
    });

    try {
        const languageInstructions: Record<string, string> = {
            'en': 'Respond in English.',
            'fr': 'Répondez en français.',
            'ar': 'أجب باللغة العربية.',
            'es': 'Responde en español.',
        };

        const languageInstruction = languageInstructions[language] || languageInstructions['en'];

        const { client, model } = await getAI();
        console.log(`[AI] Using model: ${model}`);

        const messages = [
            {
                role: 'system' as const,
                content: `You are an AI Strategic Expert from MA-TRAINING-CONSULTING conducting a CV verification interview.

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
                role: 'user' as const,
                content: `CV Analysis: ${JSON.stringify(cvAnalysis)}

Conversation so far: ${JSON.stringify(conversationHistory)}

Generate the next interview question (Question ${questionNumber}/${totalQuestions}).
Respond with just the question text, no JSON.`
            }
        ];

        console.log('[AI] Sending request to AI API...');
        const response = await client.chat.completions.create({
            model: model,
            messages: messages,
            temperature: 0.8,
            max_tokens: 300,
        });

        const duration = Date.now() - startTime;
        const question = response.choices[0]?.message?.content || '';
        
        console.log(`[AI] Response received in ${duration}ms`, {
            hasContent: !!question,
            contentLength: question.length,
            firstChars: question.substring(0, 50)
        });

        if (!question || question.trim().length === 0) {
            console.error('[AI] Empty response from AI model');
            return {
                success: false,
                error: 'AI returned empty response',
            };
        }

        return {
            success: true,
            question: question,
        };
    } catch (error) {
        const duration = Date.now() - startTime;
        console.error(`[AI] Error after ${duration}ms:`, error);
        console.error('[AI] Error details:', {
            name: error instanceof Error ? error.name : 'Unknown',
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : 'No stack'
        });
        
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to generate question',
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
                    content: `You are a Senior Strategic Expert from MA-TRAINING-CONSULTING providing a final CV verification and interview evaluation.

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
  "expertCaseSummary": "string (A technical 300-word synthesis specifically for a human career coach. This must include: 1. Assessment of technical depth vs claims. 2. Behavioral red flags/green flags. 3. Immediate coaching priorities. 4. Strategic potential of this candidate.)",
  "expertAdvice": {
    "suggestedWorkshops": ["string (2-3 very specific advanced titles)"],
    "suggestedTrainings": ["string (2-3 curriculum themes)"],
    "strategicBrief": "string (Strategic alignment score and reasoning)"
  }
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
export async function chatWithExpert(messages: any[], language: string = 'en', expertType: 'hr' | 'learning' | 'advice' | 'strategic' = 'strategic') {
    try {
        const languageInstructions: Record<string, string> = {
            'en': 'Respond in English.',
            'fr': 'Répondez en français.',
            'ar': 'أجب باللغة العربية.',
            'es': 'Responde en español.',
        };

        const languageInstruction = languageInstructions[language] || languageInstructions['en'];

        const expertPrompts = {
            hr: `You are an Elite HR & Recruitment Specialist. 
            **YOUR DOMAIN:** Job search strategies, Interview preparation, Career promotions, HR policies, Salary negotiation, and Recruitment processes.
            **STRICT CONSTRAINT:** If the user asks about anything OUTSIDE this domain (like coding, technical troubleshooting, general life advice, etc.), you MUST REFUSE by saying (in the correct language): "This is not my area of expertise. I can only assist you with Recruitment, HR, and Career Progression topics."
            ${languageInstruction}`,

            learning: `You are an Elite Learning & Development Consultant. 
            **YOUR DOMAIN:** Educational advice, Skill acquisition strategies, Certification recommendations, Learning pathways, and Academic growth.
            **STRICT CONSTRAINT:** If the user asks about anything OUTSIDE this domain, you MUST REFUSE by saying (in the correct language): "This is not my area of expertise. I can only assist you with Learning, Education, and Skill Development topics."
            ${languageInstruction}`,

            advice: `You are a Senior Professional Mentor & Advisor. 
            **YOUR DOMAIN:** Professional conduct, Soft skills, Workplace dynamics, Conflict resolution, and General professional mentoring.
            **STRICT CONSTRAINT:** If the user asks about anything OUTSIDE this domain, you MUST REFUSE by saying (in the correct language): "This is not my area of expertise. I can only assist you with Professional Mentoring and Workplace Advice."
            ${languageInstruction}`,

            strategic: `You are a Chief Career Strategy Officer. 
            **YOUR DOMAIN:** Long-term career roadmaps, Strategic career pivoting, High-level industry positioning, and Executive career planning.
            **STRICT CONSTRAINT:** If the user asks about anything OUTSIDE this domain, you MUST REFUSE by saying (in the correct language): "This is not my area of expertise. I can only assist you with Strategic Career Planning and Roadmap development."
            ${languageInstruction}`
        };

        const systemPrompt = expertPrompts[expertType] || expertPrompts.strategic;

        const { client, model } = await getAI();
        const response = await client.chat.completions.create({
            model: model,
            messages: [
                {
                    role: 'system',
                    content: systemPrompt
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
    language: string = 'en',
    expertNotes?: string
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

**THE HUMAN FACTOR:**
You have the "Confidential Expert Notes" from the human coach who supervised the participant. These notes are the most important part of the evaluation. Integrate them naturally into the letter to prove a human expert has verified these results.

**TONE & STYLE:**
- **Elite & Authoritative:** Use the language of Fortune 500 Boards.
- **Evidence-Based:** Cite specific behaviors from the simulation (Decision making in crisis, operational precision).
- **Future-Ready:** Frame the candidate as a high-potential asset for C-Level or Senior Leadership roles.
- **NO FLUFF:** Every sentence must carry weight. Avoid generic praise like "hard worker". Use power phrases like "demonstrated high-order strategic thinking", "navigated complex volatility", "execution excellence".

**STRUCTURE:**
1. **The Executive Summary**: A powerful opening statement endorsing the candidate.
2. **The Simulation Evidence**: specifically mention their handling of the simulation missions (titles provided below).
3. **The Expert Verdict**: A final, definitive recommendation for recruitment based on our internal review.

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
SIMULATION DATA: ${JSON.stringify(simulations)}
CONFIDENTIAL EXPERT NOTES: ${expertNotes || "No specific notes provided by the expert."}

Generate the High-Stakes Recommendation Letter in ${language}.`
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
- **No Truncation**: Keep answers concise to ensure valid JSON.
- **NOVELTY DIRECTIVE**: Every regeneration MUST provide unique module titles, different practical scenarios, and fresh expert advice. Never repeat the same examples.`
                },
                {
                    role: 'user',
                    content: `User Profile: ${JSON.stringify(userProfile)}
Diagnostic Results: ${JSON.stringify(diagnosticResults)}

Generate the FULL ELITE ACADEMY in ${language}. Ensure each module is massive and technical.`
                }
            ],
            temperature: 0.8,
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
- **DIVERSITY REQUIREMENT**: If this is a repeat request, ensure the themes and session titles are different from previous interpretations to provide continuous learning value.
${languageInstruction}`
                },
                {
                    role: 'user',
                    content: `User Profile: ${JSON.stringify(userProfile)}
Diagnostic Results: ${JSON.stringify(diagnosticResults)}

Generate the Academy Structure in ${language}.`
                }
            ],
            temperature: 0.8,
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
- **VARIANT DIRECTIVE**: If this topic is revisited, ensure the specific points, expert insights, and technical frameworks provided are different from standard responses to ensure ongoing learning value.
${languageInstruction}`
                },
                {
                    role: 'user',
                    content: `Topic: ${topic}
Language: ${language}`
                }
            ],
            temperature: 0.8,
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
    language: string = 'en',
    expertNotes?: string
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
4. HUMAN EXPERT VALIDATION (Confidential notes from a senior coach).

**CRITICAL INSTRUCTION:**
If HUMAN EXPERT VALIDATION is provided, it takes precedent over AI diagnostic data. Use the expert's verdict to calibrate the scores and the final executive summary.

**OUTPUT STRUCTURE (JSON):**
{
  "summary": "string (Executive summary of overall performance, synthesizing AI data and human expert verdict)",
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
HUMAN EXPERT VERDICT: ${expertNotes || "No manual expert notes provided yet."}

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

export async function generateCareerRoadmap(
    userProfile: unknown,
    diagnosticResults: unknown,
    language: string = 'en',
    expertNotes?: string
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
                    content: `You are a World-Class Career Architect and Strategic Growth Consultant. Your mission is to transform a participant's diagnostic results and profile into a precise, step-by-step "Strategic Execution Roadmap".

**THE HUMAN FACTOR (PRIORITY):**
Confidential Expert Notes: ${expertNotes || "No manual expert notes provided. Use standard diagnostic results."}

**MISSION:**
Build a sequential journey of exactly 5 milestones. If EXPERT NOTES are present, they are your primary source of truth for the participant's real potential and recommended direction. Use them to override or refine AI diagnostic patterns.

**OUTPUT STRUCTURE (JSON):**
{
  "roadmapTitle": "string (e.g., 'Executive Leadership Transformation')",
  "milestones": [
    {
      "id": number (1 to 5),
      "label": "string (The phase name, e.g., 'Phase 1: Foundation')",
      "title": "string (Specific goal)",
      "description": "string (Concise action-oriented advice integrating diagnostic data and expert feedback)",
      "tasks": ["string (High-precision action item)", "string"],
      "expectedOutcome": "string",
      "icon": "string (Choose one: 'Target', 'Zap', 'BrainCircuit', 'Trophy', 'Award', 'Rocket', 'ShieldCheck', 'TrendingUp')"
    }
  ],
  "personalizedWorkshop": {
    "title": "string (Highly specific workshop title)",
    "description": "string (Explanation explaining why this specific workshop is needed based on diagnosis and expert feedback)",
    "durationHours": number,
    "focusAreas": ["string", "string"]
  }
}

**PEDAGOGICAL DIRECTIVES:**
- **Analytical Precision**: The roadmap MUST bridge the gaps identified in the diagnosis.
- **Sequential Growth**: Milestones MUST be logical (e.g., Foundation -> Strategy -> Execution -> Optimization -> Mastery).
- **High Impact**: Tasks must feel elite, high-stakes, and professional.
- **Language**: ${languageInstruction}`
                },
                {
                    role: 'user',
                    content: `User Profile: ${JSON.stringify(userProfile)}
Diagnostic Results: ${JSON.stringify(diagnosticResults)}
EXPERT VALIDATION: ${expertNotes || "Pending expert review."}

Generate the FULL STRATEGIC ROADMAP in ${language}.`
                }
            ],
            temperature: 0.8,
        });

        const result = response.choices[0]?.message?.content;
        if (!result) throw new Error('No response from AI');

        const cleanedResult = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        return {
            success: true,
            roadmap: JSON.parse(cleanedResult),
        };
    } catch (error) {
        console.error('Roadmap AI Error:', error);
        return { success: false, error: 'Failed to generate career roadmap' };
    }
}

/**
 * Generates a Strategic Career Intelligence (SCI) Report
 * Synthesizes diagnosis, simulations, and expert notes into a professional advisory document.
 */
export async function generateSCIReport(
    userName: string,
    diagnosisData: Record<string, unknown>,
    simulations: unknown[],
    expertNotes: string,
    language: string = 'en'
) {
    const { client, model } = await getAI();
    const prompt = `
You are a World-Class Executive Career Strategist. Generate a "Strategic Career Intelligence Report" for ${userName}.
This report is an internal-grade executive advisory document.

**INPUT DATA:**
1. CV Diagnosis Results: ${JSON.stringify(diagnosisData)}
2. Simulation Performance: ${JSON.stringify(simulations)}
3. Confidential Expert Notes: ${expertNotes}

**OUTPUT STRUCTURE (JSON ONLY):**
{
  "header": {
    "title": "Strategic Career Intelligence Report",
    "subtitle": "Career Diagnosis • Simulation Insights • Strategic Roadmap",
    "referenceId": "SCI-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}"
  },
  "executiveSummary": {
    "objective": "string",
    "currentPositioning": "string",
    "riskLevel": "Low | Medium | High",
    "priorityFocus": "string",
    "strategicRecommendation": "string"
  },
  "careerDiagnosis": {
    "industry": "string",
    "experienceLevel": "string",
    "roleScope": "string",
    "competencies": [
      { "dimension": "Leadership Readiness", "score": "number%", "interpretation": "string" },
      { "dimension": "Strategic Thinking", "score": "number%", "interpretation": "string" },
      { "dimension": "Market Positioning", "score": "number%", "interpretation": "string" }
    ],
    "riskIndicators": {
      "stagnation": "Low | Moderate | High",
      "obsolescence": "Low | Moderate | High",
      "misalignment": "Low | Moderate | High"
    }
  },
  "simulationInsights": {
    "decisionProfile": {
      "speed": "string",
      "riskManagement": "string",
      "stakeholderAwareness": "string"
    },
    "behavioralObservations": {
      "strengths": ["string"],
      "blindSpots": ["string"]
    }
  },
  "humanInsights": {
    "included": true,
    "style": "string",
    "engagement": "string",
    "developmentAreas": ["string"]
  },
  "positioningAnalysis": {
    "internalGrowth": "string",
    "externalMobility": "string",
    "scenarios": [
      { "label": "Scenario A", "description": "string" },
      { "label": "Scenario B", "description": "string" },
      { "label": "Scenario C", "description": "string" }
    ]
  },
  "roadmap": {
    "shortTerm": { "objective": "string", "actions": ["string"], "kpis": ["string"] },
    "midTerm": { "objective": "string", "actions": ["string"], "kpis": ["string"] },
    "longTerm": { "objective": "string", "actions": ["string"], "kpis": ["string"] }
  },
  "advisoryNotes": "string",
  "disclaimer": "This document is a strategic advisory career assessment report. It does not constitute a certification..."
}

Language: Return ALL text content in ${language}.
`;

    try {
        const response = await client.chat.completions.create({
            model: model,
            messages: [
                { role: 'system', content: 'You are an elite career strategist. Output raw JSON only.' },
                { role: 'user', content: prompt }
            ],
            response_format: { type: 'json_object' }
        });

        const content = response.choices[0].message.content;
        if (!content) throw new Error("Empty AI response");
        return JSON.parse(content);
    } catch (error) {
        console.error("SCI Report Generation Error:", error);
        throw error;
    }
}

interface UserProfile {
    fullName: string;
    userId: string;
}

/**
 * Generates 5 high-stakes strategic questions based on a Job Description
 */
export async function generateJobAlignmentQuestions(
    userProfile: UserProfile,
    diagnosis: Record<string, unknown>,
    jobDescription: string,
    type: string,
    language: string = 'en'
) {
    try {
        const { client, model } = await getAI();
        const prompt = `
You are a Lead Executive Recruiter. A candidate (Profile: ${JSON.stringify(userProfile)}) is applying for a ${type} (Job Description: ${jobDescription}).
Base your analysis on their previous diagnosis: ${JSON.stringify(diagnosis)}.

**MISSION:**
Analyze the complexity of the provided Job Description and determine the necessary number of validation points.
Generate at least 10 (or more if the role is highly complex) advanced, situational Multiple Choice Questions (MCQs) that verify if this candidate has the EXACT competencies required for THIS specific job. 
The questions must be "Operational Scenarios" where the candidate has to make a strategic decision relevant to the job description.
Do not exceed 15 questions to maintain candidate engagement.

**OUTPUT FORMAT (JSON ONLY):**
{
  "questions": [
    {
      "question": "string (The situational scenario)",
      "options": ["string", "string", "string", "string"],
      "correctAnswer": 0 (index of the best strategic move),
      "explanation": "string (Why this choice is the most executive-aligned)"
    }
  ]
}

**LANGUAGE:** ${language === 'fr' ? 'French' : language === 'ar' ? 'Arabic' : 'English'}
`;

        const response = await client.chat.completions.create({
            model: model,
            messages: [
                { role: 'system', content: 'You are an elite recruitment AI. Output raw JSON only.' },
                { role: 'user', content: prompt }
            ],
            response_format: { type: 'json_object' }
        });

        const content = response.choices[0].message.content;
        if (!content) throw new Error("Empty AI response");
        return JSON.parse(content);
    } catch (error) {
        console.error("Job Alignment Questions Generation Error:", error);
        throw error;
    }
}

/**
 * Evaluates the answers and generates a final Strategic Alignment Report/Certificate
 */
export async function evaluateJobAlignment(
    jobDescription: string,
    questions: Record<string, unknown>[],
    answers: number[],
    userProfile: UserProfile,
    language: string = 'en',
    expertNotes?: string
) {
    try {
        const { client, model } = await getAI();
        const prompt = `
A candidate completed a Strategic Alignment Audit for this Job Description: ${jobDescription}.
Questions & Answers: ${JSON.stringify(questions.map((q, i) => ({ q: q.question, selectedIndex: answers[i], correctIndex: q.correctAnswer })))}

**THE HUMAN FACTOR:**
Confidential Expert Notes: ${expertNotes || "No manual expert intervention for this specific audit yet. Use standard AI diagnostic logic."}

**CRITICAL INSTRUCTION:**
If Expert Notes are provided, use them to weight the evaluation. The expert's view on the candidate's character and strategic depth should influence the final verdict on alignment with this specific role.

**MISSION:**
Draft a "Strategic Job Alignment Audit Certificate". This is a formal advisory document.

**OUTPUT FORMAT (JSON ONLY):**
{
  "verdict": "string (A powerful 1-sentence executive verdict)",
  "analysis": "string (3-4 paragraphs of deep strategic analysis for this role, integrating technical answers and expert feedback)",
  "strengths": ["string", "string", "string"],
  "gaps": ["string", "string", "string"],
  "roadmap": ["string", "string", "string (Specific implementation tasks to succeed in the first 90 days)"],
  "score": number (0-100 calculated based on correct answers, depth, and expert validation)"
}

**LANGUAGE:** ${language === 'fr' ? 'French' : language === 'ar' ? 'Arabic' : 'English'}
`;

        const response = await client.chat.completions.create({
            model: model,
            messages: [
                { role: 'system', content: 'You are an elite career consultant. Output raw JSON only. Be professional and authoritative.' },
                { role: 'user', content: prompt }
            ],
            response_format: { type: 'json_object' }
        });

        const content = response.choices[0].message.content;
        if (!content) throw new Error("Empty AI response");
        return JSON.parse(content);
    } catch (error) {
        console.error("Job Alignment Evaluation Error:", error);
        throw error;
    }
}

export async function generateCorporateStrategicReport(
    inquiryData: unknown,
    candidateData: {
        diagnosis: unknown;
        interview: unknown;
        simulations: unknown[];
        expertNotes?: string;
    },
    language: string = 'en'
) {
    try {
        const promptConfig = AI_PROMPTS.STRATEGIC_CORPORATE_REPORT;
        const languageInstruction = promptConfig.languageInstructions[language as keyof typeof promptConfig.languageInstructions] || promptConfig.languageInstructions.en;

        const { client, model } = await getAI();
        const response = await client.chat.completions.create({
            model: model,
            messages: [
                {
                    role: 'system',
                    content: `${promptConfig.system}\n\n${languageInstruction}`
                },
                {
                    role: 'user',
                    content: `JOB INQUIRY: ${JSON.stringify(inquiryData)}
CANDIDATE ANALYSIS: ${JSON.stringify(candidateData.diagnosis)}
INTERVIEW RESULTS: ${JSON.stringify(candidateData.interview)}
SIMULATION PERF: ${JSON.stringify(candidateData.simulations)}
EXPERT FEEDBACK: ${candidateData.expertNotes || 'No specific expert notes provided.'}

Generate the Corporate Strategic Report in ${language}.`
                }
            ],
            temperature: 0.3,
            max_tokens: 2500,
        });

        const result = response.choices[0]?.message?.content;
        if (!result) throw new Error('No response from AI');

        const cleanedResult = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        return {
            success: true,
            report: JSON.parse(cleanedResult),
        };
    } catch (error) {
        console.error('AI Corporate Report Error:', error);
        return {
            success: false,
            error: 'Failed to generate corporate report',
        };
    }
}
