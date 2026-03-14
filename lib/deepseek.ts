import OpenAI from 'openai';
import { getAIConfig } from './config';
import { AI_PROMPTS, MA_TRAINING_PROMOTION } from './ai-prompts';

export interface InterviewMessage {
    role: "assistant" | "user";
    content: string;
}

export interface AuditResult {
  authorityScore: number;
  profileLevel: string;
  alignment: string;
  gaps: string[];
  strengths: string[];
  visionAnalysis: string;
  nextEvolutionSteps: string[];
  verdict: string;
}

export interface SWOT {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface Position {
  title: string;
  years: string;
}

export interface ProfessionalData {
  sectors: string;
  positions: Position[];
  vision: string;
  experienceMode: string;
  cv?: File | null;
  careerStory: string;
  cvText?: string;
}

export interface InterviewMessage {
  role: 'assistant' | 'user';
  content: string;
}

export interface MCQQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface UltimateReportResult {
  profileSummary: string;
  maturityLevel: string;
  swot: SWOT;
  deepInsights: string[];
  marketValue: string;
  finalVerdict: string;
  recommendedRoles: string[];
  gapAnalysis: {
    currentJobVsReality: string;
    hardSkillsMatch: number;
    softSkillsMatch: number;
    criticalCompetencyGaps: string[];
  };
}

async function getAI() {
    const config = await getAIConfig();
    const isOpenAI = config.activeProvider === 'openai';
    
    return {
        client: new OpenAI({
            apiKey: isOpenAI ? config.openai.apiKey : config.deepseek.apiKey,
            baseURL: isOpenAI ? undefined : config.deepseek.baseURL,
            dangerouslyAllowBrowser: true
        }),
        model: isOpenAI ? 'gpt-4o' : 'deepseek-chat'
    };
}

/**
 * Robustly extracts and parses JSON from AI responses that might contain markdown or filler text.
 * Now includes heuristic repair for truncated JSON frequently seen in large MCQ batches.
 */
function safeParseJSON(text: string) {
    if (!text) return null;
    
    // First try standard cleaning (remove blocks)
    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    try {
        return JSON.parse(cleaned);
    } catch (e) {
        // If that fails, try extraction between first { and last }
        const firstBrace = cleaned.indexOf('{');
        const lastBrace = cleaned.lastIndexOf('}');
        
        if (firstBrace !== -1) {
            let jsonPart = "";
            
            // Heuristic Repair for truncated JSON
            if (lastBrace === -1 || lastBrace < firstBrace) {
                jsonPart = cleaned.substring(firstBrace);
                
                if (jsonPart.includes('"questions": [')) {
                    const questionsStart = jsonPart.indexOf('"questions": [') + 14;
                    const questionsPart = jsonPart.substring(questionsStart);
                    
                    // Look for the last completely formed object inside the array
                    const lastCommaBrace = questionsPart.lastIndexOf('},');
                    if (lastCommaBrace !== -1) {
                        jsonPart = jsonPart.substring(0, questionsStart + lastCommaBrace + 1) + ']}';
                    } else {
                        const lastClosing = questionsPart.lastIndexOf('}');
                        if (lastClosing !== -1) {
                            jsonPart = jsonPart.substring(0, questionsStart + lastClosing + 1) + ']}';
                        }
                    }
                }
            } else {
                jsonPart = cleaned.substring(firstBrace, lastBrace + 1);
            }

            try {
                return JSON.parse(jsonPart);
            } catch (innerError) {
                // Final attempt: find last possible closing brace and close outer structure
                const backupBrace = jsonPart.lastIndexOf('}');
                if (backupBrace !== -1) {
                    try {
                        let finalTry = jsonPart.substring(0, backupBrace + 1);
                        if (!finalTry.trim().endsWith('}')) finalTry += '}';
                        
                        // If it belongs to questions but isn't closed
                        if (finalTry.includes('"questions"') && !finalTry.trim().endsWith(']}')) {
                            // Try closing the array and the object
                            try { return JSON.parse(finalTry + ']}'); } catch { /* ignore repair failure */ }
                            try { return JSON.parse(finalTry.substring(0, finalTry.lastIndexOf('}')) + ']}'); } catch { /* ignore repair failure */ }
                        }
                        return JSON.parse(finalTry);
                    } catch { /* ignore repair failure */ }
                }
                
                console.error("Failed to parse extracted JSON part:", innerError);
                throw innerError;
            }
        }
        throw e;
    }
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

${MA_TRAINING_PROMOTION}

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

        // Use robust JSON parsing
        let parsedAnalysis;
        try {
            parsedAnalysis = safeParseJSON(analysis);
        } catch (parseError) {
            console.error('JSON Parse Error (CV Analysis):', parseError);
            console.error('Raw response:', analysis);
            throw new Error('Failed to parse AI response as JSON. The engine may have returned malformed data.');
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

export async function performProfessionalAudit(data: { sectors: string, positions: { title: string, years: string }[], vision: string, cvText?: string, careerStory?: string }, language: string = 'en') {
    try {
        const languageInstructions: Record<string, string> = {
            'en': 'Respond in English.',
            'fr': 'Répondez en français.',
            'ar': 'أجب باللغة العربية.',
        };

        const languageInstruction = languageInstructions[language] || languageInstructions['en'];

        const { client, model } = await getAI();
        console.log(`ðŸ¤– AI Audit Started - Model: ${model}, Language: ${language}`);
        const startTime = Date.now();
        
        const response = await client.chat.completions.create({
            model: model,
            messages: [
                {
                    role: 'system',
                    content: `You are a world-class Executive HR Strategist and Master Career Coach with 25+ years of experience in high-level executive search and organizational design.
                    
**YOUR ROLE:**
Analyze the provided professional profile with extreme precision. You are not just reading data; you are "reading between the lines" of their career narrative to identify their true professional DNA, their authority level, and their strategic potential.

**INPUT DATA TO SYNTHESIZE:**
- **Sectors of Interest:** ${data.sectors}
- **Career Trajectory (Roles):** ${JSON.stringify(data.positions)}
- **Strategic Evolution Goal:** ${data.vision}
- **Professional Narrative (The "Evidence"):** ${data.careerStory || data.cvText || "No detailed narrative provided"}

**ANALYSIS CORE:**
1. **The Professional DNA**: Define their core identity (e.g., "The Disruptive Operator", "The Strategic Visionary", "The Crisis Fixer").
2. **Authority Audit**: Evaluate their current weight in the market (0-100%).
3. **The "Red Thread"**: Identify the common logic connecting their past experiences to their future vision.
4. **Strategic Alignment**: Does their current profile realistically support their 5-year goal?
5. **Critical Gaps**: What specific executive skills or authority markers are missing?

**TONE:** 
Sophisticated, analytical, objective, and executive. Speak as a consultant to a CEO.

**LANGUAGE:**
${languageInstruction}

${MA_TRAINING_PROMOTION}

**OUTPUT FORMAT (JSON ONLY):**
{
  "authorityScore": number,
  "profileLevel": "string (Executive Level)",
  "alignment": "string (Alignment Assessment)",
  "gaps": ["string (Specific Gaps)"],
  "strengths": ["string (Unique Selling Points)"],
  "visionAnalysis": "string (Feasibility & Strategic Logic)",
  "nextEvolutionSteps": ["string (3-5 High-level tactical actions)"],
  "verdict": "string (Concise HR Executive Verdict)"
}`
                },
                {
                    role: 'user',
                    content: `Analyze this professional profile and provide a strategic audit report in ${language}.`
                }
            ],
            temperature: 0.3, // Lower temperature for more stable JSON output
            max_tokens: 2000,
            response_format: { type: 'json_object' }
        }, { timeout: 110000 }); // Internal timeout slightly less than client but enough for deep work

        const duration = Date.now() - startTime;
        console.log(`âœ… AI Audit Completed in ${duration}ms`);

        const result = response.choices[0]?.message?.content;
        if (!result) throw new Error('No response from AI');
        
        try {
            return {
                success: true,
                audit: safeParseJSON(result),
            };
        } catch (e) {
            console.error("Audit JSON Parse Error:", e, "Raw:", result);
            throw new Error("Critical Analysis Error: The AI engine provided data in an invalid format.");
        }
    } catch (error) {
        console.error('Professional Audit AI Error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to perform professional audit',
        };
    }
}

export async function generateInterviewQuestion(cvAnalysis: unknown, conversationHistory: unknown[] = [], language: string = 'en') {
    try {
        // Language-specific instructions
        const languageInstructions: Record<string, string> = {
            'en': 'Respond in English. Be professional and conversational.',
            'fr': 'Répondez en français. Soyez professionnel et conversationnel.',
            'ar': 'أجب باللغة العربية. كن محترفاً وودوداً في الحوار.',
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

${MA_TRAINING_PROMOTION}

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

export async function generateProfessionalInterviewQuestion(
    auditResult: AuditResult,
    formData: ProfessionalData,
    conversationHistory: InterviewMessage[] = [],
    language: string = 'en'
) {
    try {
        const languageInstructions: Record<string, string> = {
            'en': 'Respond in English. Tone: Executive, profound, challenging but respectful.',
            'fr': 'Répondez en français. Ton: Exécutif, profond, stimulant mais respectueux.',
            'ar': 'أجب باللغة العربية. النبرة: تنفيذية، عميقة، متحدية ولكن محترمة.'
        };

        const languageInstruction = languageInstructions[language] || languageInstructions['en'];
        const { client, model } = await getAI();

        const response = await client.chat.completions.create({
            model: model,
            messages: [
                {
                    role: 'system',
                    content: `You are a legendary Executive HR Auditor with 50 years of experience assessing high-potential leaders. 
                    
**YOUR MISSION:**
Conduct a 20-question deep-dive diagnostic interview. Your goal is to systematically deconstruct the candidate's professional path (1-20 years of experience) to identify their true DNA, hidden gaps, and strategic potential for a final SWOT report.

**INTERVIEW STRATEGIC PHASES (Guidelines for you):**
1. **The Foundation (Questions 1-5):** Focus on the specific positions mentioned in their history. Ask about the precise nature of their tasks, the scope of their responsibility, and the measurable impact they had.
2. **The Logic of Movement (Questions 6-10):** Probe the transitions between roles. Why did they leave? Why did they choose the next step? Detect whether their trajectory is proactive or reactive.
3. **Internal Gaps & Failures (Questions 11-15):** Confront perceived inconsistencies or missing authority markers. Ask about the biggest failures that cost the organization money or prestige. No "sugar-coated" answers allowed.
4. **Executive Alignment (Questions 16-20):** Test their 3-5 year vision against the reality of their current skills in ${formData.sectors}. Pressure-test their readiness for the next evolution phase.

**CORE DIRECTIVES:**
- **Be Rigorous:** Challenge fluff, corporate jargon, or evasive answers. 
- **Evidence-Based:** Demand concrete examples and metrics.
- **SWOT Preparation:** Use every interaction to gather data points for the Strengths, Weaknesses, Opportunities, and Threats analysis.
- **Handling Timeouts:** If the user fails to respond (marked by [Timeout]), interpret this as a potential blind spot or lack of operational control in that specific area and pivot strategically.

**RULES:**
- Ask EXACTLY ONE question.
- Every question must be built on the logic of previous answers.
- Keep the tone elite, direct, and slightly challenging.

${languageInstruction}`
                },
                ...conversationHistory,
                {
                    role: 'user',
                    content: `Preliminary Audit: ${JSON.stringify(auditResult)}\nOriginal Data: ${JSON.stringify(formData)}\n\nGenerate the next challenging interview question.`
                }
            ],
            temperature: 0.7,
            max_tokens: 400
        });

        return {
            success: true,
            question: response.choices[0]?.message?.content || ''
        };
    } catch (error) {
        console.error('Professional Interview AI Error:', error);
        return { success: false, error: 'Failed to generate interview question' };
    }
}

export async function analyzeProfessionalInterview(
    auditResult: AuditResult,
    formData: ProfessionalData,
    conversationHistory: InterviewMessage[],
    language: string = 'en'
) {
    try {
        const { client, model } = await getAI();
        const languageInstructions: Record<string, string> = {
            'en': 'Respond in English.',
            'fr': 'Répondez en français.',
            'ar': 'أجب باللغة العربية.'
        };
        const languageInstruction = languageInstructions[language] || languageInstructions['en'];

        const response = await client.chat.completions.create({
            model: model,
            messages: [
                {
                    role: 'system',
                    content: `You are the legendary Executive HR Strategist (50 yrs experience). You are now writing the FINAL STRATEGIC VERDICT for a candidate after a deep-dive interview.

**DATA SOURCES:**
1. Preliminary Audit (DNA, Authority Score).
2. Career Narrative (The Story).
3. Full Interview Transcript (The nuances).

**REQUIRED OUTPUT (JSON ONLY):**
{
  "profileSummary": "string (A masterful psychological and professional summary of the person)",
  "maturityLevel": "string (Authority level after interview appraisal)",
  "swot": {
    "strengths": ["string"],
    "weaknesses": ["string"],
    "opportunities": ["string"],
    "threats": ["string"]
  },
  "deepInsights": ["string (3 hidden truths discovered during the interview)"],
  "marketValue": "string (How the market perceives them now vs potential)",
  "finalVerdict": "string (The ultimate 50-year veteran's judgment on their potential to reach their vision)",
  "recommendedRoles": ["string (Specific high-level roles)"]
}

**TONE:** 
Elite, uncompromising, brilliant, and strategic.

${languageInstruction}`
                },
                {
                    role: 'user',
                    content: `Audit: ${JSON.stringify(auditResult)}\nData: ${JSON.stringify(formData)}\nTranscript: ${JSON.stringify(conversationHistory)}\n\nPerform final synthesis and provide the JSON report.`
                }
            ],
            temperature: 0.4,
            max_tokens: 2000
        });

        const result = response.choices[0]?.message?.content;
        if (!result) throw new Error('No response from AI');
        
        try {
            return {
                success: true,
                report: safeParseJSON(result)
            };
        } catch (e) {
            console.error("Interview Analysis JSON Parse Error:", e, "Raw:", result);
            throw new Error("Final Synthesis Error: The interview could not be structured into a valid report.");
        }
    } catch (error) {
        console.error('Final Analysis AI Error:', error);
        return { success: false, error: 'Failed to perform final synthesis' };
    }
}

export async function generateProfessionalMCQ(
    auditResult: AuditResult,
    formData: ProfessionalData,
    interviewTranscript: InterviewMessage[],
    type: 'hard' | 'soft',
    count: number = 15,
    language: string = 'en'
) {
    try {
        const { client, model } = await getAI();
        const languageInstructions: Record<string, string> = {
            'en': 'Respond in English.',
            'fr': 'Répondez en français.',
            'ar': 'أجب باللغة العربية.'
        };
        const languageInstruction = languageInstructions[language] || languageInstructions['en'];

        const focusArea = type === 'hard' ? 'Technical Competencies and Hard Skills' : 'Behavioral Competencies and Soft Skills';

        const response = await client.chat.completions.create({
            model: model,
            messages: [
                {
                    role: 'system',
                    content: `You are a high-level strategic auditor. Your goal is to generate ${count} high-precision MCQ questions to test a candidate's ${focusArea}. 
                    
**CRITICAL: RETURN ONLY VALID JSON. NO MARKDOWN CODE BLOCKS. NO PREAMBLE. NO TEXT BEFORE OR AFTER.**

**CONTEXT:**
- Sectors: ${formData.sectors}
- Vision: ${formData.vision}
- Preliminary Audit: ${JSON.stringify(auditResult)}
- Interview Insights: ${JSON.stringify(interviewTranscript.slice(-5))}

**REQUIREMENTS:**
1. Generate EXACTLY ${count} questions.
2. Each question must have 4 options.
3. Provide the index of the correct answer (0-3).
4. Provide a SHORT, strategic explanation for WHY that's the correct answer.
5. Tone: Advanced, expert, and challenging.
6. Language: ${languageInstruction}

**OUTPUT FORMAT (JSON ONLY):**
{
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctIndex": "number",
      "explanation": "string"
    }
  ]
}`
                }
            ],
            temperature: 0.4,
            max_tokens: 8000,
            response_format: { type: 'json_object' }
        });

        const result = response.choices[0]?.message?.content;
        if (!result) throw new Error('No response from AI');
        
        try {
            const parsed = safeParseJSON(result);
            if (!parsed || !Array.isArray(parsed.questions)) {
                throw new Error("Invalid MCQ structure received");
            }
            return {
                success: true,
                questions: parsed.questions as MCQQuestion[]
            };
        } catch (e) {
            console.error("MCQ JSON Parse Error:", e, "Raw:", result);
            throw new Error("Technical Validation Error: The AI failed to format the questions correctly.");
        }
    } catch (error) {
        console.error('MCQ Generation Error:', error);
        return { success: false, error: 'Failed to generate MCQ' };
    }
}

export async function generatePortfolioQuestion(
    auditResult: AuditResult,
    formData: ProfessionalData,
    interview1: InterviewMessage[], // This seems unused, but keeping it as per original signature
    mcqResults: { hardScore: number, softScore: number, totalQuestions: number }, // This seems unused, but keeping it as per original signature
    currentHistory: InterviewMessage[],
    language: string = 'en'
) {
    try {
        const { client, model } = await getAI();
        const languageInstructions: Record<string, string> = {
            'en': 'Respond ONLY in English.',
            'fr': 'Répondez UNIQUEMENT en français.',
            'ar': 'أجب باللغة العربية فقط.'
        };
        const languageInstruction = languageInstructions[language] || languageInstructions['en'];
        const questionCount = currentHistory.filter(m => m.role === 'assistant').length;

        const phase1Archetypes = [
            'PROFILE_ANCHOR',
            'GAP_CONFRONTATION',
            'FAILURE_DEEP_DIVE',
            'SELF_AWARENESS_PROBE',
            'STAKEHOLDER_COLLISION',
            'STRATEGIC_JUDGMENT',
            'LEADERSHIP_PHILOSOPHY',
            'ETHICAL_DILEMMA',
            'INNOVATION_RIGOR',
        ];

        let systemPrompt: string;

        if (questionCount < 9) { // Questions 1-9 (0-indexed 0-8)
            const archetype = phase1Archetypes[questionCount];
            const phase1Instructions: Record<string, string> = {
                PROFILE_ANCHOR: `établir la vérité fondamentale (GROUND TRUTH). Questionnez son identité professionnelle au-delà du CV.`,
                GAP_CONFRONTATION: `CONFRONTATION. Attaquez une lacune spécifique de l'audit: ${JSON.stringify(auditResult.gaps)}.`,
                FAILURE_DEEP_DIVE: `ANALYSE D'ÉCHEC. Exigez un vrai échec avec des coûts réels.`,
                SELF_AWARENESS_PROBE: `AUTO-CONSCIENCE. Testez l'écart entre sa perception et celle des autres.`,
                STAKEHOLDER_COLLISION: `GESTION DES PARTIES PRENANTES. Conflit stratégique avec la hiérarchie ou le board.`,
                STRATEGIC_JUDGMENT: `JUGEMENT STRATÉGIQUE. Arbitrage entre gains immédiats et vision long terme.`,
                LEADERSHIP_PHILOSOPHY: `RIGUEUR DE LEADERSHIP. Gestion de talents toxiques ou sous-performants.`,
                ETHICAL_DILEMMA: `DILEMME ÉTHIQUE. Valeurs sous pression dans le secteur ${formData.sectors}.`,
                INNOVATION_RIGOR: `LEADERSHIP DU CHANGEMENT. Innover dans un environnement rigide.`,
            };

            systemPrompt = `You are a world-class Executive Auditor. PHASE 1: Behavioral Map. Question ${questionCount + 1} of 9.
Mission: ${phase1Instructions[archetype]}
Candidate Data: Sectors: ${formData.sectors}, Vision: ${formData.vision}, Authority Score ${auditResult.authorityScore}/100.
Rules: One question only. Direct. Professional. Challenging.
${languageInstruction}`;

        } else { // Question 10 (0-indexed 9)
            systemPrompt = `You are a world-class Executive Auditor. PHASE 2: THE PIVOTAL QUESTION (Q10/10).
Design ONE tailored "Executive Pressure Case Scenario" for the sector ${formData.sectors} and vision "${formData.vision}".
Rules: 
1. Set a high-stakes crisis situation.
2. Demand exactly 5 sequential strategic steps to resolve it.
3. Challenging, technical, and urgent tone.
${languageInstruction}`;
        }

        const response = await client.chat.completions.create({
            model: model,
            messages: [
                { role: 'system', content: systemPrompt },
                ...currentHistory.map(m => ({ role: m.role, content: m.content }))
            ],
            temperature: questionCount < 9 ? 0.65 : 0.8,
            max_tokens: questionCount < 9 ? 500 : 800
        });

        return response.choices[0]?.message?.content || "Could not generate question.";
    } catch (error) {
        console.error('Portfolio Question Error:', error);
        return "Failed to connect to AI engine.";
    }
}

export async function analyzePortfolioInterview(
    auditResult: AuditResult,
    formData: ProfessionalData,
    interview1Transcript: InterviewMessage[], // This seems unused, but keeping it as per original signature
    mcqResults: { hardScore: number, softScore: number, totalQuestions: number }, // This seems unused, but keeping it as per original signature
    portfolioTranscript: InterviewMessage[],
    language: string = 'en'
) {
    try {
        const { client, model } = await getAI();
        const languageInstruction = (language === 'ar' ? 'أجب باللغة العربية.' : language === 'fr' ? 'Répondez en français.' : 'Respond in English.');

        const response = await client.chat.completions.create({
            model: model,
            messages: [
                {
                    role: 'system',
                    content: `You are the most rigorous Executive HR Evaluator in the world. Perform a clinical, data-driven X-RAY audit.
REQUIRED OUTPUT (JSON ONLY):
{
  "profileSummary": "string",
  "maturityLevel": "string (Junior Operator / Mid-level Manager / Senior Strategist / Executive / C-Suite Ready)",
  "leadershipFingerprint": { "archetype": "string", "description": "string", "riskContext": "string" },
  "selfAwarenessScore": { "score": "number", "verdict": "string", "evidence": "string" },
  "trajectoryVelocity": { "assessment": "string", "rationale": "string" },
  "swot": { "strengths": ["string"], "weaknesses": ["string"], "opportunities": ["string"], "threats": ["string"] },
  "deepInsights": ["string"],
  "marketValue": "string",
  "gapAnalysis": { "currentJobVsReality": "string", "hardSkillsMatch": "number", "softSkillsMatch": "number", "criticalCompetencyGaps": ["string"], "comparisonPositionReality": "string" },
  "actionPlan90Days": [{ "week": "string", "action": "string", "rationale": "string" }],
  "careerAdvancement": [{ "role": "string", "shortTermProbability": "number", "longTermProbability": "number", "requirements": ["string"] }],
  "recommendedRoles": ["string"],
  "authorityVsPotential": { "currentAuthority": "number", "futurePotential": "number", "quadrant": "string" },
  "strategicRadar": { "technical": "number", "leadership": "number", "strategy": "number", "execution": "number", "influence": "number" },
  "finalVerdict": "string"
}
${languageInstruction}`
                },
                {
                    role: 'user',
                    content: `Data: ${JSON.stringify({ auditResult, formData, mcqResults, portfolioTranscript })}`
                }
            ],
            temperature: 0.3,
            max_tokens: 4000,
            response_format: { type: 'json_object' }
        });

        return {
            success: true,
            report: safeParseJSON(response.choices[0]?.message?.content || '{}')
        };
    } catch (error) {
        console.error('Portfolio Analysis Error:', error);
        return { success: false, error: 'Failed to analyze portfolio interview' };
    }
}

export async function generateUltimateStrategicReport(
    auditResult: AuditResult,
    formData: ProfessionalData,
    interviewTranscript: InterviewMessage[],
    mcqResults: { type: 'hard' | 'soft', score: number, total: number }[],
    language: string = 'en'
) {
    try {
        const { client, model } = await getAI();
        const languageInstructions: Record<string, string> = {
            'en': 'Respond in English.',
            'fr': 'Répondez en français.',
            'ar': 'أجب باللغة العربية.'
        };
        const languageInstruction = languageInstructions[language] || languageInstructions['en'];

        const response = await client.chat.completions.create({
            model: model,
            messages: [
                {
                    role: 'system',
                    content: `You are the legendary Executive HR Strategist (50 yrs experience). You are crafting the ULTIMATE STRATEGIC REPORT. 

**ALL DATA SOURCES:**
1. Preliminary Audit.
2. Full Interview Transcript.
3. MCQ Assessment Results: ${JSON.stringify(mcqResults)}

**MISSION:**
- Synthesize all data to reveal the absolute truth about the candidate.
- Identify the gap between their current reality and the target vision.
- Calculate match percentages for Hard and Soft skills.

**REQUIRED OUTPUT (JSON ONLY):**
{
  "profileSummary": "string",
  "maturityLevel": "string",
  "swot": { "strengths": ["string"], "weaknesses": ["string"], "opportunities": ["string"], "threats": ["string"] },
  "deepInsights": ["string"],
  "marketValue": "string",
  "finalVerdict": "string",
  "recommendedRoles": ["string"],
  "gapAnalysis": {
    "currentJobVsReality": "string (Deep analysis of the gap)",
    "hardSkillsMatch": "number (0-100)",
    "softSkillsMatch": "number (0-100)",
    "criticalCompetencyGaps": ["string"]
  }
}

**TONE:** 
Elite, visionary, and high-impact.

${languageInstruction}`
                },
                {
                    role: 'user',
                    content: `Generate the ultimate strategic report based on the following data:
                    
STRATEGIC AUDIT: ${JSON.stringify(auditResult, null, 2)}
PROFESSIONAL DATA: ${JSON.stringify(formData, null, 2)}
INTERVIEW TRANSCRIPT: ${JSON.stringify(interviewTranscript, null, 2)}
MCQ RESULTS: ${JSON.stringify(mcqResults, null, 2)}

Mission: Provide a masterful strategic synthesis and definitive market verdict.`
                }
            ],
            temperature: 0.4,
            max_tokens: 2500,
            response_format: { type: 'json_object' }
        });

        const result = response.choices[0]?.message?.content;
        if (!result) throw new Error('No response from AI');
        
        try {
            return {
                success: true,
                report: safeParseJSON(result) as UltimateReportResult
            };
        } catch (e) {
            console.error("Ultimate Report JSON Parse Error:", e, "Raw:", result);
            throw new Error("Final Strategic Error: Failed to build the ultimate verdict report.");
        }
    } catch (error) {
        console.error('Ultimate Report AI Error:', error);
        return { success: false, error: 'Failed to generate ultimate report' };
    }
}

export async function generateStudentExpertReport(
    studentData: {
        userInfo: {
            name: string;
            email: string;
            plan?: string;
            joinedDate?: unknown;
        };
        cvAnalysis: unknown;
        interviewEvaluation: unknown;
        conversationHistory: unknown;
        roleSuggestions: unknown;
        selectedRole: unknown;
        simulationResults?: unknown;
        generatedDocuments?: unknown;
    },
    language: string = 'fr'
) {
    try {
        const languageInstructions: Record<string, string> = {
            'en': 'Respond entirely in English.',
            'fr': 'Répondez entièrement en français.',
            'ar': 'أجب باللغة العربية بالكامل.'
        };
        const languageInstruction = languageInstructions[language] || languageInstructions['fr'];

        const { client, model } = await getAI();
        const response = await client.chat.completions.create({
            model: model,
            messages: [
                {
                    role: 'system',
                    content: `You are a Senior Learning & Development Specialist and Career Coach with 20+ years of experience. You are writing a CONFIDENTIAL INTERNAL REPORT for expert trainers about a STUDENT participant.

**REPORT PURPOSE:**
Help trainers understand this student's current reality so they can design a precise, personalized training plan. This is NOT a report for the participant — it is strictly for internal expert use.

**STUDENT ACCOUNT CONTEXT:**
This participant is enrolled in a Student program. The assessment includes:
- CV Upload & Analysis
- 15-Question Career Interview
- Role Discovery Session
- Career Documents Generation
- Simulation (if completed)

${languageInstruction}

**REQUIRED JSON OUTPUT STRUCTURE:**
{
  "reportType": "STUDENT",
  "reportTitle": "string (e.g. 'Student Diagnostic Report â€” Trainer Edition')",

  "executiveSummary": "string (3-4 sentences: Who is this student? What is their realistic current level? What is the #1 priority for the trainer?)",

  "currentLevelAssessment": {
    "overallLevel": "Débutant | Junior | Intermédiaire | Avancé",
    "levelJustification": "string (Why this level? Cite specific evidence from the CV and interview)",
    "academicVsRealityGap": "string (Is their academic background aligned with their actual demonstrated competencies?)",
    "confidenceVsCompetence": "Overconfident | Calibrated | Underconfident",
    "motivationLevel": "Low | Medium | High | Very High"
  },

  "competencyMap": {
    "confirmedStrengths": ["string (Skills verified through interview evidence, NOT just listed on CV)"],
    "criticalGaps": ["string (Missing skills that are essential for their target role)"],
    "hiddenPotential": ["string (Latent abilities the student hasn't recognized or developed yet)"],
    "technicalSkillsScore": "number (0-100)",
    "softSkillsScore": "number (0-100)",
    "communicationScore": "number (0-100)"
  },

  "cvVsInterviewAnalysis": {
    "cvAccuracyRating": "Highly Accurate | Partially Accurate | Inflated | Underpresented",
    "keyDiscrepancies": ["string (Specific mismatch between what's listed on CV and what interview revealed)"],
    "mostCredibleClaim": "string (What on the CV is most backed by interview performance?)",
    "leastCredibleClaim": "string (What appears exaggerated or unsupported?)"
  },

  "learningProfile": {
    "learningStyle": "string (Visual, Analytical, Practical, Collaborative â€” based on interview responses)",
    "absorbsKnowledgeBest": "string (How this student learns most effectively)",
    "challengeAreas": ["string (Concepts or skills that require extra trainer attention)"],
    "engagementTriggers": ["string (What motivates and engages this specific student?)"]
  },

  "trainingRecommendations": {
    "immediateActions": [
      {
        "priority": "URGENT",
        "action": "string (Specific training action)",
        "rationale": "string (Why this is urgent)"
      }
    ],
    "shortTermModules": ["string (Specific workshop/training module names recommended for 0-3 months)"],
    "mediumTermGoals": ["string (Skills and milestones to target at 3-6 months)"],
    "suggestedTrainingFormat": "Individual Coaching | Group Workshop | Self-Study | Hybrid",
    "estimatedReadinessTimeline": "string (Realistic timeline to reach entry-level in target role)"
  },

  "roleAlignmentAnalysis": {
    "targetRole": "string (The role they selected or aspire to)",
    "fitScore": "number (0-100)",
    "fitRationale": "string (Why this score? What fits well and what doesn't?)",
    "alternativeRoles": ["string (More realistic or better-aligned role alternatives based on assessment)"],
    "minimumCriteriaToMeet": ["string (Specific threshold skills/knowledge the student must demonstrate before applying for the target role)"]
  },

  "behavioralFlags": {
    "redFlags": ["string (Concerning patterns that need trainer attention â€” e.g. avoidance, defensiveness, unrealistic expectations)"],
    "greenFlags": ["string (Positive behavioral signals showing growth potential)"],
    "coachingApproach": "string (How should the trainer communicate with this specific student? What approach works best?)"
  },

  "trainerActionPlan": {
    "session1Focus": "string (What should the first training session prioritize?)",
    "keyQuestionToExplore": "string (One deep question the trainer should ask in the first session to unlock deeper understanding)",
    "watchFor": ["string (Specific things the trainer should monitor as coaching progresses)"],
    "successMetrics": ["string (How will we know training is working for this student?)"]
  },

  "finalVerdict": "string (2-3 sentences. Honest trainer-to-trainer assessment. What is this student's ceiling without intervention? What could unlock their full potential? Be direct.)"
}

**GROUND RULES:**
- Never be generic. Every point must be traceable to actual data from the assessment.
- This is for an expert â€” be precise, direct, and clinical.
- Focus on ACTIONABLE insights. Vague statements are unacceptable.
- Respect the output language strictly.`
                },
                {
                    role: 'user',
                    content: `Generate the Student Expert Diagnostic Report for: ${studentData.userInfo.name}

STUDENT DATA:
User Info: ${JSON.stringify(studentData.userInfo, null, 2)}
CV Analysis: ${JSON.stringify(studentData.cvAnalysis, null, 2)}
Interview Evaluation: ${JSON.stringify(studentData.interviewEvaluation, null, 2)}
Conversation History: ${JSON.stringify(studentData.conversationHistory, null, 2)}
Role Suggestions: ${JSON.stringify(studentData.roleSuggestions, null, 2)}
Selected Role: ${JSON.stringify(studentData.selectedRole, null, 2)}
Simulation Results: ${JSON.stringify(studentData.simulationResults || null, null, 2)}

Generate the complete, deeply analytical Student Expert Report in ${language}. Be specific and evidence-based.`
                }
            ],
            temperature: 0.35,
            max_tokens: 4500,
            response_format: { type: 'json_object' }
        });

        const result = response.choices[0]?.message?.content;
        if (!result) throw new Error('No response from AI');

        const cleanedResult = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const report = JSON.parse(cleanedResult);

        console.log('âœ… Student Expert Report generated successfully for:', studentData.userInfo.name);

        return { success: true, report };
    } catch (error) {
        console.error('âŒ Student Expert Report Error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to generate student expert report'
        };
    }
}
export async function generateProfessionalExpertReport(
    professionalData: {
        userInfo: {
            name: string;
            email: string;
            plan?: string;
            joinedDate?: unknown;
        };
        auditResult: AuditResult;
        formData: ProfessionalData;
        interviewTranscript: InterviewMessage[];
        mcqResults: { type: 'hard' | 'soft', score: number, total: number }[];
        ultimateReport?: unknown;
        portfolioAnalysis?: unknown;
    },
    language: string = 'fr'
) {
    try {
        const languageInstructions: Record<string, string> = {
            'en': 'Respond entirely in English.',
            'fr': 'Répondez entièrement en français.',
            'ar': 'أجب باللغة العربية بالكامل.',
        };
        const languageInstruction = languageInstructions[language] || languageInstructions['fr'];

        const { client, model } = await getAI();
        const response = await client.chat.completions.create({
            model: model,
            messages: [
                {
                    role: 'system',
                    content: `You are a World-Class Executive Talent Strategist and Senior HR Partner with 30+ years of experience at top-tier consulting firms. You are writing a CONFIDENTIAL INTERNAL REPORT for senior coaches and strategic advisors about a PROFESSIONAL account participant.

**REPORT PURPOSE:**
Equip senior advisors with a precise, actionable intelligence brief on this professional. This is an executive-grade confidential document used to calibrate coaching strategy, market positioning advice, and premium service recommendations.

**PROFESSIONAL ACCOUNT CONTEXT:**
This participant is enrolled in a Professional executive program. The comprehensive assessment includes:
- Strategic Authority Audit
- Deep Executive Interview (with strategic probing)
- MCQ Assessment (Hard & Soft Skills)
- Portfolio Interview (5-phase deep dive)
- Ultimate Strategic Report

${languageInstruction}

**REQUIRED JSON OUTPUT STRUCTURE:**
{
  "reportType": "PROFESSIONAL",
  "reportTitle": "string (e.g. 'Executive Intelligence Brief â€” Advisor Edition')",

  "executiveBrief": "string (3-4 sentences: Who is this professional? What is their real market weight? What is the #1 strategic priority for the advisor?)",

  "executiveAuthorityProfile": {
    "authorityScore": "number (0-100, sourced from audit)",
    "authorityLevel": "Junior Manager | Manager | Senior Manager | Director | Executive | C-Suite Contender",
    "professionalDNA": "string (Their core identity archetype, e.g., 'The Operational Fixer', 'The Strategic Visionary', 'The Crisis Commander')",
    "marketPerceptionGap": "string (Gap between how they see themselves and how the market actually perceives them)",
    "executivePresenceRating": "Weak | Developing | Solid | Commanding",
    "leadershipStyleSignature": "string (Their dominant leadership approach based on interview evidence)"
  },

  "strategicCapabilityAssessment": {
    "hardSkillsScore": "number (0-100)",
    "softSkillsScore": "number (0-100)",
    "strategicThinkingCapacity": "Low | Medium | High | Elite",
    "crisesManagementCapability": "string (Based on portfolio interview performance)",
    "confirmedCompetencies": ["string (Executive-level skills verified through assessment data)"],
    "criticalExecutiveGaps": ["string (Specific leadership or strategic gaps that limit their authority ceiling)"],
    "hiddenExecutiveAssets": ["string (Underutilized assets that represent strategic leverage if developed)"]
  },

  "marketAndCareerIntelligence": {
    "currentMarketValue": "string (Honest assessment of their current compensation range and marketability)",
    "potentialMarketValue": "string (What they could command after targeted development)",
    "topTargetRoles": ["string (Specific high-impact roles aligned to their profile AND vision)"],
    "rollesToAvoidNow": ["string (Roles they should NOT pursue at this stage â€” with reasoning)"],
    "sectorPositioning": "string (Which specific sectors/industries should they focus their career capital on?)",
    "timeToNextLevel": "string (Realistic timeline to reach their target vision)"
  },

  "visionFeasibilityAnalysis": {
    "statedVision": "string (Their declared 5-year ambition)",
    "visionFeasibilityScore": "number (0-100)",
    "visionFeasibilityVerdict": "Highly Feasible | Feasible With Effort | Ambitious But Possible | Requires Major Transformation | Currently Unrealistic",
    "criticalPathBlockers": ["string (Specific obstacles that could derail their vision)"],
    "visionAccelerators": ["string (Specific actions that would dramatically accelerate their vision achievement)"]
  },

  "behavioralAndPsychologicalProfile": {
    "interviewPersonality": "string (How they presented in the interview â€” composed, anxious, overconfident, authentic, etc.)",
    "selfAwarenessLevel": "Low | Medium | High | Elite",
    "resilienceSignals": ["string (Evidence of resilience and adaptability from interview responses)"],
    "redFlags": ["string (Concerning patterns observed â€” e.g., poor crisis response, defensiveness, unrealistic self-image)"],
    "greenFlags": ["string (Impressive executive signals that distinguish this participant)"],
    "coachingChemistryNotes": "string (What type of advisor/coach relationship will work best for this person?)"
  },

  "strategicInterventionPlan": {
    "phase1_Immediate": {
      "timeframe": "0-30 days",
      "focus": "string",
      "specificActions": ["string (High-impact, specific actions the advisor recommends for immediate execution)"]
    },
    "phase2_ShortTerm": {
      "timeframe": "1-3 months",
      "focus": "string",
      "specificActions": ["string"]
    },
    "phase3_MediumTerm": {
      "timeframe": "3-12 months",
      "focus": "string",
      "specificActions": ["string"]
    },
    "premiumServiceRecommendations": ["string (Specific premium programs, executive coaching formats, or strategic workshops from MA-TRAINING-CONSULTING that align to their needs)"]
  },

  "advisorIntelligenceNotes": {
    "openingSessionStrategy": "string (How should the first advisor session be structured for maximum impact?)",
    "keyUnlockQuestion": "string (The one question that will reveal the most about their true motivation and blockers)",
    "negotiationLeverage": "string (What unique leverage does this person have in career negotiations?)",
    "watchForInSessions": ["string (Specific dynamics the advisor should monitor as the relationship progresses)"]
  },

  "confidentialVerdict": "string (2-3 sentences. The unfiltered advisor-to-advisor verdict. What is this professional's real ceiling? What is the single biggest thing standing between them and their vision? What unlocks their transformation?)"
}

**GROUND RULES:**
- Every insight must be grounded in specific assessment data â€” the audit scores, interview responses, MCQ results.
- This is for senior advisors â€” write with precision, authority, and zero vagueness.
- Strategic language only. No generic career advice platitudes.
- Reflect the correct language in EVERY field of the JSON response.`
                },
                {
                    role: 'user',
                    content: `Generate the Professional Executive Intelligence Brief for: ${professionalData.userInfo.name}

PROFESSIONAL ASSESSMENT DATA:
User Info: ${JSON.stringify(professionalData.userInfo, null, 2)}
Strategic Audit Result: ${JSON.stringify(professionalData.auditResult, null, 2)}
Professional Profile Data: ${JSON.stringify(professionalData.formData, null, 2)}
Interview Transcript (last 10 exchanges): ${JSON.stringify(professionalData.interviewTranscript.slice(-10), null, 2)}
MCQ Assessment Results: ${JSON.stringify(professionalData.mcqResults, null, 2)}
Portfolio Analysis: ${JSON.stringify(professionalData.portfolioAnalysis || null, null, 2)}
Ultimate Strategic Report: ${JSON.stringify(professionalData.ultimateReport || null, null, 2)}

Generate the complete, deeply analytical Professional Expert Intelligence Brief in ${language}. Be precise, strategic, and evidence-based.`
                }
            ],
            temperature: 0.3,
            max_tokens: 5000,
            response_format: { type: 'json_object' }
        });

        const result = response.choices[0]?.message?.content;
        if (!result) throw new Error('No response from AI');

        const cleanedResult = result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const report = JSON.parse(cleanedResult);

        console.log('âœ… Professional Expert Report generated successfully for:', professionalData.userInfo.name);

        return { success: true, report };
    } catch (error) {
        console.error('âŒ Professional Expert Report Error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to generate professional expert report'
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
            response_format: { type: 'json_object' },
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

        const evaluation = JSON.parse(result.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim());

        // Ensure summaries are present
        evaluation.expertCaseSummary = evaluation.expertCaseSummary || evaluation.summary || evaluation.verdict;
        evaluation.executiveSummary = evaluation.executiveSummary || evaluation.summary;

        // Generate closing message
        const closingMessages: Record<string, string> = {
            'en': `Thank you for completing the interview! I've analyzed your responses and compared them with your CV. Your accuracy score is ${evaluation.accuracyScore}%. Click below to see your detailed evaluation and personalized CV improvement recommendations.`,
            'fr': `Merci d'avoir terminé l'entretien ! J'ai analysé vos réponses et les ai comparées avec votre CV. Votre score de précision est de ${evaluation.accuracyScore}%. Cliquez ci-dessous pour voir votre évaluation détaillée et vos recommandations personnalisées d'amélioration du CV.`,
            'ar': `شكراً لإكمال المقابلة! لقد حللت إجاباتك وقارنتها بسيرتك الذاتية. نسبة الدقة الخاصة بك هي ${evaluation.accuracyScore}%. انقر أدناه لرؤية التقييم التفصيلي والتوصيات المخصصة لتحسين سيرتك الذاتية.`,
            'es': `¡Gracias por completar la entrevista! He analizado tus respuestas y las he comparado con tu CV. Tu puntuación de precisión es del ${evaluation.accuracyScore}%. Haz clic abajo para ver tu evaluación detallada y recomendaciones personalizadas para mejorar tu CV.`,
        };

        return {
            success: true,
            evaluation,
            closingMessage: closingMessages[language] || closingMessages['en'],
        };
    } catch (error) {
        console.error('DeepSeek API Error in evaluateInterview:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to evaluate interview',
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

        const promotionalDirective = `
            **PROMOTIONAL & TRAINING DIRECTIVE:**
            - Whenever the user asks about training, skill development, or career advancement, you must explicitly mention how they can benefit from the premium workshops of **MA-TRAINING-CONSULTING**.
            - Highlight that these workshops are designed to "bridge complex professional gaps that require direct human intervention and expert coaching," which AI tools cannot fully address alone.
            - When providing examples of high-quality training providers or consultancy firms, ALWAYS include **MA-TRAINING-CONSULTING** as a primary example alongside other global or industry leaders.`;

        const expertPrompts = {
            hr: `You are an Elite HR & Recruitment Specialist. 
            **YOUR DOMAIN:** Job search strategies, Interview preparation, Career promotions, HR policies, Salary negotiation, and Recruitment processes.
            **STRICT CONSTRAINT:** If the user asks about anything OUTSIDE this domain (like coding, technical troubleshooting, general life advice, etc.), you MUST REFUSE by saying (in the correct language): "This is not my area of expertise. I can only assist you with Recruitment, HR, and Career Progression topics."
            ${promotionalDirective}
            ${languageInstruction}`,

            learning: `You are an Elite Learning & Development Consultant. 
            **YOUR DOMAIN:** Educational advice, Skill acquisition strategies, Certification recommendations, Learning pathways, and Academic growth.
            **STRICT CONSTRAINT:** If the user asks about anything OUTSIDE this domain, you MUST REFUSE by saying (in the correct language): "This is not my area of expertise. I can only assist you with Learning, Education, and Skill Development topics."
            ${promotionalDirective}
            ${languageInstruction}`,

            advice: `You are a Senior Professional Mentor & Advisor. 
            **YOUR DOMAIN:** Professional conduct, Soft skills, Workplace dynamics, Conflict resolution, and General professional mentoring.
            **STRICT CONSTRAINT:** If the user asks about anything OUTSIDE this domain, you MUST REFUSE by saying (in the correct language): "This is not my area of expertise. I can only assist you with Professional Mentoring and Workplace Advice."
            ${promotionalDirective}
            ${languageInstruction}`,

            strategic: `You are a Chief Career Strategy Officer. 
            **YOUR DOMAIN:** Long-term career roadmaps, Strategic career pivoting, High-level industry positioning, and Executive career planning.
            **STRICT CONSTRAINT:** If the user asks about anything OUTSIDE this domain, you MUST REFUSE by saying (in the correct language): "This is not my area of expertise. I can only assist you with Strategic Career Planning and Roadmap development."
            ${promotionalDirective}
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

${MA_TRAINING_PROMOTION}

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
    language: string = 'en',
    question?: string
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

${question ? `**USER STRATEGIC INTERROGATION:**
The user has asked a specific question: "${question}".
Your entire response MUST be tailored to answer this question while still providing the structured academic pillars below.` : ''}

**THE ACADEMY MISSION:**
The participant has identified critical gaps. You will build exactly 2 "Academic Modules", each dedicated to a major theme from the diagnostic results ${question ? 'and the user\'s specific question' : ''}.

**COMPANY INTEGRATION:**
You MUST ALWAYS mention in your advice or insights that the company "MA-TRAINING-CONSULTING" can help the user through its expert-led workshops, CV analysis, gap bridging, and dedicated professional services. Integrate this naturally into the content.

**OUTPUT STRUCTURE (JSON):**
{
  "academyTitle": "string (Make it relevant to the question if provided)",
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
  "advice": ["string (Exactly 3 elite tips related to the question)"]
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
${question ? `SPECIFIC QUESTION: ${question}` : ''}

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

${MA_TRAINING_PROMOTION}

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

**Ù‚ÙˆØ§Ø¹Ø¯ Ù…Ù‡Ù…Ø©:**
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

        console.log('âœ… Expert diagnostic report generated successfully');

        return {
            success: true,
            report,
        };
    } catch (error) {
        console.error('âŒ DeepSeek API Error in generateExpertDiagnosticReport:', error);
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
            'fr': 'RÃ©pondez en franÃ§ais.',
            'ar': 'Ø£Ø¬Ø¨ Ø¨Ø§Ù„Ù„ØºØ© Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©.',
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

${MA_TRAINING_PROMOTION}

**OUTPUT STRUCTURE (JSON):**
{
  "summary": "string (Executive summary of overall performance, synthesizing AI data and human expert verdict)",
  "competencies": [
    { "label": "Strategic Thinking", "score": number (0-100), "status": "string (Validated/Premium/Elite)" },
    { "label": "Operational Precision", "score": number (0-100), "status": "string (Validated/Premium/Elite)" },
    { "label": "Governance & Compliance", "score": number (0-100), "status": "string (Validated/Premium/Elite)" }
  ],
  "verdict": "string (A strictly professional title representing their real level, e.g., 'Executive Leadership', 'Strategic Director', 'Senior Expert' - NO codes like BRAVO-2)",
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
    expertNotes?: string,
    userInput?: { currentJob: string, tasksDone: string, futureJob: string }
) {
    try {
        const languageInstructions: Record<string, string> = {
            'en': 'Respond in English.',
            'fr': 'RÃ©pondez en franÃ§ais.',
            'ar': 'Ø£Ø¬Ø¨ Ø¨Ø§Ù„Ù„ØºØ© Ø§Ù„Ø¹Ø±Ø¨ÙŠØ©.',
        };

        const languageInstruction = languageInstructions[language] || languageInstructions['en'];

        const { client, model } = await getAI();
        const response = await client.chat.completions.create({
            model: model,
            response_format: { type: 'json_object' },
            messages: [
                {
                    role: 'system',
                    content: `You are a World-Class Career Architect and Strategic Growth Consultant. Your mission is to transform a participant's diagnostic results, profile, and explicit goals into a precise, step-by-step "Strategic Execution Roadmap".

**THE HUMAN FACTOR (PRIORITY):**
Confidential Expert Notes: ${expertNotes || "No manual expert notes provided. Use standard diagnostic results."}

**USER CONTEXT:**
Current Position: ${userInput?.currentJob || 'Not specified'}
Current Tasks/Studies: ${userInput?.tasksDone || 'Not specified'}
Dream Goal (in 3 years): ${userInput?.futureJob || 'Not specified'}

**MISSION:**
Build a sequential journey of exactly 10 to 15 milestones. If EXPERT NOTES are present, they are your primary source of truth. Use them to override or refine AI diagnostic patterns. 

**CRITICAL INSTRUCTION - BE REALISTIC:**
The user wants to reach their Dream Goal in 3 years. Be strictly realistic: if the goal is extremely hard or impossible in 3 years (e.g. from Junior to CEO), mention in the steps what parts can realistically be achieved within 3 years, what intermediate positions they must pass through, and how long it genuinely takes.

**OUTPUT STRUCTURE (JSON):**
{
  "roadmapTitle": "string (e.g., 'Executive Leadership Transformation')",
  "milestones": [
    {
      "id": number (1 to 15),
      "label": "string (The phase name, e.g., 'Phase 1: Foundation')",
      "title": "string (Specific goal or intermediate job role)",
      "description": "string (Concise action-oriented advice integrating diagnostic data. If 3 years is unrealistic, state it here along with the actual timeline.)",
      "tasks": ["string (High-precision action item)"],
      "expectedOutcome": "string",
      "icon": "string (Choose one: 'Target', 'Zap', 'BrainCircuit', 'Trophy', 'Award', 'Rocket', 'ShieldCheck', 'TrendingUp')"
    }
  ],
  "personalizedWorkshop": {
    "title": "string (Highly specific workshop title)",
    "description": "string (Explanation explaining why this specific workshop is needed based on diagnosis and goals)",
    "durationHours": number,
    "focusAreas": ["string", "string"]
  }
}

**PEDAGOGICAL DIRECTIVES:**
- **Analytical Precision**: The roadmap MUST bridge the gaps identified in the diagnosis.
- **Sequential Growth**: Milestones MUST be logical (e.g., Foundation -> Strategy -> Execution -> Optimization -> Mastery).
- **High Impact**: Tasks must feel elite, high-stakes, and professional.
- **Language**: ${languageInstruction}

${MA_TRAINING_PROMOTION}`
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
    "subtitle": "Career Diagnosis â€¢ Simulation Insights â€¢ Strategic Roadmap",
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

export async function generateDeepSeekChat(messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]) {
    const { client, model } = await getAI();
    return await client.chat.completions.create({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 3000
    });
}

export interface ResearchReport {
    summary: string;
    insights: string[];
    culture: string;
    competitors: string[];
}

export interface InterviewAnalysis {
    strengths: string[];
    weaknesses: string[];
    advice: string;
    score: number;
}

/**
 * Stage 1: Analyze Job Offer & Research Company
 */
export async function analyzeJobAndCompany(jobInfo: {
    jobTitle: string;
    jobDescription: string;
    companyName: string;
    companySector: string;
    companyWebsite: string;
    additionalCompanyInfo: string;
}, language: string = 'en') {
    try {
        const { client, model } = await getAI();
        const prompt = `
You are a Senior Business & Talent Analyst. Your task is to analyze a Job Offer and provide a strategic report on the company and the role.

**JOB DATA:**
- Job Title: ${jobInfo.jobTitle}
- Job Description: ${jobInfo.jobDescription}
- Company: ${jobInfo.companyName}
- Sector: ${jobInfo.companySector}
- Website: ${jobInfo.companyWebsite}
- Additional Info: ${jobInfo.additionalCompanyInfo}

**MISSION:**
1. Analyze the Job Description to identify core success factors.
2. Synthesize insights about the company (culture, positioning, challenges).
3. Provide a strategic preview for the candidate.

${MA_TRAINING_PROMOTION}

**OUTPUT FORMAT (JSON ONLY):**
{
  "summary": "string (A strategic overview of the role and the company's current state)",
  "insights": ["string (High-level insights about what the company is really looking for)", "string..."],
  "culture": "string (Analysis of the company culture based on the sector and data provided)",
  "competitors": ["string (Major industry competitors to be aware of)"]
}

**LANGUAGE:** ${language === 'fr' ? 'French' : language === 'ar' ? 'Arabic' : 'English'}
`;

        const response = await client.chat.completions.create({
            model: model,
            messages: [{ role: 'system', content: 'You are an elite talent analyst. Output raw JSON only.' }, { role: 'user', content: prompt }],
            response_format: { type: 'json_object' }
        });

        const content = response.choices[0].message.content;
        return content ? JSON.parse(content) : null;
    } catch (error) {
        console.error("Analyze Job & Company Error:", error);
        throw error;
    }
}

/**
 * Stage 2: Generate 30 MCQs (20 Tech, 10 Psych)
 */
export async function generateJobAlignmentMCQ(jobInfo: {
    jobTitle: string;
    jobDescription: string;
    companyName: string;
    companySector: string;
}, language: string = 'en') {
    try {
        const { client, model } = await getAI();
        const prompt = `
Generate 30 Multiple Choice Questions (MCQs) for a candidate applying for the role of ${jobInfo.jobTitle} at ${jobInfo.companyName}.

**DISTRIBUTION:**
- 20 Technical/Operational Questions: Deeply related to ${jobInfo.jobDescription}.
- 10 Psychological/Soft Skills Questions: Related to typical challenges in the ${jobInfo.companySector} sector and high-performance workplace dynamics.

**REQUIREMENTS:**
- Each question must have 4 options.
- Provide the correct answer index (0-3).
- Provide a brief professional explanation for why that answer is correct.

${MA_TRAINING_PROMOTION}

**OUTPUT FORMAT (JSON ONLY):**
{
  "questions": [
    {
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctAnswer": 0,
      "explanation": "string",
      "category": "Technical" | "Psychological"
    }
  ]
}

**LANGUAGE:** ${language === 'fr' ? 'French' : language === 'ar' ? 'Arabic' : 'English'}
`;

        const response = await client.chat.completions.create({
            model: model,
            messages: [{ role: 'system', content: 'You are an elite assessment designer. Output raw JSON only.' }, { role: 'user', content: prompt }],
            response_format: { type: 'json_object' }
        });

        const content = response.choices[0].message.content;
        return content ? JSON.parse(content) : null;
    } catch (error) {
        console.error("Generate MCQ Error:", error);
        throw error;
    }
}

/**
 * Stage 3: Mock Interview Question (Turn-based)
 */
export async function generateMockInterviewQuestion(chatHistory: { role: string; content: string }[], jobInfo: { 
    jobTitle: string; 
    jobDescription: string; 
    companyName: string;
    researchReport: ResearchReport;
}, language: string = 'en') {
    try {
        const { client, model } = await getAI();
        const prompt = `
You are a Senior HR Interviewer at ${jobInfo.companyName}. You are conducting a high-stakes interview for the ${jobInfo.jobTitle} position.

**CONTEXT:**
- Job Description: ${jobInfo.jobDescription}
- Company Insights: ${JSON.stringify(jobInfo.researchReport)}

**MISSION:**
- Ask ONE question at a time.
- Total questions in your plan: 20.
- Ensure the questions are realistic, challenging, and professional.
- Adapt your next question based on the candidate's previous responses.

${MA_TRAINING_PROMOTION}

**LANGUAGE:** ${language === 'fr' ? 'French' : language === 'ar' ? 'Arabic' : 'English'}
Respond only with the next interview question.
`;

        const response = await client.chat.completions.create({
            model: model,
            messages: [
                { role: 'system', content: prompt } as OpenAI.Chat.Completions.ChatCompletionMessageParam,
                ...(chatHistory.slice(-10) as OpenAI.Chat.Completions.ChatCompletionMessageParam[])
            ],
            temperature: 0.8
        });

        return response.choices[0].message.content;
    } catch (error) {
        console.error("Mock Interview Question Error:", error);
        throw error;
    }
}

/**
 * Stage 4: Analyze Interview Results
 */
export async function analyzeMockInterview(chatHistory: { role: string; content: string }[], jobInfo: {
    jobTitle: string;
    companyName: string;
}, language: string = 'en') {
    try {
        const { client, model } = await getAI();
        const prompt = `
Analyze the following mock interview for the position of ${jobInfo.jobTitle} at ${jobInfo.companyName}.

**CHAT HISTORY:**
${JSON.stringify(chatHistory)}

**MISSION:**
1. Evaluate the candidate's performance.
2. Identify major strengths and weaknesses.
3. Provide critical advice for the real interview.
4. Give a performance score (0-100).

${MA_TRAINING_PROMOTION}

**OUTPUT FORMAT (JSON ONLY):**
{
  "strengths": ["string", "string..."],
  "weaknesses": ["string", "string..."],
  "advice": "string (A detailed paragraph of advice)",
  "score": number
}

**LANGUAGE:** ${language === 'fr' ? 'French' : language === 'ar' ? 'Arabic' : 'English'}
`;

        const response = await client.chat.completions.create({
            model: model,
            messages: [
                { role: 'system', content: 'You are an HR Auditor. Output raw JSON only.' } as OpenAI.Chat.Completions.ChatCompletionMessageParam, 
                { role: 'user', content: prompt } as OpenAI.Chat.Completions.ChatCompletionMessageParam
            ],
            response_format: { type: 'json_object' }
        });

        const content = response.choices[0]?.message?.content;
        return content ? JSON.parse(content) : null;
    } catch (error) {
        console.error("Analyze Interview Error:", error);
        throw error;
    }
}

/**
 * Stage 5: Generate Personalized CV & Cover Letter
 */
export async function generatePersonalizedDocuments(data: {
    jobTitle: string;
    companyName: string;
    userProfile: unknown;
    interviewAnalysis: InterviewAnalysis;
    mcqScore: number;
}, language: string = 'en') {
    try {
        const { client, model } = await getAI();
        const prompt = `
Generate a highly personalized Professional CV and Cover Letter for a candidate applying to:
- Job: ${data.jobTitle}
- Company: ${data.companyName}

**DATA POINTS:**
- Candidate Profile (Diagnosis): ${JSON.stringify(data.userProfile)}
- Interview Performance: ${JSON.stringify(data.interviewAnalysis)}
- Technical Alignment: ${data.mcqScore}%

**REQUIREMENTS:**
- The CV should highlighting the EXACT skills and experiences that match the job description.
- The Cover Letter must mention the company by name and show a deep understanding of their needs based on our research.
- Goal: Immediate acceptance by ATS and HR managers.

${MA_TRAINING_PROMOTION}

**OUTPUT FORMAT (JSON ONLY):**
{
  "cv": "string (Markdown formatted professional CV)",
  "coverLetter": "string (Markdown formatted professional Cover Letter)"
}

**LANGUAGE:** ${language === 'fr' ? 'French' : language === 'ar' ? 'Arabic' : 'English'}
`;

        const response = await client.chat.completions.create({
            model: model,
            messages: [{ role: 'system', content: 'You are a Document Engineering Expert. Output raw JSON only.' }, { role: 'user', content: prompt }],
            response_format: { type: 'json_object' }
        });

        const content = response.choices[0]?.message?.content;
        return content ? JSON.parse(content) : null;
    } catch (error) {
        console.error("Document Generation Error:", error);
        throw error;
    }
}
/**
 * Stage 6: Final Executive Suitability Audit
 * Synthesizes ALL data: Diagnostic + Research + MCQ + Interview
 */
export async function generateJobAlignmentFinalAudit(data: {
    userName: string;
    jobTitle: string;
    companyName: string;
    diagnosis: unknown;
    researchReport: ResearchReport;
    mcqScore: number;
    interviewAnalysis: InterviewAnalysis;
    interviewChat: { role: string; content: string }[];
}, language: string = 'en') {
    try {
        const { client, model } = await getAI();
        const prompt = `
You are the Chief Executive Talent Auditor for MA-TRAINING-CONSULTING. 
Your mission is to provide a "Definitive Strategic Suitability Audit" for ${data.userName} for the role of ${data.jobTitle} at ${data.companyName}.

**DATA SOURCES (INTEGRATE ALL):**
1. **Initial Assessment (DNA):** ${JSON.stringify(data.diagnosis)}
2. **Company/Market Research:** ${JSON.stringify(data.researchReport)}
3. **Technical Audit (MCQ):** ${data.mcqScore}% accuracy.
4. **Mock Interview Performance:** ${JSON.stringify(data.interviewAnalysis)}
5. **Interview Nuances (Transcript):** ${JSON.stringify(data.interviewChat)}

**REQUIRED ANALYSIS:**
- **The Match:** How does their natural professional DNA (from diagnosis) align with this company's culture and the job's technical pressure?
- **The "Evidence" (Dalail):** Cite specific facts from their interview answers or MCQ performance to prove your point.
- **The Risks:** Where were they most vulnerable?
- **Acceptance Probability (Percentage):** Based on the current market reality and their performance, what is the % chance they will actually be accepted?

${MA_TRAINING_PROMOTION}

**OUTPUT FORMAT (JSON ONLY):**
{
  "verdict": "string (Suitable / Partially Suitable / High Risk - Followed by a 1-sentence executive summary)",
  "suitabilityScore": number (0-100),
  "evidence": ["string (Point 1: Technical proof)", "string (Point 2: Behavioral proof)", "string (Point 3: Cultural proof)"],
  "detailedAnalysis": "string (A masterful 3-parapraph diagnostic synthesis explaining the REAL logic behind this candidacy)"
}

**LANGUAGE:** ${language === 'fr' ? 'French' : language === 'ar' ? 'Arabic' : 'English'}
`;

        const response = await client.chat.completions.create({
            model: model,
            messages: [{ role: 'system', content: 'You are the Chief Talent Auditor. Output raw JSON only.' }, { role: 'user', content: prompt }],
            response_format: { type: 'json_object' }
        });

        const content = response.choices[0].message.content;
        return content ? JSON.parse(content) : null;
    } catch (error) {
        console.error("Final Audit Generation Error:", error);
        throw error;
    }
}

// ─── PROFESSIONAL SIMULATION ──────────────────────────────────────────────────

export async function generateProfessionalSimulation(
    auditResult: unknown,
    formData: { sectors?: string; positions?: { title: string; years: string }[] },
    mcqResults: { hardScore: number; softScore: number; totalQuestions: number } | null,
    language: string = 'en'
) {
    const langMap: Record<string, string> = { en: 'English', fr: 'French', ar: 'Arabic' };
    const lang = langMap[language] || 'English';
    const positions = (formData?.positions || []).map(p => `${p.title} (${p.years} years)`).join(', ');
    const sectors = formData?.sectors || 'Not specified';
    const profileLevel = (auditResult as { profileLevel?: string })?.profileLevel || 'Mid-Level';
    const gaps = ((auditResult as { gaps?: string[] })?.gaps || []).join(', ');

    const prompt = `You are a World-Class Professional Assessment Designer. Generate EXACTLY 10 simulation scenarios for this candidate:

**PROFILE:**
- Sectors: ${sectors}
- Positions: ${positions}
- Level: ${profileLevel}
- Key gaps: ${gaps}
- MCQ Hard: ${mcqResults?.hardScore || 0}, Soft: ${mcqResults?.softScore || 0}

**DISTRIBUTION (MANDATORY):**
- 4 type "hard" → Technical scenarios tied to their actual roles (${positions})
- 4 type "soft" → Behavioral/interpersonal decision scenarios
- 2 type "critical" → High-stakes promotion readiness scenarios

**RULES:**
- ALL scenarios must be realistic and specific to the candidate's sector and positions
- Each scenario has EXACTLY 3 choices (A, B, C). One correct, one acceptable, one wrong.
- Respond in ${lang}.

**OUTPUT (JSON ONLY):**
{
  "scenarios": [
    {
      "id": number,
      "type": "hard" | "soft" | "critical",
      "category": "string",
      "title": "string",
      "context": "string (2-3 sentences, role-specific)",
      "situation": "string (the exact dilemma, present tense)",
      "choices": [
        { "label": "string", "description": "string" },
        { "label": "string", "description": "string" },
        { "label": "string", "description": "string" }
      ],
      "correctChoice": number (0, 1, or 2),
      "consequence": "string (why correct is best, what wrong costs)",
      "promotionRelevance": "string (critical type only)"
    }
  ]
}`;

    try {
        const { client, model } = await getAI();
        const response = await client.chat.completions.create({
            model,
            messages: [
                { role: 'system', content: 'You are a professional assessment designer. Output raw valid JSON only.' },
                { role: 'user', content: prompt },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.7,
            max_tokens: 4000,
        });
        const content = response.choices[0]?.message?.content;
        if (!content) throw new Error('No response from AI');
        const parsed = JSON.parse(content);
        return { success: true, scenarios: parsed.scenarios };
    } catch (error) {
        console.error('Simulation generate error:', error);
        return { success: false, error: 'Failed to generate simulations' };
    }
}

export async function analyzeProfessionalSimulation(
    scenarios: { id: number; type: string; title: string; category: string; correctChoice: number }[],
    answers: number[],
    auditResult: unknown,
    formData: { sectors?: string; positions?: { title: string }[] },
    language: string = 'en'
) {
    const langMap: Record<string, string> = { en: 'English', fr: 'French', ar: 'Arabic' };
    const lang = langMap[language] || 'English';

    const hardScenarios = scenarios.filter(s => s.type === 'hard');
    const softScenarios = scenarios.filter(s => s.type === 'soft');
    const criticalScenarios = scenarios.filter(s => s.type === 'critical');

    const hardScore = hardScenarios.filter(s => answers[scenarios.indexOf(s)] === s.correctChoice).length;
    const softScore = softScenarios.filter(s => answers[scenarios.indexOf(s)] === s.correctChoice).length;
    const criticalScore = criticalScenarios.filter(s => answers[scenarios.indexOf(s)] === s.correctChoice).length;

    const scenariosWithAnswers = scenarios.map((s, i) => ({
        type: s.type,
        title: s.title,
        category: s.category,
        correct: answers[i] === s.correctChoice,
    }));

    const prompt = `You are a Chief Talent Analyst. Analyze this simulation performance:

**CANDIDATE:**
- Sector: ${formData?.sectors || 'Not specified'}
- Positions: ${(formData?.positions || []).map(p => p.title).join(', ')}
- Level: ${(auditResult as { profileLevel?: string })?.profileLevel || 'Mid-Level'}

**SCORES:**
- Technical (Hard): ${hardScore}/4
- Behavioral (Soft): ${softScore}/4
- Critical/Promotion: ${criticalScore}/2

**SCENARIO RESULTS:**
${scenariosWithAnswers.map((s, i) => `${i + 1}. [${s.type.toUpperCase()}] ${s.title} → ${s.correct ? '✓ Correct' : '✗ Wrong'}`).join('\n')}

Respond in ${lang}.

**OUTPUT (JSON):**
{
  "hardSkillScore": ${hardScore},
  "softSkillScore": ${softScore},
  "criticalScore": ${criticalScore},
  "promotionReadiness": "string (2-3 honest sentences about promotion potential)",
  "promotionBlockers": ["string", "string", "string max"],
  "weaknesses": ["string", "string", "string"],
  "overallVerdict": "string (3-4 sentences: honest executive verdict referencing specific wrong decisions)"
}`;

    try {
        const { client, model } = await getAI();
        const response = await client.chat.completions.create({
            model,
            messages: [
                { role: 'system', content: 'You are a chief talent analyst. Output raw valid JSON only.' },
                { role: 'user', content: prompt },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.4,
            max_tokens: 1500,
        });
        const content = response.choices[0]?.message?.content;
        if (!content) throw new Error('No AI response');
        return { success: true, results: JSON.parse(content) };
    } catch (error) {
        console.error('Simulation analyze error:', error);
        return { success: false, error: 'Failed to analyze simulation' };
    }
}

export interface SimulationScenario {
    id: number;
    type: "hard" | "soft" | "critical";
    category: string;
    title: string;
    context: string;
    situation: string;
    choices: { label: string; description: string }[];
    correctChoice: number;
    consequence: string;
    promotionRelevance?: string;
}

export interface SimulationResult {
    scenarios: SimulationScenario[];
    hardSkillScore: number;
    softSkillScore: number;
    criticalScore: number;
    promotionReadiness: string;
    promotionBlockers: string[];
    weaknesses: string[];
    overallVerdict: string;
}

export async function generateUltimateMasterReport(
    auditResult: AuditResult,
    formData: { sectors: string; positions: { title: string; years: string }[] },
    interviewTranscript: InterviewMessage[],
    portfolioTranscript: InterviewMessage[],
    mcqResults: { hardScore: number; softScore: number; totalQuestions: number },
    simulationResult: SimulationResult,
    language: string = 'en'
) {
    const langMap: Record<string, string> = { en: 'English', fr: 'French', ar: 'Arabic' };
    const lang = langMap[language] || 'English';

    const prompt = `You are the Chief Executive Auditor at a prestigious Global Strategic Talent Firm (McKinsey/BCG level). 
Generate a COMPREHENSIVE STRATEGIC CERTIFICATION REPORT for a high-level professional. 

**STRICT REQUIREMENTS:**
1. **Official Tone:** Use extremely professional, clinical, and sophisticated corporate language.
2. **Total Depth:** Analyze the candidate’s professional DNA, tactical maturity, and long-term executive viability.
3. **Internal Logic:** Connect the Audit (claims), the Interview (narrative), the MCQ (knowledge), and the Simulation (behavior).
4. **Consistency:** ALL text content in the report MUST be in ${lang}. DO NOT mix languages.
5. **No Placeholders:** Provide concrete, high-level psychological and strategic insights.

**CANDIDATE DATA CONTEXT:**
- Audit Profile: ${auditResult?.profileLevel} (Authority: ${auditResult?.authorityScore}/100)
- Interview Insights: ${interviewTranscript.slice(-10).map(m => m.content).join(' ')}
- MCQ Performance: Hard Score ${mcqResults?.hardScore}, Soft Score ${mcqResults?.softScore}
- Simulation Analysis: ${simulationResult?.overallVerdict}
- Simulation Blockers: ${simulationResult?.promotionBlockers?.join(', ')}

**JSON OUTPUT STRUCTURE (MANDATORY):**
{
  "title": "string (Official Strategic Certification Title)",
  "subtitle": "string (Professional Designation)",
  "profileSummary": "string (3-4 sentences of deep executive synthesis)",
  "maturityLevel": "string (Executive / Senior Strategist / etc.)",
  "leadershipFingerprint": { 
    "archetype": "string", 
    "description": "string", 
    "riskContext": "string" 
  },
  "selfAwarenessScore": { 
    "score": number (0-100), 
    "verdict": "string", 
    "evidence": "string" 
  },
  "trajectoryVelocity": { 
    "assessment": "string (Accelerating/Stabilizing/etc.)", 
    "rationale": "string" 
  },
  "swot": {
    "strengths": ["string", "string", "string", "string"],
    "weaknesses": ["string", "string", "string"],
    "opportunities": ["string", "string"],
    "threats": ["string", "string"]
  },
  "deepInsights": ["string", "string", "string (hidden cognitive patterns)"],
  "marketValue": "string (Current Valuation vs Potential)",
  "finalVerdict": "string (The ultimate 1-paragraph strategic judgment)",
  "recommendedRoles": ["string", "string"],
  "gapAnalysis": {
    "currentJobVsReality": "string",
    "hardSkillsMatch": number,
    "softSkillsMatch": number,
    "criticalCompetencyGaps": ["string", "string"],
    "comparisonPositionReality": "string"
  },
  "actionPlan90Days": [
    { "week": "Weeks 1-4", "action": "string", "rationale": "string" },
    { "week": "Weeks 5-8", "action": "string", "rationale": "string" },
    { "week": "Weeks 9-12", "action": "string", "rationale": "string" }
  ],
  "careerAdvancement": [
    { "role": "string", "shortTermProbability": number, "longTermProbability": number, "requirements": ["string", "string"] }
  ],
  "authorityVsPotential": { 
    "currentAuthority": number, 
    "futurePotential": number, 
    "quadrant": "string" 
  },
  "strategicRadar": { 
    "technical": number, 
    "leadership": number, 
    "strategy": number, 
    "execution": number, 
    "influence": number 
  },
  "marketPerceptionVerdict": "string",
  "linkedInStrategy": {
    "headline": "string",
    "summaryFocus": "string",
    "networkingAdvice": "string"
  },
  "expertInterviewNotes": ["string", "string (Behavioral notes from AI evaluator)"]
}`;

    try {
        const { client, model } = await getAI();
        const response = await client.chat.completions.create({
            model,
            messages: [
                { role: 'system', content: `You are a high-level Executive Talent Auditor. Return VALID JSON ONLY. Respond in ${lang}.` },
                { role: 'user', content: prompt }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.3,
            max_tokens: 4000,
        });

        const content = response.choices[0]?.message?.content;
        if (!content) throw new Error('AI output empty');
        return { success: true, report: JSON.parse(content) };
    } catch (error) {
        console.error('Finalize all error:', error);
        return { success: false, error: 'Failed to generate ultimate report' };
    }
}

