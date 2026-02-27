import { NextRequest, NextResponse } from "next/server";
import { jsPDF } from "jspdf";
import fs from "fs";
import path from "path";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const participantName = searchParams.get("name") || "M. Participant";
    const workshopTitle   = searchParams.get("title") || "Workshop Stratégique";
    const referenceId     = searchParams.get("ref")   || `WKS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const dateParam       = searchParams.get("date");
    const date = dateParam
        ? new Date(Number(dateParam)).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })
        : new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });

    // ── Load Logo ─────────────────────────────────────────────────────────────
    const logoPath = path.join(process.cwd(), "public", "logo-matc.png");
    let logoBase64 = "";
    try {
        const logoBuffer = fs.readFileSync(logoPath);
        logoBase64 = `data:image/png;base64,${logoBuffer.toString("base64")}`;
    } catch (e) {
        console.error("Failed to load logo:", e);
    }

    // ── Page setup ──────────────────────────────────────────────────────────────
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const W = 297; // A4 landscape width (mm)
    const H = 210; // A4 landscape height (mm)

    // ── Background ──────────────────────────────────────────────────────────────
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, W, H, "F");

    // Subtle radial centre glow
    doc.setFillColor(250, 251, 252);
    doc.ellipse(W / 2, H / 2, 120, 80, "F");
    doc.setFillColor(255, 255, 255);
    doc.ellipse(W / 2, H / 2, 80, 55, "F");

    // ── Ornamental border ────────────────────────────────────────────────────────
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setLineWidth(0.3);
    doc.rect(12, 12, W - 24, H - 24);

    doc.setDrawColor(15, 23, 42, 0.1);
    doc.setLineWidth(0.15);
    doc.setLineDashPattern([0.5, 1], 0);
    doc.rect(14, 14, W - 28, H - 28);
    doc.setLineDashPattern([], 0);

    // Corner accents
    const ca = 20;
    doc.setDrawColor(15, 23, 42, 0.1);
    doc.setLineWidth(1);
    doc.line(8, 8 + ca, 8, 8);  doc.line(8, 8, 8 + ca, 8);
    doc.line(W - 8, H - 8 - ca, W - 8, H - 8);  doc.line(W - 8, H - 8, W - 8 - ca, H - 8);

    // Watermark
    doc.setTextColor(15, 23, 42);
    doc.setGState(doc.GState({ opacity: 0.01 }));
    doc.setFontSize(180);
    doc.text("✦", W / 2, H / 2 + 50, { align: "center" });
    doc.setGState(doc.GState({ opacity: 1 }));

    // ── Header: Logo & Company ──────────────────────────────────────────────────
    if (logoBase64) {
        doc.addImage(logoBase64, "PNG", W / 2 - 15, 15, 30, 30);
    }
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text("MA-TRAINING-CONSULTING", W / 2, 50, { align: "center" });
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(6);
    doc.setTextColor(37, 99, 235);
    doc.text("CABINET DE CONSEIL STRATÉGIQUE", W / 2, 54, { align: "center" });

    // ── Content Area ─────────────────────────────────────────────────────────────
    doc.setTextColor(148, 163, 184);
    doc.setFontSize(7);
    doc.text("ATTESTATION DE PARTICIPATION", W / 2, 68, { align: "center" });

    doc.setTextColor(15, 23, 42);
    doc.setFont("times", "bolditalic");
    doc.setFontSize(48);
    doc.text("Workshop Stratégique", W / 2, 88, { align: "center" });

    doc.setFont("times", "italic");
    doc.setFontSize(14);
    doc.setTextColor(100, 116, 139);
    doc.text("Le Cabinet MA-TRAINING-CONSULTING certifie par la présente la participation active de", W / 2, 108, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(38);
    doc.setTextColor(15, 23, 42);
    doc.text(participantName, W / 2, 128, { align: "center" });

    doc.setDrawColor(15, 23, 42, 0.15);
    doc.setLineWidth(1);
    const nameWidth = doc.getTextWidth(participantName) + 40;
    doc.line(W / 2 - nameWidth / 2, 131, W / 2 + nameWidth / 2, 131);

    doc.setFont("times", "italic");
    doc.setFontSize(14);
    doc.setTextColor(71, 85, 105);
    doc.text("À la Session Complète de Workshop intitulée :", W / 2, 148, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(29, 78, 216);
    doc.text(`« ${workshopTitle} »`, W / 2, 158, { align: "center" });

    // ── Footer ──────────────────────────────────────────────────────────────────
    doc.setDrawColor(241, 245, 249);
    doc.setLineWidth(0.5);
    doc.line(25, 178, W - 25, 178);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(6);
    doc.setTextColor(148, 163, 184);
    doc.text("DÉLIVRÉ LE", 30, 187);
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(10);
    doc.text(date, 30, 194);

    doc.setFontSize(6);
    doc.setTextColor(148, 163, 184);
    doc.text("RÉF. VALIDATION", 85, 187);
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(8);
    doc.setFont("courier", "bold");
    doc.text(referenceId, 85, 194);

    // Stamp & Signature (Bottom Right)
    const sx = W - 65; // Further right
    const sy = 192; // Final lowering

    doc.setFont("times", "italic");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("Le Consultant en Stratégie", sx + 25, sy + 22, { align: "center" });

    // Stamp
    doc.setDrawColor(30, 58, 138);
    doc.setLineWidth(1.2);
    doc.roundedRect(sx, sy - 4, 50, 24, 3, 3);
    
    doc.setTextColor(30, 58, 138);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Sté MA", sx + 25, sy + 4, { align: "center" });
    doc.setFontSize(7);
    doc.text("Training Consulting", sx + 25, sy + 8, { align: "center" });
    
    doc.setDrawColor(30, 58, 138, 0.3);
    doc.setLineWidth(0.2);
    doc.line(sx + 10, sy + 10, sx + 40, sy + 10);
    
    doc.setFontSize(5);
    doc.text("Tel: 44 172 264", sx + 25, sy + 14, { align: "center" });
    doc.text("MF: 1805031P/A/M/000", sx + 25, sy + 17, { align: "center" });

    // Signature (Manual Curves)
    doc.setDrawColor(30, 58, 138, 0.9);
    doc.setLineWidth(1);
    const sigBaseX = sx - 10;
    const sigBaseY = sy + 5;
    doc.moveTo(sigBaseX + 10, sigBaseY + 5);
    doc.curveTo(sigBaseX + 25, sigBaseY - 10, sigBaseX + 45, sigBaseY + 10, sigBaseX + 65, sigBaseY - 15);
    doc.stroke();
    doc.line(sigBaseX + 15, sigBaseY + 8, sigBaseX + 55, sigBaseY + 5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(5);
    doc.setTextColor(203, 213, 225);
    doc.text("Propriété exclusive de MA-TRAINING-CONSULTING. Vérification autorisée via le code de référence unique.", W - 25, 203, { align: "right" });

    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

    return new NextResponse(pdfBuffer, {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="Attestation-Workshop-${referenceId}.pdf"`,
            "Content-Length": String(pdfBuffer.length),
        },
    });
}
