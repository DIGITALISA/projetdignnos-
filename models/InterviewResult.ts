import mongoose, { Schema, model, models } from "mongoose";

const InterviewResultSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    cvAnalysis: {
        type: Object,
        required: true,
    },
    conversationHistory: {
        type: [Object],
        required: true,
    },
    evaluation: {
        accuracyScore: Number,
        overallRating: Number,
        summary: String,
        cvVsReality: {
            confirmedStrengths: [String],
            exaggerations: [String],
            hiddenStrengths: [String]
        },
        cvImprovements: [String],
        skillDevelopmentPriorities: [String],
        verdict: String
    },
    language: {
        type: String,
        default: 'en'
    }
}, {
    timestamps: true,
});

const InterviewResult = models.InterviewResult || model("InterviewResult", InterviewResultSchema);

export default InterviewResult;
