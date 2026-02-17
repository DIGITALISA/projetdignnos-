import { Schema, model, models } from "mongoose";

const DigitalProjectSchema = new Schema({
    title: {
        en: { type: String, required: true },
        fr: { type: String, required: true },
        ar: { type: String, required: true }
    },
    idea: {
        en: { type: String, required: true },
        fr: { type: String, required: true },
        ar: { type: String, required: true }
    },
    strategy: {
        en: { type: String, required: true },
        fr: { type: String, required: true },
        ar: { type: String, required: true }
    },
    extraServices: {
        en: [String],
        fr: [String],
        ar: [String]
    },
    price: {
        type: Number,
        required: true
    },
    currentBid: {
        type: Number,
        default: 0
    },
    auctionStartedAt: {
        type: Date,
        default: null
    },
    demoUrl: {
        type: String,
        required: true
    },
    image: {
        type: String, // URL to image
        required: true
    },
    category: {
        type: String,
        required: true
    },
    tier: {
        type: String,
        enum: ['basic', 'pro'],
        default: 'basic'
    },
    status: {
        type: String,
        enum: ['active', 'sold', 'archived'],
        default: 'active'
    }
}, {
    timestamps: true,
});

if (models.DigitalProject) {
    delete (models as Record<string, unknown>).DigitalProject;
}

const DigitalProject = model("DigitalProject", DigitalProjectSchema);

export default DigitalProject;
