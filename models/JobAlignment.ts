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
    jobDescription: {
        type: String,
        required: true,
    },
    questions: [{
        question: String,
        options: [String],
        correctAnswer: Number,
        explanation: String
    }],
    answers: [Number],
    score: {
        type: Number,
        default: 0
    },
    report: {
        verdict: String,
        strengths: [String],
        gaps: [String],
        roadmap: [String],
        analysis: String
    },
    status: {
        type: String,
        enum: ["pending", "completed"],
        default: "pending"
    },
    referenceId: {
        type: String,
        unique: true
    },
    language: {
        type: String,
        default: "en"
    }
}, {
    timestamps: true,
});

const JobAlignment = models.JobAlignment || model("JobAlignment", JobAlignmentSchema);

export default JobAlignment;
