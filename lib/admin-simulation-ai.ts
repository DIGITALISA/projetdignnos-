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

export async function generateSimulationMissionAI(diagnosis: any, missionType: string, language: string = 'en') {
    try {
        const { client, model } = await getAI();

        const systemPrompt = `You are an elite Career Coach and Simulation Designer. Your task is to design a personalized career simulation mission for a professional based on their CV analysis and diagnostic results.
        
        The mission should target the user's career path: "${missionType}".
        
        **USER DIAGNOSTIC CONTEXT:**
        ${JSON.stringify(diagnosis.analysis)}
        
        **DESIGN REQUIREMENTS:**
        1. **Title**: Catchy, high-stakes professional title (e.g., "The Boardroom Crisis", "Strategic Market Expansion").
        2. **Role & Company**: Invent a realistic role and company that fits the user's target career path but challenges them 2 levels above their current state.
        3. **Briefing**: A compelling 200-300 word executive briefing that sets the scene, details the challenge, and explains why this user was "hired" for this mission.
        4. **Objectives (Roadmap)**: 4-6 strategic steps the user must complete. Each objective should be a clear milestone.
        5. **Price**: A recommended fee between 149 and 399 TND based on the complexity.
        
        **OUTPUT FORMAT (JSON ONLY):**
        {
          "title": "string",
          "role": "string",
          "company": "string",
          "briefing": "string",
          "objectives": [
            { "title": "Objective 1 title" },
            { "title": "Objective 2 title" }
          ],
          "price": number
        }
        
        Respond ONLY in valid JSON. All text content must be in ${language === 'ar' ? 'Arabic' : language === 'fr' ? 'French' : 'English'}.`;

        const response = await client.chat.completions.create({
            model: model,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: `Generate a custom simulation for a ${missionType} path.` }
            ],
            temperature: 0.8,
            max_tokens: 2000,
        });

        const content = response.choices[0]?.message?.content;
        if (!content) throw new Error("No response from AI");

        console.log("AI Simulation Generation response:", content);

        try {
            // Find JSON in the response
            const jsonStart = content.indexOf('{');
            const jsonEnd = content.lastIndexOf('}');
            if (jsonStart === -1 || jsonEnd === -1) {
                throw new Error("AI response did not contain valid JSON: " + content);
            }
            const jsonStr = content.substring(jsonStart, jsonEnd + 1);
            return JSON.parse(jsonStr);
        } catch (parseError) {
            console.error("Failed to parse AI mission response:", content);
            throw new Error("Invalid format received from AI. Please try again.");
        }
    } catch (error: any) {
        console.error("AI Generation Critical Error:", error);
        throw error;
    }
}
