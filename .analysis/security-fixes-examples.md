# أمثلة عملية للإصلاحات الأمنية المقترحة

## 🔐 1. إضافة نظام مصادقة آمن باستخدام NextAuth.js

### الخطوة 1: التثبيت

```bash
npm install next-auth @auth/mongodb-adapter
```

### الخطوة 2: إنشاء ملف التكوين

```typescript
// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import connectDB from "./mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(connectDB()),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        await connectDB();
        const user = await User.findOne({ email: credentials.email });

        if (!user) {
          throw new Error("User not found");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (!isValid) {
          throw new Error("Invalid password");
        }

        if (
          user.status === "Pending" &&
          user.role !== "Admin" &&
          user.role !== "Moderator"
        ) {
          throw new Error("Account pending verification");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.fullName,
          role: user.role,
          plan: user.plan,
          isDiagnosisComplete: user.isDiagnosisComplete,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.plan = user.plan;
        token.isDiagnosisComplete = user.isDiagnosisComplete;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role;
        session.user.plan = token.plan;
        session.user.isDiagnosisComplete = token.isDiagnosisComplete;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
```

### الخطوة 3: إنشاء API Route

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
```

### الخطوة 4: حماية API Routes

```typescript
// app/api/simulation/route.ts
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  // ✅ التحقق من المصادقة
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.email;

  try {
    await connectDB();
    const activeMission = await Simulation.findOne({
      userId,
      status: "active",
    });
    // ... rest of code
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
```

### الخطوة 5: حماية الصفحات

```typescript
// app/(dashboard)/layout.tsx
"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "unauthenticated") {
            redirect("/login");
        }
    }, [status]);

    if (status === "loading") {
        return <LoadingScreen />;
    }

    if (!session) {
        return null;
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <Sidebar />
            <main>{children}</main>
        </div>
    );
}
```

---

## 🛡️ 2. إضافة Input Validation باستخدام Zod

### الخطوة 1: التثبيت

```bash
npm install zod
```

### الخطوة 2: تعريف Schemas

```typescript
// lib/validations/simulation.ts
import { z } from "zod";

export const CreateSimulationSchema = z.object({
  userId: z.string().email("Invalid email format"),
  missionType: z.enum([
    "Executive Coaching",
    "Technical Training",
    "Leadership Development",
  ]),
});

export const AcceptMissionSchema = z.object({
  userId: z.string().email(),
  missionId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId"),
});

export const SaveDraftSchema = z.object({
  userId: z.string().email(),
  draft: z
    .string()
    .min(10, "Draft must be at least 10 characters")
    .max(50000, "Draft too long"),
});

export const SubmitPlanSchema = z.object({
  userId: z.string().email(),
  submittedLink: z.string().url("Invalid URL format"),
});

export type CreateSimulationInput = z.infer<typeof CreateSimulationSchema>;
export type AcceptMissionInput = z.infer<typeof AcceptMissionSchema>;
```

### الخطوة 3: استخدام Validation في API

```typescript
// app/api/simulation/route.ts
import {
  CreateSimulationSchema,
  AcceptMissionSchema,
  SaveDraftSchema,
} from "@/lib/validations/simulation";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { type } = body;

    if (type === "create_request") {
      // ✅ Validate input
      const validatedData = CreateSimulationSchema.parse(body);

      await connectDB();
      const newSim = await Simulation.create({
        userId: validatedData.userId,
        missionType: validatedData.missionType,
        status: "requested",
      });

      return NextResponse.json({ success: true, mission: newSim });
    }

    if (type === "accept_mission") {
      // ✅ Validate input
      const validatedData = AcceptMissionSchema.parse(body);

      await connectDB();
      const active = await Simulation.findByIdAndUpdate(
        validatedData.missionId,
        { status: "active" },
        { new: true },
      );

      return NextResponse.json({ success: true, mission: active });
    }

    return NextResponse.json({ error: "Invalid action type" }, { status: 400 });
  } catch (error) {
    // ✅ Handle Zod validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.errors,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
```

---

## 🔒 3. تحديث User Model - إزالة rawPassword

### قبل:

```typescript
// ❌ models/User.ts
const UserSchema = new Schema({
  email: String,
  password: String,
  rawPassword: String, // ❌ خطر أمني
  // ...
});
```

### بعد:

```typescript
// ✅ models/User.ts
import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [100, "Name must be less than 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v: string) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
        },
        message: "Please enter a valid email",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false, // ✅ لا يتم إرجاع password في الاستعلامات العادية
    },
    whatsapp: {
      type: String,
      validate: {
        validator: function (v: string) {
          return !v || /^\+?[1-9]\d{1,14}$/.test(v);
        },
        message: "Please enter a valid phone number",
      },
    },
    role: {
      type: String,
      enum: {
        values: [
          "Premium Member",
          "Free Tier",
          "Beta User",
          "Admin",
          "Moderator",
          "Trial User",
        ],
        message: "{VALUE} is not a valid role",
      },
      default: "Free Tier",
    },
    status: {
      type: String,
      enum: {
        values: ["Active", "Pending", "Inactive", "Suspended"],
        message: "{VALUE} is not a valid status",
      },
      default: "Pending",
    },
    // ... rest of fields
  },
  {
    timestamps: true,
  },
);

