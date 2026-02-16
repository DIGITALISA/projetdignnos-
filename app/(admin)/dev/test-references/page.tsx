import ReferenceIdTester from "@/components/ReferenceIdTester";

/**
 * 🧪 Developer Testing Page
 * صفحة اختبار للمطورين - للتحقق من المعرفات
 */
export default function DevTestPage() {
    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-blue-950 dark:to-slate-900 py-12">
            <ReferenceIdTester />
        </div>
    );
}
