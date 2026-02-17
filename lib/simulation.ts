import OpenAI from 'openai';

const deepseek = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1',
});

// ✅ Type Definitions
interface RoleData {
    title: string;
    category?: string;
    matchPercentage?: number;
    description?: string;
}

interface CVAnalysis {
    overallScore?: number;
    verdict?: string;
    overview?: string;
    strengths?: string[];
    weaknesses?: string[];
    skills?: {
        technical?: string[];
        soft?: string[];
        gaps?: string[];
    };
    experience?: {
        years?: number;
        quality?: string;
        progression?: string;
    };
    education?: {
        level?: string;
        relevance?: string;
        notes?: string;
    };
    immediateActions?: string[];
    careerPaths?: string[];
}

interface GeneratedCV {
    cvContent?: string;
    coverLetterContent?: string;
}

interface ConversationMessage {
    role: 'user' | 'ai' | 'system';
    content: string;
    timestamp?: Date | string;
}

interface ScenarioResult {
    scenarioNumber: number;
    scenarioTitle?: string;
    evaluation?: {
        planning?: number;
        taskManagement?: number;
        thinking?: number;
        behavior?: number;
        decisionMaking?: number;
        overallScore?: number;
        strengths?: string[];
        improvements?: string[];
        feedback?: string;
    };
    userResponse?: string;
}