// ✅ Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// ✅ Method to compare passwords
UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = models.User || model("User", UserSchema);

export default User;
```

---

## 🚀 4. إضافة Rate Limiting

### الخطوة 1: التثبيت

```bash
npm install express-rate-limit
```

### الخطوة 2: إنشاء Rate Limiter Middleware

```typescript
// lib/rate-limit.ts
import { NextResponse } from "next/server";

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

export function rateLimit(options: {
  interval: number; // in milliseconds
  uniqueTokenPerInterval: number;
}) {
  return {
    check: (limit: number, token: string) => {
      const now = Date.now();
      const tokenData = store[token];

      if (!tokenData || now > tokenData.resetTime) {
        store[token] = {
          count: 1,
          resetTime: now + options.interval,
        };
        return { success: true };
      }

      if (tokenData.count >= limit) {
        return {
          success: false,
          remaining: 0,
          resetTime: tokenData.resetTime,
        };
      }

      tokenData.count++;
      return {
        success: true,
        remaining: limit - tokenData.count,
      };
    },
  };
}

// Create limiters for different endpoints
export const apiLimiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
});

export const aiLimiter = rateLimit({
  interval: 15 * 60 * 1000, // 15 minutes
  uniqueTokenPerInterval: 100,
});
```

### الخطوة 3: استخدام Rate Limiter

```typescript
// app/api/analyze-cv/route.ts
import { aiLimiter } from "@/lib/rate-limit";
import { getServerSession } from "next-auth/next";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ✅ Rate limiting - 5 requests per 15 minutes
  const identifier = session.user.email;
  const rateLimitResult = await aiLimiter.check(5, identifier);

  if (!rateLimitResult.success) {
    return NextResponse.json(
      {
        error: "Too many requests",
        message: "You have exceeded the rate limit. Please try again later.",
        resetTime: rateLimitResult.resetTime,
      },
      { status: 429 },
    );
  }

  try {
    const { cvText, language } = await req.json();

    // Validate input
    const schema = z.object({
      cvText: z.string().min(50).max(50000),
      language: z.enum(["en", "fr", "ar", "es"]),
    });

    const validated = schema.parse({ cvText, language });

    // Call AI API
    const analysis = await analyzeCVWithAI(
      validated.cvText,
      validated.language,
    );

    return NextResponse.json({ success: true, analysis });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
```

---

## 🔍 5. إضافة Database Indexes

```typescript
// models/Simulation.ts
import mongoose, { Schema, model, models } from "mongoose";

const SimulationSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true, // ✅ Index for faster queries
    },
    status: {
      type: String,
      enum: ["requested", "proposed", "active", "completed"],
      default: "requested",
      index: true, // ✅ Index for status queries
    },
    // ... rest of fields
  },
  {
    timestamps: true,
  },
);

// ✅ Compound index for common queries
SimulationSchema.index({ userId: 1, status: 1 });
SimulationSchema.index({ userId: 1, createdAt: -1 });

// ✅ Text index for search
SimulationSchema.index({ title: "text", briefing: "text" });

