import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Config from '@/models/Config';

export async function GET() {
    try {
        await connectDB();
        const configs = await Config.find({ category: 'contact' });
        
        const configMap = configs.reduce((acc, config) => {
            acc[config.key] = config.value;
            return acc;
        }, {} as Record<string, string>);

        return NextResponse.json({
            whatsapp: configMap['contact_whatsapp'] || '+216 23 351 048',
            email: configMap['contact_email'] || 'matrainingconsulting@gmail.com'
        });
    } catch (error) {
        console.error("Failed to fetch contact config:", error);
        return NextResponse.json({ error: "Failed to fetch configuration" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        await connectDB();
        const body = await req.json();
        const { whatsapp, email } = body;

        if (whatsapp) {
            await Config.findOneAndUpdate(
                { key: 'contact_whatsapp' },
                { 
                    value: whatsapp, 
                    category: 'contact',
                    description: 'WhatsApp number for consulting inquiries'
                },
                { upsert: true, new: true }
            );
        }

        if (email) {
            await Config.findOneAndUpdate(
                { key: 'contact_email' },
                { 
                    value: email, 
                    category: 'contact',
                    description: 'Email address for consulting inquiries'
                },
                { upsert: true, new: true }
            );
        }

        return NextResponse.json({ success: true, message: "Contact configuration updated" });
    } catch (error) {
        console.error("Failed to update contact config:", error);
        return NextResponse.json({ error: "Failed to update configuration" }, { status: 500 });
    }
}
