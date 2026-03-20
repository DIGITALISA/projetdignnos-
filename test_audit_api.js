const axios = require('axios');

async function testAudit() {
    const url = 'http://localhost:3000/api/professional/audit';
    
    // Test Case 1: Low Quality
    console.log("--- Testing Low Quality Narrative ---");
    try {
        const res1 = await axios.post(url, {
            narrative: "أنا أحمد من تونس، أبحث عن عمل. درست التجارة وعملت قليلاً في البيع.",
            language: "ar"
        });
        console.log("Result 1 (Criticism):", res1.data.analysis.strategicCriticism);
        console.log("Indicators 1:", res1.data.analysis.indicators.map(i => `${i.label}: ${i.value}`).join(', '));
    } catch (e) {
        console.log("Error 1:", e.response ? e.response.data : e.message);
    }

    // Test Case 2: High Quality
    console.log("\n--- Testing High Quality Narrative ---");
    try {
        const res2 = await axios.post(url, {
            narrative: "أمتلك شهادة ماجستير في إدارة المشاريع من جامعة تونس المنار. بدأت مساري بتربص في بنك الزيتونة لمدة 6 أشهر حيث تعلمت إدارة المخاطر. ثم عملت كمنسق عمليات في شركة صناعية لمدة 3 سنوات، حيث برعت في تحسين سلاسل الإمداد. حالياً أشغل منصب مدير مشاريع أول، حيث أقود فريقاً من 10 أشخاص لرقمنة الخدمات، وقد حققنا نمواً في الكفاءة بنسبة 20%. أطمح لتطوير مهاراتي القيادية الاستراتيجية للدخول في مستوى الإدارة العليا.",
            language: "ar"
        });
        console.log("Result 2 (Criticism):", res2.data.analysis.strategicCriticism);
        console.log("Indicators 2:", res2.data.analysis.indicators.map(i => `${i.label}: ${i.value}`).join(', '));
    } catch (e) {
        console.log("Error 2:", e.response ? e.response.data : e.message);
    }
}

testAudit();
