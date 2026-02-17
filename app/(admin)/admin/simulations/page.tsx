"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Briefcase,
    CheckCircle2,
    Search,
    Filter,
    Plus,
    UserPlus,
    Trash2,
    Sparkles,
    Send,
    MessageSquare,
    Target,
    ChevronRight,
    Loader2,
    ShieldCheck,
    X,
    PlayCircle,
    FileText
} from "lucide-react";

interface Objective {
    title: string;
    status: string;
    date?: string;
    time?: string;
    meetingLink?: string;
}

interface Message {
    text: string;
    sender: "admin" | "user";
    timestamp: string;
}

interface ResourceAsset {
    title: string;
    url: string;
    type: string;
}

interface Participant {
    _id: string;
    fullName: string;
    email: string;
    role: string;
}

interface Simulation {
    _id: string;
    userId: string;
    status: string;
    title: string;
    role: string;
    company: string;
    briefing: string;
    objectives: Objective[];
    resources?: ResourceAsset[];
    createdAt: string;
    draftViewedByAdmin?: boolean;
    currentDraft?: string;
    submittedLink?: string;
    messages?: Message[];
    missionType?: string;
    meetingLink?: string;
}

interface MissionRequest {
    userId: string;
    missionType: string;
    _id?: string;
    status?: string;
    createdAt?: string;
}

