import mongoose, { Schema, model, models } from "mongoose";

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
    isTrial: {
        type: Boolean,
        default: false,
    },
    trialExpiry: {
        type: Date,
    },
    plan: {
        type: String,
        enum: ["Free Trial", "Pro Essential", "Elite Full Pack", "None"],
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
    }
}, {
    timestamps: true,
});

const User = models.User || model("User", UserSchema);

export default User;
