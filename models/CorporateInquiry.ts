import mongoose, { Schema, Document } from 'mongoose';

export interface ICorporateInquiry extends Document {
    companyName: string;
    companyEmail: string;
    companyPhone: string;
    targetPosition: string;
    jobDescription: string;
    candidateRefId: string;
    candidateFirstName: string;
    candidateLastName: string;
    desiredReportDate: Date;
    interviewDate: Date;
    additionalInfo?: string;
    status: 'pending' | 'reviewed' | 'completed';
    corporateReport?: {
        summary: string;
        strengths: string[];
        risks: string[];
        expertVerdict: string;
        generatedAt: Date;
    };
    createdAt: Date;
}

const CorporateInquirySchema: Schema = new Schema({
    companyName: { type: String, required: true },
    companyEmail: { type: String, required: true },
    companyPhone: { type: String, required: true },
    targetPosition: { type: String, required: true },
    jobDescription: { type: String, required: true },
    candidateRefId: { type: String, required: true },
    candidateFirstName: { type: String, required: true },
    candidateLastName: { type: String, required: true },
    desiredReportDate: { type: Date, required: true },
    interviewDate: { type: Date, required: true },
    additionalInfo: { type: String },
    status: { type: String, enum: ['pending', 'reviewed', 'completed'], default: 'pending' },
    corporateReport: {
        summary: String,
        strengths: [String],
        risks: [String],
        expertVerdict: String,
        generatedAt: Date
    },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.CorporateInquiry || mongoose.model<ICorporateInquiry>('CorporateInquiry', CorporateInquirySchema);
