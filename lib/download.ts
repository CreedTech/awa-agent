/* ============================================================
   AwaAgent - client-side file generation & download
   Real downloads (CSV + PDF), no backend required.
   ============================================================ */

import { formatCurrency } from "./utils";
import { env } from "./env";
import type { EscrowTransaction, Property } from "./types";

/** Trigger a browser download for a Blob. */
function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Build + download a CSV from a header row and data rows. */
export function downloadCsv(filename: string, header: string[], rows: (string | number)[][]) {
  const escape = (v: string | number) => {
    const s = String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [header, ...rows].map((r) => r.map(escape).join(",")).join("\n");
  saveBlob(new Blob([csv], { type: "text/csv;charset=utf-8;" }), filename);
}

/** Generate + download a real PDF receipt for a settled/refunded escrow txn. */
export async function downloadReceiptPdf(txn: EscrowTransaction, property?: Property) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const left = 56;
  let y = 64;

  // Header band
  doc.setFillColor(0, 31, 63);
  doc.rect(0, 0, 595, 96, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text(`${env.appName}`, left, 56);
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(212, 175, 55);
  doc.text("Escrow payment receipt", left, 74);

  doc.setTextColor(15, 25, 35);
  y = 140;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text(property?.title ?? "Rental payment", left, y);
  y += 18;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(108, 125, 145);
  doc.text(`${property?.area ?? ""}${property?.landmark ? ` · Near ${property.landmark}` : ""}`, left, y);

  const rows: [string, string][] = [
    ["Status", txn.status.replace(/_/g, " ")],
    ["Escrow reference", txn.id],
    ["Paystack reference", txn.paystackRef],
    ["Tenant", txn.tenantName],
    ["Agent", txn.agentName],
    ["Landlord", txn.landlordName ?? "-"],
    ["Locked on", txn.lockedOn ?? "-"],
    ["Settled on", txn.settledOn ?? txn.refundedOn ?? "-"],
  ];

  y += 28;
  doc.setDrawColor(230, 235, 241);
  doc.setTextColor(15, 25, 35);
  doc.setFontSize(11);
  for (const [k, v] of rows) {
    doc.setTextColor(108, 125, 145);
    doc.text(k, left, y);
    doc.setTextColor(15, 25, 35);
    doc.text(v, 539, y, { align: "right" });
    y += 16;
    doc.line(left, y - 6, 539, y - 6);
  }

  // Breakdown
  if (txn.breakdown) {
    y += 14;
    const b = txn.breakdown;
    const lines: [string, number][] = [
      ["Base rent", b.baseRent],
      ["Agent commission", b.commission],
      ["Escrow fee", b.escrowFee],
    ];
    for (const [k, v] of lines) {
      doc.setTextColor(108, 125, 145);
      doc.text(k, left, y);
      doc.setTextColor(15, 25, 35);
      doc.text(formatCurrency(v), 539, y, { align: "right" });
      y += 16;
    }
  }

  // Total
  y += 10;
  doc.setFillColor(243, 245, 248);
  doc.rect(left, y - 16, 483, 34, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Total paid", left + 12, y + 4);
  doc.text(formatCurrency(txn.amount), 527, y + 4, { align: "right" });

  y += 56;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(150, 160, 175);
  doc.text(
    `Generated ${new Date().toLocaleString("en-NG")} · ${env.appName} · ${env.supportEmail}`,
    left,
    y,
  );

  doc.save(`AwaAgent-receipt-${txn.id}.pdf`);
}
