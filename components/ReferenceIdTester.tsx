"use client";

import { useState } from "react";
import {
    validateReferenceId,
    formatReferenceId,
    getDocumentInfo,
    DocumentType,
    DOCUMENT_INFO,
    generateReferenceId,
} from "@/lib/referenceId";
import { CheckCircle2, XCircle, Info, Copy, RefreshCw } from "lucide-react";

/**
 * 🧪 Reference ID Tester Component
 * مكون لاختبار وتوليد المعرفات
 */
export default function ReferenceIdTester() {
    const [testId, setTestId] = useState("");
    const [validationResult, setValidationResult] = useState<ReturnType<typeof validateReferenceId> | null>(null);
    const [generatedId, setGeneratedId] = useState("");
    const [selectedType, setSelectedType] = useState<DocumentType>(DocumentType.CERTIFICATE);

    const handleValidate = () => {
        if (!testId) {
            setValidationResult(null);
            return;
        }
        const result = validateReferenceId(testId);
        setValidationResult(result);
    };

    const handleGenerate = () => {
        const newId = generateReferenceId(selectedType);
        setGeneratedId(newId);
        setTestId(newId);
        setValidationResult(validateReferenceId(newId));
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const docInfo = testId ? getDocumentInfo(testId) : null;

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                    🔐 Reference ID Tester
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                    اختبر وتحقق من صحة معرفات الوثائق
                </p>
            </div>

            {/* Generator Section */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-slate-800">
                <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">
                    📝 توليد معرف جديد
                </h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                            نوع الوثيقة
                        </label>
                        <select
                            value={selectedType}
                            onChange={(e) => setSelectedType(e.target.value as DocumentType)}
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                            {Object.entries(DOCUMENT_INFO).map(([key, info]) => (
                                <option key={key} value={key}>
                                    {info.typeName.ar} ({key})
                                </option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={handleGenerate}
                        className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
                    >
                        <RefreshCw size={18} />
                        توليد معرف جديد
                    </button>
                    {generatedId && (
                        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-1">
                                        معرف جديد تم توليده
                                    </p>
                                    <p className="font-mono text-lg font-bold text-green-900 dark:text-green-300">
                                        {generatedId}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleCopy(generatedId)}
                                    className="p-2 hover:bg-green-100 dark:hover:bg-green-900/40 rounded-lg transition-colors"
                                    title="نسخ"
                                >
                                    <Copy size={18} className="text-green-600 dark:text-green-400" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Validator Section */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg p-6 border border-slate-200 dark:border-slate-800">
                <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">
                    🔍 التحقق من معرف
                </h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
                            أدخل المعرف
                        </label>
                        <input
                            type="text"
                            value={testId}
                            onChange={(e) => {
                                setTestId(e.target.value);
                                setValidationResult(null);
                            }}
                            onBlur={handleValidate}
                            placeholder="مثال: CERT-2026-A1B2C3"
                            className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 outline-none font-mono"
                        />
                    </div>
                    <button
                        onClick={handleValidate}
                        disabled={!testId}
                        className="w-full px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        تحقق من الصحة
                    </button>
                </div>

                {/* Validation Results */}
                {validationResult && (
                    <div className="mt-6 space-y-4">
                        {validationResult.valid ? (
                            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="text-green-600 dark:text-green-400 mt-1" size={20} />
                                    <div className="flex-1">
                                        <h3 className="font-bold text-green-900 dark:text-green-300 mb-2">
                                            ✅ المعرف صحيح
                                        </h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-green-700 dark:text-green-400">النوع:</span>
                                                <span className="font-mono font-bold text-green-900 dark:text-green-300">
                                                    {validationResult.type}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-green-700 dark:text-green-400">السنة:</span>
                                                <span className="font-mono font-bold text-green-900 dark:text-green-300">
                                                    {validationResult.year}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-green-700 dark:text-green-400">الكود:</span>
                                                <span className="font-mono font-bold text-green-900 dark:text-green-300">
                                                    {validationResult.code}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-green-700 dark:text-green-400">المعرف المنسق:</span>
                                                <span className="font-mono font-bold text-green-900 dark:text-green-300">
                                                    {formatReferenceId(testId)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                                <div className="flex items-start gap-3">
                                    <XCircle className="text-red-600 dark:text-red-400 mt-1" size={20} />
                                    <div className="flex-1">
                                        <h3 className="font-bold text-red-900 dark:text-red-300 mb-2">
                                            ❌ المعرف غير صحيح
                                        </h3>
                                        <p className="text-sm text-red-700 dark:text-red-400 mb-2">
                                            <strong>الخطأ:</strong> {validationResult.error}
                                        </p>
                                        {validationResult.suggestion && (
                                            <p className="text-sm text-red-600 dark:text-red-500">
                                                <strong>اقتراح:</strong> {validationResult.suggestion}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Document Info */}
                        {docInfo && (
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                                <div className="flex items-start gap-3">
                                    <Info className="text-blue-600 dark:text-blue-400 mt-1" size={20} />
                                    <div className="flex-1">
                                        <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-3">
                                            📄 معلومات الوثيقة
                                        </h3>
                                        <div className="space-y-3 text-sm">
                                            <div>
                                                <p className="text-blue-700 dark:text-blue-400 font-medium mb-1">
                                                    الاسم:
                                                </p>
                                                <p className="text-blue-900 dark:text-blue-300 font-bold">
                                                    {docInfo.typeName.ar}
                                                </p>
                                                <p className="text-blue-800 dark:text-blue-400 text-xs mt-1">
                                                    {docInfo.typeName.en}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-blue-700 dark:text-blue-400 font-medium mb-1">
                                                    الوصف:
                                                </p>
                                                <p className="text-blue-900 dark:text-blue-300">
                                                    {docInfo.description.ar}
                                                </p>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-blue-200 dark:border-blue-800">
                                                <div>
                                                    <p className="text-blue-700 dark:text-blue-400 text-xs">الموديل:</p>
                                                    <p className="font-mono text-blue-900 dark:text-blue-300 font-bold">
                                                        {docInfo.modelName}
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-blue-700 dark:text-blue-400 text-xs">الحقل:</p>
                                                    <p className="font-mono text-blue-900 dark:text-blue-300 font-bold">
                                                        {docInfo.fieldName}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Documentation */}
            <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800">
                <h3 className="font-bold text-slate-900 dark:text-white mb-3">
                    📚 أنواع المعرفات المدعومة
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(DOCUMENT_INFO).map(([key, info]) => (
                        <div
                            key={key}
                            className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">
                                    {key}
                                </span>
                                <span className="text-xs text-slate-500 dark:text-slate-400">
                                    {info.modelName}
                                </span>
                            </div>
                            <p className="text-sm font-medium text-slate-900 dark:text-white">
                                {info.typeName.ar}
                            </p>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                                {info.description.ar}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
