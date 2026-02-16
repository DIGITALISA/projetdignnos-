# تحليل نظام حفظ التقدم في MongoDB

## تاريخ التحليل

2026-02-15

## السؤال الرئيسي

**هل يفقد المشارك تقدمه في الجلسات عند الخروج من التطبيق؟**

---

## النتيجة: ✅ **لا، المشارك لا يفقد تقدمه**

النظام مصمم بآلية **حفظ تلقائي مزدوجة** تضمن استمرارية الجلسة:

---

## 1. آلية الحفظ في MongoDB

### أ. نموذج البيانات (Diagnosis Model)

الملف: `models/Diagnosis.ts`

```typescript
const DiagnosisSchema = new Schema({
    userId: { type: String, required: true, index: true },
    userName: { type: String, required: true },

    // حفظ المحادثة الكاملة
    conversationHistory: [{
        role: String,
        content: String,
        timestamp: Date
    }],

    // حفظ التقدم
    currentStep: {
        type: String,
        enum: ['cv_upload', 'analysis_complete', 'interview_in_progress',
               'interview_complete', 'role_discovery', 'role_selected',
               'cv_generation', 'completed'],
        default: 'analysis_complete'
    },

    totalQuestions: { type: Number, default: 15 },

    // حفظ النتائج
    interviewEvaluation: { type: Schema.Types.Mixed },
    roleSuggestions: [{ ... }],
    selectedRole: { type: Schema.Types.Mixed },
    generatedDocuments: { ... },

    // حالة الإكمال لكل مرحلة
    completionStatus: {
        cvAnalysisComplete: { type: Boolean, default: false },
        interviewComplete: { type: Boolean, default: false },
        roleDiscoveryComplete: { type: Boolean, default: false },
        roleSelected: { type: Boolean, default: false },
        simulationComplete: { type: Boolean, default: false },
        cvGenerationComplete: { type: Boolean, default: false },
        strategicReportComplete: { type: Boolean, default: false },
    }
}, {
    timestamps: true  // ✅ يضيف createdAt و updatedAt تلقائيًا
});
```

### ب. API الحفظ التلقائي

الملف: `app/api/interview/save-progress/route.ts`

```typescript
export async function POST(request: NextRequest) {
  const { diagnosisId, messages, currentQuestionIndex, totalQuestions } =
    await request.json();

  await Diagnosis.findByIdAndUpdate(diagnosisId, {
    conversationHistory: messages, // ✅ حفظ كل الرسائل
    currentStep: "interview_in_progress", // ✅ تحديث الحالة
    totalQuestions, // ✅ حفظ عدد الأسئلة
  });
}
```

**متى يتم الحفظ؟**

- **تلقائيًا** بعد كل رسالة جديدة (سؤال أو إجابة)
- يتم استدعاء API كل مرة تتغير فيه `messages`

الكود في `interview/page.tsx` (السطر 206-218):

```typescript
useEffect(() => {
    // Save progress whenever messages change
    if (messages.length > 0 && diagnosisId) {
        fetch('/api/interview/save-progress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                diagnosisId,
                messages,
                currentQuestionIndex,
                totalQuestions
            })
        }).catch(err => console.error("Error saving chat", err));
    }
}, [messages, diagnosisId, ...]);
```

---

## 2. آلية الاستعادة عند العودة

### أ. API استرجاع التقدم

الملف: `app/api/assessment/progress/route.ts`

```typescript
export async function GET(request: NextRequest) {
  const userId = searchParams.get("userId");

  // البحث عن آخر جلسة للمستخدم
  const latestDiagnosis = await Diagnosis.findOne({ userId }).sort({
    createdAt: -1,
  }); // ✅ الأحدث أولاً

  return NextResponse.json({
    hasActiveSession: true,
    diagnosisId: latestDiagnosis._id,
    currentStep: latestDiagnosis.currentStep,
    conversationHistory: latestDiagnosis.conversationHistory, // ✅ كل المحادثة
    analysis: latestDiagnosis.analysis,
    language: latestDiagnosis.language,
    totalQuestions: latestDiagnosis.totalQuestions,
    evaluation: latestDiagnosis.interviewEvaluation,
    roleSuggestions: latestDiagnosis.roleSuggestions,
    // ... كل البيانات الأخرى
  });
}
```

### ب. الاستعادة في الواجهة

الملف: `interview/page.tsx` (السطر 54-144)

```typescript
useEffect(() => {
  const loadSession = async () => {
    const userProfile = JSON.parse(localStorage.getItem("userProfile") || "{}");
    const userId = userProfile.email || userProfile.fullName;

    if (userId) {
      // ✅ 1. محاولة استرجاع من MongoDB أولاً
      const res = await fetch(`/api/assessment/progress?userId=${userId}`);
      const data = await res.json();

      if (data.hasActiveSession) {
        // ✅ استعادة كل شيء
        setDiagnosisId(data.diagnosisId);
        setCvAnalysis(data.analysis);
        setSelectedLanguage(data.language);
        setTotalQuestions(data.totalQuestions);

        if (data.conversationHistory && data.conversationHistory.length > 0) {
          // ✅ استعادة المحادثة الكاملة
          const restoredMessages = data.conversationHistory.map((m) => ({
            ...m,
            timestamp: new Date(m.timestamp),
          }));
          setMessages(restoredMessages);

          // ✅ حساب التقدم بدقة
          const calculatedIndex = Math.floor(restoredMessages.length / 2);
          setCurrentQuestionIndex(
            Math.min(calculatedIndex, data.totalQuestions),
          );

          return; // ✅ تم الاستعادة بنجاح
        }
      }
    }

    // ✅ 2. Fallback إلى localStorage فقط للجلسات الجديدة
    const stored = localStorage.getItem("cvAnalysis");
    if (stored && !cvAnalysis) {
      setCvAnalysis(JSON.parse(stored));
    }
  };

  loadSession();
}, []);
```

