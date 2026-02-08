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
        requiredSkills: [String],
        salaryRange: String,
        growthPotential: String
    }],
    selectedRole: {
        type: Schema.Types.Mixed, // يحفظ كائن الدور المختار كامل
    },
    interviewEvaluation: {
        type: Schema.Types.Mixed, // نتيجة تقييم المقابلة
    },
    generatedDocuments: {
        cv: String, // السيرة الذاتية المولدة
        coverLetter: String, // خطاب التقديم
        linkedinProfile: String, // ملف LinkedIn
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
    // حالة الإكمال لكل مرحلة
    completionStatus: {
        cvAnalysisComplete: { type: Boolean, default: false },
        interviewComplete: { type: Boolean, default: false },
        roleDiscoveryComplete: { type: Boolean, default: false },
        roleSelected: { type: Boolean, default: false },
        cvGenerationComplete: { type: Boolean, default: false },
    }
}, {
    timestamps: true,
});

const Diagnosis = models.Diagnosis || model("Diagnosis", DiagnosisSchema);

export default Diagnosis;
