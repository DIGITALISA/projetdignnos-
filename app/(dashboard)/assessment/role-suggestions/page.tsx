"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Target, Clock, CheckCircle, AlertCircle, Award, Sparkles, ChevronDown, ChevronUp, Download, Loader2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface RoleSuggestion {
    title: string;
    matchPercentage: number;
    category: 'ready' | 'future';
    description: string;
    strengths: string[];
    weaknesses: string[];
    requiredCompetencies: string[];
    timeToReady?: string;
}

export default function RoleSuggestionsPage() {
    const router = useRouter();
    const resultsRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(true);
    const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
    const [roleSuggestions, setRoleSuggestions] = useState<RoleSuggestion[]>([]);
    const [expandedRole, setExpandedRole] = useState<string | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        const loadProgress = async () => {
            const storedCV = localStorage.getItem('cvAnalysis');
            const storedLanguage = localStorage.getItem('selectedLanguage');
            const storedRoles = localStorage.getItem('roleSuggestions');
            const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
            const userId = userProfile.email || userProfile.fullName;

            if (storedCV && storedRoles) {
                setRoleSuggestions(JSON.parse(storedRoles));
                setSelectedLanguage(storedLanguage || 'en');
                setLoading(false);
                return;
            }

            // If not found in localStorage, check API
            if (userId) {
                try {
                    const res = await fetch(`/api/user/progress?userId=${encodeURIComponent(userId)}`);
                    const response = await res.json();

                    if (response.hasData && response.data) {
                        const data = response.data;
                        
                        if (data.roleSuggestions && data.roleSuggestions.length > 0) {
                            // Restore to state
                            setRoleSuggestions(data.roleSuggestions);
                            setSelectedLanguage(data.language || 'en');
                            
                            // Restore to localStorage for other parts of the app
                            if (data.cvAnalysis) localStorage.setItem('cvAnalysis', JSON.stringify(data.cvAnalysis));
                            localStorage.setItem('roleSuggestions', JSON.stringify(data.roleSuggestions));
                            localStorage.setItem('selectedLanguage', data.language || 'en');
                            
                            setLoading(false);
                            return;
                        }
                    }
                } catch (e) {
                    console.error("Error loading progress:", e);
                }
            }

            // If we reach here, we check if we should fallback to localStorage
            const stored = localStorage.getItem('roleSuggestions');
            if (userId && !loading) {
                 // If we have a userId but no API data, the local cache is likely stale
                 console.log("Logged in user with no role data in cloud - clearing stale cache");
                 localStorage.removeItem('cvAnalysis');
                 localStorage.removeItem('roleSuggestions');
                 localStorage.removeItem('selectedLanguage');
                 router.push('/assessment/cv-upload');
            } else if (stored) {
                setRoleSuggestions(JSON.parse(stored));
                setLoading(false);
            } else {
                router.push('/assessment/cv-upload');
            }
        };

        loadProgress();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router]);

    const handleDownloadReport = async () => {
        setIsDownloading(true);
        try {
            // 1. Create a dedicated container for the PDF
            const container = document.createElement('div');
            container.style.position = 'absolute';
            container.style.left = '-9999px';
            container.style.top = '0';
            container.style.width = '800px'; // Fixed width for A4 consistency
            container.style.backgroundColor = '#ffffff';
            container.style.padding = '40px';
            container.style.fontFamily = "'Tajawal', sans-serif";
            container.style.color = '#0f172a';
            
            // 2. Prepare Data
            const ready = roleSuggestions.filter(r => r.category?.toLowerCase() === 'ready').sort((a,b) => b.matchPercentage - a.matchPercentage);
            const future = roleSuggestions.filter(r => r.category?.toLowerCase() === 'future').sort((a,b) => b.matchPercentage - a.matchPercentage);

            // 3. Build the HTML Template (Clean, Print-Optimized)
            container.innerHTML = `
                <style>
                    @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap');
                    * { box-sizing: border-box; }
                    .page-break { page-break-inside: avoid; }
                </style>
                <div style="font-family: 'Tajawal', sans-serif;">
                    
                    <!-- Header -->
                    <div style="text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #e2e8f0;">
                       <div style="background: linear-gradient(135deg, #2563eb, #1e40af); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-size: 28px; font-weight: bold; margin-bottom: 10px;">
                            MA-TRAINING-CONSULTING
                       </div>
                       <h1 style="font-size: 24px; color: #1e293b; margin: 0; font-weight: bold;">Career Path Recommendations</h1>
                       <p style="color: #64748b; margin-top: 10px; font-size: 14px;">
                           Generated for: Strategic Assessment • ${new Date().toLocaleDateString()}
                       </p>
                    </div>

                    <!-- Introduction -->
                    <div style="margin-bottom: 30px; background-color: #f8fafc; padding: 20px; border-radius: 12px; border-left: 4px solid #2563eb;">
                        <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #334155;">
                            Based on your AI-driven assessment, we have identified your optimal career paths. 
                            <strong>Ready Now</strong> roles utilize your current strengths, while <strong>Future Goals</strong> represent strategic growth opportunities.
                        </p>
                    </div>

                    <!-- Ready Roles Section -->
                    ${ready.length > 0 ? `
                    <div style="margin-bottom: 40px;">
                        <h2 style="font-size: 20px; color: #166534; border-bottom: 1px solid #bbb; padding-bottom: 10px; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
                            <span style="font-size: 24px;">✅</span> Ready Now - Short Term
                        </h2>
                        ${ready.map(role => renderRoleCard(role, '#dcfce7', '#166534')).join('')}
                    </div>
                    ` : ''}

                    <!-- Future Roles Section -->
                    ${future.length > 0 ? `
                    <div style="margin-bottom: 40px;">
                        <h2 style="font-size: 20px; color: #9a3412; border-bottom: 1px solid #bbb; padding-bottom: 10px; margin-bottom: 20px; display: flex; align-items: center; gap: 10px;">
                             <span style="font-size: 24px;">🚀</span> Future Goals - Long Term
                        </h2>
                        ${future.map(role => renderRoleCard(role, '#ffedd5', '#9a3412')).join('')}
                    </div>
                    ` : ''}

                    <!-- Footer -->
                    <div style="margin-top: 50px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 20px;">
                        © ${new Date().getFullYear()} MA-TRAINING-CONSULTING • AI Career Architecture System
                    </div>
                </div>
            `;

            document.body.appendChild(container);

            // 4. Capture
            const canvas = await html2canvas(container, {
                scale: 2, // High resolution
                useCORS: true,
                logging: false,
                backgroundColor: "#ffffff",
                windowWidth: 800
            });

            // 5. Cleanup
            document.body.removeChild(container);

            // 6. Generate PDF
            const imgData = canvas.toDataURL('image/png', 1.0);
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgProps = pdf.getImageProperties(imgData);
            const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight, undefined, 'FAST');
            heightLeft -= pdfHeight;

            while (heightLeft > 0) {
                position -= pdfHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight, undefined, 'FAST');
                heightLeft -= pdfHeight;
            }

            pdf.save(`MA-TRAINING-Career-Path-Report.pdf`);

        } catch (error) {
            console.error("PDF generation failed:", error);
            alert("Failed to generate PDF report.");
        } finally {
            setIsDownloading(false);
        }
    };

    // Helper for generating report HTML string
    const renderRoleCard = (role: RoleSuggestion, bgColor: string, accentColor: string) => `
        <div class="page-break" style="margin-bottom: 25px; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            <!-- Card Header -->
            <div style="background-color: ${bgColor}; padding: 15px 20px; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="margin: 0; font-size: 18px; color: #0f172a; font-weight: bold;">${role.title}</h3>
                <div style="background-color: #ffffff; padding: 4px 12px; border-radius: 20px; font-weight: bold; color: ${accentColor}; font-size: 14px; border: 1px solid ${accentColor}20;">
                    ${role.matchPercentage}% Match
                </div>
            </div>
            
            <!-- Body -->
            <div style="padding: 20px;">
                <p style="margin: 0 0 20px 0; color: #475569; font-size: 14px; line-height: 1.5;">${role.description}</p>
                
                <!-- Grid Stats -->
                <div style="display: flex; gap: 15px; margin-bottom: 20px;">
                    <div style="flex: 1; padding: 10px; background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0;">
                        <div style="font-size: 11px; text-transform: uppercase; color: #64748b; margin-bottom: 5px;">Strengths</div>
                        <ul style="margin: 0; padding-left: 15px; font-size: 12px; color: #334155;">
                            ${role.strengths.slice(0, 3).map(s => `<li style="margin-bottom: 2px;">${s}</li>`).join('')}
                        </ul>
                    </div>
                     <div style="flex: 1; padding: 10px; background-color: #fef2f2; border-radius: 8px; border: 1px solid #fee2e2;">
                        <div style="font-size: 11px; text-transform: uppercase; color: #b91c1c; margin-bottom: 5px;">Gaps to Close</div>
                        <ul style="margin: 0; padding-left: 15px; font-size: 12px; color: #7f1d1d;">
                            ${role.weaknesses.slice(0, 3).map(w => `<li style="margin-bottom: 2px;">${w}</li>`).join('')}
                        </ul>
                    </div>
                </div>
                
                 <!-- Competencies -->
                <div>
                     <div style="font-size: 12px; font-weight: bold; color: #334155; margin-bottom: 8px;">Required Competencies:</div>
                     <div style="display: flex; flex-wrap: wrap; gap: 5px;">
                        ${role.requiredCompetencies.map(c => `
                            <span style="background-color: #eff6ff; color: #1d4ed8; padding: 4px 10px; border-radius: 12px; font-size: 11px; border: 1px solid #dbeafe;">${c}</span>
                        `).join('')}
                     </div>
                </div>
            </div>
        </div>
    `;

    const selectRole = async (role: RoleSuggestion) => {
        // Store locally
        localStorage.setItem('selectedRole', JSON.stringify(role));

        // Persist to DB
        const userProfile = JSON.parse(localStorage.getItem('userProfile') || '{}');
        if (userProfile.email) {
            try {
                await fetch('/api/user/update-profile', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        email: userProfile.email,
                        updates: { selectedRole: role.title }
                    })
                });
            } catch (e) {
                console.error("Failed to persist selected role", e);
            }
        }

        router.push('/assessment/cv-generation');
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 text-lg">Analyzing career paths...</p>
                </div>
            </div>
        );
    }

    const readyRoles = roleSuggestions
        .filter(r => r.category?.toLowerCase() === 'ready')
        .sort((a, b) => b.matchPercentage - a.matchPercentage);

    const futureRoles = roleSuggestions
        .filter(r => r.category?.toLowerCase() === 'future')
        .sort((a, b) => b.matchPercentage - a.matchPercentage);

    return (
        <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center relative"
            >
                <div className="absolute top-0 right-0">
                    <button
                        onClick={handleDownloadReport}
                        disabled={isDownloading}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all font-semibold text-slate-700 shadow-sm"
                    >
                        {isDownloading ? (
                            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                        ) : (
                            <Download className="w-5 h-5 text-blue-600" />
                        )}
                        {isDownloading ? 'Generating...' : 'Download PDF'}
                    </button>
                </div>
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 shrink-0">
                    <Target className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl font-bold text-slate-900 mb-3">Career Path Recommendations</h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Based on your CV analysis and career discovery, here are the most suitable roles for you
                </p>
            </motion.div>

            {/* Results Wrapper for PDF Capture */}
            <div ref={resultsRef} className="space-y-8 p-1">

                {/* Instructions Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="bg-linear-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200 p-4"
                >
                    <div className="flex items-center gap-3">
                        <Sparkles className="w-6 h-6 text-blue-600 shrink-0" />
                        <p className="text-slate-700">
                            {selectedLanguage === 'ar' ? (
                                <>
                                    <strong>كيف يعمل:</strong> راجع الأدوار أدناه، وسّع التفاصيل لرؤية نقاط القوة والفجوات،
                                    ثم انقر على <strong className="text-purple-600">&quot;التركيز على هذا الدور&quot;</strong> لتوليد سيرتك الذاتية ورسالة التحفيز المخصصة!
                                </>
                            ) : selectedLanguage === 'fr' ? (
                                <>
                                    <strong>Comment ça marche :</strong> Consultez les rôles ci-dessous, développez les détails pour voir les forces et les lacunes,
                                    puis cliquez sur <strong className="text-purple-600">&quot;Se concentrer sur ce rôle&quot;</strong> pour générer votre CV et lettre de motivation personnalisés !
                                </>
                            ) : selectedLanguage === 'es' ? (
                                <>
                                    <strong>Cómo funciona:</strong> Revisa los roles a continuación, expande los detalles para ver fortalezas y brechas,
                                    luego haz clic en <strong className="text-purple-600">&quot;Enfocarse en este rol&quot;</strong> para generar tu CV y carta de presentación personalizados!
                                </>
                            ) : (
                                <>
                                    <strong>How it works:</strong> Review the roles below, expand details to see strengths and gaps,
                                    then click <strong className="text-purple-600">&quot;Focus on This Role&quot;</strong> to generate your personalized CV and cover letter!
                                </>
                            )}
                        </p>
                    </div>
                </motion.div>

                {/* Ready Now Roles */}
                {readyRoles.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Ready Now - Short Term</h2>
                                <p className="text-slate-600">Roles you can pursue immediately with your current skills</p>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            {readyRoles.map((role, index) => (
                                <RoleCard
                                    key={index}
                                    role={role}
                                    isExpanded={expandedRole === role.title}
                                    onToggle={() => setExpandedRole(expandedRole === role.title ? null : role.title)}
                                    onSelect={() => selectRole(role)}
                                    color="green"
                                />
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Future Roles */}
                {futureRoles.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                                <Clock className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">Future Goals - Long Term</h2>
                                <p className="text-slate-600">Roles to work towards with skill development</p>
                            </div>
                        </div>

                        <div className="grid gap-4">
                            {futureRoles.map((role, index) => (
                                <RoleCard
                                    key={index}
                                    role={role}
                                    isExpanded={expandedRole === role.title}
                                    onToggle={() => setExpandedRole(expandedRole === role.title ? null : role.title)}
                                    onSelect={() => selectRole(role)}
                                    color="orange"
                                />
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Fallback if no roles found */}
                {readyRoles.length === 0 && futureRoles.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200"
                    >
                        <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-900 mb-2">No recommendations found</h3>
                        <p className="text-slate-600 mb-6">We couldn&apos;t identify specific roles based on current data. Please try the discovery interview again.</p>
                        <button
                            onClick={() => router.push('/assessment/role-discovery')}
                            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
                        >
                            Restart Career Discovery
                        </button>
                    </motion.div>
                )}

            </div>

        </div>
    );
}

interface RoleCardProps {
    role: RoleSuggestion;
    isExpanded: boolean;
    onToggle: () => void;
    onSelect: () => void;
    color: 'green' | 'orange';
}

function RoleCard({ role, isExpanded, onToggle, onSelect, color }: RoleCardProps) {
    const colorClasses = {
        green: {
            border: 'border-green-200',
            bg: 'bg-green-50',
            badge: 'bg-green-100 text-green-700 border-green-200',
            button: 'bg-green-600 hover:bg-green-700',
            icon: 'text-green-600',
        },
        orange: {
            border: 'border-orange-200',
            bg: 'bg-orange-50',
            badge: 'bg-orange-100 text-orange-700 border-orange-200',
            button: 'bg-orange-600 hover:bg-orange-700',
            icon: 'text-orange-600',
        },
    };

    const colors = colorClasses[color];

    // Determine opacity and prominence based on match percentage
    const isHighMatch = role.matchPercentage >= 70;
    const isMediumMatch = role.matchPercentage >= 50 && role.matchPercentage < 70;
    const isLowMatch = role.matchPercentage < 50;

    const cardOpacity = isHighMatch ? 'opacity-100' : isMediumMatch ? 'opacity-75' : 'opacity-50';
    const cardScale = isHighMatch ? 'scale-100' : 'scale-95';
    const borderWidth = isHighMatch ? 'border-2' : 'border';
    const shadowIntensity = isHighMatch ? 'hover:shadow-xl' : isMediumMatch ? 'hover:shadow-lg' : 'hover:shadow-md';

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`bg-white rounded-2xl ${borderWidth} ${colors.border} overflow-hidden transition-all ${shadowIntensity} ${cardOpacity} ${cardScale} relative`}
        >
            {/* High Match Badge */}
            {isHighMatch && (
                <div className="absolute top-4 right-4 z-10">
                    <div className="bg-linear-to-r from-yellow-400 to-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Top Match
                    </div>
                </div>
            )}

            {/* Low Match Indicator */}
            {isLowMatch && (
                <div className="absolute top-4 right-4 z-10">
                    <div className="bg-slate-200 text-slate-600 px-3 py-1 rounded-full text-xs font-medium">
                        Stretch Goal
                    </div>
                </div>
            )}
            {/* Header */}
            <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3">
                            <h3 className="text-2xl font-bold text-slate-900">{role.title}</h3>
                            <span className={`px-3 py-1 rounded-full text-sm font-bold border ${colors.badge}`}>
                                {role.matchPercentage}% Match
                            </span>
                        </div>
                        <p className="text-slate-600">{role.description}</p>
                        {role.timeToReady && (
                            <div className="flex items-center gap-2 mt-2 text-sm text-slate-500">
                                <Clock className="w-4 h-4" />
                                <span>Time to ready: {role.timeToReady}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Match Bar */}
                <div className="w-full bg-slate-200 rounded-full h-3 mb-4">
                    <div
                        className={`h-3 rounded-full transition-all duration-1000 ${color === 'green' ? 'bg-green-600' : 'bg-orange-600'}`}
                        style={{ width: `${role.matchPercentage}%` }}
                    />
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className={`p-3 ${colors.bg} rounded-xl text-center`}>
                        <p className="text-xs text-slate-600 mb-1">Strengths</p>
                        <p className={`text-lg font-bold ${colors.icon}`}>{role.strengths.length}</p>
                    </div>
                    <div className={`p-3 ${colors.bg} rounded-xl text-center`}>
                        <p className="text-xs text-slate-600 mb-1">Gaps</p>
                        <p className={`text-lg font-bold ${colors.icon}`}>{role.weaknesses.length}</p>
                    </div>
                    <div className={`p-3 ${colors.bg} rounded-xl text-center`}>
                        <p className="text-xs text-slate-600 mb-1">Skills Needed</p>
                        <p className={`text-lg font-bold ${colors.icon}`}>{role.requiredCompetencies.length}</p>
                    </div>
                </div>

                {/* Toggle Details Button - With guiding animation */}
                <motion.button
                    onClick={onToggle}
                    whileHover={{ backgroundColor: 'rgba(241, 245, 249, 1)' }}
                    className="w-full py-3 text-slate-500 hover:text-indigo-600 font-bold flex items-center justify-center gap-2 transition-colors rounded-xl mt-2 group"
                >
                    {isExpanded ? (
                        <>
                            <span>Hide Details</span>
                            <ChevronUp className="w-5 h-5" />
                        </>
                    ) : (
                        <>
                            <span className="group-hover:tracking-wide transition-all">View Details</span>
                            <motion.div
                                animate={{ y: [0, 4, 0] }}
                                transition={{ 
                                    duration: 1.5, 
                                    repeat: Infinity, 
                                    ease: "easeInOut" 
                                }}
                            >
                                <ChevronDown className="w-5 h-5" />
                            </motion.div>
                        </>
                    )}
                </motion.button>
            </div>

            {/* Expanded Details with AnimatePresence */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, y: -20 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        exit={{ opacity: 0, height: 0, y: -10 }}
                        transition={{ 
                            height: { duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] },
                            opacity: { duration: 0.25 },
                            y: { duration: 0.4, ease: "easeOut" }
                        }}
                        className="border-t border-slate-200 overflow-hidden bg-slate-50"
                    >
                        <div className="p-6">
                            <div className="grid md:grid-cols-3 gap-6 mb-8">
                                {/* Strengths */}
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <div className="flex items-center gap-2 mb-3">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                        <h4 className="font-bold text-slate-900 text-sm md:text-base">Your Strengths</h4>
                                    </div>
                                    <ul className="space-y-2">
                                        {role.strengths.map((strength, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                                                <span>{strength}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>

                                {/* Weaknesses */}
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <div className="flex items-center gap-2 mb-3">
                                        <AlertCircle className="w-5 h-5 text-red-600" />
                                        <h4 className="font-bold text-slate-900 text-sm md:text-base">Areas to Develop</h4>
                                    </div>
                                    <ul className="space-y-2">
                                        {role.weaknesses.map((weakness, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                                                <span>{weakness}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>

                                {/* Required Competencies */}
                                <motion.div
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <div className="flex items-center gap-2 mb-3">
                                        <Award className="w-5 h-5 text-blue-600" />
                                        <h4 className="font-bold text-slate-900 text-sm md:text-base">Required Skills</h4>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {role.requiredCompetencies.map((comp, i) => (
                                            <span key={i} className="px-3 py-1 bg-white text-blue-700 rounded-lg text-xs font-bold border border-blue-100 shadow-xs">
                                                {comp}
                                            </span>
                                        ))}
                                    </div>
                                </motion.div>
                            </div>

                            {/* Select Role Button - Special Animation */}
                            <motion.button
                                onClick={onSelect}
                                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                whileHover={{ scale: 1.02, backgroundColor: '#000' }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ 
                                    type: "spring", 
                                    stiffness: 400, 
                                    damping: 25,
                                    delay: 0.4 
                                }}
                                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-lg hover:shadow-2xl hover:shadow-indigo-500/20 transition-all flex items-center justify-center gap-3 group"
                            >
                                <Sparkles className="w-6 h-6 text-yellow-400 group-hover:rotate-12 transition-transform" />
                                Focus on This Role
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
