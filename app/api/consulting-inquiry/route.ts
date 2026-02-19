import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const { fullName, email, phone } = body;

        if (!fullName || !email) {
            return NextResponse.json({ error: "Full name and email are required" }, { status: 400 });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        
        if (existingUser) {
            // Update existing user with mandate fields to make it appear in admin mandate list
            // Only update if they don't already have an active mandate to avoid overwriting
            if (!existingUser.mandateDuration || existingUser.mandateDuration === 0) {
                existingUser.mandateDuration = 12;
                existingUser.mandateCurrency = "EUR";
                existingUser.mandateAmount = 80;
                existingUser.whatsapp = phone || existingUser.whatsapp;
                existingUser.status = "Pending";
                await existingUser.save();
            }
            return NextResponse.json({ 
                success: true, 
                message: "Nous avons bien reçu votre demande. Un consultant vous contactera prochainement." 
            });
        }

        // Create a temporary hashed password (random)
        const tempPassword = await bcrypt.hash(Math.random().toString(36).slice(-10), 10);

        // Create a new user record that will appear in the Mandates admin section
        const newUser = await User.create({
            fullName,
            email: email.toLowerCase(),
            password: tempPassword,
            whatsapp: phone || "",
            role: "Premium Member",
            status: "Pending",
            paymentStatus: "Unpaid",
            plan: "Pro Essential",
            mandateDuration: 12, // 1 year default for strategic consulting
            mandateCurrency: "EUR",
            mandateAmount: 80,
            plannedPaymentDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            accountType: "Premium",
            mandateAgreed: false
        });

        return NextResponse.json({ 
            success: true, 
            message: "Votre demande de consultation stratégique a été enregistrée. Notre équipe vous contactera sous 24h.",
            data: { id: newUser._id } 
        });

    } catch (error) {
        console.error("Consulting Inquiry Error:", error);
        return NextResponse.json({ 
            error: "Une erreur est survenue lors de l'envoi de votre demande. Veuillez réessayer." 
        }, { status: 500 });
    }
}
