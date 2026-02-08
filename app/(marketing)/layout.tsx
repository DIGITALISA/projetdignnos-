import { Navbar } from "@/components/ui/navbar";
import { Footer } from "@/components/ui/footer";

export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#050505]">
            <Navbar />
            {children}
            <Footer />
        </div>
    );
}