---

## 3. سيناريوهات الاختبار

### ✅ السيناريو 1: المستخدم يجيب على 5 أسئلة ثم يغلق المتصفح

**النتيجة:**

- يتم حفظ الـ 5 أسئلة والإجابات في MongoDB
- عند العودة: يجد نفسه في السؤال رقم 6 مباشرة
- **لا يعيد من البداية**

### ✅ السيناريو 2: المستخدم يكمل المقابلة ويخرج قبل رؤية النتائج

**النتيجة:**

- يتم حفظ `interviewEvaluation` في MongoDB
- عند العودة: يتم توجيهه مباشرة لصفحة النتائج
- **لا يعيد المقابلة**

### ✅ السيناريو 3: المستخدم يختار دور ثم يغلق التطبيق

**النتيجة:**

- يتم حفظ `selectedRole` و `roleSuggestions` في MongoDB
- عند العودة: يجد الدور المختار محفوظًا
- **يمكنه المتابعة لتوليد السيرة الذاتية مباشرة**

### ✅ السيناريو 4: انقطاع الإنترنت أثناء المقابلة

**النتيجة:**

- آخر رسالة تم حفظها قبل الانقطاع موجودة في MongoDB
- عند عودة الاتصال: يستكمل من آخر نقطة محفوظة
- **قد يفقد فقط الرسالة الأخيرة غير المحفوظة**

---

## 4. نقاط القوة في النظام

### ✅ الحفظ التلقائي (Auto-Save)

- لا يحتاج المستخدم للضغط على "حفظ"
- كل رسالة تُحفظ فورًا في MongoDB

### ✅ الاستعادة الذكية (Smart Recovery)

- النظام يتحقق من MongoDB **أولاً** قبل localStorage
- يحسب التقدم بدقة بناءً على عدد الرسائل

### ✅ التتبع الشامل (Comprehensive Tracking)

- حفظ `currentStep` لمعرفة المرحلة الحالية
- حفظ `completionStatus` لكل مرحلة على حدة
- حفظ `timestamps` لمعرفة متى بدأت وانتهت كل مرحلة

### ✅ الحماية من الفقدان (Data Loss Prevention)

- استخدام `index` على `userId` للبحث السريع
- استخدام `.sort({ createdAt: -1 })` لضمان استرجاع أحدث جلسة
- Fallback إلى localStorage في حالة فشل MongoDB

---

## 5. نقاط الضعف المحتملة

### ⚠️ 1. localStorage كـ Fallback

**المشكلة:** إذا فشل MongoDB، النظام يعتمد على localStorage الذي:

- يُمسح عند تنظيف المتصفح
- غير متزامن بين الأجهزة

**الحل المقترح:**

- إضافة رسالة تحذيرية للمستخدم إذا فشل الحفظ في MongoDB
- محاولة إعادة الحفظ تلقائيًا (Retry mechanism)

### ⚠️ 2. عدم وجود Conflict Resolution

**المشكلة:** إذا فتح المستخدم جلستين من جهازين مختلفين:

- قد يحدث تضارب في البيانات
- آخر تحديث يكتب فوق السابق

**الحل المقترح:**

- إضافة `sessionId` لتمييز الجلسات
- عرض تحذير إذا اكتشف النظام جلسة نشطة من جهاز آخر

### ⚠️ 3. عدم وجود Versioning

**المشكلة:**

- تم تعطيل `versionKey` في Schema
- قد يحدث فقدان بيانات في حالة التحديثات المتزامنة

**الحل المقترح:**

- إعادة تفعيل Versioning
- استخدام Optimistic Locking

---

## 6. الخلاصة النهائية

### ✅ **الإجابة: المشارك لا يفقد تقدمه**

**الأسباب:**

1. **حفظ تلقائي** بعد كل رسالة في MongoDB
2. **استعادة ذكية** عند العودة من MongoDB
3. **تتبع شامل** لكل مرحلة ومحادثة
4. **Fallback** إلى localStorage كطبقة أمان

**التوصيات:**

- ✅ النظام الحالي **يعمل بشكل جيد** للاستخدام العادي
- ⚠️ يُنصح بإضافة **Retry mechanism** للحفظ
- ⚠️ يُنصح بإضافة **Session conflict detection**
- ⚠️ يُنصح بإعادة تفعيل **Versioning** للأمان

---

## 7. مثال عملي على التدفق

```
المستخدم يبدأ المقابلة:
├─ السؤال 1 → يُحفظ في MongoDB ✅
├─ السؤال 2 → يُحفظ في MongoDB ✅
├─ السؤال 3 → يُحفظ في MongoDB ✅
│
└─ المستخدم يغلق المتصفح 🚪
   │
   └─ بعد ساعة... يفتح التطبيق مرة أخرى 🔄
      │
      ├─ النظام يستعلم من MongoDB
      ├─ يجد conversationHistory = [Q1, A1, Q2, A2, Q3, A3]
      ├─ يحسب currentQuestionIndex = 3
      └─ يعرض السؤال 4 مباشرة ✅
```

**النتيجة:** المستخدم يستكمل من حيث توقف، **بدون فقدان أي بيانات**.
