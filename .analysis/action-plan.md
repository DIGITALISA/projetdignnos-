# خطة عمل تفصيلية لإصلاح المشروع

# Detailed Action Plan for Project Fixes

## 📅 جدول زمني: 4 أسابيع

---

## 🔴 الأسبوع الأول: الأمان والمصادقة (Week 1: Security & Authentication)

### اليوم 1-2: إعداد NextAuth.js

#### المهام:

- [ ] تثبيت NextAuth.js والمكتبات المطلوبة

```bash
npm install next-auth @auth/mongodb-adapter
```

- [ ] إنشاء `lib/auth.ts` مع التكوين الكامل
- [ ] إنشاء `app/api/auth/[...nextauth]/route.ts`
- [ ] إضافة `NEXTAUTH_SECRET` إلى `.env.local`

```bash
# Generate secret
openssl rand -base64 32
```

- [ ] تحديث `types/next-auth.d.ts` لإضافة custom fields

```typescript
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      plan: string;
      isDiagnosisComplete: boolean;
    };
  }
}
```

#### الملفات المتأثرة:

- `lib/auth.ts` (جديد)
- `app/api/auth/[...nextauth]/route.ts` (جديد)
- `types/next-auth.d.ts` (جديد)
- `.env.local` (تحديث)

#### الاختبار:

- [ ] تسجيل الدخول يعمل بشكل صحيح
- [ ] Session يتم تخزينها بشكل آمن
- [ ] Logout يعمل بشكل صحيح

---

### اليوم 3-4: حماية API Routes

#### المهام:

- [ ] إضافة `getServerSession` لجميع API routes المحمية
- [ ] تحديث `app/api/simulation/route.ts`
- [ ] تحديث `app/api/analyze-cv/route.ts`
- [ ] تحديث `app/api/interview/*/route.ts`
- [ ] تحديث `app/api/user/*/route.ts`

#### مثال للتطبيق:

```typescript
// قبل
export async function GET(req: Request) {
  const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");
  // ...
}

// بعد
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.email;
  // ...
}
```

#### الملفات المتأثرة (13 ملف):

- `app/api/simulation/route.ts`
- `app/api/analyze-cv/route.ts`
- `app/api/interview/*/route.ts` (5 files)
- `app/api/user/*/route.ts` (7 files)

#### الاختبار:

- [ ] جميع API routes ترفض الطلبات غير المصادق عليها
- [ ] Session data متاحة بشكل صحيح

---

### اليوم 5: تحديث User Model

#### المهام:

- [ ] حذف حقل `rawPassword` من Schema
- [ ] إضافة validation للـ email
- [ ] إضافة validation للـ password
- [ ] إضافة `pre('save')` hook لـ hashing
- [ ] إضافة `comparePassword` method

#### الكود:

```typescript
// models/User.ts
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
) {
  return await bcrypt.compare(candidatePassword, this.password);
};
```

#### Migration Script:

```typescript
// scripts/remove-raw-passwords.ts
import connectDB from "../lib/mongodb";
import User from "../models/User";

async function removeRawPasswords() {
  await connectDB();
  const result = await User.updateMany(
    { rawPassword: { $exists: true } },
    { $unset: { rawPassword: "" } },
  );
  console.log(`Updated ${result.modifiedCount} users`);
}

removeRawPasswords();
```

#### الملفات المتأثرة:

- `models/User.ts` (تحديث)
- `scripts/remove-raw-passwords.ts` (جديد)

#### الاختبار:

- [ ] تشغيل migration script
- [ ] التحقق من عدم وجود rawPassword في DB
- [ ] تسجيل مستخدم جديد يعمل
- [ ] تسجيل الدخول يعمل مع المستخدمين القدامى

---

### اليوم 6-7: إضافة Zod Validation

#### المهام:

- [ ] تثبيت Zod

```bash
npm install zod
```

- [ ] إنشاء validation schemas في `lib/validations/`
- [ ] تطبيق validation على جميع API routes

#### الملفات الجديدة:

```
lib/validations/
├── simulation.ts
├── user.ts
├── cv.ts
└── interview.ts
```

