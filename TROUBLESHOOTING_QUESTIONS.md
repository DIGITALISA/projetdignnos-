# دليل تشخيص مشاكل توليد الأسئلة والوثائق

## Troubleshooting Guide for Question & Document Generation Issues

## المشكلة / Problem

النظام يتعلق ولا يعطي الأسئلة التالية أو الوثائق للمشاركين بعد الإجابة.
The system freezes and doesn't provide next questions or documents to participants after they answer.

## الحلول المطبقة / Solutions Implemented

### 1. تسجيل شامل للأخطاء / Comprehensive Error Logging

تم إضافة سجلات تفصيلية في جميع مسارات API:
Detailed logging has been added to all API routes:

- ✅ `/api/interview/next-question`
- ✅ `/api/role-discovery/next-question`
- ✅ `/api/simulation/next-scenario`
- ✅ `/api/cv-generation/start`
- ✅ `/api/cv-generation/next-question`
- ✅ `/api/cv-generation/complete`

**ما يتم تسجيله:**

- وقت بدء الطلب
- معلومات الطلب (البيانات المرسلة)
- مدة المعالجة
- نجاح/فشل العملية
- تفاصيل الأخطاء الكاملة

### 2. التحقق من الاستجابات / Response Validation

تم إضافة فحوصات للتأكد من:

- عدم إرجاع أسئلة أو وثائق فارغة
- وجود محتوى صالح من الذكاء الاصطناعي
- إرجاع رسائل خطأ واضحة ومترجمة

### 3. آلية إعادة المحاولة التلقائية / Automatic Retry Mechanism

تم إضافة نظام إعادة محاولة ذكي في جميع صفحات التقييم:

- ✅ **Interview Page**: إعادة محاولة تلقائية حتى مرتين
- ✅ **Role Discovery Page**: إعادة محاولة تلقائية حتى مرتين
- ✅ **Simulation Page**: إعادة محاولة تلقائية حتى مرتين
- ✅ **CV Generation Page**: إعادة محاولة تلقائية حتى مرتين

**كيف يعمل:**

1. عند فشل الطلب، يحاول النظام مرة أخرى تلقائياً
2. يعرض رسالة للمستخدم: "إعادة المحاولة 1/2..."
3. إذا فشل بعد محاولتين، يعرض رسالة خطأ نهائية
4. رسائل الخطأ مترجمة (عربي، فرنسي، إنجليزي)

### 4. Timeout Protection

تم إضافة حماية من التعليق:

- ✅ `fetchWithTimeout` في جميع الصفحات
- ✅ Timeout: 60 ثانية للأسئلة
- ✅ Timeout: 90 ثانية لتوليد الوثائق (CV Generation Complete)

### 5. كيفية مراقبة السجلات على Vercel / How to Monitor Logs on Vercel

#### الطريقة الأولى: من لوحة التحكم

1. افتح مشروعك على Vercel: https://vercel.com/dashboard
2. اختر المشروع الخاص بك
3. اذهب إلى **Logs** من القائمة الجانبية
4. ستشاهد جميع السجلات في الوقت الفعلي

#### الطريقة الثانية: باستخدام Vercel CLI

```bash
# تثبيت Vercel CLI
npm i -g vercel

# تسجيل الدخول
vercel login

# مشاهدة السجلات المباشرة
vercel logs --follow

# مشاهدة سجلات محددة
vercel logs --since 1h  # آخر ساعة
vercel logs --since 30m # آخر 30 دقيقة
```

### 6. البحث عن الأخطاء في السجلات / Searching for Errors in Logs

ابحث عن هذه العلامات:

```
[API] /api/interview/next-question - Request received
[API] /api/cv-generation/next-question - Request received
[API] Question generation completed in XXXms
[API] Document generation completed in XXXms
[API] Error after XXXms:
[AI] generateNextInterviewQuestion called
[AI] Response received in XXXms
```

**علامات المشاكل:**

- ❌ `[API] Empty question returned from AI`
- ❌ `[API] Empty response from AI`
- ❌ `[API] Question generation failed`
- ❌ `[API] Document generation failed`
- ❌ `[AI] Empty response from AI model`
- ❌ `Error after XXXms` (إذا كان الوقت > 50000ms)
- ❌ `Request timeout`

### 7. الأخطاء الشائعة وحلولها / Common Errors and Solutions

#### خطأ: "AI returned empty response"

**السبب:** الذكاء الاصطناعي لم يرجع محتوى
**الحل:**

