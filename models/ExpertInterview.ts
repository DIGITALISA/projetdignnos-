import { Schema, model, models } from "mongoose";

const ExpertInterviewSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    paymentMode: { type: String, required: true },
    amount: { type: String },
    paymentOther: { type: String },
    answers: { type: Object, required: true }, 
    status: {
        type: String,
        enum: ["Pending", "Reviewed", "Interviewing", "Accepted", "Rejected"],
        default: "Pending"
    }
}, {
    timestamps: true,
});

const ExpertInterview = models.ExpertInterview || model("ExpertInterview", ExpertInterviewSchema);

export default ExpertInterview;
