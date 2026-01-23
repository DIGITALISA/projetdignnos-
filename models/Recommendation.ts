import mongoose, { Schema, model, models } from "mongoose";

const RecommendationSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    keyEndorsements: {
        type: [String],
        default: [],
    },
    language: {
        type: String,
        default: 'en'
    },
    referenceId: {
        type: String,
        unique: true,
        sparse: true // Allow for existing records without it initially
    }
}, {
    timestamps: true,
});

const Recommendation = models.Recommendation || model("Recommendation", RecommendationSchema);

export default Recommendation;
