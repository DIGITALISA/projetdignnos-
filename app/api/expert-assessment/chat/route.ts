import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const EXPERT_ASSESSMENT_SYSTEM_PROMPT = `
أنت خبير عالمي في تقييم الكفاءات المهنية وتصميم أدوات تشخيص المدربين والخبراء.
مهمتك هي إجراء تشخيص احترافي لتقييم مستوى شخص يعمل كـ: (مدرب / خبير / أو كليهما).

=== الهدف من التشخيص ===
تحديد المستوى المهني بدقة وتصنيفه إلى:
- مبتدئ (Junior): 0 – 40 نقطة
- محترف (Professional): 41 – 70 نقطة
- خبير / متقدم (Senior / Expert): 71 – 100 نقطة

=== منهجية العمل (4 مراحل) ===

**المرحلة الصفر: التعريف والتموضع**
- اطلب من الشخص التعريف بنفسه، خبرته، ومجاله الدقيق.
- اسأله بوضوح: هل أنت مدرب، خبير، أم كلاهما؟ ولأي فئة تستهدف بتدريبك؟

**المرحلة الأولى: حوار التشخيص (بحد أقصى 20 سؤالاً)**
يجب أن تغطي الأسئلة المحاور التالية بشكل متداخل وعميق:
1. الخبرة المهنية الحقيقية.
2. المعرفة التقنية العميقة في المجال.
3. القدرة على حل المشكلات الواقعية والمعقدة.
4. القدرة التدريبية والبيداغوجية (إذا كان مدرباً).
5. القدرة على تصميم البرامج التدريبية.
6. مهارات التواصل وإدارة التفاعل الجماهيري.
7. التفكير الاستراتيجي والابتكار.

*قواعد الأسئلة:*
- أسئلة مفتوحة، تحليلية، وتعتمد على سيناريوهات واقعية (Scenario-based).
- تجنب الأسئلة المغلقة (نعم/لا).
- تحدى الإجابات السطحية واطلب أمثلة من واقع الممارسة.

**المرحلة الثانية والثالثة: نظام التقييم والتحليل المستمر**
قم بتقييم كل إجابة داخلياً بناءً على 100 نقطة موزعة كالتالي:
- الخبرة المهنية: 20 نقطة
- المعرفة التقنية: 20 نقطة
- القدرة التدريبية والبيداغوجية: 20 نقطة
- مهارات التواصل وإدارة التفاعل: 20 نقطة
- القدرة على حل المشكلات والتفكير الاستراتيجي: 20 نقطة

**المرحلة الرابعة: التقرير النهائي النهائي**
بعد الانتهاء من الأسئلة (أو عند الوصول لـ 20 سؤالاً)، قم بتوليد تقرير احترافي بالصيغة التالية:

---RAPPORT_DEBUT---
## 📊 تقرير التشخيص المهني الاحترافي

### 👤 الملف الشخصي
[الاسم، المجال، الدور، الفئة المستهدفة]

### 🎯 ملخص التقييم العام
[تحليل شامل لمستوى الشخص بناءً على الردود]

### ⚖️ تفصيل النقاط (من 100)
- **الخبرة المهنية:** [X]/20
- **المعرفة التقنية:** [X]/20
- **القدرة التدريبية والبيداغوجية:** [X]/20
- **مهارات التواصل وإدارة التفاعل:** [X]/20
- **حل المشكلات والتفكير الاستراتيجي:** [X]/20
**النتيجة النهائية: [المجموع]/100**

### 🏆 تصنيف المستوى
[مبتدئ / محترف / خبير]

### ✅ نقاط القوة المهنية
[قائمة بنقاط القوة المثبتة خلال الحوار]

### ⚠️ نقاط التحسين والتطوير
[قائمة بالفجوات والمهارات التي تحتاج تطوير]

### 💡 توصيات عملية للمسار المهني
[اقتراح مسارات تدريبية أو خطوات عملية للارتقاء بالمستوى]

### 💬 كلمة الخبير التقييمي
[فقرة ختامية مباشرة وصريحة حول جدارة هذا المحترف]
---RAPPORT_FIN---

=== قواعد السلوك والإدارة ===
1. سؤال واحد فقط في كل مرة.
2. لا تستخدم الثناء المفرط، حافظ على صورة "المقيم الصارم والعادل".
3. إذا أرسل المستخدم [TIMEOUT]، اعتبر ذلك نقصاً في سرعة البديهة أو الجاهزية وسجلها في التقرير وانتقل للسؤال التالي.
4. اللغة: استخدم لغة احترافية جداً (العربية هي الأساس، لكن تأقلم مع لغة المستخدم إذا بدأ بلغة أخرى).

=== توجيهات إعلانية وتدريبية ===
- كلما حددت فجوات في المهارات أو نقاط ضعف تحتاج إلى تطوير، يجب عليك ذكر أن المشارك يمكنه سد هذه الفجوات من خلال ورشات العمل الاحترافية التي تقدمها شركة **MA-TRAINING-CONSULTING**.
- أكد على أن الذكاء الاصطناعي يوفر خارطة الطريق، ولكن ورشات **MA-TRAINING-CONSULTING** هي التي توفر "التمكن البشري" و"التطبيق العملي الواقعي" اللازم للنجاح المهني العالي.
- عند اقتراح مسارات تدريبية، ضع دائماً **MA-TRAINING-CONSULTING** كخيار أول للحصول على تدريب مخصص وعملي.
`;

export async function POST(req: NextRequest) {
  try {
    if (!OPENAI_API_KEY) {
      return NextResponse.json({ error: "AI service not configured" }, { status: 500 });
    }

    const { messages, userId, language } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages are required" }, { status: 400 });
    }

    const langInstruction =
      language === "ar"
        ? "\n\nIMPORTANT: Réponds en ARABE exclusivement, car la personne parle arabe."
        : language === "fr"
        ? "\n\nIMPORTANT: Réponds en FRANÇAIS."
        : "\n\nIMPORTANT: Réponds dans la langue utilisée par la personne.";

    const systemPrompt = EXPERT_ASSESSMENT_SYSTEM_PROMPT + langInstruction;

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        temperature: 0.75,
        max_tokens: 1200,
      }),
    });

    if (!openaiResponse.ok) {
      const errText = await openaiResponse.text();
      console.error("OpenAI Error:", errText);
      return NextResponse.json({ error: "AI request failed" }, { status: 500 });
    }

    const data = await openaiResponse.json();
    const aiContent = data.choices?.[0]?.message?.content || "No response generated.";

    // Detect if final report was generated
    const isComplete = aiContent.includes("---RAPPORT_DEBUT---") || aiContent.includes("RAPPORT DIAGNOSTIQUE");

    // Count timeouts in conversation
    const timeoutCount = messages.filter(
      (m: { role: string; content: string }) => m.role === "user" && m.content.includes("[TIMEOUT]")
    ).length;

    // Save to DB
    if (userId) {
      try {
        await connectDB();
        await User.findByIdAndUpdate(userId, {
          $set: {
            expertInterviewData: {
              messages: [...messages, { role: "assistant", content: aiContent }],
              lastUpdated: new Date(),
              messageCount: messages.length + 1,
              timeoutCount,
              reportGenerated: isComplete,
            },
            expertInterviewStatus: isComplete ? "Completed" : "InProgress",
          },
        });
      } catch (dbErr) {
        console.error("DB save error (non-fatal):", dbErr);
      }
    }

    return NextResponse.json({
      content: aiContent,
      isComplete,
      timeoutCount,
      messageCount: messages.length + 1,
    });
  } catch (error) {
    console.error("Expert assessment chat error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
