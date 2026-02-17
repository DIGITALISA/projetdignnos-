import { Schema, model, models } from "mongoose";

const SimulationSchema = new Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true,
        default: "Pending Assignment"
    },
    role: String,
    company: String,
    duration: String,
    difficulty: String,
    briefing: String,
    plan: {
        type: String,
        default: 'standard'
    },
    price: {
        type: Number,
        default: 199
    },
    missionType: {
        type: String,
        default: 'Executive Coaching'
    },
    status: {
        type: String,
        enum: ['requested', 'proposed', 'active', 'completed'],
        default: 'requested'
    },
    objectives: [{
        title: String,
        date: String,
        time: String,
        meetingLink: String,
        status: {
            type: String,
            enum: ['locked', 'current', 'completed'],
            default: 'locked'
        }
    }],
    resources: [{
        title: String,
        type: { type: String }, // e.g. 'Confidential', 'Intelligence'
        url: String
    }],
    advisorTips: [String],
    currentDraft: {
        type: String,
        default: ""
    },
    lastDraftUpdate: { type: Date, default: Date.now },
    draftViewedByAdmin: { type: Boolean, default: true },
    messages: [{
        sender: { type: String, enum: ['system', 'admin', 'user'], default: 'admin' },
        text: String,
        timestamp: { type: Date, default: Date.now }
    }],
    submittedLink: {
        type: String,
        default: ""
    },
    performanceMetrics: {
        leadership: { type: Number, default: 0 },
        strategy: { type: Number, default: 0 },
        communication: { type: Number, default: 0 },
        problemSolving: { type: Number, default: 0 },
        decisionSpeed: { type: Number, default: 0 },
        overallScore: { type: Number, default: 0 }
    },
    badges: [{
        name: String,
        icon: String,
        date: { type: Date, default: Date.now }
    }],
    referenceId: {
        type: String,
        unique: true,
        sparse: true
    }
}, {
    timestamps: true,
});

if (models.Simulation) {
    delete (models as Record<string, unknown>).Simulation;
}
const Simulation = model("Simulation", SimulationSchema);

export default Simulation;
