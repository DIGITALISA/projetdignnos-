import mongoose, { Schema, model, models } from "mongoose";

const CertificateSchema = new Schema({
    userId: {
        type: String, // Can be user email or ID
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    courseId: {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: true,
    },
    courseTitle: {
        type: String,
        required: true,
    },
    issueDate: {
        type: Date,
        default: Date.now,
    },
    certificateId: {
        type: String,
        unique: true,
        required: true,
    },
}, {
    timestamps: true,
});

const Certificate = models.Certificate || model("Certificate", CertificateSchema);

export default Certificate;
