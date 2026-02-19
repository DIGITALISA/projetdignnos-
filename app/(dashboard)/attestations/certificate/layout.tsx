import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Certificate | matrainingconsulting",
  description: "Official verification page for MA-TRAINING-CONSULTING workshop attestations. Secure validation of professional benchmarks and executive achievements.",
};

export default function CertificateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
