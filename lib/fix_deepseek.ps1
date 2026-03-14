$path = "C:\Users\ahmed\Desktop\e-projet\lib\deepseek.ts"
$content = Get-Content $path
$startLine = 1058
$endLine = 1198

$prefix = $content[0..($startLine-2)]
$suffix = $content[$endLine..($content.Length-1)]

$middle = @'
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
  "reportTitle": "string (e.g. 'Executive Intelligence Brief — Advisor Edition')",

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
    "rollesToAvoidNow": ["string (Roles they should NOT pursue at this stage — with reasoning)"],
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
    "interviewPersonality": "string (How they presented in the interview — composed, anxious, overconfident, authentic, etc.)",
    "selfAwarenessLevel": "Low | Medium | High | Elite",
    "resilienceSignals": ["string (Evidence of resilience and adaptability from interview responses)"],
    "redFlags": ["string (Concerning patterns observed — e.g., poor crisis response, defensiveness, unrealistic self-image)"],
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
- Every insight must be grounded in specific assessment data — the audit scores, interview responses, MCQ results.
- This is for senior advisors — write with precision, authority, and zero vagueness.
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

        console.log('✅ Professional Expert Report generated successfully for:', professionalData.userInfo.name);

        return { success: true, report };
    } catch (error) {
        console.error('❌ Professional Expert Report Error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to generate professional expert report'
        };
    }
}
'@

$newContent = $prefix + $middle.Split("`n") + $suffix
Set-Content $path -Value $newContent -Encoding utf8
