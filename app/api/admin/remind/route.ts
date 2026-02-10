import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { sendEmail } from "@/lib/mail";

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const { userId, type } = await req.json();

        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (type === "email") {
            const subject = "Rappel de Paiement - Mandat Exécutif";
            const amountDisplay = `${user.mandateAmount} ${user.mandateCurrency}`;
            const dateDisplay = user.plannedPaymentDate ? new Date(user.plannedPaymentDate).toLocaleDateString('fr-FR') : "non précisée";

            const html = `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #1e293b;">Bonjour ${user.fullName},</h2>
                    <p>Ceci است un rappel concernant votre inscription au programme <strong>MA Training Consulting</strong>.</p>
                    <p>Conformément à votre engagement, voici les détails de votre mandat :</p>
                    <ul style="background: #f8fafc; padding: 15px; border-radius: 8px; list-style: none;">
                        <li><strong>Offre :</strong> ${user.plan}</li>
                        <li><strong>Montant :</strong> ${amountDisplay}</li>
                        <li><strong>Date de paiement prévue :</strong> ${dateDisplay}</li>
                    </ul>
                    <p>Nous vous remercions de bien vouloir procéder au règlement pour activer l'intégralité de vos services.</p>
                    <p>Si vous avez déjà effectué le paiement, merci de ne pas tenir compte de cet email.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 12px; color: #64748b;">L'équipe MA Training Consulting</p>
                </div>
            `;

            const result = await sendEmail({ to: user.email, subject, html });
            if (result.success) {
                return NextResponse.json({ message: "Email envoyé مع النجاح" });
            } else {
                return NextResponse.json({ error: "Erreur lors de l'envoi de l'email" }, { status: 500 });
            }
        }

        return NextResponse.json({ error: "Type de rappel non supporté" }, { status: 400 });

    } catch (error) {
        console.error("Reminder API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
