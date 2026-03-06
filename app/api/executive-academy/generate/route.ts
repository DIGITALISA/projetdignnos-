import { NextRequest, NextResponse } from "next/server";
import { generateDeepSeekChat } from "@/lib/deepseek";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { report, language } = body;

        const systemPrompt = `You are a Grand Master of the Strategic Academy. Based on the user's professional diagnostic report, create a personal ELITE ACADEMY.
        The academy must include:
        1. A Curriculum with 3 high-level strategic modules. Each module needs:
           - A sharp title.
           - Recommended duration.
           - 4 tactical topics.
           - ONE practical "Field Assignment" (Real-world task). Ensure there is exactly ONE assignment for EACH module in the same order.
        2. 5 Strategic Professional Advices (Elite, brutal, and effective).
        3. ONE Premium Consultancy Paragraph (A holistic strategic view of their career potential).

        Return ONLY a JSON object:
        {
          "curriculum": {
            "title": "Academy Title (Personalized)",
            "description": "Short vision",
            "modules": [{ "title": "...", "duration": "...", "topics": ["..."] }],
            "assignments": [{ "title": "Assignment Title", "task": "...", "objective": "..." }]
          },
          "strategicAdvice": ["..."],
          "premiumConsultancy": "..."
        }
        Language: ${language || 'ar'}. Be elite and authoritative.`;

        const userPrompt = `DIAGNOSTIC_REPORT: ${JSON.stringify(report)}`;

        const response: any = await generateDeepSeekChat([
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ]);

        const content = response.choices[0].message.content;
        const jsonStr = content.match(/\{[\s\S]*\}/)?.[0] || content;
        const academy = JSON.parse(jsonStr);

        return NextResponse.json({ success: true, academy });
    } catch (error: any) {
        console.error("Academy API Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
