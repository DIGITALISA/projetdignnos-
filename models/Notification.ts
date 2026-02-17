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
        default: "info", // booking, alert, info
    },
    read: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});

const Notification = models.Notification || model("Notification", NotificationSchema);

export default Notification;
