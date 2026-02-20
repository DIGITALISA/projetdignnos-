"use client";

import { useState, useEffect } from "react";
import { 
    Save, 
    Plus, 
    Trash2, 
    Link as LinkIcon, 
    ExternalLink, 
    Type, 
    Layout, 
    Check, 
    Loader2,
    ShieldCheck,
    Twitter,
    Linkedin,
    Globe,
    ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FooterLink {
    id: string;
    label: string;
    href: string;
}

interface FooterColumn {
    id: string;
    title: string;
    titleHref?: string;
    links: FooterLink[];
}

interface FooterConfig {
    brandName: string;
    brandDescription: string;
    columns: FooterColumn[];
    socials: {
        linkedin: string;
        twitter: string;
    };
    rightsText: string;
}

const DEFAULT_CONFIG: FooterConfig = {
    brandName: "SuccessStrategy",
    brandDescription: "The industrial operating system for career growth and strategic transformation. Verify, endorse, dominate.",
    columns: [
        {
            id: "col-1",
            title: "The Protocol",
            links: [
                { id: "l1", label: "Skill Scan", href: "#" },
                { id: "l2", label: "Pressure Test", href: "#" },
                { id: "l3", label: "Board Access", href: "#" },
                { id: "l4", label: "Executive Vault", href: "#" },
            ]
        },
        {
            id: "col-2",
            title: "B2B Protocol",
            links: [
                { id: "l5", label: "Corporate Audit", href: "/digitalization" },
                { id: "l6", label: "Team Training", href: "/digitalization" },
                { id: "l7", label: "Scale Architecture", href: "/digitalization" },
                { id: "l8", label: "Industrial IA", href: "/digitalization" },
            ]
        },
        {
            id: "col-3",
            title: "Intelligence",
            links: [
                { id: "l9", label: "Legal Warrant", href: "#" },
                { id: "l10", label: "Privacy Policy", href: "#" },
                { id: "l11", label: "Cookie Protocol", href: "#" },
                { id: "l12", label: "System Status", href: "#" },
            ]
        }
    ],
    socials: {
        linkedin: "#",
        twitter: "#"
    },
    rightsText: ".MA-TRAINING-CONSULTING 2026 ©"
};

export default function FooterManager() {
    const [config, setConfig] = useState<FooterConfig>(DEFAULT_CONFIG);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const res = await fetch("/api/admin/config");
            const data = await res.json();
            if (data.success && data.configs.footer_config) {
                setConfig(JSON.parse(data.configs.footer_config));
            }
        } catch (error) {
            console.error("Failed to fetch footer config:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch("/api/admin/config", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    configs: {
                        footer_config: JSON.stringify(config)
                    }
                })
            });

            if (res.ok) {
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
            }
        } catch (error) {
            console.error("Save error:", error);
            alert("Failed to save footer configuration");
        } finally {
            setIsSaving(false);
        }
    };

    const addLink = (columnId: string) => {
        setConfig(prev => ({
            ...prev,
            columns: prev.columns.map(col => 
                col.id === columnId 
                ? { ...col, links: [...col.links, { id: Date.now().toString(), label: "New Link", href: "#" }] }
                : col
            )
        }));
    };

    const removeLink = (columnId: string, linkId: string) => {
        setConfig(prev => ({
            ...prev,
            columns: prev.columns.map(col => 
                col.id === columnId 
                ? { ...col, links: col.links.filter(l => l.id !== linkId) }
                : col
            )
        }));
    };

    const updateLink = (columnId: string, linkId: string, field: keyof FooterLink, value: string) => {
        setConfig(prev => ({
            ...prev,
            columns: prev.columns.map(col => 
                col.id === columnId 
                ? { ...col, links: col.links.map(l => l.id === linkId ? { ...l, [field]: value } : l) }
                : col
            )
        }));
    };

    const updateColumnTitle = (columnId: string, field: 'title' | 'titleHref', value: string) => {
        setConfig(prev => ({
            ...prev,
            columns: prev.columns.map(col => col.id === columnId ? { ...col, [field]: value } : col)
        }));
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-6xl pb-20">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Footer Manager</h1>
                    <p className="text-slate-500 mt-1">Customize your platform&apos;s footer content, links, and branding.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 hover:-translate-y-0.5 transition-all disabled:opacity-70"
                    >
                        {isSaving ? <Loader2 className="animate-spin" size={18} /> : 
                         saved ? <Check size={18} /> : <Save size={18} />}
                        {isSaving ? "Saving..." : saved ? "Config Saved" : "Save Changes"}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Branding Column */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                        <SectionHeader icon={ShieldCheck} title="Branding" color="blue" />
                        
                        <div className="space-y-4">
                            <InputField 
                                label="Brand Name" 
                                value={config.brandName} 
                                onChange={(v) => setConfig({ ...config, brandName: v })} 
                                icon={Type}
                            />
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Brand Description</label>
                                <textarea 
                                    value={config.brandDescription}
                                    onChange={(e) => setConfig({ ...config, brandDescription: e.target.value })}
                                    className="w-full px-5 py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold min-h-[120px] focus:ring-2 focus:ring-blue-500/10 outline-none transition-all"
                                />
                            </div>
                        </div>

                        <SectionHeader icon={Globe} title="Social Media" color="indigo" />
                        <div className="space-y-4">
                            <InputField 
                                label="LinkedIn URL" 
                                value={config.socials.linkedin} 
                                onChange={(v) => setConfig({ ...config, socials: { ...config.socials, linkedin: v } })} 
                                icon={Linkedin}
                            />
                            <InputField 
                                label="Twitter URL" 
                                value={config.socials.twitter} 
                                onChange={(v) => setConfig({ ...config, socials: { ...config.socials, twitter: v } })} 
                                icon={Twitter}
                            />
                        </div>

                        <SectionHeader icon={Check} title="Legal" color="amber" />
                        <InputField 
                            label="Rights Text" 
                            value={config.rightsText} 
                            onChange={(v) => setConfig({ ...config, rightsText: v })} 
                            icon={ArrowRight}
                        />
                    </div>
                </div>

                {/* Links Columns */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid md:grid-cols-1 gap-6">
                        {config.columns.map((col, cIdx) => (
                            <div key={col.id} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                                            <Layout size={18} />
                                        </div>
                                        Column {cIdx + 1}
                                    </h2>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <InputField 
                                        label="Column Title" 
                                        value={col.title} 
                                        onChange={(v) => updateColumnTitle(col.id, 'title', v)} 
                                        placeholder="e.g. Products"
                                    />
                                    <InputField 
                                        label="Title Link (Optional)" 
                                        value={col.titleHref || ""} 
                                        onChange={(v) => updateColumnTitle(col.id, 'titleHref', v)} 
                                        placeholder="e.g. https://..."
                                        icon={ExternalLink}
                                    />
                                </div>

                                <div className="space-y-4 pt-4 border-t border-slate-50">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Link Items</span>
                                        <button 
                                            onClick={() => addLink(col.id)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold hover:bg-blue-100 transition-colors"
                                        >
                                            <Plus size={12} /> Add Link
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        {col.links.map((link) => (
                                            <div key={link.id} className="group relative flex items-center gap-3 p-4 bg-slate-50 rounded-2xl hover:bg-slate-100/50 transition-all border border-transparent hover:border-slate-200">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                                                    <div className="relative">
                                                        <input 
                                                            type="text" 
                                                            value={link.label}
                                                            onChange={(e) => updateLink(col.id, link.id, 'label', e.target.value)}
                                                            className="w-full bg-transparent border-none p-0 text-sm font-bold focus:ring-0 outline-none"
                                                            placeholder="Label"
                                                        />
                                                        <div className="absolute -bottom-1 left-0 w-full h-px bg-slate-300 transform scale-x-0 group-focus-within:scale-x-100 transition-transform" />
                                                    </div>
                                                    <div className="relative flex items-center gap-2 text-slate-400">
                                                        <LinkIcon size={14} />
                                                        <input 
                                                            type="text" 
                                                            value={link.href}
                                                            onChange={(e) => updateLink(col.id, link.id, 'href', e.target.value)}
                                                            className="w-full bg-transparent border-none p-0 text-xs font-medium focus:ring-0 outline-none truncate"
                                                            placeholder="URL"
                                                        />
                                                    </div>
                                                </div>
                                                <button 
                                                    onClick={() => removeLink(col.id, link.id)}
                                                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-white rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        ))}

                                        {col.links.length === 0 && (
                                            <div className="text-center py-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                                                <p className="text-xs font-medium text-slate-400 italic">No links in this column</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

function SectionHeader({ icon: Icon, title, color }: { icon: React.ElementType, title: string, color: string }) {
    const colors = {
        blue: "bg-blue-50 text-blue-600",
        indigo: "bg-indigo-50 text-indigo-600",
        amber: "bg-amber-50 text-amber-600",
    };
    return (
        <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-3">
            <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center", colors[color as keyof typeof colors])}>
                <Icon size={14} />
            </div>
            {title}
        </h2>
    );
}

function InputField({ label, value, onChange, type = "text", placeholder = "", icon: Icon }: { label: string, value: string, onChange: (v: string) => void, type?: string, placeholder?: string, icon?: React.ElementType }) {
    return (
        <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{label}</label>
            <div className="relative">
                {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />}
                <input
                    type={type}
                    value={value}
                    placeholder={placeholder}
                    onChange={(e) => onChange(e.target.value)}
                    className={cn(
                        "w-full py-3 bg-slate-50 border-none rounded-2xl text-sm font-bold focus:ring-2 focus:ring-blue-500/10 outline-none transition-all",
                        Icon ? "pl-12 pr-5" : "px-5"
                    )}
                />
            </div>
        </div>
    );
}
