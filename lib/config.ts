import connectDB from "./mongodb";
import Config from "@/models/Config";

export async function getConfig(key: string, defaultValue: string = ""): Promise<string> {
    try {
        await connectDB();
        const config = await Config.findOne({ key });
        if (config) {
            return config.value;
        }
        return defaultValue;
    } catch (error) {
        console.error(`Error fetching config ${key}:`, error);
        return defaultValue;
    }
}

export async function getAIConfig() {
    const deepseekKey = await getConfig("DEEPSEEK_API_KEY", process.env.DEEPSEEK_API_KEY || "");
    const deepseekBaseUrl = await getConfig("DEEPSEEK_BASE_URL", process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com/v1");
    const openaiKey = await getConfig("OPENAI_API_KEY", process.env.OPENAI_API_KEY || "");
    const activeProvider = await getConfig("ACTIVE_AI_PROVIDER", "deepseek"); // deepseek or openai

    return {
        deepseek: {
            apiKey: deepseekKey,
            baseURL: deepseekBaseUrl
        },
        openai: {
            apiKey: openaiKey
        },
        activeProvider
    };
}

export async function getSMTPConfig() {
    const host = await getConfig("SMTP_HOST", process.env.SMTP_HOST || "");
    const port = await getConfig("SMTP_PORT", process.env.SMTP_PORT || "587");
    const user = await getConfig("SMTP_USER", process.env.SMTP_USER || "");
    const pass = await getConfig("SMTP_PASS", process.env.SMTP_PASS || "");
    const secure = await getConfig("SMTP_SECURE", process.env.SMTP_SECURE || "false");

    return {
        host,
        port: parseInt(port),
        secure: secure === "true",
        auth: {
            user,
            pass
        }
    };
}
