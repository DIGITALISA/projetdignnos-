"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Download, Share2, Award, CheckCircle2, QrCode, BookmarkCheck, ChevronRight, Loader2 } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function CertificatePage() {
    const certificateRef = useRef<HTMLDivElement>(null);
    const [studentName, setStudentName] = useState("Ahmed User");
    const [certificates, setCertificates] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCertId, setSelectedCertId] = useState<string | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);

    const fetchCertificates = async (userName: string) => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/user/certificates?userId=${userName}`);
            const data = await res.json();
            if (Array.isArray(data)) {
                setCertificates(data);
                if (data.length > 0) setSelectedCertId(data[0].certificateId);
            }
        } catch (error) {
            console.error("Error fetching certificates:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const loadProfile = () => {
            try {
                const savedProfile = localStorage.getItem("userProfile");
                if (savedProfile) {
                    const { fullName } = JSON.parse(savedProfile);
                    if (fullName) {
                        setStudentName(fullName);
                        fetchCertificates(fullName);
                    }
                } else {
                    fetchCertificates("Ahmed User");
                }
            } catch (e) {
                console.error("Failed to load profile", e);
                fetchCertificates("Ahmed User");
            }
        };

        loadProfile();
        window.addEventListener("profileUpdated", loadProfile);
        return () => window.removeEventListener("profileUpdated", loadProfile);
    }, []);

    const selectedCert = certificates.find(c => c.certificateId === selectedCertId) || (certificates.length > 0 ? certificates[0] : null);

    const handleDownload = async () => {
        if (!certificateRef.current || !selectedCert) return;

        setIsDownloading(true);
        // Wait for render
        await new Promise(resolve => setTimeout(resolve, 500));

        try {
            const canvas = await html2canvas(certificateRef.current, {
                scale: 3, // Higher quality
                useCORS: true,
                allowTaint: true,
                logging: false,
                backgroundColor: "#ffffff"
            });

            const imgData = canvas.toDataURL('image/png');

            // Standard A4 Landscape
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4'
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            // Margins (10mm)
            const margin = 10;
            const contentWidth = pdfWidth - (margin * 2);
            const contentHeight = pdfHeight - (margin * 2);

            // Fit image to content area preserving ratio
            const imgProps = pdf.getImageProperties(imgData);
            const ratio = imgProps.width / imgProps.height;

            let w = contentWidth;
            let h = contentWidth / ratio;

            // If height exceeds content height, scale down by height
            if (h > contentHeight) {
                h = contentHeight;
                w = contentHeight * ratio;
            }

            // Center content
            const x = margin + (contentWidth - w) / 2;
            const y = margin + (contentHeight - h) / 2;

            pdf.addImage(imgData, 'PNG', x, y, w, h);
            pdf.save(`Certificate-${selectedCert.certificateId}.pdf`);
        } catch (error: any) {
            console.error("PDF generation failed:", error);
            alert(`Failed to generate PDF: ${error.message || "Unknown error"}`);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
                        <Award className="w-8 h-8 text-yellow-500" />
                        My Certificates
                    </h1>
                    <p className="text-slate-500 mt-1">Select a certificate to view, verify, or download.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleDownload}
                        disabled={!selectedCert || isDownloading}
                        className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10 disabled:opacity-50"
                    >
                        {isDownloading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Download className="w-4 h-4" />
                        )}
                        {isDownloading ? "Generating PDF..." : "Download PDF"}
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="py-20 text-center">
                    <Loader2 className="w-12 h-12 animate-spin mx-auto text-blue-600 mb-4" />
                    <p className="text-slate-500 font-medium">Authenticating your achievements...</p>
                </div>
            ) : certificates.length === 0 ? (
                <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                    <Award className="w-16 h-16 mx-auto text-slate-200 mb-4" />
                    <h3 className="text-xl font-bold text-slate-900">No certificates yet</h3>
                    <p className="text-slate-400 mt-2 max-w-sm mx-auto">Complete courses in the Training Hub to earn your professional certifications.</p>
                </div>
            ) : (
                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Sidebar List */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider px-2">Your Collection</h3>
                        <div className="space-y-2">
                            {certificates.map((cert) => (
                                <button
                                    key={cert._id}
                                    onClick={() => setSelectedCertId(cert.certificateId)}
                                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group ${selectedCertId === cert.certificateId
                                        ? "bg-white border-blue-500 shadow-md ring-1 ring-blue-500/20"
                                        : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                        }`}
                                >
                                    <div>
                                        <h4 className={`font-bold ${selectedCertId === cert.certificateId ? "text-slate-900" : "text-slate-600"}`}>
                                            {cert.courseTitle}
                                        </h4>
                                        <p className="text-xs text-slate-400 mt-1">{new Date(cert.issueDate).toLocaleDateString()}</p>
                                    </div>
                                    {selectedCertId === cert.certificateId && (
                                        <ChevronRight className="w-5 h-5 text-blue-500" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Certificate Preview Area */}
                    <div className="lg:col-span-3">
                        {selectedCert && (
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selectedCert.certificateId}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    transition={{ duration: 0.2 }}
                                    className="relative p-2 rounded-xl shadow-lg overflow-hidden"
                                    style={{ backgroundColor: "#f1f5f9", border: "1px solid #e2e8f0" }}
                                >
                                    <div
                                        ref={certificateRef}
                                        className="relative w-full aspect-[1.414/1] flex flex-col items-center text-center overflow-hidden"
                                        style={{
                                            backgroundColor: "#ffffff",
                                            color: "#0f172a",
                                            padding: "24px", // Reduced padding
                                            boxShadow: "inset 0 0 0 15px #ffffff, inset 0 0 0 18px #94a3b8",
                                            backgroundImage: "radial-gradient(circle at center, #ffffff 40%, #f8fafc 100%)"
                                        }}
                                    >
                                        {/* Decorative Corner Backgrounds */}
                                        <div style={{ position: 'absolute', top: 0, left: 0, width: '80px', height: '80px', borderTop: '20px solid rgba(15, 23, 42, 0.05)', borderLeft: '20px solid rgba(15, 23, 42, 0.05)', borderBottomRightRadius: '60px' }} />
                                        <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', borderTop: '20px solid rgba(15, 23, 42, 0.05)', borderRight: '20px solid rgba(15, 23, 42, 0.05)', borderBottomLeftRadius: '60px' }} />
                                        <div style={{ position: 'absolute', bottom: 0, left: 0, width: '80px', height: '80px', borderBottom: '20px solid rgba(15, 23, 42, 0.05)', borderLeft: '20px solid rgba(15, 23, 42, 0.05)', borderTopRightRadius: '60px' }} />
                                        <div style={{ position: 'absolute', bottom: 0, right: 0, width: '80px', height: '80px', borderBottom: '20px solid rgba(15, 23, 42, 0.05)', borderRight: '20px solid rgba(15, 23, 42, 0.05)', borderTopLeftRadius: '60px' }} />

                                        {/* Main Content Container */}
                                        <div className="relative z-10 w-full h-full flex flex-col justify-between py-2">

                                            {/* Top Section */}
                                            <div className="space-y-2 pt-2">
                                                <div className="flex items-center justify-center gap-2 mb-1" style={{ color: "#eab308" }}>
                                                    <Award className="w-5 h-5" />
                                                    <span className="text-[10px] font-bold tracking-[0.3em] uppercase" style={{ color: "#94a3b8" }}>Official Certification</span>
                                                    <Award className="w-5 h-5" />
                                                </div>
                                                <h1 className="text-3xl md:text-5xl font-serif font-bold tracking-wide leading-tight" style={{ color: "#0f172a" }}>
                                                    Certificate of Excellence
                                                </h1>
                                                <p className="text-xs font-serif italic" style={{ color: "#64748b" }}>Proudly presented to</p>
                                            </div>

                                            {/* Name Section */}
                                            <div className="py-2 flex flex-col items-center">
                                                <span className="text-3xl md:text-5xl font-serif font-medium px-8" style={{ color: "#0f172a", display: "inline-block" }}>
                                                    {selectedCert.userName}
                                                </span>
                                                {/* Line clearly separated below the text */}
                                                <div style={{
                                                    height: "2px",
                                                    width: "100%",
                                                    maxWidth: "400px",
                                                    background: "linear-gradient(90deg, transparent, #cbd5e1, transparent)",
                                                    marginTop: "24px"
                                                }} />
                                            </div>

                                            {/* Course Content */}
                                            <div className="space-y-1">
                                                <p className="text-xs font-serif italic" style={{ color: "#64748b" }}>
                                                    for successfully completing the rigorous requirements of
                                                </p>
                                                <h2 className="text-xl md:text-3xl font-bold font-serif max-w-3xl mx-auto leading-tight" style={{ color: "#1e3a8a" }}>
                                                    {selectedCert.courseTitle}
                                                </h2>
                                            </div>

                                            {/* ID Section */}
                                            <div className="my-2 p-2 rounded-lg border-2 border-dashed max-w-md mx-auto w-full transform scale-90"
                                                style={{ backgroundColor: "#f8fafc", borderColor: "#cbd5e1" }}>
                                                <p className="text-[9px] uppercase tracking-widest font-bold mb-1" style={{ color: "#94a3b8" }}>CREDENTIAL IDENTIFIER</p>
                                                <p className="text-lg font-mono font-bold tracking-[0.1em]" style={{ color: "#000000" }}>
                                                    {selectedCert.certificateId || "PENDING-ISSUANCE"}
                                                </p>
                                            </div>

                                            {/* Footer Signatures */}
                                            <div className="grid grid-cols-2 gap-12 items-end pt-2 px-12">
                                                <div className="text-center">
                                                    <p className="font-serif pb-1 mb-1 px-4 text-sm" style={{ color: "#0f172a", borderBottom: "1px solid #cbd5e1" }}>
                                                        {new Date(selectedCert.issueDate).toLocaleDateString()}
                                                    </p>
                                                    <p className="text-[9px] uppercase tracking-wider font-bold" style={{ color: "#94a3b8" }}>Date Issued</p>
                                                </div>

                                                <div className="text-center">
                                                    <div className="w-24 h-6 mb-1 mx-auto relative opacity-80">
                                                        <svg viewBox="0 0 140 50" style={{ width: '100%', height: '100%', stroke: '#0f172a', fill: 'none', strokeWidth: 2 }}>
                                                            <path d="M10,35 Q40,5 70,25 T130,15" />
                                                        </svg>
                                                    </div>
                                                    <p className="font-serif pb-1 mb-1 px-4 text-sm font-bold" style={{ color: "#0f172a", borderBottom: "1px solid #cbd5e1" }}>
                                                        Director Signature
                                                    </p>
                                                    <p className="text-[9px] uppercase tracking-wider font-bold" style={{ color: "#94a3b8" }}>Authorized By</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        )}

                        <div className="mt-8 bg-blue-50 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 border border-blue-100">
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white rounded-xl shadow-sm text-blue-600">
                                    <QrCode className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">Digital Verification available</h3>
                                    <p className="text-sm text-slate-600 max-w-lg mt-1">
                                        Verify this certificate instantly at <Link href={`/verification?id=${selectedCert.certificateId}`} target="_blank" className="font-mono text-blue-700 hover:underline">/verification</Link> using the unique ID.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
