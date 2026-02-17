import { NextRequest, NextResponse } from "next/server";
import { chatWithExpert } from "@/lib/deepseek";

export async function POST(req: NextRequest) {
    try {
        const { messages, language, expertType } = await req.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: "Invalid messages format" }, { status: 400 });
        }

        const result = await chatWithExpert(messages, language || 'en', expertType);

        if (!result.success) {
            return NextResponse.json({ error: result.error }, { status: 500 });
        }

        return NextResponse.json({ content: result.content });
    } catch (error) {
        console.error("Expert Chat API Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
