import nodemailer from "nodemailer";
import { getSMTPConfig } from "./config";

export async function sendEmail({ to, subject, html }: { to: string, subject: string, html: string }) {
    try {
        const smtpConfig = await getSMTPConfig();

        if (!smtpConfig.auth.user || !smtpConfig.auth.pass) {
            console.warn("SMTP settings are missing in DB and environment. Email not sent.");
            return { success: false, error: "SMTP settings missing" };
        }

        const transporter = nodemailer.createTransport(smtpConfig);

        await transporter.sendMail({
            from: `"MA Training Consulting" <${smtpConfig.auth.user}>`,
            to,
            subject,
            html,
        });
        return { success: true };
    } catch (error) {
        console.error("Error sending email:", error);
        return { success: false, error };
    }
}
