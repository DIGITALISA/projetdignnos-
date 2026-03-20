import { getAI } from './deepseek';

export async function generateProfessionalSmartCoach(
    diagnosisData: unknown,
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
                    content: `You are an Elite Executive Career Coach. Your task is to provide a "Free Executive Consultation" based on the user's career diagnosis.

**OUTPUT STRUCTURE (JSON ONLY):**
{
  "expertVerdict": "string (A powerful, 2-3 sentence overarching verdict on their career potential and immediate blocker)",
  "roadmap": [
    {
      "phase": "string (e.g., Immediate (Next 30 Days), Short-term (3 Months), Medium-term (6 Months), Strategic (1 Year))",
      "focus": "string (The main theme of this phase)",
      "actions": ["string (3 highly specific, actionable steps)"],
      "mindsetShift": "string (The psychological or perspective shift required for this phase)"
    }
  ],
  "coachAdvice": [
    {
      "topic": "string (e.g., Leadership, Risk Management, Networking)",
      "advice": "string (Deep executive advice)",
      "icon": "string (Lucide icon name: e.g., Brain, Target, Compass, Zap, ShieldAlert, Rocket, Key)"
    }
  ]
}

- The roadmap MUST have exactly 4 phases representing time progression.
- The coachAdvice MUST have 3-4 distinct deep-dive strategic points.
- Tone: Mentor, Executive, Transformative, High-Stakes.
${languageInstruction}`
                },
                {
                    role: 'user',
                    content: `Here is my Career Diagnosis Data:
${JSON.stringify(diagnosisData)}

Provide my Executive Smart Coach session.`
                }
            ],
            temperature: 0.7,
        });

        const result = response.choices[0]?.message?.content;
        if (!result) throw new Error('No response');
        return { success: true, consultation: JSON.parse(result) };
    } catch (e: unknown) {
        return { success: false, error: e instanceof Error ? e.message : 'Failed to generate coach consultation' };
    }
}
