"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { Info, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function DemoDisclaimer() {
    const { t, dir } = useLanguage();
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`fixed bottom-6 ${dir === 'rtl' ? 'right-6' : 'left-6'} z-40 max-w-sm`}
            >
                <div className="bg-amber-50 border border-amber-200 shadow-lg rounded-xl p-4 flex items-start gap-3">
                    <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-amber-800 text-sm font-medium leading-relaxed">
                            {t.demoDisclaimer?.text}
                        </p>
                    </div>
                    <button
                        onClick={() => setIsVisible(false)}
                        className="text-amber-400 hover:text-amber-700 transition:-colors ml-1"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
