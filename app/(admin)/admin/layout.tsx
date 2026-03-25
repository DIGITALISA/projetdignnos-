"use client";

import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  PlayCircle,
  Library,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Search,
  Bell,
  Wrench,
  Lock,
  ShieldAlert,
  Loader2,
  ArrowRight,
  Briefcase,
  FileText,
  Video,
  Building2,
  Zap,
  UserPlus,
  LayoutGrid,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

interface AdminNotification {
  _id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const adminSidebarItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/admin" },
  { name: "Mandats", icon: FileText, href: "/admin/registrations" },
  { name: "Participants", icon: Users, href: "/admin/users" },
  { name: "Recruitment Hub", icon: UserPlus, href: "/admin/recruitment" },
  { name: "Missions & Audits", icon: Briefcase, href: "/admin/simulations" },
  { name: "Tools AI", icon: Wrench, href: "/admin/tools" },
  { name: "Workshop Manager", icon: PlayCircle, href: "/admin/training" },
  { name: "Live Briefings", icon: Video, href: "/admin/sessions" },
  { name: "Strategic Mandates", icon: Building2, href: "/admin/consulting" },
  { name: "Corporate Inquiries", icon: Briefcase, href: "/admin/inquiries" },
  { name: "Library", icon: Library, href: "/admin/library" },
  { name: "Marketplace Hub", icon: Zap, href: "/admin/digitalization" },
  { name: "Footer Manager", icon: LayoutGrid, href: "/admin/footer" },
  { name: "System Settings", icon: Settings, href: "/admin/settings" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSectionUnlocked, setIsSectionUnlocked] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");

  const ADMIN_EMAIL = "ahmed@matc.com";
  const ADMIN_PASSWORD = "ahmedmatc@20388542";

  const userName = "Dev Admin";
  const userRole = "Super Admin";

  const pathname = usePathname();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Avoid synchronous setState in effect body to prevent cascading renders
    Promise.resolve().then(() => {
      setMounted(true);
      const unlocked =
        sessionStorage.getItem("admin_section_unlocked") === "true";
      setIsSectionUnlocked(unlocked);
      setIsCheckingAuth(false);
    });
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError("");

