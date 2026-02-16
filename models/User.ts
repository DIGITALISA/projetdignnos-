import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    whatsapp: {
        type: String,
    },
    role: {
        type: String,
        enum: ["Premium Member", "Free Tier", "Beta User", "Admin", "Moderator", "Trial User"],
        default: "Free Tier",
    },
    status: {
        type: String,
        enum: ["Active", "Pending", "Inactive", "Suspended"],
        default: "Pending",
    },
    accountType: {
        type: String,
        enum: ["Free", "Trial", "Premium"],
        default: "Free",
    },
    isTrial: {
        type: Boolean,
        default: false,
    },
    trialExpiry: {
        type: Date,
    },
    trialDurationHours: {
        type: Number,
        default: 1, // 1h for Free accounts, 3h for Trial Users
    },
    plan: {
        type: String,
        enum: ["Free Trial", "Pro Essential", "None"],
        default: "None",
    },
    subscriptionExpiry: {
        type: Date,
    },
    purchasedItems: [{
        type: String, // IDs or names of workshops/simulations paid for
    }],
    canAccessCertificates: {
        type: Boolean,
        default: false,
    },
    canAccessRecommendations: {
        type: Boolean,
        default: false,
    },
    canAccessScorecard: {
        type: Boolean,
        default: false,
    },
    canAccessSCI: {
        type: Boolean,
        default: false,
    },
    scorecardRequested: {
        type: Boolean,
        default: false,
    },
    isDiagnosisComplete: {
        type: Boolean,
        default: false,
    },
    diagnosisData: {
        type: Schema.Types.Mixed,
    },
    selectedRole: {
        type: String,
    },
    rawPassword: {
        type: String,
    },
    // Executive Mandate Fields
    mandateDuration: {
        type: Number, // In months
    },
    mandateCurrency: {
        type: String,
    },
    mandateAmount: {
        type: Number,
    },
    plannedPaymentDate: {
        type: Date,
    },
    mandateAgreed: {
        type: Boolean,
        default: false,
    },
    workshopAttestationRequested: {
        type: Boolean,
        default: false,
    },
    attestations: [{
        workshopTitle: String,
        issueDate: { type: Date, default: Date.now },
        referenceId: String,
        instructor: String
    }],
    workshopAccessRequests: [{
        type: Schema.Types.ObjectId,
        ref: 'Course'
    }],
    liveSessions: [{
        title: { type: String, default: "Strategic Brief" },
        date: { type: Date },
        time: { type: String },
        expertName: { type: String, default: "Executive Expert" },
        meetingLink: { type: String }
    }],
    memberId: {
        type: String,
        unique: true,
        sparse: true // Allow nulls for old users until migrated
    },
    resetRequested: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true,
});

if (models.User) {
    delete (models as Record<string, unknown>).User;
}
const User = model("User", UserSchema);

export default User;