// ✅ Helper: Retry mechanism with exponential backoff
async function callAIWithRetry<T>(
    apiCall: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
): Promise<T> {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
            return await apiCall();
        } catch (error) {
            const isLastAttempt = attempt === maxRetries - 1;
            if (isLastAttempt) {
                console.error(`[AI Retry] Failed after ${maxRetries} attempts:`, error);
                throw error;
            }
            
            const delay = baseDelay * Math.pow(2, attempt);
            console.log(`[AI Retry] Attempt ${attempt + 1} failed, retrying in ${delay}ms...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    throw new Error('Retry mechanism failed unexpectedly');
}

// ✅ Helper: Clean and parse JSON response
function parseAIResponse<T = Record<string, unknown>>(rawResponse: string, context: string): T {
    console.log(`[${context}] Raw AI response:`, rawResponse.substring(0, 200));
    
    let cleanedResult = rawResponse.trim();
    cleanedResult = cleanedResult.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    
    const jsonMatch = cleanedResult.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        cleanedResult = jsonMatch[0];
    }
    
    console.log(`[${context}] Cleaned result:`, cleanedResult.substring(0, 200));
    
    try {
        return JSON.parse(cleanedResult) as T;
    } catch (parseError) {
        console.error(`[${context}] JSON Parse Error:`, parseError);
        console.error(`[${context}] Failed to parse:`, cleanedResult);
        throw new Error(`Failed to parse AI response as JSON: ${parseError}`);
    }
}

export async function startSimulation(
    selectedRole: RoleData,
    cvAnalysis: CVAnalysis,
    generatedCV: GeneratedCV,
    language: string = 'en',
    scenarioNumber: number = 1
) {
    try {
        const languageInstructions: Record<string, string> = {
            'en': 'Respond in English.',
            'fr': 'Répondez en français.',
            'ar': 'أجب باللغة العربية.',
            'es': 'Responde en español.',
        };

        const languageInstruction = languageInstructions[language] || languageInstructions['en'];
        const scenarioType = scenarioNumber <= 2 ? 'MAJOR' : 'MINOR';
        const scenarioComplexity = scenarioType === 'MAJOR' ? 'complex, multi-faceted' : 'focused, specific';

        const response = await callAIWithRetry(() => 
            deepseek.chat.completions.create({
                model: 'deepseek-chat',
                messages: [
                    {
                        role: 'system',
                        content: `You are a Senior Role Simulation Coach creating realistic workplace scenarios.

${languageInstruction}

**ROLE CONTEXT:**
The candidate is practicing for: "${selectedRole.title}"

**SCENARIO TYPE:** ${scenarioType}
- **MAJOR Scenarios (1-2)**: Complex, multi-step situations requiring strategic thinking, planning, and multiple decisions
- **MINOR Scenarios (3-4)**: Focused, specific situations testing particular skills or behaviors

**YOUR TASK:**
Create a ${scenarioComplexity} real-world scenario for "${selectedRole.title}" that tests:

**FOR MAJOR SCENARIOS:**
1. **Strategic Planning**: Ability to create comprehensive plans
2. **Task Prioritization**: Managing multiple competing priorities
3. **Decision Making**: Making tough calls with incomplete information
4. **Stakeholder Management**: Handling different personalities and expectations
5. **Problem Solving**: Creative solutions to complex problems

**FOR MINOR SCENARIOS:**
1. **Specific Skill**: One key competency (communication, technical, leadership, etc.)
2. **Quick Thinking**: Rapid response to a focused situation
3. **Behavioral Response**: How they handle a specific interaction

**SCENARIO REQUIREMENTS:**
- **Realistic**: Based on actual ${selectedRole.title} responsibilities
- **Challenging**: Push them to demonstrate real capabilities
- **Measurable**: Clear criteria for evaluation
- **Relevant**: Aligned with role requirements
- **Engaging**: Interesting and thought-provoking
 
**CRITICAL: You MUST respond ONLY with valid JSON. No explanatory text, no markdown, just pure JSON.**
**IMPORTANT: The language instruction applies ONLY to the text content INSIDE the JSON fields.**`
                    },
                    {
                        role: 'user',
                        content: `Role: ${selectedRole.title}
CV Analysis: ${JSON.stringify(cvAnalysis)}
Scenario Number: ${scenarioNumber} (${scenarioType})

Create:
1. A warm welcome message introducing the simulation
2. A detailed ${scenarioType} scenario for this role

IMPORTANT: You MUST respond with VALID JSON only.
Respond in JSON format:
{
  "welcomeMessage": "string",
  "scenario": "string (detailed scenario description)",
  "scenarioType": "${scenarioType}",
  "expectedSkills": ["skill1", "skill2", ...]
}`
                    }
                ],
                temperature: 0.7,
                max_tokens: 2000,
            })
        );

        const result = response.choices[0]?.message?.content;
        if (!result) throw new Error('No response from AI');

        const parsed = parseAIResponse<{
            welcomeMessage: string;
            scenario: string;
            scenarioType: string;
            expectedSkills: string[];
        }>(result, 'Simulation Start');

        return {
            success: true,
            welcomeMessage: parsed.welcomeMessage,
            scenario: parsed.scenario,
            scenarioType: parsed.scenarioType,
            expectedSkills: parsed.expectedSkills || []
        };
    } catch (error) {
        console.error('DeepSeek API Error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to start simulation',
        };
    }
}

// ✅ NEW: Generate interactive follow-up question based on user response
export async function generateFollowUpQuestion(
    selectedRole: RoleData,
    scenario: string,
    userResponse: string,
    conversationHistory: ConversationMessage[],
    language: string = 'en',
    questionNumber: number = 1
) {
    try {
        const languageInstructions: Record<string, string> = {
            'en': 'Respond in English. Act as a supportive expert coach.',
            'fr': 'Répondez en français. Agissez comme un coach expert bienveillant.',
            'ar': 'أجب باللغة العربية. تصرف كمدرب خبير داعم.',
            'es': 'Responde en español. Actúa como un entrenador experto solidario.',
        };

        const languageInstruction = languageInstructions[language] || languageInstructions['en'];

        const response = await callAIWithRetry(() =>
            deepseek.chat.completions.create({
                model: 'deepseek-chat',
                messages: [
                    {
                        role: 'system',
                        content: `You are an Expert Career Coach conducting a LIVE interactive simulation session.

${languageInstruction}

**YOUR ROLE:**
You are NOT just evaluating - you are COACHING the participant through the scenario in REAL-TIME.

**COACHING APPROACH:**
1. **Acknowledge** their response (positive reinforcement)
2. **Probe Deeper** with a thoughtful follow-up question
3. **Guide** them to think more strategically
4. **Challenge** them to consider edge cases or alternatives

**FOLLOW-UP QUESTION TYPES:**
- "Great start! How would you handle [specific edge case]?"
- "Interesting approach. What if [complication] occurred?"
- "I like your thinking. Can you elaborate on [specific detail]?"
- "Good point. How would you prioritize between [option A] and [option B]?"

**TONE:**
- Supportive and encouraging
- Professional but warm
- Genuinely curious about their thinking
- Like a mentor in a real coaching session

**CRITICAL: You MUST respond ONLY with valid JSON. No explanatory text, no markdown, just pure JSON.**
**IMPORTANT: The language instruction applies ONLY to the text content INSIDE the JSON fields.**`
                    },
                    {
                        role: 'user',
                        content: `Role: ${selectedRole.title}
Scenario: ${scenario}
User's Response: ${userResponse}
Conversation History: ${JSON.stringify(conversationHistory)}
Follow-up Question Number: ${questionNumber} of 2

Generate a thoughtful follow-up question that:
1. Acknowledges their response
2. Probes deeper into their thinking
3. Challenges them to consider additional factors

IMPORTANT: You MUST respond with VALID JSON only.
Respond in JSON format:
{
  "followUpQuestion": "string (your coaching follow-up question)",
  "focusArea": "string (what aspect you're probing: planning/thinking/behavior/etc)"
}`
                    }
                ],
                temperature: 0.6,
                max_tokens: 500,
            })
        );

        const result = response.choices[0]?.message?.content;
        if (!result) throw new Error('No response from AI');

        const parsed = parseAIResponse<{
            followUpQuestion: string;
            focusArea: string;
        }>(result, 'Follow-up Question');

        return {
            success: true,
            followUpQuestion: parsed.followUpQuestion,
            focusArea: parsed.focusArea
        };
    } catch (error) {
        console.error('DeepSeek API Error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to generate follow-up question',
        };
    }
}

export async function evaluateResponse(
    selectedRole: RoleData,
    cvAnalysis: CVAnalysis,
    scenarioNumber: number,
    userResponse: string,
    conversationHistory: ConversationMessage[],
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
        const scenarioType = scenarioNumber <= 2 ? 'MAJOR' : 'MINOR';

        const response = await callAIWithRetry(() =>
            deepseek.chat.completions.create({
                model: 'deepseek-chat',
                messages: [
                    {
                        role: 'system',
                        content: `You are an Expert Performance Evaluator assessing role simulation responses.

**CRITICAL: You MUST respond ONLY with valid JSON. No explanatory text, no markdown, just pure JSON.**

${languageInstruction}
**IMPORTANT: The language instruction above applies ONLY to the text content INSIDE the JSON fields. The JSON structure itself must be valid JSON.**

**EVALUATION CONTEXT:**
Role: ${selectedRole.title}
Scenario Type: ${scenarioType}

**YOUR TASK:**
Evaluate the candidate's COMPLETE response (including all follow-up answers) across 5 dimensions:

1. **Planning (1-10)**:
   - Do they have a structured approach?
   - Is there a clear step-by-step plan?
   - Did they consider all aspects?

2. **Task Management (1-10)**:
   - How well do they prioritize?
   - Can they manage multiple tasks?
   - Do they allocate resources effectively?

3. **Thinking (1-10)**:
   - Is their reasoning logical?
   - Do they consider alternatives?
   - Are they strategic or reactive?

4. **Behavior (1-10)**:
   - Professional communication?
   - Appropriate tone and approach?
   - Stakeholder awareness?

5. **Decision Making (1-10)**:
   - Sound judgments?
   - Based on available information?
   - Consider risks and benefits?

**SCORING GUIDELINES:**
- **9-10**: Exceptional - Industry best practices
- **7-8**: Strong - Above average performance
- **5-6**: Adequate - Meets basic requirements
- **3-4**: Needs Improvement - Significant gaps
- **1-2**: Poor - Major deficiencies

**FEEDBACK REQUIREMENTS:**
- **Specific**: Reference exact parts of their response
- **Actionable**: Tell them HOW to improve
- **Balanced**: Acknowledge strengths AND weaknesses
- **Constructive**: Encourage growth

**OUTPUT FORMAT (JSON):**
{
  "scenarioTitle": "string (brief title of the scenario)",
  "evaluation": {
    "planning": number (1-10),
    "taskManagement": number (1-10),
    "thinking": number (1-10),
    "behavior": number (1-10),
    "decisionMaking": number (1-10),
    "overallScore": number (average of above),
    "strengths": ["specific strength 1", "specific strength 2"],
    "improvements": ["specific improvement 1", "specific improvement 2"],
    "feedback": "string (detailed constructive feedback)"
  },
  "feedback": "string (conversational feedback message to the user)"
}`
                    },
                    {
                        role: 'user',
                        content: `Role: ${selectedRole.title}
Scenario Number: ${scenarioNumber}
Full Conversation History (including follow-ups): ${JSON.stringify(conversationHistory)}
User's Final Response: ${userResponse}

IMPORTANT: You MUST respond with VALID JSON only. The structure must be exactly as specified in the OUTPUT FORMAT above.
All text content INSIDE the JSON must be in ${language}.
Do NOT add any text before or after the JSON. Do NOT wrap it in markdown code blocks.

Evaluate this COMPLETE response now (including all follow-up interactions).`
                    }
                ],
                temperature: 0.4,
                max_tokens: 2000,
            })
        );

        const result = response.choices[0]?.message?.content;
        if (!result) throw new Error('No response from AI');

        const parsed = parseAIResponse<{
            scenarioTitle: string;
            evaluation: {
                planning: number;
                taskManagement: number;
                thinking: number;
                behavior: number;
                decisionMaking: number;
                overallScore: number;
                strengths: string[];
                improvements: string[];
                feedback: string;
            };
            feedback: string;
        }>(result, 'Simulation Evaluation');

        return {
            success: true,
            scenarioTitle: parsed.scenarioTitle,
            evaluation: parsed.evaluation,
            feedback: parsed.feedback,
        };
    } catch (error) {
        console.error('DeepSeek API Error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to evaluate response',
        };
    }
}

export async function generateNextScenario(
    selectedRole: RoleData,
    cvAnalysis: CVAnalysis,
    scenarioNumber: number,
    previousResults: ScenarioResult[],
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
        const scenarioType = scenarioNumber <= 2 ? 'MAJOR' : 'MINOR';

        const response = await callAIWithRetry(() =>
            deepseek.chat.completions.create({
                model: 'deepseek-chat',
                messages: [
                    {
                        role: 'system',
                        content: `You are creating the next simulation scenario.

${languageInstruction}

**CONTEXT:**
Role: ${selectedRole.title}
Scenario ${scenarioNumber} of 4 (${scenarioType})

**PREVIOUS PERFORMANCE:**
${JSON.stringify(previousResults)}

**CRITICAL: You MUST respond ONLY with valid JSON. No explanatory text, no markdown, just pure JSON.**
**IMPORTANT: The language instruction applies ONLY to the text content INSIDE the JSON fields.**

**YOUR TASK:**
Based on their previous performance, create a ${scenarioType} scenario that:
- Tests areas where they showed weakness
- Builds on their strengths
- Provides growth opportunities
- Remains realistic and relevant to ${selectedRole.title}

**${scenarioType} SCENARIO CHARACTERISTICS:**
${scenarioType === 'MAJOR' ?
                            '- Complex, multi-step situation\n- Requires strategic planning\n- Multiple stakeholders\n- Competing priorities\n- 3-5 minute response expected' :
                            '- Focused, specific situation\n- Tests one key skill\n- Quick decision needed\n- 1-2 minute response expected'
                        }`
                    },
                    {
                        role: 'user',
                        content: `Create scenario ${scenarioNumber} (${scenarioType}) for ${selectedRole.title}.

IMPORTANT: You MUST respond with VALID JSON only.
Respond in JSON format:
{
  "scenario": "string (detailed scenario)",
  "focusAreas": ["area1", "area2"]
}`
                    }
                ],
                temperature: 0.7,
                max_tokens: 2000,
            })
        );

        const result = response.choices[0]?.message?.content;
        if (!result) throw new Error('No response from AI');

        const parsed = parseAIResponse<{
            scenario: string;
            focusAreas: string[];
        }>(result, 'Next Scenario');

        return {
            success: true,
            scenario: parsed.scenario,
            focusAreas: parsed.focusAreas || []
        };
    } catch (error) {
        console.error('DeepSeek API Error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to generate next scenario',
        };
    }
}

export async function completeSimulation(
    selectedRole: RoleData,
    cvAnalysis: CVAnalysis,
    scenarioResults: ScenarioResult[],
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

        const response = await callAIWithRetry(() =>
            deepseek.chat.completions.create({
                model: 'deepseek-chat',
                messages: [
                    {
                        role: 'system',
                        content: `You are a Senior Career Coach providing final simulation assessment.

**CRITICAL: You MUST respond ONLY with valid JSON. No explanatory text, no markdown, just pure JSON.**

${languageInstruction}
**IMPORTANT: The language instruction above applies ONLY to the text content INSIDE the JSON fields. The JSON structure itself must be valid JSON.**

**YOUR TASK:**
Analyze ALL scenario results and provide a comprehensive final report.

**CALCULATE:**
1. **Overall Score**: Average of all scenario scores
2. **Skill Scores**: Average for each of the 5 dimensions
3. **Readiness Level**: Percentage ready for ${selectedRole.title} (0-100%)
4. **Performance Rank**: Beginner / Intermediate / Advanced / Expert

**PROVIDE:**
- **Key Strengths**: Top 3-5 consistent strengths across scenarios
- **Areas to Improve**: Top 3-5 areas needing development
- **Recommendations**: Specific, actionable advice for improvement
- **Next Steps**: What they should focus on next

**READINESS CALCULATION:**
- 90-100%: Expert - Ready to excel in senior positions
- 75-89%: Advanced - Ready for the role with minor gaps
- 60-74%: Intermediate - Ready with some development needed
- 40-59%: Beginner - Significant preparation required
- Below 40%: Not ready - Major skill gaps

**OUTPUT FORMAT (JSON):**
{
  "overallScore": number (1-10, average of all scenarios),
  "readinessLevel": number (0-100),
  "rank": "Beginner" | "Intermediate" | "Advanced" | "Expert",
  "skillScores": {
    "planning": number (1-10),
    "taskManagement": number (1-10),
    "thinking": number (1-10),
    "behavior": number (1-10),
    "decisionMaking": number (1-10)
  },
  "keyStrengths": ["strength 1", "strength 2", "strength 3"],
  "areasToImprove": ["area 1", "area 2", "area 3"],
  "recommendations": "string (detailed recommendations)",
  "nextSteps": ["step 1", "step 2", "step 3"]
}`
                    },
                    {
                        role: 'user',
                        content: `Role: ${selectedRole.title}
All Scenario Results: ${JSON.stringify(scenarioResults)}

IMPORTANT: You MUST respond with VALID JSON only. The structure must be exactly as specified in the OUTPUT FORMAT above.
All text content INSIDE the JSON must be in ${language}.
Do NOT add any text before or after the JSON. Do NOT wrap it in markdown code blocks.

Generate the final comprehensive report now.`
                    }
                ],
                temperature: 0.4,
                max_tokens: 2000,
            })
        );

        const result = response.choices[0]?.message?.content;
        if (!result) throw new Error('No response from AI');

        const parsed = parseAIResponse<{
            overallScore: number;
            readinessLevel: number;
            rank: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
            skillScores: {
                planning: number;
                taskManagement: number;
                thinking: number;
                behavior: number;
                decisionMaking: number;
            };
            keyStrengths: string[];
            areasToImprove: string[];
            recommendations: string;
            nextSteps: string[];
        }>(result, 'Simulation Complete');

        const completionMessages: Record<string, string> = {
            'en': `Congratulations! You've completed all simulation scenarios. Your overall performance score is ${parsed.overallScore.toFixed(1)}/10. Review your detailed report below.`,
            'fr': `Félicitations ! Vous avez terminé tous les scénarios de simulation. Votre score de performance global est de ${parsed.overallScore.toFixed(1)}/10. Consultez votre rapport détaillé ci-dessous.`,
            'ar': `تهانينا! لقد أكملت جميع سيناريوهات المحاكاة. درجة أدائك الإجمالية هي ${parsed.overallScore.toFixed(1)}/10. راجع تقريرك المفصل أدناه.`,
            'es': `¡Felicitaciones! Has completado todos los escenarios de simulación. Tu puntuación de rendimiento general es ${parsed.overallScore.toFixed(1)}/10. Revisa tu informe detallado a continuación.`,
        };

        return {
            success: true,
            report: parsed,
            completionMessage: completionMessages[language] || completionMessages['en'],
        };
    } catch (error) {
        console.error('DeepSeek API Error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to complete simulation',
        };
    }
}
