import mongoose, { Schema, model, models } from "mongoose";

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
    }
}, {
    timestamps: true,
});

if (models.Simulation) {
    delete (mongoose as any).models.Simulation;
}
const Simulation = model("Simulation", SimulationSchema);

export default Simulation;
