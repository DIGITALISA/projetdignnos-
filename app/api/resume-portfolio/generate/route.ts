import { NextRequest, NextResponse } from "next/server";
import { generateDeepSeekChat } from "@/lib/deepseek";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { profile, readiness, report, language } = body;

        const systemPrompt = `You are a world-class Elite Career Coach and ATS-Resume Optimization Expert. 
Your goal is to generate an ATS-optimized professional Resume and a modern Portfolio structure for a high-level executive based on their diagnostic report, readiness data, and profile.
You will receive:
1. Profile Information
2. Readiness Data (if available)
3. Final Strategic Verdict Report (if available)

Your response MUST be in strictly well-formed JSON format with the following structure:
{
  "resume": {
    "header": {
      "fullName": "If missing in profile, use placeholders e.g. [Full Name]",
      "professionalTitle": "E.g. Senior Marketing Strategy Director",
      "summary": "ATS-friendly impactful professional summary (3-4 sentences)",
      "contact": { "email": "", "phone": "", "linkedin": "", "location": "" }
    },
    "experience": [
      {
        "title": "Role Title",
        "company": "Company Name or placeholder",
        "date": "YYYY - YYYY or Present",
        "achievements": ["Action verb driven achievement with metrics", "Led strategy..."]
      }
    ],
    "skills": {
      "technical": ["Technical Skill 1", "Technical Skill 2"],
      "soft": ["Leadership Skill 1", "Leadership Skill 2"]
    },
    "education": [
      {
        "degree": "Degree Level and Name",
        "institution": "Institution Name",
        "year": "YYYY"
      }
    ]
  },
  "portfolio": {
    "introduction": "A magnetic headline and intro for their personal website",
    "keyProjects": [
      {
        "title": "Project Name",
        "description": "Short description of the challenge and solution",
        "impact": "Metrics or strategic value generated",
        "tags": ["strategy", "leadership"]
      }
    ],
    "leadershipPhilosophy": "A short, powerful statement about their leadership style",
    "recommendedLayout": "A short description of how they should design their portfolio visually to match their profile archetype (e.g. Dark Minimalist, Glassmorphism Corporate...)"
  }
}

Be direct, rigorous, and extremely professional. Ensure keywords from their strengths and maturity level (if found in diagnostic report) are heavily integrated and highlighted for ATS systems. Use the language: ${language === 'ar' ? 'Arabic' : 'English'}, but keep technical keys in JSON structure exactly as specified. If data is missing like company names or specific dates, invent intelligent placeholders like '[Global Enterprise]'. Do not use placeholders for generated content (like summary, philosophy, achievements, etc.), invent strong and plausible content for those based on their profile and maturity level.`;

        const userPrompt = `
PROFILE: ${JSON.stringify(profile)}
READINESS: ${JSON.stringify(readiness)}
DIAGNOSTIC REPORT: ${JSON.stringify(report)}

Generate the ATS Resume and Professional Portfolio structures now based on the above information. Make it sound elite and executive level.`;

        const response = await generateDeepSeekChat([
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ]);

        const content = response.choices[0].message.content;
        if (!content) throw new Error("Empty response from AI engine");
        
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        const result = jsonMatch ? JSON.parse(jsonMatch[0]) : JSON.parse(content);

        return NextResponse.json({ success: true, result });
    } catch (error) {
        console.error("ATS Resume Generation Error:", error);
        return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Internal Server Error" }, { status: 500 });
    }
}
