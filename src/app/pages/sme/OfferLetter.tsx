import { useState } from "react";
import { useNavigate } from "react-router";
import { jsPDF } from "jspdf";
import { useApp } from "../../context/AppContext";
import { C } from "../../constants/colors";
import { ArrowLeft, CheckCircle2, X, FileText, AlertTriangle, Download, Paperclip } from "lucide-react";

export default function OfferLetter() {
  const navigate = useNavigate();
  const { offerDocument } = useApp();
  const [decision, setDecision] = useState<"accept" | "reject" | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const details = [
    { label: "Approved Amount", value: "PKR 8,000,000", highlight: true },
    { label: "Markup Rate", value: "9.5% per annum (Fixed)", highlight: false },
    { label: "Tenor", value: "3 Years (36 Months)", highlight: false },
    { label: "Monthly Installment", value: "PKR 254,800 (approx.)", highlight: false },
    { label: "Processing Fee", value: "0.5% of approved amount", highlight: false },
    { label: "Offer Expiry Date", value: "July 30, 2025", highlight: false },
    { label: "Disbursement Timeline", value: "5–7 business days post acceptance", highlight: false },
  ];

  const terms = [
    "Financing is subject to satisfactory completion of legal documentation.",
    "The applicant must maintain a current account with HBL for disbursement.",
    "Security / collateral as required by the bank must be provided before disbursement.",
    "The applicant must remain compliant with SBP prudential regulations throughout the tenor.",
    "Any false declaration will result in immediate cancellation of the facility.",
    "This offer is valid for 14 calendar days from the issuance date.",
  ];

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFillColor(0, 104, 56);
    doc.rect(0, 0, pageWidth, 28, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("Conditional Offer Letter — HBL", 14, 17);

    doc.setTextColor(20, 20, 20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("XYZ Foods Pvt. Ltd.", 14, 42);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Case: SBP-SME-2025-00098", 14, 49);

    let y = 62;
    details.forEach(({ label, value }, i) => {
      if (i % 2 === 0) {
        doc.setFillColor(247, 248, 250);
        doc.rect(14, y - 6, pageWidth - 28, 10, "F");
      }
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(120, 120, 120);
      doc.text(label, 18, y);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(20, 20, 20);
      doc.text(String(value), 100, y);
      y += 10;
    });

    y += 6;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(20, 20, 20);
    doc.text("Terms & Conditions", 14, y);
    y += 8;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    terms.forEach((t, i) => {
      const lines = doc.splitTextToSize(`${i + 1}. ${t}`, pageWidth - 32);
      doc.text(lines, 18, y);
      y += lines.length * 5 + 2;
    });

    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Generated ${new Date().toLocaleString()}`, 14, 287);

    doc.save("SBP-SME-2025-00098-Offer-Letter.pdf");
  };

  return (
    <div className="px-6 py-6" style={{ fontFamily: "var(--font-display)" }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/sme")} className="p-2 rounded-xl hover:bg-white border"
            style={{ border: `1.5px solid ${C.border}` }}>
            <ArrowLeft className="w-4 h-4" style={{ color: C.textMuted }} />
          </button>
          <div>
            <h1 className="text-lg font-bold" style={{ color: C.text }}>Conditional Offer Letter</h1>
            <p className="text-xs" style={{ color: C.textMuted }}>Case: SBP-SME-2025-00098 · XYZ Foods Pvt. Ltd.</p>
          </div>
        </div>
        <button onClick={handleDownloadPdf}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border hover:bg-gray-50"
          style={{ border: `1.5px solid ${C.border}`, color: C.text }}>
          <Download className="w-4 h-4" /> Download PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Offer details */}
        <div className="lg:col-span-2 space-y-4">
          {offerDocument && (
            <a href={offerDocument.fileUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-xl p-3.5 transition-all hover:opacity-90"
              style={{ background: C.greenLight, border: `1.5px solid ${C.green}40` }}>
              <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: C.green }}>
                <Paperclip className="w-4 h-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold" style={{ color: C.green }}>Offer document from {offerDocument.bank}</p>
                <p className="text-xs truncate" style={{ color: C.textMuted }}>{offerDocument.fileName}</p>
              </div>
              <Download className="w-4 h-4 flex-shrink-0" style={{ color: C.green }} />
            </a>
          )}

          {/* Offer header card */}
          <div className="rounded-2xl overflow-hidden" style={{ border: `1.5px solid ${C.green}` }}>
            <div className="px-5 py-3 flex items-center justify-between"
              style={{ background: C.green }}>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-white" />
                <span className="text-sm font-bold text-white">Financing Offer — HBL</span>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                style={{ background: "rgba(255,255,255,0.15)", color: "white" }}>
                OFFER VALID · 14 DAYS
              </span>
            </div>
            <div className="p-5 bg-white">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {details.map(({ label, value, highlight }) => (
                  <div key={label} className={`rounded-xl p-3 ${highlight ? "sm:col-span-2" : ""}`}
                    style={{ background: highlight ? C.greenLight : C.bg, border: `1.5px solid ${highlight ? C.green + "40" : C.border}` }}>
                    <div className="text-xs mb-1" style={{ color: C.textMuted }}>{label}</div>
                    <div className={`font-bold ${highlight ? "text-xl" : "text-sm"}`}
                      style={{ color: highlight ? C.green : C.text, fontFamily: "var(--font-mono)" }}>
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="rounded-2xl border p-5" style={{ background: C.surface, border: `1.5px solid ${C.border}` }}>
            <h2 className="text-sm font-bold mb-3" style={{ color: C.text }}>Terms & Conditions</h2>
            <div className="space-y-2">
              {terms.map((t, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-xs font-bold mt-0.5 w-5 flex-shrink-0"
                    style={{ color: C.textMuted, fontFamily: "var(--font-mono)" }}>{i + 1}.</span>
                  <p className="text-xs leading-relaxed" style={{ color: C.textMuted }}>{t}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Actions sidebar */}
        <div className="space-y-4">
          {!decision ? (
            <>
              <div className="rounded-2xl border p-5" style={{ background: C.surface, border: `1.5px solid ${C.border}` }}>
                <h2 className="text-sm font-bold mb-1" style={{ color: C.text }}>Your Decision</h2>
                <p className="text-xs mb-4" style={{ color: C.textMuted }}>
                  This offer expires on <strong>July 30, 2025</strong>. Review carefully before accepting.
                </p>
                <div className="flex flex-col gap-3">
                  <button onClick={() => { setDecision("accept"); setShowConfirm(true); }}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                    style={{ background: C.green }}>
                    <CheckCircle2 className="w-4 h-4" /> Accept Offer
                  </button>
                  <button onClick={() => { setDecision("reject"); setShowConfirm(true); }}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border transition-all hover:bg-red-50"
                    style={{ border: "1.5px solid #DC2626", color: "#DC2626" }}>
                    <X className="w-4 h-4" /> Decline Offer
                  </button>
                </div>
              </div>

              <div className="rounded-2xl border p-4 flex gap-3"
                style={{ background: "#FEF3C7", border: "1.5px solid #D97706" }}>
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#D97706" }} />
                <p className="text-xs leading-relaxed" style={{ color: "#92400E" }}>
                  Accepting this offer is legally binding. Ensure you have read all terms and conditions before proceeding.
                </p>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border p-5 text-center"
              style={{ background: decision === "accept" ? C.greenLight : "#FEE2E2", border: `1.5px solid ${decision === "accept" ? C.green : "#DC2626"}` }}>
              {decision === "accept"
                ? <CheckCircle2 className="w-10 h-10 mx-auto mb-3" style={{ color: C.green }} />
                : <X className="w-10 h-10 mx-auto mb-3" style={{ color: "#DC2626" }} />}
              <h3 className="font-bold text-base mb-1" style={{ color: decision === "accept" ? C.green : "#DC2626" }}>
                {decision === "accept" ? "Offer Accepted!" : "Offer Declined"}
              </h3>
              <p className="text-xs" style={{ color: C.textMuted }}>
                {decision === "accept"
                  ? "HBL will proceed with legal documentation. You will receive further instructions via email."
                  : "The offer has been declined. You may apply again with a different bank."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Confirm modal */}
      {showConfirm && !decision?.startsWith("decided") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: "rgba(0,0,0,0.4)" }}>
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-base font-bold mb-2" style={{ color: C.text }}>
              {decision === "accept" ? "Confirm Offer Acceptance" : "Confirm Decline"}
            </h3>
            <p className="text-sm mb-4" style={{ color: C.textMuted }}>
              {decision === "accept"
                ? "Are you sure you want to accept this financing offer of PKR 8,000,000 from HBL?"
                : "Are you sure you want to decline this offer? This action cannot be undone."}
            </p>
            {decision === "reject" && (
              <textarea rows={2} value={rejectReason} onChange={e => setRejectReason(e.target.value)}
                placeholder="Reason for declining (optional)"
                className="w-full rounded-xl border text-sm mb-4 resize-none outline-none"
                style={{ padding: "10px 12px", border: `1.5px solid ${C.border}`, color: C.text }} />
            )}
            <div className="flex gap-3">
              <button onClick={() => setShowConfirm(false)} className="flex-1 py-2.5 rounded-xl border text-sm font-medium"
                style={{ border: `1.5px solid ${C.border}`, color: C.text }}>Cancel</button>
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: decision === "accept" ? C.green : "#DC2626" }}>
                {decision === "accept" ? "Yes, Accept" : "Yes, Decline"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