    setTimeout(() => {
      if (
        emailInput.trim().toLowerCase() === ADMIN_EMAIL &&
        passwordInput === ADMIN_PASSWORD
      ) {
        setIsSectionUnlocked(true);
        sessionStorage.setItem("admin_section_unlocked", "true");
      } else {
        if (emailInput.trim().toLowerCase() !== ADMIN_EMAIL) {
          setError("Adresse e-mail incorrecte");
        } else {
          setError("Mot de passe incorrect");
        }
      }
      setIsVerifying(false);
    }, 800);
  };

  const handleLogout = () => {
    setIsSectionUnlocked(false);
    sessionStorage.removeItem("admin_section_unlocked");
    setEmailInput("");
    setPasswordInput("");
    setError("");
  };

  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [activeToast, setActiveToast] = useState<AdminNotification | null>(
    null,
  );

  const lastDisplayedToastId = useRef<string | null>(null);

  useEffect(() => {
    if (notifications.length > 0) {
      const latest = notifications[0];
      if (!latest.read && unreadCount > 0 && latest._id !== lastDisplayedToastId.current) {
        lastDisplayedToastId.current = latest._id;
        // Use a small delay to avoid cascading synchronous render warnings
        const toastTimer = setTimeout(() => setActiveToast(latest), 50);
        const hideTimer = setTimeout(() => setActiveToast(null), 8000);
        return () => {
          clearTimeout(toastTimer);
          clearTimeout(hideTimer);
        };
      }
    }
  }, [notifications, unreadCount]);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/notifications");
      const data = await res.json();
      if (data.notifications) {
        setUnreadCount(data.unreadCount || 0);
        setNotifications(data.notifications);
      }
    } catch (error) {
      console.error("Error fetching notifications", error);
    }
  }, []);

  useEffect(() => {
    // Initiation fetch moved to end of current tick
    const startInitialFetch = setTimeout(fetchNotifications, 0);
    const interval = setInterval(fetchNotifications, 30000); 
    return () => {
      clearTimeout(startInitialFetch);
      clearInterval(interval);
    };
  }, [fetchNotifications]);

  const markAsRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch("/api/admin/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      fetchNotifications();
    } catch (error) {
      console.error("Error marking read", error);
    }
  };

  // Ensure no hydration mismatch by waiting for mount
  if (!mounted || isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  // Show admin login page if not authenticated
  if (!isSectionUnlocked) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background glow effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-3xl" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative w-full max-w-md"
        >
          {/* Card */}
          <div className="bg-slate-900/80 backdrop-blur-2xl border border-slate-700/50 rounded-3xl p-8 shadow-2xl shadow-black/50">
            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-blue-500/30 mb-4">
                <span className="font-black text-white text-3xl">A</span>
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                Admin Panel
              </h1>
              <p className="text-slate-400 text-sm mt-1 font-medium">
                Accès réservé aux administrateurs
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Adresse e-mail
                </label>
                <div className="relative">
                  <input
                    id="admin-email"
                    type="email"
                    value={emailInput}
                    onChange={(e) => {
                      setEmailInput(e.target.value);
                      setError("");
                    }}
                    placeholder="admin@example.com"
                    required
                    autoComplete="email"
                    autoFocus
                    className="w-full px-4 py-3.5 bg-slate-800/80 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 text-sm font-medium focus:outline-none focus:border-blue-500/60 focus:bg-slate-800 transition-all"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Mot de passe
                </label>
                <div className="relative">
                  <input
                    id="admin-password"
                    type={showPassword ? "text" : "password"}
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setError("");
                    }}
                    placeholder="••••••••••"
                    required
                    autoComplete="current-password"
                    className="w-full px-4 py-3.5 bg-slate-800/80 border border-slate-700/50 rounded-xl text-white placeholder-slate-500 text-sm font-medium focus:outline-none focus:border-blue-500/60 focus:bg-slate-800 transition-all pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                  >
                    <Lock size={16} />
                  </button>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl"
                >
                  <ShieldAlert size={14} className="text-red-400 shrink-0" />
                  <p className="text-xs font-bold text-red-400">{error}</p>
                </motion.div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={isVerifying || !emailInput || !passwordInput}
                className="w-full py-4 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-sm uppercase tracking-[0.15em] shadow-xl shadow-blue-500/20 hover:from-blue-500 hover:to-indigo-500 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0 mt-2"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />{" "}
                    Vérification...
                  </>
                ) : (
                  <>
                    Se connecter <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t border-slate-800 text-center">
              <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                Accès strictement réservé. Toute tentative non autorisée sera
                enregistrée.
              </p>
            </div>
          </div>

          {/* Bottom badge */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-slate-600 font-medium">
              Connexion sécurisée
            </span>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Admin Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen bg-slate-900 text-slate-300 z-50 transition-all duration-300 md:translate-x-0 w-72",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* Brand */}
        <div className="h-20 flex items-center justify-between px-8 border-b border-slate-800 bg-slate-900">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <span className="font-black text-white text-xl">A</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-white tracking-tight">
                Admin Panel
              </span>
              <span className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">
                Management
              </span>
            </div>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-slate-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Sidebar Nav */}
        <nav className="p-6 space-y-2">
          {adminSidebarItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-4 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all group relative",
                  isActive
                    ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20"
                    : "hover:bg-slate-800 hover:text-white",
                )}
              >
                <item.icon
                  size={20}
                  className={cn(
                    "transition-colors",
                    isActive
                      ? "text-white"
                      : "text-slate-500 group-hover:text-blue-400",
                  )}
                />
                <span className="flex-1">{item.name}</span>
                {isActive && (
                  <ChevronRight size={16} className="text-white/50" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Logout */}
        <div className="absolute bottom-0 w-full p-6 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-3.5 w-full rounded-xl text-sm font-semibold text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all group"
          >
            <LogOut
              size={20}
              className="group-hover:translate-x-1 transition-transform"
            />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen md:pl-72">
        {/* Admin Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg md:hidden"
            >
              <Menu size={24} />
            </button>
            <div className="relative hidden md:block group">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-colors"
                size={18}
              />
              <input
                type="text"
                placeholder="Search everything..."
                className="pl-10 pr-4 py-2.5 bg-slate-100 border-none rounded-xl text-sm w-80 focus:ring-2 focus:ring-blue-500/10 transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all relative"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                )}
              </button>

              {/* Notifications Dropdown */}
              {isNotificationOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsNotificationOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 flex flex-col">
                    <div className="p-4 border-b border-slate-50 flex justify-between items-center">
                      <h3 className="font-bold text-slate-900 text-sm">
                        Notifications
                      </h3>
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-bold">
                        {unreadCount} New
                      </span>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 text-xs font-medium">
                          No details
                        </div>
                      ) : (
                        notifications.map((notif: AdminNotification) => (
                          <div
                            key={notif._id}
                            onClick={(e) =>
                              !notif.read && markAsRead(notif._id, e)
                            }
                            className={cn(
                              "p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer relative group",
                              !notif.read ? "bg-blue-50/30" : "",
                            )}
                          >
                            <div className="flex items-start gap-3">
                              <div
                                className={cn(
                                  "w-2 h-2 rounded-full mt-1.5 shrink-0",
                                  notif.read ? "bg-slate-200" : "bg-blue-500",
                                )}
                              />
                              <div>
                                <p className="text-xs font-bold text-slate-900">
                                  {notif.title}
                                </p>
                                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                                  {notif.message}
                                </p>
                                <p className="text-[10px] text-slate-400 mt-2 font-medium">
                                  {new Date(notif.createdAt).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="h-8 w-px bg-slate-200 mx-2" />
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900">{userName}</p>
                <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter">
                  {userRole}
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-slate-200 to-slate-300 border border-slate-300 flex items-center justify-center font-bold text-slate-600">
                {userName.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* Workspace area */}
        <main className="flex-1 p-8">{children}</main>
      </div>

      {/* Toast Notification Container */}
      <div className="fixed bottom-8 right-8 z-100 flex flex-col gap-3 pointer-events-none">
        {activeToast && (
          <div className="pointer-events-auto bg-slate-900 text-white p-5 rounded-3xl shadow-2xl border border-slate-700/50 flex items-start gap-4 max-w-sm">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/20">
              <Bell size={20} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-4 mb-1">
                <h4 className="font-bold text-sm truncate">
                  <span suppressHydrationWarning>{activeToast.title}</span>
                </h4>
                <button
                  onClick={() => setActiveToast(null)}
                  className="text-slate-400 hover:text-white transition-colors p-1"
                >
                  <X size={14} />
                </button>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                <span suppressHydrationWarning>{activeToast.message}</span>
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">
                  New Update
                </span>
                <div className="w-1 h-1 rounded-full bg-slate-700" />
                <span className="text-[10px] text-slate-500">
                  {new Date(activeToast.createdAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
