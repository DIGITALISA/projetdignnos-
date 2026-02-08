import OpenAI from 'openai';

const deepseek = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1',
});

export async function startSimulation(
    selectedRole: any,
    cvAnalysis: any,
    generatedCV: any,
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

        // Determine scenario type (major or minor)
        const scenarioType = scenarioNumber <= 2 ? 'MAJOR' : 'MINOR';
        const scenarioComplexity = scenarioType === 'MAJOR' ? 'complex, multi-faceted' : 'focused, specific';

        const response = await deepseek.chat.completions.create({
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

**EVALUATION CRITERIA:**
You will assess their response on:
1. **Planning** (1-10): Do they have a clear, structured approach?
2. **Task Management** (1-10): How well do they prioritize and organize?
3. **Thinking** (1-10): Is their reasoning logical and strategic?
4. **Behavior** (1-10): Professional, appropriate, effective communication?
5. **Decision Making** (1-10): Sound judgments based on available info?
 
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
        });

        const result = response.choices[0]?.message?.content;
        if (!result) throw new Error('No response from AI');

        console.log('[Simulation Start] Raw AI response:', result.substring(0, 200));

        // Clean the result more aggressively
        let cleanedResult = result.trim();
        cleanedResult = cleanedResult.replace(/```json\s*/g, '').replace(/```\s*/g, '');

        // Try to extract JSON if there's text before/after
        const jsonMatch = cleanedResult.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            cleanedResult = jsonMatch[0];
        }

        console.log('[Simulation Start] Cleaned result:', cleanedResult.substring(0, 200));

        let parsed;
        try {
            parsed = JSON.parse(cleanedResult);
        } catch (parseError) {
            console.error('[Simulation Start] JSON Parse Error:', parseError);
            console.error('[Simulation Start] Failed to parse:', cleanedResult);
            throw new Error(`Failed to parse AI response as JSON: ${parseError}`);
        }

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

export async function evaluateResponse(
    selectedRole: any,
    cvAnalysis: any,
    scenarioNumber: number,
    userResponse: string,
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
        const scenarioType = scenarioNumber <= 2 ? 'MAJOR' : 'MINOR';

        const response = await deepseek.chat.completions.create({
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
Evaluate the candidate's response across 5 dimensions:

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
Conversation History: ${JSON.stringify(conversationHistory)}
User Response: ${userResponse}

IMPORTANT: You MUST respond with VALID JSON only. The structure must be exactly as specified in the OUTPUT FORMAT above.
All text content INSIDE the JSON must be in ${language}.
Do NOT add any text before or after the JSON. Do NOT wrap it in markdown code blocks.

Evaluate this response now.`
                }
            ],
            temperature: 0.4,
            max_tokens: 2000,
        });

        const result = response.choices[0]?.message?.content;
        if (!result) throw new Error('No response from AI');

        console.log('[Simulation] Raw AI response:', result.substring(0, 200));

        let cleanedResult = result.trim();
        cleanedResult = cleanedResult.replace(/```json\s*/g, '').replace(/```\s*/g, '');

        const jsonMatch = cleanedResult.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            cleanedResult = jsonMatch[0];
        }

        console.log('[Simulation] Cleaned result:', cleanedResult.substring(0, 200));

        let parsed;
        try {
            parsed = JSON.parse(cleanedResult);
        } catch (parseError) {
            console.error('[Simulation] JSON Parse Error:', parseError);
            console.error('[Simulation] Failed to parse:', cleanedResult);
            throw new Error(`Failed to parse AI response as JSON: ${parseError}`);
        }

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
    selectedRole: any,
    cvAnalysis: any,
    scenarioNumber: number,
    previousResults: any[],
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

        const response = await deepseek.chat.completions.create({
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
        });

        const result = response.choices[0]?.message?.content;
        if (!result) throw new Error('No response from AI');

        console.log('[Next Scenario] Raw AI response:', result.substring(0, 200));

        let cleanedResult = result.trim();
        cleanedResult = cleanedResult.replace(/```json\s*/g, '').replace(/```\s*/g, '');

        const jsonMatch = cleanedResult.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            cleanedResult = jsonMatch[0];
        }

        let parsed;
        try {
            parsed = JSON.parse(cleanedResult);
        } catch (parseError) {
            console.error('[Next Scenario] JSON Parse Error:', parseError);
            console.error('[Next Scenario] Failed to parse:', cleanedResult);
            throw new Error(`Failed to parse AI response as JSON: ${parseError}`);
        }

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
    selectedRole: any,
    cvAnalysis: any,
    scenarioResults: any[],
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
        });

        const result = response.choices[0]?.message?.content;
        if (!result) throw new Error('No response from AI');

        console.log('[Simulation Complete] Raw AI response:', result.substring(0, 200));

        let cleanedResult = result.trim();
        cleanedResult = cleanedResult.replace(/```json\s*/g, '').replace(/```\s*/g, '');

        const jsonMatch = cleanedResult.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            cleanedResult = jsonMatch[0];
        }

        let parsed;
        try {
            parsed = JSON.parse(cleanedResult);
        } catch (parseError) {
            console.error('[Simulation Complete] JSON Parse Error:', parseError);
            console.error('[Simulation Complete] Failed to parse:', cleanedResult);
            throw new Error(`Failed to parse AI response as JSON: ${parseError}`);
        }

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
