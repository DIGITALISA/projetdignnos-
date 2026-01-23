import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Config from "@/models/Config";

export async function GET() {
    try {
        await connectDB();
        const configs = await Config.find({});
        // Convert to a simple object for easier frontend consumption
        const configMap = configs.reduce((acc: any, curr: any) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});
        return NextResponse.json({ success: true, configs: configMap });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await connectDB();
        const { configs } = await req.json(); // Expected format: { "KEY": "VALUE", ... }

        if (!configs || typeof configs !== 'object') {
            return NextResponse.json({ success: false, error: "Invalid format" }, { status: 400 });
        }

        const promisses = Object.entries(configs).map(([key, value]) => {
            return Config.findOneAndUpdate(
                { key },
                { key, value: String(value) },
                { upsert: true, new: true }
            );
        });

        await Promise.all(promisses);

        return NextResponse.json({ success: true, message: "Settings updated successfully" });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
