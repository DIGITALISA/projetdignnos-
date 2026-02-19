import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Official Workshop Attestations | matrainingconsulting",
  description: "View and manage your professional workshop attestations issued by MA-TRAINING-CONSULTING. Secure and verified executive credentials.",
};

export default function AttestationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
