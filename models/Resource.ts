import { Schema, model, models } from "mongoose";

const ResourceSchema = new Schema({
    title: {
        type: String,
        required: [true, "Please provide a title for the resource"],
    },
    url: {
        type: String,
        required: [true, "Please provide a URL"],
    },
    description: {
        type: String,
        default: "",
    },
    category: {
        type: String,
        default: "General",
    },
    size: {
        type: String,
        default: "0 KB",
    },
    type: {
        type: String,
        required: [true, "Please provide a resource type"],
    },
    totalDownloads: {
        type: Number,
        default: 0,
    },
    allowedUsers: {
        type: [String],
        default: [],
    },
}, {
    timestamps: true,
});

const Resource = models.Resource || model("Resource", ResourceSchema);

export default Resource;