1. تحقق من مفتاح API (DEEPSEEK_API_KEY)
2. تحقق من حصة الاستخدام (API quota)
3. راجع سجلات Deepseek API

#### خطأ: "Request timeout" أو "انتهت مهلة الطلب"

**السبب:** الطلب يستغرق وقتاً طويلاً
**الحل:**

- ✅ تم بالفعل زيادة `maxDuration` إلى 60-90 ثانية
- ✅ تم إضافة `fetchWithTimeout` لمنع التعليق
- ✅ نظام إعادة المحاولة يعمل تلقائياً
- تحقق من سرعة الإنترنت
- راجع حالة خدمة Deepseek

#### خطأ: "Retrying 1/2..." يظهر ولا يختفي

**السبب:** النظام يحاول إعادة الطلب
**الحل:**

- انتظر قليلاً (1.5 ثانية بين كل محاولة)
- إذا استمر، تحقق من الاتصال بالإنترنت
- راجع سجلات Vercel للأخطاء

#### خطأ: "Missing CV analysis" أو "بيانات الجلسة مفقودة"

**السبب:** البيانات المطلوبة غير موجودة
**الحل:**

1. تحقق من localStorage في المتصفح
2. تأكد من إكمال الخطوات السابقة
3. أعد تحميل الصفحة
4. ابدأ من جديد إذا لزم الأمر

### 8. اختبار النظام / Testing the System

#### اختبار محلي (Local Testing)

```bash
# شغل السيرفر المحلي
npm run dev

# راقب السجلات في Terminal
# ستظهر جميع السجلات مباشرة
```

#### اختبار على Vercel (Production Testing)

1. افتح الموقع على Vercel
2. افتح Developer Console في المتصفح (F12)
3. اذهب إلى تبويب **Network**
4. جرب إرسال سؤال
5. راقب الطلبات:
   - `/api/interview/next-question`
   - `/api/role-discovery/next-question`
   - `/api/simulation/next-scenario`
   - `/api/cv-generation/next-question`
   - `/api/cv-generation/complete`

### 9. معلومات إضافية للتشخيص / Additional Diagnostic Information

عند حدوث مشكلة، اجمع هذه المعلومات:

1. **وقت حدوث المشكلة** (بالضبط)
2. **رقم السؤال** الذي توقف عنده
3. **المرحلة**: Interview / Role Discovery / Simulation / CV Generation
4. **اللغة المستخدمة** (عربي/فرنسي/إنجليزي)
5. **رسالة الخطأ** (إن وجدت)
6. **عدد محاولات إعادة المحاولة** (Retry count)
7. **لقطة شاشة** من Developer Console

### 10. التواصل للدعم / Contact for Support

إذا استمرت المشكلة:

1. افتح Vercel Logs
2. ابحث عن الأخطاء باستخدام الوقت المحدد
3. انسخ السجلات الكاملة
4. شارك المعلومات مع فريق التطوير

## الملفات المعدلة / Modified Files

### Backend (API Routes)

```
✅ app/api/interview/next-question/route.ts
✅ app/api/role-discovery/next-question/route.ts
✅ app/api/simulation/next-scenario/route.ts
✅ app/api/cv-generation/start/route.ts
✅ app/api/cv-generation/next-question/route.ts
✅ app/api/cv-generation/complete/route.ts
✅ lib/deepseek.ts
```

### Frontend (Pages)

```
✅ app/(dashboard)/assessment/interview/page.tsx
✅ app/(dashboard)/assessment/role-discovery/page.tsx
✅ app/(dashboard)/assessment/simulation/page.tsx
✅ app/(dashboard)/assessment/cv-generation/page.tsx
```

## التحسينات المطبقة / Improvements Applied

- ✅ إضافة نظام إعادة محاولة تلقائي (Auto-retry up to 2 times)
- ✅ تسجيل شامل للأخطاء مع timestamps
- ✅ `fetchWithTimeout` لمنع التعليق
- ✅ `maxDuration` 60-90 ثانية حسب العملية
- ✅ رسائل خطأ مترجمة (AR/FR/EN)
- ✅ Visual feedback للمستخدم أثناء إعادة المحاولة
- ✅ Response validation شاملة

## التحسينات المستقبلية / Future Improvements

- [ ] تخزين مؤقت للأسئلة المولدة
- [ ] إشعارات تلقائية عند حدوث أخطاء
- [ ] لوحة تحكم لمراقبة الأداء
- [ ] تحليل أنماط الأخطاء

---

**تاريخ التحديث:** 2026-02-17
**الإصدار:** 3.0
**الحالة:** ✅ مطبق ونشط على جميع المراحل
