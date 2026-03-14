import { Schema, model, models } from "mongoose";

const JobAlignmentSchema = new Schema({
    userId: {
        type: String,
        required: true,
        index: true,
    },
    userName: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["New Job", "Promotion"],
        required: true,
    },
    jobTitle: String,
    companyName: String,
    companySector: String,
    companyAddress: String,
    companyWebsite: String,
    additionalCompanyInfo: String,
    researchReport: {
        summary: String,
        insights: [String],
        culture: String,
        competitors: [String]
    },
    jobDescription: {
        type: String,
        required: true,
    },
    // MCQ Phase
    mcqQuestions: [{
        question: String,
        options: [String],
        correctAnswer: Number,
        explanation: String,
        category: { type: String, enum: ["Technical", "Psychological"] }
    }],
    mcqAnswers: [Number],
    mcqScore: Number,
    // Interview Phase
    interviewChat: [{
        role: { type: String, enum: ["assistant", "user"] },
        content: String,
        timestamp: { type: Date, default: Date.now }
    }],
    interviewAnalysis: {
        strengths: [String],
        weaknesses: [String],
        advice: String,
        score: Number
    },
    // Final Output
    generatedCV: String,
    generatedCoverLetter: String,
    currentStage: {
        type: String,
        enum: ["form", "research", "mcq", "interview", "cv-prep", "completed"],
        default: "form"
    },
    referenceId: {
        type: String,
        unique: true
    },
    language: {
        type: String,
        default: "en"
    },
    report: { // Legacy field, keeping for backward compatibility but might not use for new flow
        verdict: String,
        strengths: [String],
        gaps: [String],
        roadmap: [String],
        analysis: String
    },
    finalAudit: {
        verdict: String,
        suitabilityScore: Number,
        evidence: [String],
        detailedAnalysis: String
    },
    status: {
        type: String,
        enum: ["pending", "completed"],
        default: "pending"
    }
}, {
    timestamps: true,
});

const JobAlignment = models.JobAlignment || model("JobAlignment", JobAlignmentSchema);

export default JobAlignment;
