import { NextRequest, NextResponse } from "next/server";
import { jsPDF } from "jspdf";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const participantName = searchParams.get("name") || "M. Participant";
    const workshopTitle   = searchParams.get("title") || "Workshop Stratégique";
    const referenceId     = searchParams.get("ref")   || `WKS-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const dateParam       = searchParams.get("date");
    const date = dateParam
        ? new Date(Number(dateParam)).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })
        : new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });

    // ── Page setup ──────────────────────────────────────────────────────────────
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const W = 297; // A4 landscape width (mm)
    const H = 210; // A4 landscape height (mm)

    // ── Background ──────────────────────────────────────────────────────────────
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, W, H, "F");

    // Subtle radial centre glow (very light grey gradient approximation)
    doc.setFillColor(249, 250, 251);
    doc.ellipse(W / 2, H / 2, 120, 80, "F");
    doc.setFillColor(255, 255, 255);
    doc.ellipse(W / 2, H / 2, 80, 55, "F");

    // ── Ornamental border ────────────────────────────────────────────────────────
    doc.setDrawColor(203, 213, 225);   // slate-300
    doc.setLineWidth(0.3);
    doc.rect(12, 12, W - 24, H - 24);

    doc.setDrawColor(15, 23, 42);
    doc.setLineWidth(0.15);
    doc.setLineDashPattern([0.5, 1], 0);
    doc.rect(14, 14, W - 28, H - 28);
    doc.setLineDashPattern([], 0);

    // Corner accents (top-left / bottom-right)
    const ca = 20; // corner accent length
    doc.setDrawColor(15, 23, 42, 0.12);
    doc.setLineWidth(1.2);
    // TL
    doc.line(5, 5 + ca, 5, 5);  doc.line(5, 5, 5 + ca, 5);
    // BR
    doc.line(W - 5, H - 5 - ca, W - 5, H - 5);  doc.line(W - 5, H - 5, W - 5 - ca, H - 5);
    doc.setLineWidth(0.3);

    // Watermark "✦" (light)
    doc.setTextColor(15, 23, 42);
    doc.setGState(doc.GState({ opacity: 0.015 }));
    doc.setFontSize(200);
    doc.setFont("helvetica", "bold");
    doc.text("✦", W / 2, H / 2 + 60, { align: "center" });
    doc.setGState(doc.GState({ opacity: 1 }));

    // ── Logo box ─────────────────────────────────────────────────────────────────
    doc.setFillColor(15, 23, 42);
    doc.roundedRect(W / 2 - 7, 22, 14, 14, 2, 2, "F");
    // Simple icon lines (document icon)
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.8);
    doc.roundedRect(W / 2 - 4, 24.5, 8, 9, 0.8, 0.8);
    doc.line(W / 2 - 2.5, 27, W / 2 + 2.5, 27);
    doc.line(W / 2 - 2.5, 29, W / 2 + 2.5, 29);
    doc.line(W / 2 - 2.5, 31, W / 2 + 1, 31);
    doc.setLineWidth(0.3);

    // ── Company name ─────────────────────────────────────────────────────────────
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(15, 23, 42);
    doc.setCharSpace(3.5);
    doc.text("MA-TRAINING-CONSULTING", W / 2, 42, { align: "center" });
    doc.setCharSpace(0);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(5.5);
    doc.setTextColor(37, 99, 235, 0.6);
    doc.text("CABINET DE CONSEIL STRATÉGIQUE", W / 2, 46.5, { align: "center" });

    // ── Attestation label ────────────────────────────────────────────────────────
    doc.setFont("helvetica", "bold");
    doc.setFontSize(5.5);
    doc.setTextColor(148, 163, 184);
    doc.setCharSpace(4);
    doc.text("ATTESTATION DE PARTICIPATION", W / 2, 55, { align: "center" });
    doc.setCharSpace(0);

    // ── Main title ───────────────────────────────────────────────────────────────
    doc.setFont("times", "bolditalic");
    doc.setFontSize(42);
    doc.setTextColor(2, 6, 23);
    doc.text("Workshop Stratégique", W / 2, 80, { align: "center" });

    // ── Certifies text ────────────────────────────────────────────────────────────
    doc.setFont("times", "italic");
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.text("Le Cabinet MA-TRAINING-CONSULTING certifie par la présente la participation active de", W / 2, 92, { align: "center" });

    // ── Participant name ──────────────────────────────────────────────────────────
    doc.setFont("times", "bold");
    doc.setFontSize(28);
    doc.setTextColor(15, 23, 42);
    doc.text(participantName, W / 2, 106, { align: "center" });
    // Underline
    const nameWidth = doc.getTextWidth(participantName);
    doc.setDrawColor(15, 23, 42);
    doc.setLineWidth(0.6);
    doc.line(W / 2 - nameWidth / 2, 108, W / 2 + nameWidth / 2, 108);
    doc.setLineWidth(0.3);

    // ── Workshop label ────────────────────────────────────────────────────────────
    doc.setFont("times", "italic");
    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text("À la Session Complète de Workshop intitulée :", W / 2, 118, { align: "center" });

    // Workshop title in blue
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(29, 78, 216);
    doc.text(`« ${workshopTitle} »`, W / 2, 127, { align: "center" });

    // ── Divider line ──────────────────────────────────────────────────────────────
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.4);
    doc.line(20, 143, W - 20, 143);

    // ── Footer left: Date + Ref ───────────────────────────────────────────────────
    doc.setFont("helvetica", "bold");
    doc.setFontSize(5);
    doc.setTextColor(148, 163, 184);
    doc.setCharSpace(2);
    doc.text("DÉLIVRÉ LE", 22, 150);
    doc.setCharSpace(0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text(date, 22, 156);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(5);
    doc.setTextColor(148, 163, 184);
    doc.setCharSpace(2);
    doc.text("RÉF. VALIDATION", 22, 164);
    doc.setCharSpace(0);
    doc.setFont("courier", "bold");
    doc.setFontSize(8);
    doc.setTextColor(15, 23, 42);
    doc.text(referenceId, 22, 170);

    // ── Stamp (bottom right) ──────────────────────────────────────────────────────
    const sx = W - 85;  // stamp x
    const sy = 148;     // stamp y
    const sw = 58;      // stamp width
    const sh = 32;      // stamp height

    doc.setGState(doc.GState({ opacity: 0.72 }));
    // Rotate stamp slightly
    doc.saveGraphicsState();
    const angle = -6 * (Math.PI / 180);
    const cx = sx + sw / 2;
    const cy = sy + sh / 2;
    // Manual rotation approach: draw rotated rect using lines
    doc.setDrawColor(30, 58, 138);
    doc.setLineWidth(1.8);
    const corners = [
        [sx, sy], [sx + sw, sy], [sx + sw, sy + sh], [sx, sy + sh]
    ].map(([x, y]) => [
        cx + (x - cx) * Math.cos(angle) - (y - cy) * Math.sin(angle),
        cy + (x - cx) * Math.sin(angle) + (y - cy) * Math.cos(angle)
    ]);
    doc.line(corners[0][0], corners[0][1], corners[1][0], corners[1][1]);
    doc.line(corners[1][0], corners[1][1], corners[2][0], corners[2][1]);
    doc.line(corners[2][0], corners[2][1], corners[3][0], corners[3][1]);
    doc.line(corners[3][0], corners[3][1], corners[0][0], corners[0][1]);

    // Stamp text
    doc.setFont("times", "bold");
    doc.setFontSize(10);
    doc.setTextColor(30, 58, 138);
    doc.text("Sté MA", cx, cy - 6, { align: "center", angle: 6 });
    doc.setFont("helvetica", "bold");
    doc.setFontSize(5);
    doc.setCharSpace(1.5);
    doc.text("TRAINING CONSULTING", cx, cy - 1.5, { align: "center", angle: 6 });
    doc.setCharSpace(0);
    // Divider inside stamp
    doc.setDrawColor(30, 58, 138, 0.4);
    doc.setLineWidth(0.3);
    doc.line(cx - 18, cy + 1, cx + 18, cy + 1);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(5);
    doc.text("Tel: 44 172 264", cx, cy + 4.5, { align: "center", angle: 6 });
    doc.text("MF: 1805031P/A/M/000", cx, cy + 7.5, { align: "center", angle: 6 });

    doc.restoreGraphicsState();
    doc.setGState(doc.GState({ opacity: 1 }));

    // ── Signature (SVG-style curves via lines) ────────────────────────────────────
    doc.setGState(doc.GState({ opacity: 0.80 }));
    doc.setDrawColor(30, 58, 138);
    doc.setLineWidth(1.4);
    // Primary sweep
    const sigX = W - 100;
    const sigY = 157;
    // Bezier approximation using polyline
    const pts1: [number, number][] = [];
    for (let t = 0; t <= 1; t += 0.04) {
        const x = sigX + t * 55;
        const y = sigY + Math.sin(t * Math.PI * 1.5) * -8 + t * 3;
        pts1.push([x, y]);
    }
    for (let i = 0; i < pts1.length - 1; i++) {
        doc.line(pts1[i][0], pts1[i][1], pts1[i+1][0], pts1[i+1][1]);
    }
    // Secondary underline
    doc.setLineWidth(0.9);
    const pts2: [number, number][] = [];
    for (let t = 0; t <= 1; t += 0.06) {
        const x = sigX + 5 + t * 38;
        const y = sigY + 4 + Math.sin(t * Math.PI) * -1.5;
        pts2.push([x, y]);
    }
    for (let i = 0; i < pts2.length - 1; i++) {
        doc.line(pts2[i][0], pts2[i][1], pts2[i+1][0], pts2[i+1][1]);
    }
    doc.setGState(doc.GState({ opacity: 1 }));
    doc.setLineWidth(0.3);

    // ── Legal text ────────────────────────────────────────────────────────────────
    doc.setFont("helvetica", "normal");
    doc.setFontSize(4.5);
    doc.setTextColor(148, 163, 184);
    doc.text("Propriété intellectuelle exclusive de MA-TRAINING-CONSULTING.", W - 22, 183, { align: "right" });
    doc.text("Vérification autorisée via le code de référence unique.", W - 22, 187, { align: "right" });

    // ── Output ────────────────────────────────────────────────────────────────────
    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

    return new NextResponse(pdfBuffer, {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="Attestation-Workshop-${referenceId}.pdf"`,
            "Content-Length": String(pdfBuffer.length),
        },
    });
}
