import { useState } from "react";
import { useNavigate } from "react-router";
import { C } from "../../constants/colors";
import { ArrowLeft, Upload, CheckCircle2, FileText, Download, Clock, Eye } from "lucide-react";

const REQUIRED_DOCS = [
  { label: "Executed Financing Agreement", desc: "Signed facility agreement with HBL", uploaded: false },
  { label: "Mortgage / Charge Documents", desc: "Property or asset charge as per bank requirement", uploaded: false },
  { label: "Personal Guarantee Form", desc: "Signed personal guarantee of owner/directors", uploaded: false },
  { label: "Insurance Policy", desc: "Asset / life insurance as required", uploaded: false },
];

const UPLOAD_HISTORY = [
  { name: "Business_Registration_Certificate.pdf", size: "1.2 MB", date: "July 14, 2025", status: "verified" },
  { name: "CNIC_Scan_AhmedKhan.pdf", size: "850 KB", date: "July 14, 2025", status: "verified" },
  { name: "Financial_Statements_2023_24.pdf", size: "3.4 MB", date: "July 14, 2025", status: "under_review" },
];

export default function PostDocs() {
  const navigate = useNavigate();
  const [docs, setDocs] = useState(REQUIRED_DOCS.map(d => ({ ...d })));

  const markUploaded = (i: number) => {
    const updated = [...docs];
    updated[i].uploaded = true;
    setDocs(updated);
  };

  const statusStyle = (s: string) =>
    s === "verified" ? { bg: C.greenLight, color: C.green, label: "Verified" }
      : { bg: "#FEF3C7", color: "#D97706", label: "Under Review" };

  return (
    <div className="px-6 py-6" style={{ fontFamily: "var(--font-display)" }}>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate("/sme")} className="p-2 rounded-xl hover:bg-white border"
          style={{ border: `1.5px solid ${C.border}` }}>
          <ArrowLeft className="w-4 h-4" style={{ color: C.textMuted }} />
        </button>
        <div>
          <h1 className="text-lg font-bold" style={{ color: C.text }}>Post-Approval Documents</h1>
          <p className="text-xs" style={{ color: C.textMuted }}>Case: SBP-SME-2025-00098 · HBL Facility</p>
        </div>
      </div>

      {/* Progress */}
      <div className="rounded-2xl border p-4 mb-5 flex items-center gap-4"
        style={{ background: C.greenLight, border: `1.5px solid ${C.green}30` }}>
        <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: C.green }}>
          <CheckCircle2 className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-bold" style={{ color: C.greenDark }}>Offer Accepted — Pending Legal Docs</p>
          <p className="text-xs" style={{ color: C.green }}>
            Upload all required legal documents to proceed with disbursement.
          </p>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold" style={{ color: C.green, fontFamily: "var(--font-mono)" }}>
            {docs.filter(d => d.uploaded).length}/{docs.length}
          </div>
          <div className="text-xs" style={{ color: C.textMuted }}>uploaded</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Required docs */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border overflow-hidden" style={{ background: C.surface, border: `1.5px solid ${C.border}` }}>
            <div className="px-5 py-4 border-b" style={{ borderColor: C.border }}>
              <h2 className="text-sm font-semibold" style={{ color: C.text }}>Required Documents</h2>
            </div>

            {/* Drop zone */}
            <div className="px-5 pt-4">
              <div className="border-2 border-dashed rounded-xl p-6 text-center cursor-pointer hover:border-green-400 transition-all"
                style={{ borderColor: C.border }}>
                <Upload className="w-6 h-6 mx-auto mb-2" style={{ color: C.textMuted }} />
                <p className="text-sm font-medium" style={{ color: C.text }}>Drag & drop files here</p>
                <p className="text-xs mt-1" style={{ color: C.textMuted }}>PDF, JPG, PNG up to 10MB</p>
              </div>
            </div>

            <div className="px-5 pb-5 pt-3 space-y-2">
              {docs.map((doc, i) => (
                <div key={doc.label} className="flex items-center gap-3 p-3 rounded-xl border transition-all"
                  style={{
                    border: `1.5px solid ${doc.uploaded ? C.green + "40" : C.border}`,
                    background: doc.uploaded ? C.greenLight : C.bg,
                  }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: doc.uploaded ? C.green : C.surface, border: `1.5px solid ${C.border}` }}>
                    {doc.uploaded
                      ? <CheckCircle2 className="w-4 h-4 text-white" />
                      : <FileText className="w-4 h-4" style={{ color: C.textMuted }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium" style={{ color: C.text }}>{doc.label}</div>
                    <div className="text-xs" style={{ color: C.textMuted }}>{doc.desc}</div>
                  </div>
                  {!doc.uploaded ? (
                    <button onClick={() => markUploaded(i)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all hover:bg-green-50"
                      style={{ border: `1.5px solid ${C.green}`, color: C.green }}>
                      Upload
                    </button>
                  ) : (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: C.green, color: "white" }}>Uploaded</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Upload history */}
        <div>
          <div className="rounded-2xl border overflow-hidden" style={{ background: C.surface, border: `1.5px solid ${C.border}` }}>
            <div className="px-5 py-4 border-b" style={{ borderColor: C.border }}>
              <h2 className="text-sm font-semibold" style={{ color: C.text }}>Upload History</h2>
            </div>
            <div className="divide-y" style={{ borderColor: C.border }}>
              {UPLOAD_HISTORY.map(({ name, size, date, status }) => {
                const s = statusStyle(status);
                return (
                  <div key={name} className="px-4 py-3 flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: C.bg }}>
                      <FileText className="w-4 h-4" style={{ color: C.textMuted }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium truncate" style={{ color: C.text }}>{name}</div>
                      <div className="text-xs mt-0.5" style={{ color: C.textMuted }}>{size} · {date}</div>
                      <span className="inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-semibold"
                        style={{ background: s.bg, color: s.color }}>{s.label}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <button className="p-1 rounded" style={{ color: C.textMuted }}><Eye className="w-3.5 h-3.5" /></button>
                      <button className="p-1 rounded" style={{ color: C.textMuted }}><Download className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