#### مثال Schema:

```typescript
// lib/validations/simulation.ts
import { z } from "zod";

export const CreateSimulationSchema = z.object({
  userId: z.string().email(),
  missionType: z.enum(["Executive Coaching", "Technical Training"]),
});

export const AcceptMissionSchema = z.object({
  userId: z.string().email(),
  missionId: z.string().regex(/^[0-9a-fA-F]{24}$/),
});
```

#### الملفات المتأثرة (15+ ملف):

- جميع API routes التي تستقبل بيانات من العميل

#### الاختبار:

- [ ] إرسال بيانات غير صحيحة يُرجع 400
- [ ] رسائل الخطأ واضحة ومفيدة
- [ ] البيانات الصحيحة تمر بنجاح

---

## 🟡 الأسبوع الثاني: الأداء وقاعدة البيانات (Week 2: Performance & Database)

### اليوم 1-2: إضافة Database Indexes

#### المهام:

- [ ] تحليل الاستعلامات الأكثر استخداماً
- [ ] إضافة indexes لـ `Simulation` model
- [ ] إضافة indexes لـ `User` model
- [ ] إضافة indexes لـ `Course` model
- [ ] إضافة indexes لـ `Resource` model

#### الكود:

```typescript
// models/Simulation.ts
SimulationSchema.index({ userId: 1, status: 1 });
SimulationSchema.index({ userId: 1, createdAt: -1 });
SimulationSchema.index({ status: 1, createdAt: -1 });

// models/User.ts
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1, status: 1 });
UserSchema.index({ createdAt: -1 });
```

#### الاختبار:

- [ ] تشغيل `db.collection.getIndexes()` للتحقق
- [ ] قياس سرعة الاستعلامات قبل وبعد
- [ ] استخدام MongoDB Compass لتحليل الأداء

---

### اليوم 3-4: تحسين Database Queries

#### المهام:

- [ ] دمج الاستعلامات المتعددة في استعلام واحد
- [ ] استخدام `select()` لتحديد الحقول المطلوبة فقط
- [ ] استخدام `lean()` للاستعلامات read-only
- [ ] إضافة pagination للقوائم الطويلة

#### قبل:

```typescript
const activeMission = await Simulation.findOne({ userId, status: "active" });
const proposals = await Simulation.find({ userId, status: "proposed" });
const requested = await Simulation.findOne({ userId, status: "requested" });
```

#### بعد:

```typescript
const [missions] = await Simulation.aggregate([
  { $match: { userId } },
  {
    $facet: {
      active: [{ $match: { status: "active" } }, { $limit: 1 }],
      proposals: [{ $match: { status: "proposed" } }],
      requested: [{ $match: { status: "requested" } }, { $limit: 1 }],
    },
  },
]);
```

#### الملفات المتأثرة:

- `app/api/simulation/route.ts`
- `app/api/admin/users/route.ts`
- `app/api/user/*/route.ts`

---

### اليوم 5-6: إضافة React Query للـ Caching

#### المهام:

- [ ] تثبيت React Query

```bash
npm install @tanstack/react-query
```

- [ ] إنشاء QueryClient Provider
- [ ] تحويل `useEffect` + `fetch` إلى `useQuery`
- [ ] إضافة `useMutation` للعمليات التي تغير البيانات

#### الكود:

```typescript
// components/providers/QueryProvider.tsx
'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                staleTime: 60 * 1000, // 1 minute
                cacheTime: 5 * 60 * 1000, // 5 minutes
            },
        },
    }));

    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
```

#### مثال الاستخدام:

```typescript
// قبل
useEffect(() => {
  const fetchMission = async () => {
    const res = await fetch(`/api/simulation?userId=${userId}`);
    const data = await res.json();
    setMissionState(data);
  };
  fetchMission();
}, []);

// بعد
const { data: missionState, isLoading } = useQuery({
  queryKey: ["simulation", userId],
  queryFn: () =>
    fetch(`/api/simulation?userId=${userId}`).then((r) => r.json()),
});
```

#### الملفات المتأثرة (10+ ملف):

- جميع الصفحات التي تستخدم `useEffect` + `fetch`

