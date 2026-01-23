import mongoose, { Schema, model, models } from "mongoose";

const DiagnosisSchema = new Schema({
    userId: {
        type: String, // User identity (e.g. name or email)
        required: true,
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
        enum: ['cv_upload', 'analysis_complete', 'interview_in_progress', 'interview_complete', 'completed'],
        default: 'analysis_complete'
    },
    conversationHistory: [{
        role: String,
        content: String,
        timestamp: Date
    }]
}, {
    timestamps: true,
});

const Diagnosis = models.Diagnosis || model("Diagnosis", DiagnosisSchema);

export default Diagnosis;
