"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Search, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/ui/navbar";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function VerificationPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerificationContent />
        </Suspense>
    );
}

function VerificationContent() {
    const searchParams = useSearchParams();
    const [certId, setCertId] = useState("");
    const [status, setStatus] = useState<'idle' | 'loading' | 'valid' | 'invalid'>('idle');

    useEffect(() => {
        const id = searchParams.get('id');
        if (id) {
            setCertId(id);
            // We need to call the verify logic. I'll refactor handleVerify to be callable.
            triggerVerify(id);
        }
    }, [searchParams]);

    const [result, setResult] = useState<any>(null);

    const triggerVerify = async (id: string) => {
        setStatus('loading');
        setResult(null);

        try {
            const response = await fetch(`/api/verify-document?id=${id.trim().toUpperCase()}`);
            const data = await response.json();

            if (data.success) {
                setResult(data.data);
                setStatus('valid');
            } else {
                setStatus('invalid');
            }
        } catch (error) {
            console.error("Verification error:", error);
            setStatus('invalid');
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        triggerVerify(certId);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar />

            <main className="container mx-auto px-4 pt-32 pb-16">
                <div className="max-w-2xl mx-auto text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-6"
                    >
                        <ShieldCheck className="w-8 h-8" />
                    </motion.div>
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">Verify a Certificate</h1>
                    <p className="text-lg text-slate-600">
                        Ensure the authenticity of a CareerUpgrade certification. Enter the unique Certificate ID located at the bottom left of the document.
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8"
                >
                    <form onSubmit={handleVerify} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Certificate ID</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="e.g. CERT-2026-8842"
                                    value={certId}
                                    onChange={(e) => setCertId(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-mono text-lg transition-all placeholder:text-slate-400"
                                />
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            </div>
                        </div>
                        <button
                            disabled={status === 'loading' || !certId}
                            className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg flex items-center justify-center gap-2"
                        >
                            {status === 'loading' ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Verifying...
                                </>
                            ) : (
                                "Verify Authenticity"
                            )}
                        </button>
                    </form>

                    {/* Results */}
                    {status === 'valid' && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-8 p-6 bg-green-50 rounded-xl border border-green-100"
                        >
                            <div className="flex items-start gap-4">
                                <div className="mt-1 bg-green-100 p-2 rounded-full text-green-600">
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-green-800">Verified {result?.type === 'recommendation' ? 'Recommendation' : 'Certificate'} Found</h3>
                                    <div className="mt-2 space-y-1 text-sm text-green-700">
                                        <p><span className="font-semibold">Recipient:</span> {result?.userName}</p>
                                        <p><span className="font-semibold">{result?.type === 'recommendation' ? 'Subject' : 'Course'}:</span> {result?.title}</p>
                                        <p><span className="font-semibold">Issued:</span> {new Date(result?.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                        <p><span className="font-semibold">Status:</span> {result?.status}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {status === 'invalid' && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-8 p-6 bg-red-50 rounded-xl border border-red-100 text-center"
                        >
                            <h3 className="text-lg font-bold text-red-800">Invalid Certificate ID</h3>
                            <p className="text-red-600 mt-1">We could not find a certificate with this ID. Please check the number and try again.</p>
                        </motion.div>
                    )}
                </motion.div>
            </main>
        </div>
    );
}