---

### اليوم 7: إضافة Rate Limiting

#### المهام:

- [ ] إنشاء `lib/rate-limit.ts`
- [ ] إضافة rate limiting لـ AI endpoints
- [ ] إضافة rate limiting لـ authentication endpoints
- [ ] إضافة rate limiting لـ API endpoints العامة

#### الكود:

```typescript
// lib/rate-limit.ts
export const aiLimiter = rateLimit({
  interval: 15 * 60 * 1000, // 15 minutes
  uniqueTokenPerInterval: 100,
});

// app/api/analyze-cv/route.ts
const rateLimitResult = await aiLimiter.check(5, session.user.email);
if (!rateLimitResult.success) {
  return NextResponse.json({ error: "Too many requests" }, { status: 429 });
}
```

#### الملفات المتأثرة:

- `app/api/analyze-cv/route.ts`
- `app/api/interview/*/route.ts`
- `app/api/auth/login/route.ts`

---

## 🟢 الأسبوع الثالث: Error Handling & Logging (Week 3)

### اليوم 1-2: إضافة Error Handling موحد

#### المهام:

- [ ] إنشاء `lib/errors.ts` مع custom error classes
- [ ] إنشاء `handleAPIError` function
- [ ] تطبيق error handling على جميع API routes
- [ ] إضافة Error Boundaries للـ frontend

#### الملفات الجديدة:

- `lib/errors.ts`
- `components/ErrorBoundary.tsx`
- `app/error.tsx`
- `app/global-error.tsx`

#### الكود:

```typescript
// lib/errors.ts
export class APIError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string,
  ) {
    super(message);
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

// components/ErrorBoundary.tsx
("use client");
export class ErrorBoundary extends Component {
  // ... implementation
}
```

---

### اليوم 3-4: إضافة Logging System

#### المهام:

- [ ] تثبيت Winston

```bash
npm install winston
```

- [ ] إنشاء `lib/logger.ts`
- [ ] استبدال جميع `console.log` بـ `logger.info`
- [ ] استبدال جميع `console.error` بـ `logger.error`
- [ ] إضافة log rotation

#### الكود:

```typescript
// lib/logger.ts
import winston from "winston";

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "warn" : "debug",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

export default logger;
```

#### الملفات المتأثرة (50+ ملف):

- جميع الملفات التي تستخدم `console.log` أو `console.error`

---

### اليوم 5-6: إضافة Sentry للـ Error Tracking

#### المهام:

- [ ] إنشاء حساب Sentry
- [ ] تثبيت Sentry SDK

```bash
npm install @sentry/nextjs
```

- [ ] تشغيل Sentry wizard

```bash
npx @sentry/wizard@latest -i nextjs
```

- [ ] تكوين Sentry
- [ ] اختبار error tracking

#### الملفات الجديدة:

- `sentry.client.config.ts`
- `sentry.server.config.ts`
- `sentry.edge.config.ts`

---

### اليوم 7: إضافة Middleware للمصادقة

#### المهام:

- [ ] إنشاء `middleware.ts` في root
- [ ] نقل منطق المصادقة من `layout.tsx` إلى middleware
- [ ] إصلاح redirect loops

#### الكود:

```typescript
// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      const path = req.nextUrl.pathname;

      // Public paths
      if (path.startsWith("/login") || path.startsWith("/register")) {
        return true;
      }

      // Protected paths
      if (path.startsWith("/dashboard") || path.startsWith("/assessment")) {
        return !!token;
      }

      return true;
    },
  },
});

export const config = {
  matcher: ["/dashboard/:path*", "/assessment/:path*", "/admin/:path*"],
};
```

---

## 🔵 الأسبوع الرابع: Testing & Documentation (Week 4)

### اليوم 1-3: إضافة Unit Tests

#### المهام:

- [ ] تثبيت Jest و React Testing Library

```bash
npm install -D jest @testing-library/react @testing-library/jest-dom jest-environment-jsdom
```

- [ ] إنشاء `jest.config.js`
- [ ] كتابة tests للـ API routes
- [ ] كتابة tests للـ utility functions
- [ ] كتابة tests للـ components

