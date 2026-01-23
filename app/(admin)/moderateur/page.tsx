"use client";

import { motion } from "framer-motion";
import { Users, ShieldCheck, Activity, Key, Lock, Save, Loader2, Check } from "lucide-react";
import { useState, useEffect } from "react";

export default function ModeratorDashboard() {
    const [stats, setStats] = useState([
        { label: "Total Participants", value: "1,280", icon: Users, color: "indigo" },
        { label: "New Requests", value: "15", icon: Activity, color: "blue" },
        { label: "Verified Admins", value: "3", icon: ShieldCheck, color: "green" },
        { label: "Access Logs", value: "154", icon: Key, color: "amber" },
    ]);

    const [adminPassword, setAdminPassword] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await fetch("/api/admin/config");
                const data = await res.json();
                if (data.success && data.configs.ADMIN_PROTECTION_PASSWORD) {
                    setAdminPassword(data.configs.ADMIN_PROTECTION_PASSWORD);
                }
            } catch (error) {
                console.error("Failed to fetch config:", error);
            }
        };
        fetchConfig();
    }, []);

    const handleSavePassword = async () => {
        setIsSaving(true);
        try {
            const res = await fetch("/api/admin/config", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    configs: {
                        ADMIN_PROTECTION_PASSWORD: adminPassword
                    }
                })
            });
            if (res.ok) {
                setIsSaved(true);
                setTimeout(() => setIsSaved(false), 2000);
            }
        } catch (error) {
            console.error("Failed to save password:", error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Modérateur Dashboard</h1>
                    <p className="text-slate-500 mt-2 text-lg">Gérez les accès et surveillez la plateforme.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {stats.map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-100 hover:scale-[1.02] transition-transform"
                    >
                        <div className={`w-14 h-14 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 flex items-center justify-center mb-6`}>
                            <stat.icon size={28} />
                        </div>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-1">{stat.label}</p>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</h3>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Password Protection Management */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white p-10 rounded-[3rem] shadow-xl shadow-indigo-100/50 border border-indigo-50 space-y-8"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                            <Lock size={22} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 tracking-tight">Sécurité des Sections Admin</h2>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-0.5 text-indigo-600">Protection par mot de passe</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <p className="text-sm text-slate-500 leading-relaxed">
                            Définissez le mot de passe requis pour accéder aux sections sensibles de l'administration (Tools AI, Training, Library, Settings).
                        </p>

                        <div className="relative group">
                            <Key className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                            <input
                                type="password"
                                placeholder="Entrez le mot de passe de protection..."
                                className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-indigo-500/20 focus:bg-white rounded-[2rem] text-sm font-bold transition-all outline-none"
                                value={adminPassword}
                                onChange={(e) => setAdminPassword(e.target.value)}
                            />
                        </div>

                        <button
                            onClick={handleSavePassword}
                            disabled={isSaving}
                            className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-bold text-sm uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/20 hover:bg-slate-900 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-70"
                        >
                            {isSaving ? <Loader2 className="animate-spin" size={20} /> : isSaved ? <Check size={20} /> : <Save size={20} />}
                            {isSaving ? "Enregistrement..." : isSaved ? "Mot de passe enregistré !" : "Sauvegarder le mot de passe"}
                        </button>
                    </div>
                </motion.div>

                {/* Help Card */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-indigo-900 rounded-[3rem] p-10 text-white overflow-hidden relative shadow-2xl shadow-indigo-500/20"
                >
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -mr-48 -mt-48" />
                    <div className="relative z-10 h-full flex flex-col justify-between space-y-8">
                        <div>
                            <h2 className="text-3xl font-black tracking-tight mb-4">Rôle du Modérateur</h2>
                            <p className="text-indigo-100 text-lg opacity-80 leading-relaxed">
                                Votre rôle est crucial pour la sécurité. Vous contrôlez qui peut devenir administrateur et vous sécurisez l'accès aux outils de configuration avancés.
                            </p>
                        </div>
                        <button className="px-8 py-4 bg-white text-indigo-900 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-indigo-50 transition-colors shadow-lg self-start">
                            Guide de sécurité
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
