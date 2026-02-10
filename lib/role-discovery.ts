import OpenAI from 'openai';

const deepseek = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/v1',
});

interface CVAnalysisResult {
    overallScore: number;
    verdict: string;
    overview: string;
    strengths: string[];
    weaknesses: string[];
    skills: {
        technical: string[];
        soft: string[];
        gaps: string[];
    };
    experience: {
        years: number;
        quality: string;
        progression: string;
    };
    education: {
        level: string;
        relevance: string;
        notes: string;
    };
    immediateActions: string[];
    careerPaths: string[];
}

interface InterviewEvaluation {
    accuracyScore: number;
    overallRating: number;
    summary: string;
    cvVsReality: {
        confirmedStrengths: string[];
        exaggerations: string[];
        hiddenStrengths: string[];
    };
    cvImprovements: string[];
    skillDevelopmentPriorities: string[];
    verdict: string;
    seniorityLevel: string;
    suggestedRoles: string[];
}

export async function startRoleDiscoveryInterview(cvAnalysis: CVAnalysisResult, interviewEvaluation: InterviewEvaluation, language: string = 'en') {
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
                    content: `You are a Senior Career Strategist conducting an in-depth professional portfolio analysis.

${languageInstruction}

**CONTEXT:**
You have access to:
1. The candidate's CV analysis (skills, experience, education, strengths, weaknesses)
2. Their first interview evaluation (CV accuracy score, confirmed strengths, detected exaggerations, hidden strengths)

**YOUR MISSION:**
Conduct a strategic 8-question interview to build a COMPLETE understanding of their professional profile. This is NOT just about preferences - it's about understanding:

**CRITICAL AREAS TO EXPLORE:**
1. **Technical Depth**: Probe their ACTUAL expertise level in key skills mentioned in CV
   - Ask for specific examples, projects, challenges solved
   - Understand what they can do independently vs with help
   
2. **Work Style & Environment**: 
   - How they work best (solo vs team, structured vs flexible)
   - Their ideal company culture and size
   - Remote/hybrid/office preferences and why
   
3. **Career Trajectory**:
   - Where they see themselves in 2-3 years
   - Leadership aspirations vs specialist path
   - Industry/domain interests
   
4. **Motivations & Priorities**:
   - What drives them (learning, impact, compensation, recognition)
   - Work-life balance importance
   - Growth vs stability preferences
   
5. **Hidden Capabilities**:
   - Skills they have but didn't emphasize in CV
   - Soft skills and unique strengths
   - Cross-functional experience
   
6. **Realistic Self-Assessment**:
   - What they consider their biggest professional strength
   - Areas they know they need to develop
   - Types of work they excel at vs struggle with

**QUESTIONING STRATEGY:**
- Start broad, then go deep based on their answers
- Ask follow-up questions that reveal TRUE capabilities
- Look for patterns between CV claims and real experience
- Identify gaps between their goals and current skills
- Be conversational but probing
- Each question should build on previous answers

**GOAL:**
By the end, you should have enough data to recommend roles that:
- Match their ACTUAL skills (not just CV claims)
- Align with their TRUE preferences and goals
- Consider their realistic growth trajectory
- Account for both strengths and development areas`
                },
                {
                    role: 'user',
                    content: `CV Analysis: ${JSON.stringify(cvAnalysis)}

Interview Evaluation: ${JSON.stringify(interviewEvaluation)}

Generate:
1. A warm, professional welcome message (2-3 sentences) explaining this deep-dive career discovery phase
2. The first strategic question that starts building their professional profile

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
        };
    } catch (error) {
        console.error('DeepSeek API Error:', error);
        return {
            success: false,
            error: 'Failed to start role discovery',
        };
    }
}

export async function generateRoleDiscoveryQuestion(
    cvAnalysis: CVAnalysisResult,
    interviewEvaluation: InterviewEvaluation,
    conversationHistory: { role: string, content: string }[],
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
                    content: `You are conducting an in-depth professional portfolio analysis interview.

${languageInstruction}

**CURRENT STATUS:** Question ${questionNumber} of ${totalQuestions}

**YOUR TASK:**
Based on ALL previous answers and the data you have, ask the MOST strategic next question to:
1. Fill gaps in your understanding of their professional profile
2. Verify or challenge assumptions from their CV
3. Uncover hidden strengths or weaknesses
4. Understand their true capabilities and preferences

**QUESTION STRATEGY BY STAGE:**

**Questions 1-3 (Foundation):**
- Understand their core technical capabilities with specific examples
- Explore their most significant professional achievements
- Identify what they're genuinely good at vs what's on paper

**Questions 4-6 (Depth):**
- Probe work style, environment preferences, and motivations
- Understand career trajectory and growth aspirations
- Explore industry/domain interests and company culture fit

**Questions 7-8 (Refinement):**
- Address any remaining gaps or contradictions
- Understand development areas and learning goals
- Clarify priorities (growth vs stability, leadership vs specialist, etc.)

**CRITICAL RULES:**
- Build on their PREVIOUS answers - reference what they said
- Ask for SPECIFIC examples when they make claims
- Probe deeper if answers are vague or generic
- Look for consistency between CV, first interview, and current answers
- Each question should reveal something NEW and important
- Avoid redundant or surface-level questions

**EXAMPLES OF GOOD QUESTIONS:**
- "You mentioned [X skill] in your CV. Can you walk me through the most complex project where you used it? What was your specific role?"
- "Based on your experience in [Y], what type of problems do you find most engaging to solve?"
- "You said you want to grow into [Z role]. What specific skills or experiences do you think you're missing to get there?"

**AVOID:**
- Generic questions like "What are your strengths?"
- Questions already answered in previous conversation
- Yes/no questions that don't reveal depth`
                },
                {
                    role: 'user',
                    content: `CV Analysis: ${JSON.stringify(cvAnalysis)}

Interview Evaluation: ${JSON.stringify(interviewEvaluation)}

Conversation so far: ${JSON.stringify(conversationHistory)}

Generate the next strategic discovery question (Question ${questionNumber}/${totalQuestions}).
This question should build on their previous answers and fill important gaps in understanding their professional profile.
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

export async function completeRoleDiscovery(
    cvAnalysis: CVAnalysisResult,
    interviewEvaluation: InterviewEvaluation,
    conversationHistory: { role: string, content: string }[],
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
                    content: `You are a Senior Career Path Strategist and Data Analyst providing PRECISE role recommendations.

**CRITICAL: You MUST respond ONLY with valid JSON. No explanatory text, no markdown, just pure JSON.**

${languageInstruction}
**IMPORTANT: The language instruction above applies ONLY to the text content INSIDE the JSON fields (title, description, etc.). The JSON structure itself must be valid JSON.**

**DATA SOURCES YOU HAVE:**
1. **CV Analysis**: Original skills, experience, education listed
2. **First Interview Evaluation**: 
   - CV Accuracy Score (how truthful their CV is)
   - Confirmed Strengths (skills they actually have)
   - Exaggerations (skills they overstated)
   - Hidden Strengths (capabilities not in CV)
3. **Career Discovery Interview**: 
   - Technical depth and real expertise
   - Work preferences and motivations
   - Career goals and aspirations
   - Self-assessment and development areas

**YOUR MISSION:**
Provide 4-6 HIGHLY ACCURATE role recommendations with REALISTIC match percentages.

**MATCH PERCENTAGE CALCULATION:**
Calculate match percentage based on:
- **40%**: Technical skills match (from interview evaluation, NOT just CV)
- **30%**: Experience level and domain fit
- **20%**: Career preferences and work style alignment
- **10%**: Growth potential and learning curve

**BE BRUTALLY HONEST:**
- If someone has 2 years experience, don't suggest senior roles
- If they exaggerated skills in CV, account for REAL capabilities
- Match percentages should reflect REALITY:
  * 85-100%: Perfect fit, ready immediately
  * 70-84%: Strong fit, minor gaps
  * 55-69%: Moderate fit, some development needed
  * 40-54%: Stretch role, significant upskilling required
  * Below 40%: Not realistic in near term

**ROLE CATEGORIES:**
- **Ready Now (category: 'ready')**: Match ≥ 55%, can start within 0-3 months
- **Future Goals (category: 'future')**: Match 40-70%, achievable in 6-18 months with focused development

**FOR EACH ROLE PROVIDE:**
1. **Title**: Real, specific job title (e.g., "Junior Frontend Developer", not just "Developer")
2. **Match Percentage**: Calculated honestly based on ALL data
3. **Category**: 'ready' or 'future'
4. **Description**: 2-3 sentences on WHY this role fits (reference specific skills/preferences from interviews)
5. **Strengths**: 3-4 SPECIFIC skills they ACTUALLY have (from interview evaluation)
6. **Weaknesses**: 2-3 SPECIFIC gaps they need to fill
7. **Required Competencies**: 4-6 key skills for this role
8. **Time to Ready**: Realistic timeline ("Immediate", "1-2 months", "3-6 months", "6-12 months", "12-18 months")

**CRITICAL RULES:**
✓ Use ACTUAL capabilities from interview evaluation, not CV claims
✓ Consider their stated preferences and goals
✓ Be realistic about experience level
✓ Suggest logical career progression
✓ Account for both technical AND soft skills
✓ Match percentages must be justified by the data
✗ Don't suggest roles they're clearly not qualified for
✗ Don't inflate match percentages to be nice
✗ Don't ignore red flags from interviews

**OUTPUT FORMAT (JSON):**
{
  "roles": [
    {
      "title": "string (specific job title)",
      "matchPercentage": number (40-100, realistic),
      "category": "ready" | "future", (STRICTLY USE THESE TWO VALUES IN ENGLISH)
      "description": "string (why this fits, reference their data)",
      "strengths": ["specific skill they have", "..."],
      "weaknesses": ["specific gap to fill", "..."],
      "requiredCompetencies": ["skill 1", "skill 2", "..."],
      "timeToReady": "string (realistic timeline)"
    }
  ]
}`
                },
                {
                    role: 'user',
                    content: `CV Analysis: ${JSON.stringify(cvAnalysis)}

Interview Evaluation: ${JSON.stringify(interviewEvaluation)}

Career Discovery Conversation: ${JSON.stringify(conversationHistory)}

IMPORTANT: You MUST respond with VALID JSON only. The structure must be exactly as specified in the OUTPUT FORMAT above.
All text content INSIDE the JSON (titles, descriptions, strengths, weaknesses, etc.) must be in ${language}.
The "category" field MUST remain "ready" or "future" in English.
Do NOT add any text before or after the JSON. Do NOT wrap it in markdown code blocks.`
                }
            ],
            temperature: 0.4,
            max_tokens: 2500,
        });

        const result = response.choices[0]?.message?.content;
        if (!result) throw new Error('No response from AI');

        console.log('[Role Discovery] Raw AI response:', result.substring(0, 200));

        // Clean the result more aggressively
        let cleanedResult = result.trim();

        // Remove markdown code blocks
        cleanedResult = cleanedResult.replace(/```json\s*/g, '').replace(/```\s*/g, '');

        // Try to extract JSON if there's text before/after
        const jsonMatch = cleanedResult.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            cleanedResult = jsonMatch[0];
        }

        console.log('[Role Discovery] Cleaned result:', cleanedResult.substring(0, 200));

        let parsed;
        try {
            parsed = JSON.parse(cleanedResult);
        } catch (parseError) {
            console.error('[Role Discovery] JSON Parse Error:', parseError);
            console.error('[Role Discovery] Failed to parse:', cleanedResult);
            throw new Error(`Failed to parse AI response as JSON: ${parseError}`);
        }

        const closingMessages: Record<string, string> = {
            'en': `Perfect! I've analyzed everything and identified the best career paths for you. Let's review your personalized recommendations.`,
            'fr': `Parfait ! J'ai tout analysé et identifié les meilleurs parcours professionnels pour vous. Examinons vos recommandations personnalisées.`,
            'ar': `ممتاز! لقد حللت كل شيء وحددت أفضل المسارات المهنية لك. دعنا نراجع توصياتك الشخصية.`,
            'es': `¡Perfecto! He analizado todo e identificado las mejores trayectorias profesionales para ti. Revisemos tus recomendaciones personalizadas.`,
        };

        return {
            success: true,
            roles: parsed.roles,
            closingMessage: closingMessages[language] || closingMessages['en'],
        };
    } catch (error) {
        console.error('DeepSeek API Error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to complete role discovery',
        };
    }
}
