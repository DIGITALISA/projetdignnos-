"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Download, Share2, Award, CheckCircle2, QrCode, BookmarkCheck, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";

export default function CertificatePage() {
    const certificateRef = useRef<HTMLDivElement>(null);
    const [studentName, setStudentName] = useState("Ahmed User");
    const [selectedCertId, setSelectedCertId] = useState("CERT-2026-8842");

    // Mock Data: Multiple Certificates
    const certificates = [
        {
            id: "CERT-2026-8842",
            courseName: "Advanced Product Management",
            shortName: "Product Management",
            completionDate: "January 20, 2026",
            skills: ["Strategic Planning", "User Research", "Agile Methodology", "Stakeholder Management"],
            grade: "Distinction (95%)",
            color: "blue"
        },
        {
            id: "CERT-2025-9921",
            courseName: "AI-Driven Crisis Management",
            shortName: "Crisis Management",
            completionDate: "December 15, 2025",
            skills: ["Risk Assessment", "AI Tools", "Decision Making", "Leadership"],
            grade: "Merit (88%)",
            color: "purple"
        },
        {
            id: "CERT-2025-7734",
            courseName: "Strategic Data Analysis",
            shortName: "Data Analysis",
            completionDate: "November 05, 2025",
            skills: ["Data Visualization", "Python Basics", "Business Intelligence", "Reporting"],
            grade: "Distinction (92%)",
            color: "green"
        }
    ];

    const selectedCert = certificates.find(c => c.id === selectedCertId) || certificates[0];

    useEffect(() => {
        // Function to load profile
        const loadProfile = () => {
            try {
                const savedProfile = localStorage.getItem("userProfile");
                if (savedProfile) {
                    const { fullName } = JSON.parse(savedProfile);
                    if (fullName) setStudentName(fullName);
                }
            } catch (e) {
                console.error("Failed to load profile", e);
            }
        };

        // Initial load
        loadProfile();

        // Listen for updates
        const handleProfileUpdate = () => loadProfile();
        window.addEventListener("profileUpdated", handleProfileUpdate);
        return () => window.removeEventListener("profileUpdated", handleProfileUpdate);
    }, []);

    const handleDownload = () => {
        alert(`Downloading certificate ${selectedCert.id}...`);
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
                        className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/10"
                    >
                        <Download className="w-4 h-4" />
                        Download PDF
                    </button>
                    <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors">
                        <Share2 className="w-4 h-4" />
                        Share
                    </button>
                </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-8">
                {/* Sidebar List */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider px-2">Available Certificates</h3>
                    <div className="space-y-2">
                        {certificates.map((cert) => (
                            <button
                                key={cert.id}
                                onClick={() => setSelectedCertId(cert.id)}
                                className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group ${selectedCertId === cert.id
                                        ? "bg-white border-blue-500 shadow-md ring-1 ring-blue-500/20"
                                        : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                    }`}
                            >
                                <div>
                                    <h4 className={`font-bold ${selectedCertId === cert.id ? "text-slate-900" : "text-slate-600"}`}>
                                        {cert.shortName}
                                    </h4>
                                    <p className="text-xs text-slate-400 mt-1">{cert.completionDate}</p>
                                </div>
                                {selectedCertId === cert.id && (
                                    <ChevronRight className="w-5 h-5 text-blue-500" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Certificate Preview Area */}
                <div className="lg:col-span-3">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedCert.id}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.2 }}
                            className="relative bg-white p-2 rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
                        >
                            {/* The Certificate Artboard */}
                            <div
                                ref={certificateRef}
                                className="relative w-full aspect-[1.414/1] bg-slate-50 border-8 border-double border-slate-200 p-8 md:p-16 flex flex-col items-center justify-between text-center overflow-hidden"
                                style={{
                                    backgroundImage: "radial-gradient(circle at center, white 0%, #f1f5f9 100%)"
                                }}
                            >
                                {/* Decorative Corners */}
                                <div className="absolute top-0 left-0 w-32 h-32 border-t-4 border-l-4 border-yellow-500/30 rounded-tl-3xl m-4" />
                                <div className="absolute top-0 right-0 w-32 h-32 border-t-4 border-r-4 border-yellow-500/30 rounded-tr-3xl m-4" />
                                <div className="absolute bottom-0 left-0 w-32 h-32 border-b-4 border-l-4 border-yellow-500/30 rounded-bl-3xl m-4" />
                                <div className="absolute bottom-0 right-0 w-32 h-32 border-b-4 border-r-4 border-yellow-500/30 rounded-br-3xl m-4" />

                                {/* Logo & Header */}
                                <div className="relative z-10 w-full">
                                    <div className={`mx-auto w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6 shadow-xl bg-${selectedCert.color}-600`}>
                                        <Award className="w-8 h-8" />
                                    </div>
                                    <h2 className="text-sm font-bold tracking-[0.3em] text-slate-400 uppercase mb-2">Certificate of Excellence</h2>
                                    <h1 className="text-3xl md:text-5xl font-serif text-slate-900 mb-8 tracking-tight">CareerUpgrade Institute</h1>
                                </div>

                                {/* Body */}
                                <div className="relative z-10 w-full max-w-3xl mx-auto space-y-4 md:space-y-6">
                                    <p className="text-lg text-slate-500 italic">This is to officially certify that</p>

                                    <div className="py-2 md:py-4 border-b-2 border-slate-200 w-full max-w-xl mx-auto">
                                        <span className="text-3xl md:text-5xl font-bold text-slate-900 font-serif">{studentName}</span>
                                    </div>

                                    <p className="text-lg text-slate-500 italic mt-4 md:mt-6">has successfully completed the professional program:</p>

                                    <h3 className={`text-2xl md:text-4xl font-bold text-${selectedCert.color}-900 px-4 leading-tight`}>{selectedCert.courseName}</h3>
                                    <p className="text-slate-500 font-medium">{selectedCert.grade}</p>

                                    <div className="flex flex-wrap justify-center gap-2 md:gap-3 mt-4 md:mt-6">
                                        {selectedCert.skills.map(skill => (
                                            <span key={skill} className={`px-3 py-1 bg-${selectedCert.color}-50 text-${selectedCert.color}-700 rounded-full text-xs md:text-sm font-semibold border border-${selectedCert.color}-100`}>
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Footer & Auth */}
                                <div className="relative z-10 w-full flex flex-col md:flex-row items-end justify-between mt-8 md:mt-12 pt-6 md:pt-8 border-t border-slate-200/50">
                                    <div className="text-left space-y-1">
                                        <p className="text-xs md:text-sm text-slate-400 font-mono">ID: {selectedCert.id}</p>
                                        <p className="text-xs md:text-sm text-slate-500">Date: {selectedCert.completionDate}</p>
                                        <div className="flex items-center gap-2 text-green-600 text-xs md:text-sm font-medium mt-2">
                                            <CheckCircle2 className="w-4 h-4" />
                                            Verified Authenticity
                                        </div>
                                    </div>

                                    {/* Seal */}
                                    <div className="relative group cursor-pointer hidden md:block">
                                        <div className="w-24 h-24 rounded-full border-4 border-yellow-500/20 flex items-center justify-center bg-white shadow-xl">
                                            <div className="w-20 h-20 rounded-full bg-yellow-500 flex items-center justify-center text-white p-1">
                                                <span className="text-center text-[10px] font-bold uppercase tracking-widest leading-tight">
                                                    Official<br />Seal of<br />Quality
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right mt-4 md:mt-0">
                                        <div className="w-24 md:w-32 h-10 md:h-12 mb-2 relative mx-auto md:ml-auto">
                                            {/* Fake Signature */}
                                            <svg viewBox="0 0 200 60" className="w-full h-full stroke-slate-800 fill-none" strokeWidth="2">
                                                <path d="M10,40 Q50,10 90,40 T180,30" />
                                                <path d="M20,35 Q60,50 100,20 T170,45" opacity="0.5" />
                                            </svg>
                                        </div>
                                        <div className="border-t border-slate-300 pt-2 w-32 md:w-48 ml-auto text-xs md:text-sm">
                                            <p className="font-bold text-slate-900">Dr. Sarah Connor</p>
                                            <p className="text-[10px] md:text-xs text-slate-500 uppercase tracking-wider">Program Director</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Verification Info */}
                    <div className="mt-8 bg-blue-50 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 border border-blue-100">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-white rounded-xl shadow-sm text-blue-600">
                                <QrCode className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900">Digital Verification available</h3>
                                <p className="text-sm text-slate-600 max-w-lg mt-1">
                                    Verify this certificate instantly at <span className="font-mono text-blue-700">careerupgrade.ai/verify</span> using ID <strong>{selectedCert.id}</strong>.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
