"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function ProfileRouter() {
    const params = useParams();
    const router = useRouter();
    const userId = params.userId as string;

    useEffect(() => {
        const detect = async () => {
            try {
                const res = await fetch(`/api/admin/users/${userId}/aggregated-data`);
                const data = await res.json();

                if (data.success) {
                    const plan = data.user?.plan;
                    if (plan === "Student") {
                        router.replace(`/admin/users/${userId}/student-review`);
                    } else {
                        router.replace(`/admin/users/${userId}/professional-review`);
                    }
                } else {
                    router.replace(`/admin/users`);
                }
            } catch {
                router.replace(`/admin/users`);
            }
        };

        if (userId) detect();
    }, [userId, router]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-slate-50">
            <div className="relative">
                <div className="w-16 h-16 rounded-full border-2 border-slate-200 border-t-blue-600 animate-spin" />
                <Loader2 className="absolute inset-0 m-auto w-6 h-6 text-blue-600" />
            </div>
            <p className="text-slate-500 font-bold text-sm uppercase tracking-widest animate-pulse">
                Loading Review Board...
            </p>
        </div>
    );
}