const Simulation = models.Simulation || model("Simulation", SimulationSchema);

export default Simulation;
```

---

## 🛠️ 6. إضافة Error Handler موحد

```typescript
// lib/errors.ts
export class APIError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string,
  ) {
    super(message);
    this.name = "APIError";
  }
}

export class ValidationError extends APIError {
  constructor(
    message: string,
    public details?: any,
  ) {
    super(400, message, "VALIDATION_ERROR");
  }
}

export class AuthenticationError extends APIError {
  constructor(message: string = "Unauthorized") {
    super(401, message, "AUTHENTICATION_ERROR");
  }
}

export class ForbiddenError extends APIError {
  constructor(message: string = "Forbidden") {
    super(403, message, "FORBIDDEN_ERROR");
  }
}

export class NotFoundError extends APIError {
  constructor(message: string = "Not Found") {
    super(404, message, "NOT_FOUND_ERROR");
  }
}

export class RateLimitError extends APIError {
  constructor(
    message: string = "Too Many Requests",
    public resetTime?: number,
  ) {
    super(429, message, "RATE_LIMIT_ERROR");
  }
}

export function handleAPIError(error: unknown): NextResponse {
  console.error("API Error:", error);

  if (error instanceof APIError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
        ...(error instanceof RateLimitError && { resetTime: error.resetTime }),
        ...(error instanceof ValidationError && { details: error.details }),
      },
      { status: error.statusCode },
    );
  }

  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        error: "Validation failed",
        code: "VALIDATION_ERROR",
        details: error.errors,
      },
      { status: 400 },
    );
  }

  // Log unexpected errors to monitoring service (e.g., Sentry)
  // Sentry.captureException(error);

  return NextResponse.json(
    {
      error: "Internal Server Error",
      code: "INTERNAL_ERROR",
    },
    { status: 500 },
  );
}
```

### استخدام Error Handler:

```typescript
// app/api/simulation/route.ts
import {
  handleAPIError,
  AuthenticationError,
  ValidationError,
} from "@/lib/errors";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      throw new AuthenticationError();
    }

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      throw new ValidationError("UserId is required");
    }

    await connectDB();
    const missions = await Simulation.find({ userId });

    return NextResponse.json({ success: true, missions });
  } catch (error) {
    return handleAPIError(error);
  }
}
```

---

## 📝 7. إضافة Logging System

### الخطوة 1: التثبيت

```bash
npm install winston
```

### الخطوة 2: إنشاء Logger

```typescript
// lib/logger.ts
import winston from "winston";

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const level = () => {
  const env = process.env.NODE_ENV || "development";
  const isDevelopment = env === "development";
  return isDevelopment ? "debug" : "warn";
};

const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

const transports = [
  new winston.transports.Console(),
  new winston.transports.File({
    filename: "logs/error.log",
    level: "error",
  }),
  new winston.transports.File({ filename: "logs/all.log" }),
];

const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

export default logger;
```

### الخطوة 3: استخدام Logger

```typescript
// app/api/simulation/route.ts
import logger from "@/lib/logger";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    logger.info(`Simulation POST request received`, {
      userId: body.userId,
      type: body.type,
    });

    // ... rest of code

    logger.info(`Simulation created successfully`, { missionId: newSim._id });
    return NextResponse.json({ success: true, mission: newSim });
  } catch (error) {
    logger.error(`Simulation API error`, {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return handleAPIError(error);
  }
}
```

---

## 🎯 الخلاصة

هذه الأمثلة توضح كيفية تطبيق الإصلاحات الأمنية الأساسية:

1. ✅ **NextAuth.js** - نظام مصادقة آمن وموثوق
2. ✅ **Zod Validation** - التحقق من المدخلات على مستوى API
3. ✅ **Secure User Model** - إزالة rawPassword وإضافة validation
4. ✅ **Rate Limiting** - حماية من الاستخدام المفرط
5. ✅ **Database Indexes** - تحسين الأداء
6. ✅ **Error Handling** - معالجة موحدة للأخطاء
7. ✅ **Logging System** - تتبع وتسجيل الأحداث

**الأولوية**: يجب تطبيق هذه الإصلاحات قبل نشر المشروع في Production!