#### الملفات الجديدة:

```
__tests__/
├── api/
│   ├── simulation.test.ts
│   ├── auth.test.ts
│   └── user.test.ts
├── lib/
│   ├── deepseek.test.ts
│   └── validation.test.ts
└── components/
    ├── Sidebar.test.tsx
    └── ErrorBoundary.test.tsx
```

#### مثال Test:

```typescript
// __tests__/api/simulation.test.ts
import { GET } from "@/app/api/simulation/route";

describe("Simulation API", () => {
  it("should return 401 if not authenticated", async () => {
    const req = new Request("http://localhost:3000/api/simulation");
    const response = await GET(req);
    expect(response.status).toBe(401);
  });
});
```

---

### اليوم 4-5: إضافة Documentation

#### المهام:

- [ ] إضافة JSDoc لجميع functions
- [ ] إنشاء `README.md` شامل
- [ ] إنشاء `API_DOCUMENTATION.md`
- [ ] إنشاء `DEPLOYMENT.md`
- [ ] إنشاء `CONTRIBUTING.md`

#### الملفات الجديدة:

- `README.md` (تحديث)
- `docs/API_DOCUMENTATION.md`
- `docs/DEPLOYMENT.md`
- `docs/CONTRIBUTING.md`
- `docs/ARCHITECTURE.md`

---

### اليوم 6-7: Final Testing & Deployment Prep

#### المهام:

- [ ] تشغيل جميع Tests
- [ ] إصلاح أي bugs متبقية
- [ ] تحسين الأداء
- [ ] تحديث Environment Variables
- [ ] إنشاء Production Build

```bash
npm run build
```

- [ ] اختبار Production Build محلياً

```bash
npm run start
```

- [ ] إعداد CI/CD Pipeline (GitHub Actions)

#### الملفات الجديدة:

- `.github/workflows/ci.yml`
- `.github/workflows/deploy.yml`

---

## ✅ Checklist النهائي قبل الإطلاق

### الأمان:

- [ ] NextAuth.js مفعّل ويعمل
- [ ] جميع API routes محمية
- [ ] rawPassword محذوف من DB
- [ ] Input validation مطبق في كل مكان
- [ ] Rate limiting مفعّل
- [ ] HTTPS مفعّل في Production
- [ ] Environment variables آمنة

### الأداء:

- [ ] Database indexes مضافة
- [ ] Queries محسّنة
- [ ] React Query مطبق
- [ ] Caching مفعّل
- [ ] Images محسّنة
- [ ] Bundle size مقبول (<500KB)

### الجودة:

- [ ] Error handling موحد
- [ ] Logging system مطبق
- [ ] Sentry مفعّل
- [ ] Tests تمر بنجاح
- [ ] TypeScript errors = 0
- [ ] ESLint warnings = 0

### التوثيق:

- [ ] README.md محدّث
- [ ] API Documentation موجودة
- [ ] Deployment guide موجود
- [ ] JSDoc مضاف للـ functions

### الاختبار:

- [ ] Unit tests تمر
- [ ] Integration tests تمر
- [ ] Manual testing مكتمل
- [ ] Performance testing مكتمل
- [ ] Security testing مكتمل

---

## 📊 مقاييس النجاح (Success Metrics)

### قبل الإصلاحات:

- Security Score: **3/10** ❌
- Performance Score: **4/10** ⚠️
- Code Quality: **5/10** ⚠️
- Test Coverage: **0%** ❌

### بعد الإصلاحات (المتوقع):

- Security Score: **9/10** ✅
- Performance Score: **8/10** ✅
- Code Quality: **9/10** ✅
- Test Coverage: **>70%** ✅

---

## 🎯 الخلاصة

هذه الخطة تغطي 4 أسابيع من العمل المكثف لإصلاح المشاكل الحرجة في المشروع.

**الأولوية القصوى**: الأسبوع الأول (الأمان) - يجب إكماله قبل أي شيء آخر!

**ملاحظة**: يمكن تعديل الجدول الزمني حسب حجم الفريق والموارد المتاحة.
