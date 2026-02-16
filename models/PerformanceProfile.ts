import { Schema, model, models } from 'mongoose';

const PerformanceProfileSchema = new Schema({
    userId: { type: String, required: true, index: true },
    userName: { type: String, required: true },
    summary: String,
    competencies: [{
        label: String,
        score: Number,
        status: String
    }],
    verdict: String,
    expertNotes: String,
    language: { type: String, default: 'en' },
    referenceId: { type: String, unique: true }
}, {
    timestamps: true
});

const PerformanceProfile = models.PerformanceProfile || model('PerformanceProfile', PerformanceProfileSchema);

export default PerformanceProfile;
