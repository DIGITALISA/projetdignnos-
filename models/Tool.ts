import { Schema, model, models } from "mongoose";

const ToolSchema = new Schema({
    title: {
        type: String,
        required: [true, "Please provide a title for the tool"],
    },
    category: {
        type: String,
        required: [true, "Please provide a category"],
    },
    url: {
        type: String,
        required: [true, "Please provide a URL"],
    },
    description: {
        type: String,
        default: "",
    },
    visibility: {
        type: String,
        enum: ["Public", "Premium Only"],
        default: "Public",
    },
    users: {
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

const Tool = models.Tool || model("Tool", ToolSchema);

export default Tool;
