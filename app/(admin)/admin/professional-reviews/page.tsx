"use client";

import { useState, useEffect } from "react";
import { 
  Shield, CheckCircle2, XCircle, Search, 
  FileText, MessageSquare, BarChart3, ChevronRight,
  ExternalLink, User, Loader2, AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface ProfessionalReport {
  email: string;
  fullName: string;
  status: string;
  completedAt: string;
  hasReport: boolean;
  hasAudit: boolean;
  interviewCount: number;
  expertNotes: string | null;
}

export default function ProfessionalReviewsPage() {
  const [reports, setReports] = useState<ProfessionalReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [expertNotes, setExpertNotes] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/professional-reports?status=pending_review");
      const data = await res.json();
      if (data.success) {
        setReports(data.reports);
      }
    } catch (err) {
      console.error("Failed to fetch reports", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleAction = async (email: string, action: 'approve' | 'reject') => {
    setActionLoading(true);
    try {
      const adminEmail = "ahmed@matc.com"; // In reality, fetch from session
      const res = await fetch("/api/admin/professional-reports", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetEmail: email,
          adminEmail,
          action,
          expertNotes,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setReports(reports.filter(r => r.email !== email));
        setSelectedEmail(null);
        setExpertNotes("");
      } else {
        alert(data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to process action");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredReports = reports.filter(r => 
    r.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <Shield className="text-indigo-600" />
          Professional Expert Reviews
        </h1>
        <p className="text-slate-500 mt-1 font-medium">Verify and certify professional HR audit reports.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* List of Pending Reviews */}
        <div className="xl:col-span-1 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search participants..."
              className="w-full pl-12 pr-4 py-4 rounded-3xl border border-slate-100 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
            <div className="p-6 border-b border-slate-50 bg-slate-50/50">
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-500">Queue ({filteredReports.length})</h2>
            </div>
            
            <div className="divide-y divide-slate-50 max-h-[600px] overflow-y-auto">
              {loading ? (
                <div className="p-20 flex flex-col items-center gap-4">
                  <Loader2 className="animate-spin text-indigo-600" size={32} />
                  <p className="text-xs font-bold text-slate-400">Loading queue...</p>
                </div>
              ) : filteredReports.length === 0 ? (
                <div className="p-20 text-center text-slate-400 italic font-medium">
                  No pending reviews found.
                </div>
              ) : (
                filteredReports.map((report) => (
                  <button
                    key={report.email}
                    onClick={() => setSelectedEmail(report.email)}
                    className={cn(
                      "w-full text-left p-6 hover:bg-slate-50 transition-all flex items-center justify-between group",
                      selectedEmail === report.email && "bg-indigo-50/50 border-l-4 border-indigo-600"
                    )}
                  >
                    <div className="space-y-1">
                      <div className="font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight italic">
                        {report.fullName}
                      </div>
                      <div className="text-[10px] text-slate-400 font-bold">{report.email}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Pending Review</span>
                        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{format(new Date(report.completedAt), "dd MMM yyyy", { locale: fr })}</span>
                      </div>
                    </div>
                    <ChevronRight size={18} className={cn("text-slate-300 transition-transform group-hover:translate-x-1", selectedEmail === report.email && "text-indigo-600")} />
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Selected Report Details */}
        <div className="xl:col-span-2">
          {selectedEmail ? (
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-2xl p-10 space-y-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-100">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-3xl bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
                    <User size={32} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{reports.find(r => r.email === selectedEmail)?.fullName}</h2>
                    <p className="text-slate-500 font-medium">{selectedEmail}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <a 
                    href={`/admin/users/${selectedEmail}/profile`} // Assuming we use user ID or email as slug
                    target="_blank"
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl border border-slate-200 text-slate-600 font-black uppercase text-[10px] tracking-widest hover:bg-slate-50 transition-all"
                  >
                    <ExternalLink size={14} /> Full Profile
                  </a>
                </div>
              </div>

              {/* Data Summary Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-4xl bg-slate-50 border border-slate-100 space-y-3">
                  <div className="flex items-center gap-2 text-indigo-600">
                    <FileText size={18} />
                    <h4 className="text-[10px] font-black uppercase tracking-widest">Master Report</h4>
                  </div>
                  <p className="text-xs font-bold text-slate-700">Generated & Saved</p>
                  <CheckCircle2 size={16} className="text-emerald-500" />
                </div>
                <div className="p-6 rounded-4xl bg-slate-50 border border-slate-100 space-y-3">
                  <div className="flex items-center gap-2 text-blue-600">
                    <BarChart3 size={18} />
                    <h4 className="text-[10px] font-black uppercase tracking-widest">Audit Matrix</h4>
                  </div>
                  <p className="text-xs font-bold text-slate-700">Data Available</p>
                  <CheckCircle2 size={16} className="text-emerald-500" />
                </div>
                <div className="p-6 rounded-4xl bg-slate-50 border border-slate-100 space-y-3">
                  <div className="flex items-center gap-2 text-violet-600">
                    <MessageSquare size={18} />
                    <h4 className="text-[10px] font-black uppercase tracking-widest">Interview</h4>
                  </div>
                  <p className="text-xs font-bold text-slate-700">{reports.find(r => r.email === selectedEmail)?.interviewCount} Messages Logged</p>
                  <CheckCircle2 size={16} className="text-emerald-500" />
                </div>
              </div>

              {/* Action Form */}
              <div className="space-y-6 pt-10 border-t border-slate-100">
                <div className="space-y-3">
                  <label className="text-sm font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                    <Shield size={16} className="text-indigo-600" />
                    Strategic Expert Notes / Feedback
                  </label>
                  <textarea 
                    placeholder="Provide your expert evaluation notes here. These will be visible to the participant if approved."
                    className="w-full h-40 p-6 rounded-[2.5rem] border border-slate-100 bg-slate-50 text-slate-700 font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all resize-none"
                    value={expertNotes}
                    onChange={(e) => setExpertNotes(e.target.value)}
                  />
                  <p className="text-[10px] text-slate-400 font-medium pl-4">A critical, professional tone is required for all expert interventions.</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <button
                    disabled={actionLoading}
                    onClick={() => handleAction(selectedEmail!, 'approve')}
                    className="flex-1 flex items-center justify-center gap-3 py-5 rounded-3xl bg-slate-900 text-white font-black uppercase text-xs tracking-[0.2em] hover:bg-black transition-all shadow-2xl disabled:opacity-50"
                  >
                    {actionLoading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                    Approve & Certify Report
                  </button>
                  <button
                    disabled={actionLoading}
                    onClick={() => handleAction(selectedEmail!, 'reject')}
                    className="sm:w-1/3 flex items-center justify-center gap-3 py-5 rounded-3xl bg-rose-50 text-rose-600 border border-rose-100 font-black uppercase text-xs tracking-[0.2em] hover:bg-rose-100 transition-all disabled:opacity-50"
                  >
                    <XCircle size={20} />
                    Reject / Flag
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-20 text-center space-y-6 bg-slate-50/50 rounded-[3rem] border-2 border-dashed border-slate-200">
              <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center text-slate-300">
                <AlertCircle size={48} />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 uppercase">No Selection</h3>
                <p className="text-slate-500 text-sm font-medium">Select a participant from the left queue to begin the audit review.</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