export default function SimulationsAdminPage() {
    const [activeTab, setActiveTab] = useState("incoming");
    const [simulations, setSimulations] = useState({
        pending: [] as (Simulation | MissionRequest)[], // requested + proposed
        active: [] as Simulation[],
        completed: [] as Simulation[]
    });
    const [stats, setStats] = useState({ pending: 0, active: 0, completed: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [allParticipants, setAllParticipants] = useState<Participant[]>([]);

    // Modal state for creating proposal
    const [selectedRequest, setSelectedRequest] = useState<Simulation | MissionRequest | null>(null);
    const [showProposalModal, setShowProposalModal] = useState(false);
    const [showUserSelectModal, setShowUserSelectModal] = useState(false);
    const [showControlModal, setShowControlModal] = useState(false);
    const [selectedSimulation, setSelectedSimulation] = useState<Simulation | null>(null);
    const [newMessage, setNewMessage] = useState("");
    const [newResource, setNewResource] = useState<ResourceAsset>({ title: "", url: "", type: "Confidential" });

    // Proposal form state
    const [proposal, setProposal] = useState({
        title: "",
        role: "",
        company: "",
        briefing: "",
        objectives: [
            { title: "Initial Strategic Assessment & Alignment", status: "current", date: "", time: "", meetingLink: "" },
            { title: "Market Dynamics & Stakeholder Mapping", status: "locked", date: "", time: "", meetingLink: "" },
            { title: "Crisis Management Simulation (Live)", status: "locked", date: "", time: "", meetingLink: "" },
            { title: "Final Board Review & Certification", status: "locked", date: "", time: "", meetingLink: "" }
        ],
        price: 199
    });

    const [isGeneratingAI, setIsGeneratingAI] = useState(false);

    const handleGenerateAI = async () => {
        if (!selectedRequest) return;
        setIsGeneratingAI(true);
        try {
            const res = await fetch("/api/admin/generate-mission", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: selectedRequest.userId, missionType: selectedRequest.missionType })
            });
            const data = await res.json();
            if (data.success) {
                setProposal({
                    ...proposal,
                    title: data.mission.title,
                    role: data.mission.role,
                    company: data.mission.company,
                    briefing: data.mission.briefing,
                    objectives: data.mission.objectives.map((obj: string | { title: string }, idx: number) => ({
                        title: typeof obj === 'string' ? obj : obj.title,
                        status: idx === 0 ? "current" : "locked",
                        date: "",
                        time: "",
                        meetingLink: ""
                    })),
                    price: data.mission.price || 199
                });
            } else {
                alert("AI Generation failed: " + data.error + "\n\nDetails: " + (data.details || "None"));
            }

        } catch (error) {
            console.error("AI Generation Error:", error);
            alert("Failed to connect to AI service.");
        } finally {
            setIsGeneratingAI(false);
        }
    };

    const addObjective = () => {
        setProposal({
            ...proposal,
            objectives: [...proposal.objectives, { title: "", status: "locked", date: "", time: "", meetingLink: "" }]
        });
    };

    const removeObjective = (index: number) => {
        const newObjectives = proposal.objectives.filter((_, i) => i !== index);
        setProposal({ ...proposal, objectives: newObjectives });
    };

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/admin/simulations");
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            setSimulations({
                pending: [...(data.pending || []), ...(data.proposed || [])],
                active: data.active || [],
                completed: data.completed || []
            });
            setStats({
                pending: (data.pending?.length || 0) + (data.proposed?.length || 0),
                active: data.active?.length || 0,
                completed: data.completed?.length || 0
            });

            // Fetch participants
            const usersRes = await fetch("/api/admin/users");
            const usersData = await usersRes.json();
            if (Array.isArray(usersData)) {
                setAllParticipants(usersData.filter((u: Participant) => u.role !== 'Admin' && u.role !== 'Moderator'));
            }

        } catch (error) {
            console.error("Failed to fetch simulations:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteMission = async (missionId: string) => {
        if (!confirm("Are you sure you want to delete this mission?")) return;
        setIsProcessing(true);
        try {
            const res = await fetch(`/api/admin/simulations?id=${missionId}`, {
                method: "DELETE"
            });
            if (res.ok) {
                fetchData();
            }
        } catch (error) {
            console.error("Delete Mission Error:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleMarkDraftAsViewed = async (id: string) => {
        try {
            await fetch("/api/admin/simulations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, type: 'mark_draft_viewed' })
            });
            // Update local state to remove the notification dot
            setSimulations(prev => ({
                ...prev,
                active: prev.active.map(s => s._id === id ? { ...s, draftViewedByAdmin: true } : s)
            }));
        } catch (error) {
            console.error("Failed to mark draft as viewed:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreateProposal = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRequest) return;

        if (!proposal.title || !proposal.role || !proposal.company) {
            alert("Please fill in all mission details (Title, Role, Company).");
            return;
        }

        setIsProcessing(true);
        try {
            const res = await fetch("/api/simulation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: selectedRequest.userId,
                    type: "assign_mission",
                    missionData: {
                        ...proposal,
                        missionType: selectedRequest.missionType
                    }
                })
            });

            if (res.ok) {
                // Here we might want to also delete or update the 'requested' simulation
                // But the current API flow handles it via status management usually.
                // In our current API, 'requested' stays until 'accept_mission' is called by user.
                // Actually, an admin assigning a mission creates a 'proposed' one.
                setShowProposalModal(false);
                fetchData();
            } else {
                const errorData = await res.json();
                alert(`Error: ${errorData.error || res.statusText}\n\nDetails: ${errorData.details || "No details"}`);
            }
        } catch (error) {
            const err = error as Error;
            console.error("Failed to create proposal:", err);
            alert("Connection error: " + err.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleUpdateObjectives = async (missionId: string, objectives: Objective[]) => {
        setIsProcessing(true);
        try {
            await fetch("/api/admin/simulations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: missionId,
                    type: "update_progress",
                    data: { objectives }
                })
            });
            fetchData();
        } catch (error) {
            console.error("Failed to update objectives:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedSimulation) return;
        setIsProcessing(true);
        try {
            await fetch("/api/admin/simulations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: selectedSimulation._id,
                    type: "send_message",
                    data: { text: newMessage, sender: "admin" }
                })
            });
            setNewMessage("");
            fetchSimulationDetails(selectedSimulation._id);
        } catch (error) {
            console.error("Failed to send message:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleAddResource = async () => {
        if (!newResource.title || !newResource.url || !selectedSimulation) return;
        setIsProcessing(true);
        try {
            const updatedResources = [...(selectedSimulation.resources || []), newResource];
            await fetch("/api/admin/simulations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: selectedSimulation._id,
                    type: "update_resources",
                    data: { resources: updatedResources }
                })
            });
            setNewResource({ title: "", url: "", type: "Confidential" });
            fetchSimulationDetails(selectedSimulation._id);
        } catch (error) {
            console.error("Failed to add resource:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleUpdateResources = async (id: string, resources: ResourceAsset[]) => {
        try {
            await fetch("/api/admin/simulations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id,
                    type: "update_resources",
                    data: { resources }
                })
            });
        } catch (error) {
            console.error("Failed to update resources:", error);
        }
    };

    const fetchSimulationDetails = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/simulations?id=${id}`);
            const data = await res.json();
            // Assuming the API handles getting a single simulation by ID
            if (data.pending || data.active || data.completed) {
                // Find it in the results
                const all = [...(data.pending || []), ...(data.active || []), ...(data.completed || [])];
                const found = all.find(s => s._id === id);
                if (found) setSelectedSimulation(found);
            }
        } catch (error) {
            console.error("Failed to fetch simulation details:", error);
        }
    };

    const handleCompleteSimulator = async (id: string) => {
        try {
            await fetch("/api/admin/simulations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id,
                    type: "update_progress",
                    data: { status: 'completed' }
                })
            });
            fetchData();
        } catch (error) {
            console.error("Failed to complete simulation:", error);
        }
    };

    const handleSetMeetingLink = async (missionId: string, link: string) => {
        setIsProcessing(true);
        try {
            await fetch("/api/admin/simulations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: missionId,
                    type: "set_meeting_link",
                    data: { link }
                })
            });
            fetchData();
        } catch (error) {
            console.error("Failed to set meeting link:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    if (isLoading) {
        return (
            <div className="h-[60vh] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Missions & Simulations</h1>
                    <p className="text-slate-500 mt-2 text-lg">Manage executive simulation requests and monitor active coaching sessions.</p>
                </div>
                {activeTab === "incoming" && (
                    <button
                        onClick={() => setShowUserSelectModal(true)}
                        className="px-6 py-3 bg-slate-900 text-white text-xs font-black rounded-2xl hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10 flex items-center gap-2"
                    >
                        <UserPlus size={16} /> Start Manual Mission
                    </button>
                )}
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: "Pending & Proposals", value: stats.pending, icon: MessageSquare, color: "blue", active: activeTab === "incoming" },
                    { label: "Active Simulations", value: stats.active, icon: PlayCircle, color: "emerald", active: activeTab === "active" },
                    { label: "Completed Path", value: stats.completed, icon: ShieldCheck, color: "slate", active: activeTab === "completed" },
                ].map((stat, i) => (
                    <button
                        key={i}
                        onClick={() => setActiveTab(stat.color === "blue" ? "incoming" : stat.color === "emerald" ? "active" : "completed")}
                        className={cn(
                            "p-6 rounded-[2.5rem] border-2 transition-all text-left relative overflow-hidden group",
                            stat.active
                                ? "bg-white border-blue-600 shadow-xl shadow-blue-500/10"
                                : "bg-white border-slate-100 hover:border-slate-300"
                        )}
                    >
                        <div className={cn(
                            "w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110",
                            stat.color === "blue" ? "bg-blue-50 text-blue-600" :
                                stat.color === "emerald" ? "bg-emerald-50 text-emerald-600" :
                                    "bg-slate-50 text-slate-600"
                        )}>
                            <stat.icon size={24} />
                        </div>
                        <h3 className="text-slate-500 font-bold text-sm uppercase tracking-widest">{stat.label}</h3>
                        <p className="text-4xl font-black text-slate-900 mt-1">{stat.value}</p>
                        {stat.active && (
                            <motion.div
                                layoutId="stat-active"
                                className="absolute right-6 top-6 w-2 h-2 rounded-full bg-blue-600"
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Content Table/List */}
            <div className="bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden shadow-sm">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search by participant email..."
                                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm w-80 focus:ring-2 focus:ring-blue-500/10 outline-none"
                            />
                        </div>
                        <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                            <Filter size={20} />
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Participant</th>
                                <th className="px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Type / Status</th>
                                <th className="px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                                <th className="px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {activeTab === "incoming" && simulations.pending.map((req) => (
                                <tr key={req._id} className="group hover:bg-slate-50/80 transition-all">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                                                {req.userId.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900">{req.userId}</span>
                                                <span className="text-xs text-slate-500">Tier: Executive</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col gap-1">
                                            <span className="px-3 py-1 bg-slate-100 text-slate-700 text-[10px] font-black rounded-lg uppercase tracking-widest w-fit">
                                                {req.missionType || "General Coaching"}
                                            </span>
                                            <span className={cn(
                                                "text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded w-fit",
                                                req.status === 'proposed' ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                                            )}>
                                                {req.status === 'proposed' ? 'Proposal Sent' : 'Incoming Request'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-sm text-slate-500 font-medium">
                                        {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedRequest(req);
                                                    setShowProposalModal(true);
                                                }}
                                                className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/10 flex items-center gap-2"
                                            >
                                                <Plus size={14} /> Create Proposal
                                            </button>
                                            {req._id && (
                                                <button
                                                    onClick={() => handleDeleteMission(req._id!)}
                                                    className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {activeTab === "active" && simulations.active.map((mission) => (
                                <tr key={mission._id} className="group hover:bg-slate-50/80 transition-all">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                                                {mission.userId.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex flex-col">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-slate-900">{mission.userId}</span>
                                                    {!mission.draftViewedByAdmin && (
                                                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" title="New answer from participant" />
                                                    )}
                                                </div>
                                                <span className="text-xs text-slate-500">{mission.title}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-700 text-sm">{mission.role}</span>
                                            <span className="text-xs text-slate-400">{mission.company}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden w-24">
                                                <div
                                                    className="h-full bg-emerald-500 transition-all"
                                                    style={{ width: `${(mission.objectives?.filter((o: Objective) => o.status === 'completed').length / mission.objectives?.length) * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-400">
                                                {mission.objectives?.filter((o: Objective) => o.status === 'completed').length}/{mission.objectives?.length}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => {
                                                    const link = prompt("Enter Zoom/Google Meet Link:", mission.meetingLink);
                                                    if (link !== null) handleSetMeetingLink(mission._id, link);
                                                }}
                                                className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-blue-600 hover:border-blue-100 transition-all"
                                                title="Set Meeting Link"
                                            >
                                                <PlayCircle size={18} />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedSimulation(mission);
                                                    setShowControlModal(true);
                                                    handleMarkDraftAsViewed(mission._id);
                                                }}
                                                className="p-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-blue-600 hover:border-blue-100 transition-all"
                                                title="Mission Control"
                                            >
                                                <ChevronRight size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteMission(mission._id)}
                                                className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                                                title="Delete Mission"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {(activeTab === "incoming" && simulations.pending.length === 0) ||
                                (activeTab === "active" && simulations.active.length === 0) ||
                                (activeTab === "completed" && simulations.completed.length === 0) ? (
                                <tr>
                                    <td colSpan={4} className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                                                <Briefcase size={32} />
                                            </div>
                                            <p className="text-slate-500 font-medium">No missions found in this category.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : null}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Proposal Modal */}
            <AnimatePresence>
                {showProposalModal && (
                    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowProposalModal(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-[3rem] shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden relative z-10 flex flex-col"
                        >
                            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <div>
                                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Design New Mission</h2>
                                    <p className="text-slate-500 text-sm font-medium mt-1">Creating expert proposal for {selectedRequest?.userId}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={handleGenerateAI}
                                        type="button"
                                        disabled={isGeneratingAI}
                                        className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-black hover:bg-indigo-100 transition-all border border-indigo-100 shadow-sm disabled:opacity-50"
                                    >
                                        {isGeneratingAI ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                                        Generate with AI
                                    </button>
                                    <button
                                        onClick={() => setShowProposalModal(false)}
                                        className="p-2 bg-white rounded-xl text-slate-400 hover:text-slate-900 transition-colors shadow-sm"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            <form onSubmit={handleCreateProposal} className="p-8 space-y-8 overflow-y-auto flex-1 custom-scrollbar">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Mission Details</label>
                                        <div className="space-y-4">
                                            <input
                                                type="text"
                                                placeholder="Mission Title (e.g. CEO Succession Crisis)"
                                                value={proposal.title}
                                                onChange={(e) => setProposal({ ...proposal, title: e.target.value })}
                                                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/10 outline-none font-bold"
                                                required
                                            />
                                            <div className="grid grid-cols-2 gap-4">
                                                <input
                                                    type="text"
                                                    placeholder="Role"
                                                    value={proposal.role}
                                                    onChange={(e) => setProposal({ ...proposal, role: e.target.value })}
                                                    className="px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/10 outline-none"
                                                    required
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="Company"
                                                    value={proposal.company}
                                                    onChange={(e) => setProposal({ ...proposal, company: e.target.value })}
                                                    className="px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/10 outline-none"
                                                    required
                                                />
                                            </div>
                                            <input
                                                type="number"
                                                placeholder="Fee (TND)"
                                                value={proposal.price}
                                                onChange={(e) => setProposal({ ...proposal, price: Number(e.target.value) })}
                                                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/10 outline-none font-black"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block ml-1">Executive Briefing</label>
                                        <textarea
                                            placeholder="Confidential briefing for the participant..."
                                            value={proposal.briefing}
                                            onChange={(e) => setProposal({ ...proposal, briefing: e.target.value })}
                                            className="w-full h-[180px] px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/10 outline-none resize-none leading-relaxed"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between ml-1">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Mission Roadmap</label>
                                        <button
                                            type="button"
                                            onClick={addObjective}
                                            className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline"
                                        >
                                            + Add Step
                                        </button>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {proposal.objectives.map((obj, i) => (
                                            <div key={i} className="flex gap-3 group">
                                                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-black shrink-0 mt-1">
                                                    {i + 1}
                                                </div>
                                                <div className="flex-1 relative">
                                                    <input
                                                        type="text"
                                                        value={obj.title}
                                                        onChange={(e) => {
                                                            const newObjs = [...proposal.objectives];
                                                            newObjs[i].title = e.target.value;
                                                            setProposal({ ...proposal, objectives: newObjs });
                                                        }}
                                                        className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500/10 outline-none font-medium pr-8"
                                                        required
                                                    />
                                                    {proposal.objectives.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeObjective(i)}
                                                            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest italic group">
                                        * This proposal will be sent to the participant for approval.
                                    </p>
                                    <button
                                        type="submit"
                                        disabled={isProcessing}
                                        className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:bg-blue-600 hover:-translate-y-1 transition-all flex items-center gap-3 disabled:opacity-50"
                                    >
                                        {isProcessing ? <Loader2 className="animate-spin" size={20} /> : <><Send size={18} /> Send Proposal</>}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            {/* User Selection Modal */}
            <AnimatePresence>
                {showUserSelectModal && (
                    <div className="fixed inset-0 z-70 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowUserSelectModal(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden relative z-10 p-8"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-black text-slate-900 tracking-tight">Select Participant</h3>
                                <button onClick={() => setShowUserSelectModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                                    <X size={20} className="text-slate-400" />
                                </button>
                            </div>

                            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {allParticipants.length === 0 ? (
                                    <p className="text-center py-10 text-slate-400 font-medium italic">No participants found in the system.</p>
                                ) : (
                                    allParticipants.map((user) => (
                                        <button
                                            key={user._id}
                                            onClick={() => {
                                                // We must use the unique identifier consistent with our schema.
                                                // In this system, 'email' is often used as the userId link, or fullName.
                                                // To be safe and consistent with previous steps, let's use email if available.
                                                const userIdToUse = user.email || user.fullName;
                                                setSelectedRequest({ userId: userIdToUse, missionType: 'Manual Assignment' });
                                                setShowUserSelectModal(false);
                                                setShowProposalModal(true);
                                            }}
                                            className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-blue-50 hover:shadow-sm transition-all border border-transparent hover:border-blue-100 group"
                                        >
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 font-bold flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                                {user.fullName?.charAt(0) || user.email.charAt(0)}
                                            </div>
                                            <div className="text-left flex-1 min-w-0">
                                                <p className="text-sm font-bold text-slate-900 truncate">{user.fullName || "Unnamed User"}</p>
                                                <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                            </div>
                                            <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-600" />
                                        </button>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Control Modal */}
            <AnimatePresence>
                {showControlModal && selectedSimulation && (
                    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowControlModal(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-[3.5rem] shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden relative z-10 flex flex-col"
                        >
                            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                                        <ShieldCheck size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">{selectedSimulation.title}</h2>
                                        <p className="text-slate-500 text-sm font-medium">Participant: {selectedSimulation.userId}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowControlModal(false)}
                                    className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-slate-900 transition-all hover:rotate-90"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-hidden flex">
                                {/* Left Side: Draft & Resources */}
                                <div className="flex-1 p-8 overflow-y-auto custom-scrollbar border-r border-slate-100 space-y-8">
                                    {/* User Draft */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                                <FileText size={14} /> Participant&apos;s Live Draft
                                            </label>
                                            <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded-full animate-pulse">LIVE UPDATING</span>
                                        </div>
                                        <div className="bg-slate-50 border border-slate-100 rounded-4xl p-6 text-slate-600 text-sm leading-relaxed whitespace-pre-wrap h-64 overflow-y-auto custom-scrollbar italic relative">
                                            {!selectedSimulation.draftViewedByAdmin && (
                                                <div className="absolute top-4 right-4 bg-red-500 text-white text-[9px] font-black px-2 py-1 rounded-full animate-bounce shadow-lg">NEW ANSWER</div>
                                            )}
                                            {selectedSimulation.currentDraft || "No work submitted yet..."}
                                        </div>
                                        {selectedSimulation.submittedLink && (
                                            <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                                                <p className="text-xs font-black text-emerald-700 uppercase mb-2">Submitted Final Work Link:</p>
                                                <a href={selectedSimulation.submittedLink} target="_blank" className="text-blue-600 underline text-sm font-bold break-all">
                                                    {selectedSimulation.submittedLink}
                                                </a>
                                            </div>
                                        )}
                                    </div>

                                    {/* Objectives Control */}
                                    <div className="space-y-4">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <Target size={14} /> Mission Roadmap Control
                                        </label>
                                        <div className="grid grid-cols-1 gap-3">
                                            {selectedSimulation.objectives?.map((obj: Objective, idx: number) => (
                                                <div key={idx} className="p-4 bg-white border border-slate-100 rounded-2xl hover:border-blue-100 transition-all group space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className={cn(
                                                                "w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black transition-colors",
                                                                obj.status === 'completed' ? "bg-emerald-100 text-emerald-600" :
                                                                    obj.status === 'current' ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-400"
                                                            )}>
                                                                {obj.status === 'completed' ? <CheckCircle2 size={16} /> : idx + 1}
                                                            </div>
                                                            <span className={cn("text-xs font-bold", obj.status === 'completed' ? "text-slate-400 line-through" : "text-slate-700")}>
                                                                {obj.title}
                                                            </span>
                                                        </div>
                                                        <select
                                                            value={obj.status}
                                                            onChange={(e) => {
                                                                const newObjs = [...selectedSimulation.objectives];
                                                                newObjs[idx].status = e.target.value;
                                                                handleUpdateObjectives(selectedSimulation._id, newObjs);
                                                            }}
                                                            className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-slate-50 border-none rounded-lg outline-none cursor-pointer hover:bg-slate-100"
                                                        >
                                                            <option value="locked">Locked</option>
                                                            <option value="current">Current</option>
                                                            <option value="completed">Completed</option>
                                                        </select>
                                                    </div>

                                                    {/* Session Settings */}
                                                    <div className="grid grid-cols-3 gap-2 pl-11">
                                                        <div className="space-y-1">
                                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Date</label>
                                                            <input
                                                                type="date"
                                                                value={obj.date || ""}
                                                                onChange={(e) => {
                                                                    const newObjs = [...selectedSimulation.objectives];
                                                                    newObjs[idx].date = e.target.value;
                                                                    handleUpdateObjectives(selectedSimulation._id, newObjs);
                                                                }}
                                                                className="w-full px-2 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] outline-none"
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Time</label>
                                                            <input
                                                                type="time"
                                                                value={obj.time || ""}
                                                                onChange={(e) => {
                                                                    const newObjs = [...selectedSimulation.objectives];
                                                                    newObjs[idx].time = e.target.value;
                                                                    handleUpdateObjectives(selectedSimulation._id, newObjs);
                                                                }}
                                                                className="w-full px-2 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] outline-none"
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Session Link</label>
                                                            <input
                                                                type="text"
                                                                placeholder="Zoom/Meet Link"
                                                                value={obj.meetingLink || ""}
                                                                onChange={(e) => {
                                                                    const newObjs = [...selectedSimulation.objectives];
                                                                    newObjs[idx].meetingLink = e.target.value;
                                                                    handleUpdateObjectives(selectedSimulation._id, newObjs);
                                                                }}
                                                                className="w-full px-2 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-[10px] outline-none"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Confidential Assets Manager */}
                                    <div className="space-y-4">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <ShieldCheck size={14} /> Confidential Assets (Links)
                                        </label>
                                        <div className="space-y-3">
                                            {selectedSimulation.resources?.map((res: ResourceAsset, idx: number) => (
                                                <div key={idx} className="flex items-center justify-between p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                                                            <FileText size={14} />
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-bold text-indigo-900">{res.title}</p>
                                                            <p className="text-[10px] text-indigo-500 truncate max-w-[200px]">{res.url}</p>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            const filtered = selectedSimulation.resources?.filter((_: ResourceAsset, i: number) => i !== idx) || [];
                                                            handleUpdateResources(selectedSimulation._id, filtered);
                                                        }}
                                                        className="text-indigo-300 hover:text-red-500 transition-colors"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                            <div className="grid grid-cols-2 gap-3 pt-2">
                                                <input
                                                    type="text"
                                                    placeholder="Asset Title"
                                                    value={newResource.title}
                                                    onChange={e => setNewResource({ ...newResource, title: e.target.value })}
                                                    className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500/10"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="URL (Link)"
                                                    value={newResource.url}
                                                    onChange={e => setNewResource({ ...newResource, url: e.target.value })}
                                                    className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500/10"
                                                />
                                            </div>
                                            <button
                                                onClick={handleAddResource}
                                                className="w-full py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-indigo-600/20 hover:-translate-y-0.5 transition-all"
                                            >
                                                Add Confidential Asset
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Side: Internal Comms (Chat) */}
                                <div className="w-[350px] bg-slate-50 flex flex-col">
                                    <div className="p-6 border-b border-slate-200">
                                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                            <MessageSquare size={16} /> Internal Comms
                                        </h3>
                                    </div>
                                    <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                                        {selectedSimulation.messages && selectedSimulation.messages.length > 0 ? (
                                            selectedSimulation.messages.map((msg: Message, idx: number) => (
                                                <div key={idx} className={cn(
                                                    "flex flex-col gap-1 max-w-[85%]",
                                                    msg.sender === 'admin' ? "ml-auto items-end" : "items-start"
                                                )}>
                                                    <div className={cn(
                                                        "p-3 rounded-2xl text-xs",
                                                        msg.sender === 'admin' ? "bg-slate-900 text-white rounded-tr-none" : "bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm"
                                                    )}>
                                                        {msg.text}
                                                    </div>
                                                    <span className="text-[10px] text-slate-400 font-bold px-1">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="h-full flex flex-col items-center justify-center text-center p-4">
                                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-200 shadow-sm mb-3">
                                                    <MessageSquare size={24} />
                                                </div>
                                                <p className="text-xs text-slate-400 font-medium font-arabic">لا توجد رسائل بعد. ابدأ التواصل مع المشارك.</p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-6 bg-white border-t border-slate-200">
                                        <form onSubmit={e => { e.preventDefault(); handleSendMessage(); }} className="relative">
                                            <textarea
                                                value={newMessage}
                                                onChange={e => setNewMessage(e.target.value)}
                                                placeholder="Type internally..."
                                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs outline-none focus:ring-2 focus:ring-blue-500/10 resize-none h-20 pr-12"
                                            />
                                            <button
                                                type="submit"
                                                className="absolute right-3 bottom-4 w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center hover:bg-blue-600 transition-all shadow-lg"
                                            >
                                                <Send size={14} />
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-slate-900 flex items-center justify-between gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest font-arabic">الخبير يتحكم في المحاكاة الآن</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => {
                                            if (confirm("Complete this mission? This will move it to archive.")) {
                                                handleCompleteSimulator(selectedSimulation._id);
                                                setShowControlModal(false);
                                            }
                                        }}
                                        className="px-6 py-2.5 bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
                                    >
                                        Finish & Approve Mission
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}


// Helper function to handle conditional classes
function cn(...classes: (string | boolean | undefined | null)[]) {
    return classes.filter(Boolean).join(" ");
}
