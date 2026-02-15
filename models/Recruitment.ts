import { Schema, model, models } from "mongoose";

const RecruitmentSchema = new Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    cvLink: { type: String, required: true },
    videoLink: { type: String, required: true },
    role: { 
        type: String, 
        required: true,
        enum: ["expert", "employee", "partner", "animator"]
    },
    // Specific fields
    domain: { type: String },
    experience: { type: String },
    projects: { type: String },
    tools: { type: String },
    position: { type: String },
    availability: { type: String },
    salary: { type: String },
    education: { type: String },
    company: { type: String },
    partnerType: { type: String },
    contribution: { type: String },
    network: { type: String },
    specialty: { type: String },
    portfolio: { type: String },
    languages: { type: String },
    motivation: { type: String },
    // Status
    status: {
        type: String,
        enum: ["Pending", "Reviewed", "Interviewing", "Accepted", "Rejected"],
        default: "Pending"
    }
}, {
    timestamps: true,
});

const Recruitment = models.Recruitment || model("Recruitment", RecruitmentSchema);

export default Recruitment;
