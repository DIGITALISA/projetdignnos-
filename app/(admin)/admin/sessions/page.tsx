"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
    Users, 
    Video, 
    Calendar, 
    Clock, 
    Plus, 
    Trash2, 
    ExternalLink, 
    Search,
    Loader2,
    CheckCircle2,
    X,
    UserCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface Session {
    _id?: string;
    title: string;
    date: string;
    time: string;
    expertName: string;
    meetingLink: string;
}

interface Participant {
    _id: string;
    fullName: string;
    email: string;
}

export default function SessionsManagement() {
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [selectedUser, setSelectedUser] = useState<Participant | null>(null);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState<Session>({
        title: "Strategic Executive Briefing",
        date: "",
        time: "",
        expertName: "Dr. Ahmed Ben Mansour",
        meetingLink: ""
    });

    useEffect(() => {
        fetchParticipants();
    }, []);

    const fetchParticipants = async () => {
        try {
            const res = await fetch("/api/admin/users");
            const data = await res.json();
            if (Array.isArray(data)) {
                setParticipants(data.filter(u => 
                    u.role !== 'Admin' && 
                    u.role !== 'Moderator' && 
                    u.status === 'Active'
                ));
            }
        } catch (error) {
            console.error("Failed to fetch users", error);
        }
    };

    const fetchSessions = async (user: Participant) => {
        setIsLoading(true);
        setSelectedUser(user);
        try {
            const res = await fetch(`/api/admin/sessions?userId=${encodeURIComponent(user.email)}`);
            const data = await res.json();
            if (data.success) {
                setSessions(data.sessions);
            }
        } catch (error) {
            console.error("Failed to fetch sessions", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddSession = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser) return;
        setIsLoading(true);

        try {
            const res = await fetch("/api/admin/sessions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: selectedUser.email,
                    session: formData
                })
            });

            if (res.ok) {
                await fetchSessions(selectedUser);
                setIsAddModalOpen(false);
                setFormData({
                    title: "Strategic Executive Briefing",
                    date: "",
                    time: "",
                    expertName: "Dr. Ahmed Ben Mansour",
                    meetingLink: ""
                });
            }
        } catch (error) {
            console.error("Failed to add session", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteSession = async (sessionId: string) => {
        if (!selectedUser || !confirm("Erase this briefing?")) return;
        
        try {
            const res = await fetch(`/api/admin/sessions?userId=${encodeURIComponent(selectedUser.email)}&sessionId=${sessionId}`, {
                method: "DELETE"
            });

            if (res.ok) {
                setSessions(prev => prev.filter(s => s._id !== sessionId));
            }
        } catch (error) {
            console.error("Failed to delete session", error);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Sessions Manager</h1>
                    <p className="text-slate-500 mt-1 font-medium">Schedule and deploy live executive strategic briefings.</p>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left: Participants List */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col h-[700px]">
                    <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors" size={18} />
                            <input 
                                type="text" 
                                placeholder="Search executives..."
                                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/5 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {participants.filter(p => 
                            p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            p.email.toLowerCase().includes(searchTerm.toLowerCase())
                        ).map(user => (
                            <button
                                key={user._id}
                                onClick={() => fetchSessions(user)}
                                className={cn(
                                    "w-full flex items-center gap-4 p-4 rounded-2xl transition-all border text-left",
                                    selectedUser?._id === user._id 
                                        ? "bg-blue-600 border-blue-600 shadow-lg shadow-blue-600/20 text-white" 
                                        : "bg-white border-transparent hover:bg-slate-50 text-slate-600"
                                )}
                            >
                                <div className={cn(
                                    "w-10 h-10 rounded-xl flex items-center justify-center font-bold",
                                    selectedUser?._id === user._id ? "bg-white/20" : "bg-slate-100 text-slate-400"
                                )}>
                                    {user.fullName.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-bold truncate text-sm">{user.fullName}</p>
                                    <p className={cn(
                                        "text-[10px] font-medium truncate",
                                        selectedUser?._id === user._id ? "text-blue-100" : "text-slate-400"
                                    )}>{user.email}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Right: Sessions View */}
                <div className="lg:col-span-2 space-y-6">
                    {selectedUser ? (
                        <div className="space-y-6">
                            <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
                                <div className="relative z-10 space-y-2">
                                    <div className="flex items-center gap-3">
                                        <UserCircle className="text-blue-400" />
                                        <h2 className="text-xl font-bold">{selectedUser.fullName}</h2>
                                    </div>
                                    <p className="text-slate-400 text-sm font-medium ml-9">{selectedUser.email}</p>
                                </div>
                                <button 
                                    onClick={() => setIsAddModalOpen(true)}
                                    className="relative z-10 flex items-center gap-3 px-6 py-4 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all shadow-xl active:scale-95"
                                >
                                    <Plus size={18} />
                                    New Session
                                </button>
                                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] -mr-32 -mt-32" />
                            </div>

                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-24 gap-4">
                                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Accessing Mandate Registry...</p>
                                </div>
                            ) : sessions.length > 0 ? (
                                <div className="grid md:grid-cols-2 gap-6">
                                    <AnimatePresence>
                                        {sessions.map((session) => (
                                            <motion.div
                                                key={session._id}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-lg hover:shadow-xl transition-all relative group"
                                            >
                                                <button 
                                                    onClick={() => handleDeleteSession(session._id!)}
                                                    className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                                
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                                                            <Video size={20} />
                                                        </div>
                                                        <h3 className="font-bold text-slate-900">{session.title}</h3>
                                                    </div>
                                                    
                                                    <div className="space-y-2 pt-2">
                                                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                                                            <Calendar size={14} className="text-blue-500" />
                                                            <span className="font-bold">{new Date(session.date).toLocaleDateString()}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                                                            <Clock size={14} className="text-blue-500" />
                                                            <span className="font-bold">{session.time}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                                                            <Users size={14} className="text-blue-500" />
                                                            <span className="font-bold">{session.expertName}</span>
                                                        </div>
                                                    </div>

                                                    <a 
                                                        href={session.meetingLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="mt-4 w-full flex items-center justify-center gap-2 py-3 bg-slate-50 text-slate-600 rounded-xl font-bold text-xs hover:bg-blue-50 hover:text-blue-600 transition-all border border-slate-100"
                                                    >
                                                        Link Status: Active
                                                        <ExternalLink size={14} />
                                                    </a>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <div className="bg-slate-50 rounded-[2.5rem] border-2 border-dashed border-slate-200 py-24 text-center space-y-4">
                                    <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto shadow-sm">
                                        <Video className="text-slate-300" size={32} />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-slate-900 font-bold">No Briefings Scheduled</h3>
                                        <p className="text-slate-500 text-sm">Assign a strategic session to this executive.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center py-32 gap-6 text-center">
                            <div className="w-24 h-24 bg-white rounded-4xl border border-slate-100 shadow-xl flex items-center justify-center text-blue-100">
                                <Users size={40} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Select Protocol Asset</h3>
                                <p className="text-slate-500 max-w-xs mx-auto font-medium">Choose an executive from the left registry to manage their briefings.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Session Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <>
                        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50" onClick={() => setIsAddModalOpen(false)} />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-xl bg-white rounded-[3rem] p-10 shadow-2xl z-50 overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-[80px] -mr-32 -mt-32" />
                            
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-8">
                                    <div className="space-y-1">
                                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Deploy Briefing</h2>
                                        <p className="text-slate-500 text-sm font-medium italic">Scheduling for {selectedUser?.fullName}</p>
                                    </div>
                                    <button onClick={() => setIsAddModalOpen(false)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all">
                                        <X size={24} />
                                    </button>
                                </div>

                                <form onSubmit={handleAddSession} className="space-y-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Briefing Title</label>
                                            <input 
                                                required 
                                                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold text-slate-900" 
                                                value={formData.title}
                                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Session Date</label>
                                                <input 
                                                    required 
                                                    type="date"
                                                    className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold text-slate-900" 
                                                    value={formData.date}
                                                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Session Time</label>
                                                <input 
                                                    required 
                                                    placeholder="e.g. 14:00 (GMT+1)"
                                                    className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold text-slate-900" 
                                                    value={formData.time}
                                                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Executive Expert</label>
                                            <input 
                                                required 
                                                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold text-slate-900" 
                                                value={formData.expertName}
                                                onChange={(e) => setFormData({...formData, expertName: e.target.value})}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Zoom / Google Meet Link</label>
                                            <input 
                                                required 
                                                type="url"
                                                className="w-full px-6 py-4 bg-slate-50 border-2 border-transparent focus:border-blue-500 rounded-2xl outline-none font-bold text-slate-900" 
                                                value={formData.meetingLink}
                                                onChange={(e) => setFormData({...formData, meetingLink: e.target.value})}
                                            />
                                        </div>
                                    </div>

                                    <button 
                                        type="submit" 
                                        disabled={isLoading}
                                        className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                                    >
                                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                                        Activate Session
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
