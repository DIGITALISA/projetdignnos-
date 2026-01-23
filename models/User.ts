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
    role: {
        type: String,
        enum: ["Premium Member", "Free Tier", "Beta User", "Admin", "Moderator"],
        default: "Free Tier",
    },
    status: {
        type: String,
        enum: ["Active", "Pending", "Inactive"],
        default: "Active",
    }
}, {
    timestamps: true,
});

const User = models.User || model("User", UserSchema);

export default User;
