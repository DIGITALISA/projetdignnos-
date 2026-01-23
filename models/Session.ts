import mongoose, { Schema, model, models } from "mongoose";

const SessionSchema = new Schema({
    courseId: {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    title: {
        type: String,
        required: [true, "Please provide a title for the session"],
    },
    duration: {
        type: String,
        required: [true, "Please provide a duration"],
    },
    videoUrl: {
        type: String,
        required: [true, "Please provide a video URL"],
    },
    supportLink: {
        type: String,
        default: "",
    },
}, {
    timestamps: true,
});

const Session = models.Session || model("Session", SessionSchema);

export default Session;
