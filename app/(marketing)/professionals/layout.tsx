import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Career Transformation | AI-Powered Diagnostics | MA-CONSULTING",
  description: "Reinvent your professional future with the world's first AI+Human career ecosystem. 7-stage diagnostics, executive workshops, and verified performance certifications.",
  keywords: ["career development", "AI coaching", "executive training", "professional roadmap", "CV optimization", "job simulation"],
  openGraph: {
    title: "AI Career Transformation | MA-TRAINING-CONSULTING",
    description: "Navigate your transformation with high-precision AI diagnostics and expert coaching.",
    type: "website",
  }
};

export default function ProfessionalsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
