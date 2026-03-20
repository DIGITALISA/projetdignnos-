import { getAI } from './deepseek'; // Ensure getAI is exported

export async function generateProfessionalSmartAcademyStructure(
    gaps: string[],
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
                    content: `You are an Executive Academic Dean and Strategic Gap Specialist. Your mission is to build a "Smart Academy" curriculum for a senior professional to address their specific critical skill gaps.

**INPUT:**
- The candidate's discovered Critical Gaps from their diagnosis.

**OUTPUT STRUCTURE (JSON):**
{
  "themes": [
    {
      "id": number,
      "title": "string (Executive Module Title)",
      "description": "string (Why this solves their specific gap)",
      "lessonCount": number,
      "icon": "string (Lucide icon name: e.g., Brain, Target, Zap, ShieldCheck, Flame, Rocket)"
    }
  ]
}

- Create exactly 3-4 Themes directly addressing the provided gaps.
- Themes must feel like "Executive Masterclasses".
- Tone: Serious, professional, and transformative.
${languageInstruction}`
                },
                {
                    role: 'user',
                    content: `Here are my Critical Competency Gaps identified in my diagnosis:
${JSON.stringify(gaps)}

Generate my Executive Smart Academy Curriculum.`
                }
            ],
            temperature: 0.7,
        });

        const result = response.choices[0]?.message?.content;
        if (!result) throw new Error('No response');
        return { success: true, structure: JSON.parse(result) };
    } catch (e: unknown) {
        return { success: false, error: e instanceof Error ? e.message : 'Failed to generate academy structure' };
    }
}

export async function generateProfessionalSmartAcademyModule(
    themeTitle: string,
    gaps: string[],
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
                    content: `You are an Elite Executive Coach delivering a Masterclass on a specific strategic theme.

**OUTPUT STRUCTURE (JSON):**
{
  "title": "string",
  "slides": [
    {
      "id": number,
      "title": "string (Heading)",
      "content": "string (Main instructional content - deep and insightful)",
      "practicalTakeaway": "string (Actionable advice right now)",
      "strategicInsight": "string (High-level theoretical or systemic understanding)"
    }
  ]
}

- Generate exactly 5-8 slides.
- Content must be high-yield, addressing the user's gaps.
- Tone: Direct, executive, no fluff.
${languageInstruction}`
                },
                {
                    role: 'user',
                    content: `Deliver the masterclass for the theme: "${themeTitle}".
Keep in mind these were my original gaps: ${JSON.stringify(gaps)}`
                }
            ],
            temperature: 0.7,
        });

        const result = response.choices[0]?.message?.content;
        if (!result) throw new Error('No response');
        
        let parsedResult;
        try {
            parsedResult = JSON.parse(result);
        } catch {
             // Basic fallback
             parsedResult = { title: themeTitle, slides: [] };
        }
        
        return { success: true, content: parsedResult.slides };
    } catch (e: unknown) {
        return { success: false, error: e instanceof Error ? e.message : 'Failed to generate slide module' };
    }
}
