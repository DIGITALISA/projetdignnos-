"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Printer, Shield, FileText, Calendar, Building2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface LegalDocumentProps {
    title: string;
    subtitle?: string;
    lastUpdated: string;
    version: string;
    children: React.ReactNode;
}

export default function LegalDocument({
    title,
    subtitle,
    lastUpdated,
    version,
    children
}: LegalDocumentProps) {
    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20">
            {/* Header */}
            <div className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 shadow-sm print:hidden">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-500">
                            <ArrowLeft size={20} />
                        </Link>
                        <div className="flex items-center gap-2">
                            <Shield className="w-5 h-5 text-blue-600" />
                            <span className="font-bold text-sm tracking-widest text-slate-900 dark:text-white uppercase hidden md:inline-block">
                                Centre Juridique
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="gap-2 hidden md:flex"
                            onClick={handlePrint}
                        >
                            <Printer size={14} />
                            Imprimer
                        </Button>
                        <div className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100 dark:border-blue-800">
                            V.{version}
                        </div>
                    </div>
                </div>
            </div>

            {/* Document Content */}
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
                >
                    {/* Official Banner */}
                    <div className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-100 dark:border-slate-800 p-8 md:p-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <Building2 size={200} />
                        </div>
                        
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 text-blue-600 mb-4 font-bold text-xs uppercase tracking-[0.2em]">
                                <FileText size={14} />
                                Document Officiel
                            </div>
                            <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 dark:text-white mb-4 leading-tight">
                                {title}
                            </h1>
                            {subtitle && (
                                <p className="text-slate-500 dark:text-slate-400 text-lg mb-6 max-w-2xl font-light">
                                    {subtitle}
                                </p>
                            )}
                            
                            <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-slate-400 uppercase tracking-wider">
                                <div className="flex items-center gap-2">
                                    <Calendar size={14} />
                                    Mise à jour : {lastUpdated}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Shield size={14} />
                                    MA-TRAINING-CONSULTING
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-8 md:p-12 prose prose-slate dark:prose-invert max-w-none prose-headings:font-serif prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-a:text-blue-600">
                        {children}
                    </div>

                    {/* Footer */}
                    <div className="bg-slate-50 dark:bg-slate-950/50 p-8 border-t border-slate-100 dark:border-slate-800 text-center">
                        <p className="text-xs text-slate-400 font-medium">
                            © 2026 DIGITALISA - MA-TRAINING-CONSULTING. Tous droits réservés.<br/>
                            Ce document est protégé par les lois internationales sur la propriété intellectuelle.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
