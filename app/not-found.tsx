"use client";

import Link from "next/link";
import { MoveLeft, Ghost } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl" />
      
      <div className="relative z-10 text-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex justify-center"
        >
          <div className="w-24 h-24 bg-blue-100 rounded-3xl flex items-center justify-center shadow-inner">
            <Ghost className="w-12 h-12 text-blue-600" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-8xl font-black text-slate-900 mb-2 tracking-tighter"
        >
          404
        </motion.h1>

        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-slate-800 mb-4"
        >
          Page Not Found
        </motion.h2>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-slate-500 max-w-md mx-auto mb-8"
        >
          Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or doesn&apos;t exist.
        </motion.p>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 hover:-translate-y-1"
          >
            <MoveLeft size={18} />
            Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
