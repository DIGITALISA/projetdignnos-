import mongoose, { Schema, model, models } from "mongoose";

const ConfigSchema = new Schema({
    key: {
        type: String,
        required: true,
        unique: true,
    },
    value: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    category: {
        type: String,
        default: "general",
    }
}, {
    timestamps: true,
});

const Config = models.Config || model("Config", ConfigSchema);

export default Config;
