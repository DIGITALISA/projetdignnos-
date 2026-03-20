import { Schema, model, models } from "mongoose";

const NotificationSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        default: "info",
    },
    recipientEmail: {
        type: String, // Target a specific user
        index: true
    },
    recipientRole: {
        type: String, // Target a role (e.g. 'Admin', 'User')
        index: true
    },
    metadata: {
        type: Schema.Types.Mixed,
    },
    read: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
    strict: false // Allow extra fields if needed
});

const Notification = models.Notification || model("Notification", NotificationSchema);

export default Notification;
