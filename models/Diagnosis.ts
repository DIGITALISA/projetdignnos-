import { Schema, model, models } from "mongoose";

const DiagnosisSchema = new Schema({
    userId: {
        type: String, // User identity (e.g. name or email)
        required: true,
        index: true // إضافة index للبحث السريع
    },
    userName: {
        type: String,
        required: true,
    },
    cvText: {
        type: String,
        required: true,
    },
    analysis: {
        overview: String,
        strengths: [String],
        weaknesses: [String],
        skills: {
            technical: [String],
            soft: [String],
            gaps: [String]
        },
        experience: {
            years: Number,
            quality: String,
            progression: String
        },
        education: {
            level: String,
            relevance: String,
            notes: String
        },
        immediateActions: [String],
        careerPaths: [String],
        expertAdvice: {
            suggestedWorkshops: [String],
            suggestedTrainings: [String],
            strategicBrief: String,
            evolutionNote: String
        },
        sciReport: {
            type: Object, // Stores the 8-section structured report
            default: null
        },
        overallScore: Number,
        verdict: String
    },
    language: {
        type: String,
        default: 'en'
    },
    currentStep: {
        type: String,
        enum: ['cv_upload', 'analysis_complete', 'interview_in_progress', 'interview_complete', 'role_discovery', 'role_selected', 'cv_generation', 'completed'],
        default: 'analysis_complete'
    },
    totalQuestions: {
        type: Number,
        default: 15
    },
    conversationHistory: [{
        role: String,
        content: String,
        timestamp: Date
    }],
    // ✅ حقول جديدة لحفظ كل البيانات
    roleSuggestions: [{
        title: String,
        description: String,
        matchScore: Number,
        matchPercentage: Number,
        category: String,
        strengths: [String],
        weaknesses: [String],
        requiredCompetencies: [String],
        requiredSkills: [String],
        salaryRange: String,
        growthPotential: String,
        timeToReady: String
    }],
    selectedRole: {
        type: Schema.Types.Mixed, // يحفظ كائن الدور المختار كامل
    },
    interviewEvaluation: {
        type: Schema.Types.Mixed, // نتيجة تقييم المقابلة
    },
    generatedDocuments: {
        cv: Schema.Types.Mixed, // السيرة الذاتية المولدة (Object)
        coverLetter: String, // خطاب التقديم
        linkedinProfile: String, // ملف LinkedIn
        professionalTips: String, // نصائح مهنية
        keywords: [String], // كلمات البحث المحسنة
    },
    roleDiscoveryConversation: [{
        role: String,
        content: String,
        timestamp: Date
    }],
    cvGenerationConversation: [{
        role: String,
        content: String,
        timestamp: Date
    }],
    simulationConversation: [{
        role: String,
        content: String,
        timestamp: Date,
        feedback: Schema.Types.Mixed
    }],
    simulationResults: [Schema.Types.Mixed],
    simulationReport: Schema.Types.Mixed, // Final simulation performance report
    comprehensiveReport: String, // AI-generated comprehensive final report
    comprehensiveReportGeneratedAt: Date, // Timestamp for report generation
    // حالة الإكمال لكل مرحلة
    completionStatus: {
        cvAnalysisComplete: { type: Boolean, default: false },
        interviewComplete: { type: Boolean, default: false },
        roleDiscoveryComplete: { type: Boolean, default: false },
        roleSelected: { type: Boolean, default: false },
        simulationComplete: { type: Boolean, default: false },
        cvGenerationComplete: { type: Boolean, default: false },
        strategicReportComplete: { type: Boolean, default: false },
    },
    liveSessions: [{
        title: { type: String, default: "Strategic Brief" },
        date: { type: Date },
        time: { type: String },
        expertName: { type: String, default: "Executive Expert" },
        meetingLink: { type: String }
    }],
    referenceId: {
        type: String,
        unique: true,
        sparse: true
    }
}, {
    timestamps: true,
    strict: false, // Ensure we can save extra fields if needed
    versionKey: false, // Disable versioning to avoid VersionError
});

const Diagnosis = models.Diagnosis || model("Diagnosis", DiagnosisSchema);

export default Diagnosis;
