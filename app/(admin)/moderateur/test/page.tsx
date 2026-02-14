"use client";

import { useEffect, useState } from "react";

interface UserProfile {
    email?: string;
    fullName?: string;
    role?: string;
    status?: string;
    plan?: string;
}

export default function ModeratorTest() {
    const [userInfo, setUserInfo] = useState<UserProfile | null>(null);

    useEffect(() => {
        const loadProfile = () => {
            const profile = localStorage.getItem("userProfile");
            if (profile) {
                try {
                    const parsed = JSON.parse(profile);
                    setUserInfo(parsed);
                } catch (error) {
                    console.error("Failed to parse user profile", error);
                }
            }
        };
        
        loadProfile();
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-black text-slate-900 mb-8">
                    🔍 Moderator Route Test
                </h1>
                
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200">
                    <h2 className="text-2xl font-bold mb-4">Current User Profile:</h2>
                    
                    {userInfo ? (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Email</p>
                                    <p className="text-lg font-semibold text-slate-900">{userInfo.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Full Name</p>
                                    <p className="text-lg font-semibold text-slate-900">{userInfo.fullName}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Role</p>
                                    <p className={`text-lg font-semibold ${
                                        userInfo.role === 'Admin' || userInfo.role === 'Moderator' 
                                            ? 'text-green-600' 
                                            : 'text-red-600'
                                    }`}>
                                        {userInfo.role}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Status</p>
                                    <p className="text-lg font-semibold text-slate-900">{userInfo.status}</p>
                                </div>
                            </div>

                            <div className="mt-8 p-6 bg-slate-50 rounded-2xl">
                                <h3 className="font-bold text-lg mb-2">Access Check:</h3>
                                {userInfo.role === 'Admin' || userInfo.role === 'Moderator' ? (
                                    <p className="text-green-600 font-semibold">
                                        ✅ You SHOULD have access to /moderateur
                                    </p>
                                ) : (
                                    <p className="text-red-600 font-semibold">
                                        ❌ You DO NOT have access to /moderateur
                                        <br />
                                        <span className="text-sm">Your role must be &quot;Admin&quot; or &quot;Moderator&quot;</span>
                                    </p>
                                )}
                            </div>

                            <div className="mt-6">
                                <h3 className="font-bold text-lg mb-2">Full Profile Data:</h3>
                                <pre className="bg-slate-900 text-green-400 p-4 rounded-xl overflow-auto text-xs">
                                    {JSON.stringify(userInfo, null, 2)}
                                </pre>
                            </div>
                        </div>
                    ) : (
                        <p className="text-red-600 font-semibold">❌ No user profile found in localStorage</p>
                    )}
                </div>

                <div className="mt-8 flex gap-4">
                    <a 
                        href="/moderateur" 
                        className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition"
                    >
                        Try /moderateur
                    </a>
                    <a 
                        href="/admin" 
                        className="px-6 py-3 bg-slate-600 text-white rounded-xl font-bold hover:bg-slate-700 transition"
                    >
                        Try /admin
                    </a>
                    <a 
                        href="/dashboard" 
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition"
                    >
                        Go to Dashboard
                    </a>
                </div>
            </div>
        </div>
    );
}
