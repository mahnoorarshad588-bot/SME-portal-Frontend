import { useState, useEffect } from "react";
import { useOutletContext } from "react-router";
import { jsPDF } from "jspdf";
import { useApp, type BankApplication } from "../../context/AppContext";
import { C } from "../../constants/colors";
import {
  FileText, Clock, CheckCircle2, XCircle, Banknote, Search, Filter,
  Eye, ChevronDown, ArrowRight, ArrowLeft, TrendingUp, AlertCircle, Download,
  ClipboardCheck, ShieldCheck, MessageSquare,
  Sparkles, Landmark, ListChecks, X, Send, UploadCloud, Plus, Trash2,
  PieChart, BarChart3,
} from "lucide-react";

/* Minimal gradient-stroke border, matching the app's redesigned dashboard cards */
function GradientCard({ accent, className = "", children }: { accent: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={`rounded-2xl p-px ${className}`}
      style={{ background: `linear-gradient(135deg, ${accent}45, ${accent}0A)` }}>
      <div className="h-full w-full rounded-2xl" style={{ background: C.surface }}>
        {children}
      </div>
    </div>
  );
}

type OutletCtx = {
  activeKey: string; setActiveKey: (k: string) => void;
  focusApplicationId: string | null; setFocusApplicationId: (id: string | null) => void;
};

const STATUS_CFG: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "Pending Review", color: C.textMuted, bg: "#F3F4F6" },
  under_review: { label: "Under Review", color: "#D97706", bg: "#FEF3C7" },
  offer_issued: { label: "Offer Issued", color: C.blue, bg: C.blueLight },
  approved: { label: "Approved", color: C.green, bg: C.greenLight },
  rejected: { label: "Rejected", color: "#DC2626", bg: "#FEE2E2" },
  disbursed: { label: "Disbursed", color: C.greenDark, bg: C.greenLight },
};

// Statuses where assessment is still actionable — everything else is already resolved
const ASSESSABLE_STATUSES = ["pending", "under_review"];

const STATUS_RESOLUTION_NOTE: Record<string, string> = {
  offer_issued: "A conditional offer has already been issued for this application.",
  approved: "This application has already been approved.",
  rejected: "This application has already been declined.",
  disbursed: "Funds have already been disbursed for this application.",
};

function Badge({ status }: { status: string }) {
  const c = STATUS_CFG[status] ?? STATUS_CFG.pending;
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{ background: c.bg, color: c.color }}>{c.label}</span>
  );
}

// ── Dashboard ───────────────────────────────────────────────────────────────
const MONTHLY_TREND = [
  { month: "Jan", value: 28 },
  { month: "Feb", value: 34 },
  { month: "Mar", value: 31 },
  { month: "Apr", value: 42 },
  { month: "May", value: 39 },
  { month: "Jun", value: 48 },
];

function Dashboard() {
  const { bankApplications } = useApp();
  const { setActiveKey, setFocusApplicationId } = useOutletContext<OutletCtx>();

  const openForReview = (id: string) => {
    setFocusApplicationId(id);
    setActiveKey("queue");
  };
  const STAT_CARDS = [
    { label: "Applications Received", value: "48", icon: FileText, color: C.blue, bg: C.blueLight, delta: "+12 this week" },
    { label: "Pending Assessment", value: "14", icon: Clock, color: "#D97706", bg: "#FEF3C7", delta: "3 overdue" },
    { label: "Approved", value: "18", icon: CheckCircle2, color: C.green, bg: C.greenLight, delta: "62% approval rate" },
    { label: "Rejected", value: "8", icon: XCircle, color: "#DC2626", bg: "#FEE2E2", delta: "" },
    { label: "Disbursed", value: "12", icon: Banknote, color: C.greenDark, bg: C.greenLight, delta: "PKR 86M total" },
  ];

  // Part-to-whole composition of the bank's queue by status.
  // Single sequential hue (opacity-stepped): the app's per-status colors fail a
  // colorblind-safety check when placed as adjacent chart segments, so identity
  // here rides on the always-visible legend labels, not hue alone.
  const totalApps = Math.max(1, bankApplications.length);
  const statusCount = (s: string) => bankApplications.filter(a => a.status === s).length;
  const STATUS_COMPOSITION = [
    { name: "Pending Review", value: statusCount("pending"), opacity: 0.3 },
    { name: "Under Review", value: statusCount("under_review"), opacity: 0.48 },
    { name: "Offer Issued", value: statusCount("offer_issued"), opacity: 0.64 },
    { name: "Approved", value: statusCount("approved"), opacity: 0.8 },
    { name: "Rejected", value: statusCount("rejected"), opacity: 1 },
  ].filter(d => d.value > 0);

  // Categorical green/blue/orange triple — validated colorblind-safe as a
  // 3-slot set (node scripts/validate_palette.js, all checks PASS). Red was
  // tried alongside green/orange here too but fails CVD separation (ΔE 2.4
  // protan) and the normal-vision floor, so it's kept out of this chart.
  const riskCount = (r: string) => bankApplications.filter(a => a.risk === r).length;
  const RISK_COMPOSITION = [
    { name: "Low Risk", value: riskCount("Low"), color: C.green },
    { name: "Medium Risk", value: riskCount("Medium"), color: C.orange },
    { name: "High Risk", value: riskCount("High"), color: C.blue },
  ].filter(d => d.value > 0);

  const trendMax = Math.max(...MONTHLY_TREND.map(d => d.value));

  return (
    <div className="px-6 py-6" style={{ fontFamily: "'Manrope', sans-serif" }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4" style={{ color: C.orange }} />
            <span className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: C.textMuted, fontFamily: "var(--font-mono)" }}>
              Welcome back
            </span>
          </div>
          <h1 className="text-2xl font-black leading-tight" style={{ color: C.text, letterSpacing: "-0.02em" }}>Bank Dashboard</h1>
        </div>
      </div>

      {/* Bank identity strip */}
      <GradientCard accent={C.blue} className="mb-6">
        <div className="flex items-center gap-4 px-5 py-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${C.blue}, #1E3A8A)` }}>
            <Landmark className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-base font-extrabold truncate" style={{ color: C.text }}>Habib Bank Limited (HBL)</div>
            <div className="text-xs mt-0.5" style={{ color: C.textMuted }}>SME Finance Division · Karachi Region</div>
          </div>
        </div>
      </GradientCard>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
        {STAT_CARDS.map(({ label, value, icon: Icon, color, delta }) => (
          <GradientCard key={label} accent={color}>
            <div className="p-4 rounded-2xl transition-all duration-200 hover:-translate-y-0.5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: color + "18" }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <div className="text-2xl font-black mb-0.5" style={{ color: C.text, fontFamily: "var(--font-mono)", letterSpacing: "-0.02em" }}>{value}</div>
              <div className="text-xs font-medium mb-1" style={{ color: C.textMuted }}>{label}</div>
              {delta && <div className="text-xs font-bold" style={{ color }}>{delta}</div>}
            </div>
          </GradientCard>
        ))}
      </div>

      {/* Two-column layout: table + charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Recent applications — 2/3 width */}
        <GradientCard accent={C.blue} className="lg:col-span-2">
          <div className="rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: C.border }}>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: C.blueLight }}>
                  <ListChecks className="w-3.5 h-3.5" style={{ color: C.blue }} />
                </div>
                <h2 className="text-sm font-bold" style={{ color: C.text }}>Recent Applications</h2>
              </div>
              <button onClick={() => setActiveKey("queue")}
                className="text-xs font-bold flex items-center gap-1 hover:opacity-80" style={{ color: C.blue }}>
                View All Queue <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: C.bg }}>
                    {["Case ID", "Business", "Scheme", "Amount", "Submitted", "Status", "Risk", ""].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide"
                        style={{ color: C.textMuted, fontFamily: "var(--font-mono)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bankApplications.slice(0, 4).map(app => {
                    const isNew = app.status === "pending";
                    return (
                      <tr key={app.id} onClick={() => openForReview(app.id)}
                        className="border-t hover:bg-gray-50 cursor-pointer transition-colors"
                        style={{ borderColor: C.border, background: isNew ? "#FEF2F2" : undefined, borderLeft: isNew ? "3px solid #DC2626" : "3px solid transparent" }}>
                        <td className="px-4 py-3 text-xs font-mono" style={{ color: C.text, fontFamily: "var(--font-mono)" }}>{app.caseId}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-white"
                              style={{ background: C.blue }}>
                              {app.business[0]}
                            </div>
                            <span className="text-xs font-semibold" style={{ color: C.text }}>{app.business}</span>
                            {isNew && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white" style={{ background: "#DC2626" }}>
                                NEW
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs" style={{ color: C.textMuted }}>{app.scheme}</td>
                        <td className="px-4 py-3 text-xs font-bold" style={{ color: C.text, fontFamily: "var(--font-mono)" }}>{app.amount}</td>
                        <td className="px-4 py-3 text-xs" style={{ color: C.textMuted }}>{app.submitted}</td>
                        <td className="px-4 py-3"><Badge status={app.status} /></td>
                        <td className="px-4 py-3">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                            style={{
                              background: app.risk === "Low" ? C.greenLight : app.risk === "Medium" ? "#FEF3C7" : "#FEE2E2",
                              color: app.risk === "Low" ? C.green : app.risk === "Medium" ? "#D97706" : "#DC2626",
                            }}>{app.risk}</span>
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={e => { e.stopPropagation(); openForReview(app.id); }}
                            className="p-1.5 rounded-lg hover:bg-gray-100" style={{ color: C.textMuted }}>
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </GradientCard>

        {/* Right column — charts */}
        <div className="space-y-4">

          {/* Monthly trend */}
          <GradientCard accent={C.blue}>
            <div className="p-3.5 sm:p-5">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: C.blueLight }}>
                  <BarChart3 className="w-3.5 h-3.5" style={{ color: C.blue }} />
                </div>
                <h2 className="text-sm font-bold" style={{ color: C.text }}>Monthly Applications</h2>
              </div>
              <div className="flex items-end justify-between gap-2" style={{ height: "104px" }}>
                {MONTHLY_TREND.map(d => (
                  <div key={d.month} className="flex-1 flex flex-col items-center justify-end h-full gap-1.5">
                    <span className="text-xs font-bold" style={{ color: C.text, fontFamily: "var(--font-mono)" }}>{d.value}</span>
                    <div className="w-full rounded-t-md transition-all"
                      style={{ height: `${(d.value / trendMax) * 100}%`, background: C.blue, minHeight: "4px" }}
                      title={`${d.month}: ${d.value} applications`} />
                    <span className="text-[10px] font-semibold" style={{ color: C.textMuted }}>{d.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </GradientCard>

          {/* By status */}
          <GradientCard accent={C.orange}>
            <div className="p-3.5 sm:p-5">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: C.orangeLight }}>
                  <PieChart className="w-3.5 h-3.5" style={{ color: C.orange }} />
                </div>
                <h2 className="text-sm font-bold" style={{ color: C.text }}>By Status</h2>
              </div>

              <div className="flex w-full h-3 rounded-full overflow-hidden mb-4" style={{ gap: "2px", background: C.bg }}>
                {STATUS_COMPOSITION.length === 0 ? (
                  <div className="w-full h-full rounded-full" style={{ background: C.border }} />
                ) : (
                  STATUS_COMPOSITION.map(d => (
                    <div key={d.name} className="h-full rounded-full transition-all"
                      style={{ width: `${(d.value / totalApps) * 100}%`, background: C.blue, opacity: d.opacity, minWidth: "3px" }}
                      title={`${d.name}: ${d.value}`} />
                  ))
                )}
              </div>

              <div className="space-y-2">
                {STATUS_COMPOSITION.map(d => (
                  <div key={d.name} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: C.blue, opacity: d.opacity }} />
                      <span className="text-xs font-medium truncate" style={{ color: C.text }}>{d.name}</span>
                    </div>
                    <span className="text-xs font-bold flex-shrink-0" style={{ color: C.textMuted, fontFamily: "var(--font-mono)" }}>
                      {d.value} · {Math.round((d.value / totalApps) * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </GradientCard>

          {/* By risk */}
          <GradientCard accent={C.green}>
            <div className="p-3.5 sm:p-5">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: C.greenLight }}>
                  <TrendingUp className="w-3.5 h-3.5" style={{ color: C.green }} />
                </div>
                <h2 className="text-sm font-bold" style={{ color: C.text }}>Portfolio by Risk</h2>
              </div>

              <div className="flex w-full h-3 rounded-full overflow-hidden mb-4" style={{ gap: "2px", background: C.bg }}>
                {RISK_COMPOSITION.length === 0 ? (
                  <div className="w-full h-full rounded-full" style={{ background: C.border }} />
                ) : (
                  RISK_COMPOSITION.map(d => (
                    <div key={d.name} className="h-full rounded-full transition-all"
                      style={{ width: `${(d.value / totalApps) * 100}%`, background: d.color, minWidth: "3px" }}
                      title={`${d.name}: ${d.value}`} />
                  ))
                )}
              </div>

              <div className="space-y-2">
                {RISK_COMPOSITION.map(d => (
                  <div key={d.name} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: d.color }} />
                      <span className="text-xs font-medium truncate" style={{ color: C.text }}>{d.name}</span>
                    </div>
                    <span className="text-xs font-bold flex-shrink-0" style={{ color: C.textMuted, fontFamily: "var(--font-mono)" }}>
                      {d.value} · {Math.round((d.value / totalApps) * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </GradientCard>
        </div>
      </div>
    </div>
  );
}

// ── Request More Info modal ──────────────────────────────────────────────────
function RequestInfoModal({ business, caseId, onClose, onSubmit }: {
  business: string; caseId: string; onClose: () => void; onSubmit: (type: "documents" | "info", messages: string[]) => void;
}) {
  const [requestType, setRequestType] = useState<"documents" | "info">("documents");
  const [messages, setMessages] = useState<string[]>([""]);

  const updateMessage = (i: number, value: string) =>
    setMessages(list => list.map((m, idx) => idx === i ? value : m));
  const addMessage = () => setMessages(list => [...list, ""]);
  const removeMessage = (i: number) => setMessages(list => list.filter((_, idx) => idx !== i));

  const isDocs = requestType === "documents";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(15,23,42,0.5)" }}>
      <div className="w-full max-w-lg rounded-2xl border max-h-[90vh] overflow-y-auto"
        style={{ background: C.surface, border: `1.5px solid ${C.border}` }}>
        <div className="flex items-start justify-between p-5 border-b" style={{ borderColor: C.border }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: C.orangeLight }}>
              <MessageSquare className="w-4.5 h-4.5" style={{ color: C.orange }} />
            </div>
            <div>
              <h3 className="text-sm font-bold" style={{ color: C.text }}>Request More Information</h3>
              <p className="text-xs" style={{ color: C.textMuted }}>{business} · {caseId}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100" style={{ color: C.textMuted }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: C.text }}>Request Type</label>
            <div className="grid grid-cols-2 gap-2.5">
              {([
                { value: "documents" as const, label: "Request Documents" },
                { value: "info" as const, label: "Request More Info" },
              ]).map(opt => (
                <label key={opt.value}
                  className="flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer"
                  style={{ border: `1.5px solid ${requestType === opt.value ? C.orange : C.border}`, background: requestType === opt.value ? C.orangeLight : C.bg }}>
                  <input type="radio" name="requestType" className="accent-current" checked={requestType === opt.value}
                    onChange={() => setRequestType(opt.value)} />
                  <span className="text-sm font-medium" style={{ color: requestType === opt.value ? C.orange : C.text }}>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-xl p-3 flex gap-2.5" style={{ background: C.blueLight, border: `1.5px solid ${C.blue}20` }}>
            <MessageSquare className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: C.blue }} />
            <p className="text-xs leading-relaxed" style={{ color: C.blue }}>
              This sends a notification to the applicant on the SME Portal
              {isDocs ? " asking them to upload the document(s) described below." : " with your message below."}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: C.text }}>
              {isDocs ? "Document(s) Needed" : "Message to Applicant"}
            </label>
            <div className="space-y-2.5">
              {messages.map((m, i) => (
                <div key={i} className="relative">
                  <textarea rows={3} value={m} onChange={e => updateMessage(i, e.target.value)}
                    placeholder={
                      i > 0 ? "Add another request..."
                      : isDocs ? "Describe the document you need (e.g. latest bank statement, tax return)..."
                      : "Describe what additional information is needed..."
                    }
                    className="w-full rounded-xl border text-sm outline-none resize-none"
                    style={{ padding: "10px 36px 10px 12px", border: `1.5px solid ${C.border}`, background: C.bg, color: C.text }} />
                  {messages.length > 1 && (
                    <button type="button" onClick={() => removeMessage(i)}
                      className="absolute top-2.5 right-2.5 p-1 rounded-lg hover:bg-red-50" style={{ color: "#DC2626" }}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button type="button" onClick={addMessage}
              className="mt-2.5 flex items-center gap-1.5 text-xs font-semibold" style={{ color: C.orange }}>
              <Plus className="w-3.5 h-3.5" /> Add another
            </button>
          </div>
        </div>

        <div className="flex gap-3 p-5 border-t" style={{ borderColor: C.border }}>
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold border"
            style={{ border: `1.5px solid ${C.border}`, color: C.text }}>
            Cancel
          </button>
          <button
            disabled={messages.every(m => !m.trim())}
            onClick={() => onSubmit(requestType, messages.filter(m => m.trim()))}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40"
            style={{ background: C.orange }}>
            <Send className="w-4 h-4" /> Send Request
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Application Queue ────────────────────────────────────────────────────────
function ApplicationQueue({ statusFilter, title = "Application Queue" }: {
  statusFilter?: string[]; title?: string;
}) {
  const { addNotification, bankApplications, applicationDocuments } = useApp();
  const { setActiveKey, focusApplicationId, setFocusApplicationId } = useOutletContext<OutletCtx>();
  const [selected, setSelected] = useState<BankApplication | null>(null);
  const [activeTab, setActiveTab] = useState("info");
  const [searchQ, setSearchQ] = useState("");
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    if (!focusApplicationId) return;
    const app = bankApplications.find(a => a.id === focusApplicationId);
    if (app) {
      setSelected(app);
      setRequestSent(false);
    }
    setFocusApplicationId(null);
  }, [focusApplicationId, bankApplications, setFocusApplicationId]);

  const scoped = statusFilter ? bankApplications.filter(a => statusFilter.includes(a.status)) : bankApplications;
  const filtered = scoped.filter(a =>
    a.business.toLowerCase().includes(searchQ.toLowerCase()) ||
    a.caseId.toLowerCase().includes(searchQ.toLowerCase())
  );

  const TABS = ["info", "ownership", "financing", "documents", "audit"];
  const TAB_LABELS: Record<string, string> = {
    info: "Business Information", ownership: "Ownership", financing: "Financing Details",
    documents: "Documents", audit: "Audit Trail",
  };

  const handleExport = () => {
    if (!selected) return;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFillColor(29, 78, 216);
    doc.rect(0, 0, pageWidth, 28, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("SBP SME Portal — Application Summary", 14, 17);

    doc.setTextColor(20, 20, 20);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(selected.business, 14, 42);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(selected.caseId, 14, 49);

    const rows: [string, string][] = [
      ["Financing Scheme", selected.scheme],
      ["Requested Amount", selected.amount],
      ["Submitted", selected.submitted],
      ["Status", STATUS_CFG[selected.status]?.label ?? selected.status],
      ["Risk Rating", selected.risk],
    ];

    let y = 62;
    rows.forEach(([label, value], i) => {
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
      doc.text(String(value), 90, y);
      y += 10;
    });

    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Generated ${new Date().toLocaleString()}`, 14, y + 10);

    doc.save(`${selected.caseId}.pdf`);
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left: queue list */}
      <div className="w-80 flex-shrink-0 flex flex-col border-r overflow-hidden"
        style={{ background: C.surface, borderColor: C.border }}>
        <div className="p-4 border-b" style={{ borderColor: C.border }}>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-sm font-semibold flex-1" style={{ color: C.text }}>{title}</h2>
            <button className="p-1.5 rounded-lg hover:bg-gray-100" style={{ color: C.textMuted }}>
              <Filter className="w-4 h-4" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: C.textMuted }} />
            <input value={searchQ} onChange={e => setSearchQ(e.target.value)}
              placeholder="Search applications..."
              className="w-full rounded-xl border text-xs outline-none"
              style={{ padding: "9px 12px 9px 32px", border: `1.5px solid ${C.border}`, background: C.bg, color: C.text }} />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto divide-y" style={{ borderColor: C.border }}>
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center gap-2 py-10 px-4 text-center">
              <FileText className="w-8 h-8 opacity-20" style={{ color: C.textMuted }} />
              <p className="text-xs" style={{ color: C.textMuted }}>No applications in this list right now</p>
            </div>
          )}
          {filtered.map(app => {
            const isNew = app.status === "pending";
            return (
            <div key={app.id}
              style={{
                background: selected?.id === app.id ? C.blueLight : isNew ? "#FEF2F2" : undefined,
                borderLeft: isNew ? "3px solid #DC2626" : "3px solid transparent",
              }}>
              <button
                onClick={() => { setSelected(app); setRequestSent(false); }}
                className="w-full text-left p-4 hover:bg-gray-50 transition-all">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <span className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: C.text }}>
                    {app.business}
                    {isNew && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full text-white" style={{ background: "#DC2626" }}>
                        NEW
                      </span>
                    )}
                  </span>
                  <Badge status={app.status} />
                </div>
                <div className="text-xs mb-1" style={{ color: C.textMuted, fontFamily: "var(--font-mono)" }}>{app.caseId}</div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold" style={{ color: C.text }}>{app.amount}</span>
                  <span className="text-xs" style={{ color: C.textMuted }}>{app.submitted}</span>
                </div>
              </button>
            </div>
            );
          })}
        </div>
      </div>

      {/* Right: detail panel */}
      <div className="flex-1 overflow-y-auto">
        {!selected ? (
          <div className="flex items-center justify-center h-full flex-col gap-3">
            <FileText className="w-12 h-12 opacity-20" style={{ color: C.textMuted }} />
            <p className="text-sm" style={{ color: C.textMuted }}>Select an application to review</p>
          </div>
        ) : (
          <div className="px-6 py-5">
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold" style={{ color: C.text }}>{selected.business}</h2>
                <p className="text-xs mt-0.5" style={{ color: C.textMuted, fontFamily: "var(--font-mono)" }}>{selected.caseId}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={handleExport}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border"
                  style={{ border: `1.5px solid ${C.border}`, color: C.text }}>
                  <Download className="w-3.5 h-3.5" /> Export
                </button>
                {ASSESSABLE_STATUSES.includes(selected.status) ? (
                  <button onClick={() => setActiveKey("reports")}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold text-white"
                    style={{ background: C.blue }}>
                    <ClipboardCheck className="w-3.5 h-3.5" /> Begin Assessment
                  </button>
                ) : (
                  <Badge status={selected.status} />
                )}
              </div>
            </div>

            {requestSent && (
              <div className="mb-5 rounded-xl p-3 flex items-center gap-2.5" style={{ background: C.greenLight, border: `1.5px solid ${C.green}40` }}>
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: C.green }} />
                <p className="text-xs font-medium" style={{ color: C.green }}>
                  Request sent — the applicant has been notified on the SME Portal to upload the requested documents.
                </p>
              </div>
            )}

            {/* Tabs */}
            <div className="flex gap-1 mb-5 border-b" style={{ borderColor: C.border }}>
              {TABS.map(t => (
                <button key={t} onClick={() => setActiveTab(t)}
                  className="px-4 py-2 text-xs font-medium transition-all border-b-2 -mb-px"
                  style={{
                    borderColor: activeTab === t ? C.blue : "transparent",
                    color: activeTab === t ? C.blue : C.textMuted,
                  }}>
                  {TAB_LABELS[t]}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {activeTab === "info" && (
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Business Name", value: selected.business },
                  { label: "Business Nature", value: "Trading" },
                  { label: "NTN", value: "4532891-7" },
                  { label: "Year Established", value: "2014" },
                  { label: "Annual Sales (PKR)", value: "18,500,000" },
                  { label: "Employees", value: "32" },
                  { label: "Business Status", value: "Private Limited Company" },
                  { label: "Business Premises", value: "Owned" },
                ].map(({ label, value }) => (
                  <div key={label} className="p-3 rounded-xl" style={{ background: C.bg, border: `1.5px solid ${C.border}` }}>
                    <div className="text-xs mb-1" style={{ color: C.textMuted }}>{label}</div>
                    <div className="text-sm font-semibold" style={{ color: C.text }}>{value}</div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "financing" && (
              <div className="space-y-3">
                {[
                  { label: "Facility Type", value: selected.scheme },
                  { label: "Requested Amount", value: selected.amount },
                  { label: "Tenor", value: "3 Years" },
                  { label: "Financing Purpose", value: "Working capital and machinery upgrade" },
                  { label: "IBAN", value: "PK36HABB0000949473010010" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center gap-4 py-2 border-b" style={{ borderColor: C.border }}>
                    <span className="text-xs w-36 flex-shrink-0" style={{ color: C.textMuted }}>{label}</span>
                    <span className="text-sm font-semibold" style={{ color: C.text, fontFamily: label === "IBAN" ? "var(--font-mono)" : undefined }}>{value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "documents" && (
              <div className="space-y-2">
                {(applicationDocuments[selected.id] ?? []).length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                    <FileText className="w-8 h-8 opacity-20" style={{ color: C.textMuted }} />
                    <p className="text-xs" style={{ color: C.textMuted }}>No documents on file for this application</p>
                  </div>
                ) : (
                  applicationDocuments[selected.id].map(doc => (
                    <a key={doc.label} href={doc.fileUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl transition-all hover:bg-gray-50"
                      style={{ background: C.bg, border: `1.5px solid ${C.border}` }}>
                      <FileText className="w-4 h-4 flex-shrink-0" style={{ color: C.blue }} />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm" style={{ color: C.text }}>{doc.label}</div>
                        <div className="text-xs truncate" style={{ color: C.textMuted }}>{doc.fileName}</div>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0"
                        style={{ background: C.greenLight, color: C.green }}>Uploaded</span>
                      <Eye className="w-3.5 h-3.5 flex-shrink-0" style={{ color: C.textMuted }} />
                    </a>
                  ))
                )}
              </div>
            )}

            {activeTab === "audit" && (
              <div className="space-y-3">
                {[
                  { user: "System", action: "Application received", time: "Jun 12, 09:15", type: "info" },
                  { user: "System", action: "Referred to HBL SME Finance", time: "Jun 13, 14:30", type: "info" },
                  { user: "Bilal Raza (HBL)", action: "Application opened for review", time: "Jun 15, 09:00", type: "action" },
                  { user: "Bilal Raza (HBL)", action: "Credit bureau check initiated", time: "Jun 15, 09:45", type: "action" },
                ].map(({ user, action, time, type }) => (
                  <div key={`${user}-${time}`} className="flex gap-3 p-3 rounded-xl"
                    style={{ background: C.bg, border: `1.5px solid ${C.border}` }}>
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
                      style={{ background: type === "action" ? C.blue : C.textMuted, fontSize: "10px" }}>
                      {user[0]}
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-semibold" style={{ color: C.text }}>{action}</div>
                      <div className="text-xs" style={{ color: C.textMuted }}>{user} · {time}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Assessment actions */}
            {ASSESSABLE_STATUSES.includes(selected.status) ? (
              <div className="mt-6 pt-5 border-t flex gap-3" style={{ borderColor: C.border }}>
                <button onClick={() => setShowRequestModal(true)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: C.orange }}>
                  <MessageSquare className="w-4 h-4" /> Request more info
                </button>
                <button onClick={() => setActiveKey("reports")}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                  style={{ background: C.blue }}>
                  <ClipboardCheck className="w-4 h-4" /> Start assessment
                </button>
              </div>
            ) : (
              <div className="mt-6 pt-5 border-t flex items-center gap-3" style={{ borderColor: C.border }}>
                <div className="rounded-xl p-3.5 flex items-center gap-2.5 w-full"
                  style={{ background: STATUS_CFG[selected.status]?.bg, border: `1.5px solid ${STATUS_CFG[selected.status]?.color}40` }}>
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: STATUS_CFG[selected.status]?.color }} />
                  <p className="text-xs font-medium" style={{ color: STATUS_CFG[selected.status]?.color }}>
                    {STATUS_RESOLUTION_NOTE[selected.status] ?? `This application is currently ${STATUS_CFG[selected.status]?.label.toLowerCase()}.`}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {showRequestModal && selected && (
        <RequestInfoModal
          business={selected.business}
          caseId={selected.caseId}
          onClose={() => setShowRequestModal(false)}
          onSubmit={(type, messages) => {
            addNotification({
              title: type === "documents" ? "Document Required" : "Information Requested",
              desc: `${selected.business} — bank requested ${type === "documents" ? "document(s)" : "information"}: ${messages.map(m => `"${m}"`).join("; ")}`,
              time: "Just now",
              dot: C.orange,
            });
            setShowRequestModal(false);
            setRequestSent(true);
          }}
        />
      )}
    </div>
  );
}

// ── Credit Assessment ────────────────────────────────────────────────────────
const RED = "#DC2626";

const CHECK_DEFS = [
  {
    key: "ecib", label: "Credit Bureau Result (eCIB)", note: "Score: 742/850",
    options: [
      { value: "Clean · No defaults", status: "pass" },
      { value: "Minor Defaults", status: "warn" },
      { value: "Defaults", status: "fail" },
    ],
  },
  {
    key: "risk", label: "Risk Assessment Result", note: "Manufacturing sector exposure within limits",
    options: [
      { value: "Low Risk", status: "pass" },
      { value: "Medium Risk", status: "warn" },
      { value: "High Risk", status: "fail" },
    ],
  },
  {
    key: "aml", label: "AML Screening Status", note: "No match on OFAC / UN sanctions list",
    options: [
      { value: "Clear", status: "pass" },
      { value: "Under Review", status: "warn" },
      { value: "Flagged", status: "fail" },
    ],
  },
  {
    key: "dd", label: "Due Diligence Status", note: "Site visit conducted June 14, 2025",
    options: [
      { value: "Completed", status: "pass" },
      { value: "In Progress", status: "warn" },
      { value: "Pending", status: "fail" },
    ],
  },
] as const;

// ── Upload Conditional Offer modal ───────────────────────────────────────────
function UploadOfferModal({ business, caseId, onClose, onSubmit }: {
  business: string; caseId: string; onClose: () => void; onSubmit: (file: File) => void;
}) {
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(15,23,42,0.5)" }}>
      <div className="w-full max-w-lg rounded-2xl border" style={{ background: C.surface, border: `1.5px solid ${C.border}` }}>
        <div className="flex items-start justify-between p-5 border-b" style={{ borderColor: C.border }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: C.greenLight }}>
              <UploadCloud className="w-4.5 h-4.5" style={{ color: C.green }} />
            </div>
            <div>
              <h3 className="text-sm font-bold" style={{ color: C.text }}>Upload Conditional Offer</h3>
              <p className="text-xs" style={{ color: C.textMuted }}>{business} · {caseId}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100" style={{ color: C.textMuted }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="rounded-xl p-3 flex gap-2.5" style={{ background: C.blueLight, border: `1.5px solid ${C.blue}20` }}>
            <FileText className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: C.blue }} />
            <p className="text-xs leading-relaxed" style={{ color: C.blue }}>
              Upload the signed conditional offer letter. The applicant will be notified on the
              SME Portal and can review it there to accept or decline.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: C.text }}>Offer Document</label>
            <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed py-8 cursor-pointer transition-all hover:bg-gray-50"
              style={{ borderColor: file ? C.green : C.border }}>
              <input type="file" accept=".pdf,.doc,.docx,image/*" className="hidden"
                onChange={e => setFile(e.target.files?.[0] ?? null)} />
              {file ? (
                <>
                  <CheckCircle2 className="w-6 h-6" style={{ color: C.green }} />
                  <span className="text-sm font-semibold" style={{ color: C.text }}>{file.name}</span>
                  <span className="text-xs" style={{ color: C.textMuted }}>Click to replace</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-6 h-6" style={{ color: C.textMuted }} />
                  <span className="text-sm font-medium" style={{ color: C.text }}>Click to upload offer letter</span>
                  <span className="text-xs" style={{ color: C.textMuted }}>PDF, DOC, or image</span>
                </>
              )}
            </label>
          </div>
        </div>

        <div className="flex gap-3 p-5 border-t" style={{ borderColor: C.border }}>
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold border"
            style={{ border: `1.5px solid ${C.border}`, color: C.text }}>
            Cancel
          </button>
          <button
            disabled={!file}
            onClick={() => file && onSubmit(file)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white disabled:opacity-40"
            style={{ background: C.green }}>
            <Send className="w-4 h-4" /> Upload & Send to Applicant
          </button>
        </div>
      </div>
    </div>
  );
}

function CreditAssessment() {
  const { addNotification, setOfferDocument } = useApp();
  const { setActiveKey } = useOutletContext<OutletCtx>();
  const [decision, setDecision] = useState<"accept" | "decline" | null>(null);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerSent, setOfferSent] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({
    ecib: "Clean · No defaults",
    risk: "Medium Risk",
    aml: "Clear",
    dd: "Completed",
  });

  const statusColor = (status: string) => status === "pass" ? C.green : status === "warn" ? "#D97706" : RED;

  return (
    <div className="px-6 py-6">
      <button onClick={() => setActiveKey("queue")}
        className="flex items-center gap-2 mb-4 text-sm font-medium hover:opacity-70 transition-opacity"
        style={{ color: C.textMuted }}>
        <ArrowLeft className="w-4 h-4" /> Back to Queue
      </button>
      <h1 className="text-xl font-bold mb-1" style={{ color: C.text }}>Credit Assessment</h1>
      <p className="text-sm mb-6" style={{ color: C.textMuted }}>SBP-SME-2025-00142 · ABC Traders</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-3">
          {CHECK_DEFS.map(({ key, label, note, options }) => {
            const value = values[key];
            const status = options.find(o => o.value === value)?.status ?? "pass";
            const color = statusColor(status);
            return (
              <div key={key} className="rounded-xl p-4 border flex items-start gap-4"
                style={{
                  background: status === "pass" ? C.greenLight : status === "warn" ? "#FEF3C7" : "#FEE2E2",
                  border: `1.5px solid ${color}${status === "pass" ? "40" : ""}`,
                }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: color }}>
                  {status === "pass"
                    ? <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    : <AlertCircle className="w-3.5 h-3.5 text-white" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold" style={{ color: C.text }}>{label}</span>
                    <div className="relative">
                      <select
                        value={value}
                        onChange={e => setValues(v => ({ ...v, [key]: e.target.value }))}
                        className="text-xs font-bold rounded-lg border outline-none appearance-none cursor-pointer"
                        style={{ padding: "6px 28px 6px 10px", color, border: `1.5px solid ${color}`, background: C.surface }}
                      >
                        {options.map(o => (
                          <option key={o.value} value={o.value}>{o.value}</option>
                        ))}
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ color }} />
                    </div>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: C.textMuted }}>{note}</p>
                </div>
              </div>
            );
          })}

          <div className="rounded-xl p-4 border" style={{ background: C.surface, border: `1.5px solid ${C.border}` }}>
            <label className="block text-sm font-medium mb-2" style={{ color: C.text }}>Internal Remarks</label>
            <textarea rows={4} placeholder="Enter assessment remarks, conditions, or notes..."
              className="w-full rounded-xl border text-sm outline-none resize-none"
              style={{ padding: "10px 12px", border: `1.5px solid ${C.border}`, background: C.bg, color: C.text }} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border p-5" style={{ background: C.surface, border: `1.5px solid ${C.border}` }}>
            <h3 className="text-sm font-bold mb-4" style={{ color: C.text }}>Assessment Decision</h3>

            {decision === null && (
              <div className="space-y-3">
                <button onClick={() => setDecision("accept")}
                  className="w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2"
                  style={{ background: C.green }}>
                  <CheckCircle2 className="w-4 h-4" /> Accept
                </button>
                <button onClick={() => {
                  setDecision("decline");
                  addNotification({
                    title: "Application Declined",
                    desc: "HBL has declined the financing application for ABC Traders (SBP-SME-2025-00142).",
                    time: "Just now",
                    dot: "#DC2626",
                  });
                }}
                  className="w-full py-3 rounded-xl text-sm font-semibold border flex items-center justify-center gap-2"
                  style={{ border: "1.5px solid #DC2626", color: "#DC2626" }}>
                  <XCircle className="w-4 h-4" /> Decline
                </button>
              </div>
            )}

            {decision === "accept" && !offerSent && (
              <div className="space-y-2">
                <button onClick={() => setShowOfferModal(true)}
                  className="w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2"
                  style={{ background: C.green }}>
                  <UploadCloud className="w-4 h-4" /> Upload Conditional Offer
                </button>
                <button onClick={() => setDecision(null)} className="w-full text-xs py-1.5" style={{ color: C.textMuted }}>
                  ← Change decision
                </button>
              </div>
            )}

            {decision === "decline" && (
              <div className="rounded-xl p-4 text-center" style={{ background: "#FEE2E2", border: "1.5px solid #DC2626" }}>
                <XCircle className="w-6 h-6 mx-auto mb-2" style={{ color: "#DC2626" }} />
                <p className="text-sm font-bold" style={{ color: "#DC2626" }}>Application Declined</p>
                <p className="text-xs mt-1" style={{ color: C.textMuted }}>The applicant will be notified of this decision.</p>
                <button onClick={() => setDecision(null)} className="w-full text-xs mt-3" style={{ color: C.textMuted }}>
                  ← Change decision
                </button>
              </div>
            )}
          </div>
          {offerSent && (
            <div className="rounded-2xl p-4 text-center" style={{ background: C.greenLight, border: `1.5px solid ${C.green}` }}>
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2" style={{ color: C.green }} />
              <p className="text-sm font-bold" style={{ color: C.green }}>Offer uploaded & sent!</p>
              <p className="text-xs mt-1" style={{ color: C.textMuted }}>The applicant can now view and accept the offer on the SME Portal.</p>
            </div>
          )}
        </div>
      </div>

      {showOfferModal && (
        <UploadOfferModal
          business="ABC Traders"
          caseId="SBP-SME-2025-00142"
          onClose={() => setShowOfferModal(false)}
          onSubmit={file => {
            setOfferDocument({
              fileName: file.name,
              fileUrl: URL.createObjectURL(file),
              business: "ABC Traders",
              caseId: "SBP-SME-2025-00142",
              bank: "HBL",
              uploadedAt: "Just now",
            });
            addNotification({
              title: "Offer Received",
              desc: `HBL has issued a conditional offer for ABC Traders — "${file.name}". Review and accept it now.`,
              time: "Just now",
              dot: C.green,
            });
            setShowOfferModal(false);
            setOfferSent(true);
          }}
        />
      )}
    </div>
  );
}

// ── Conditional Offer ────────────────────────────────────────────────────────
function ConditionalOffer() {
  return (
    <div className="px-6 py-6">
      <h1 className="text-xl font-bold mb-1" style={{ color: C.text }}>Generate Conditional Offer</h1>
      <p className="text-sm mb-6" style={{ color: C.textMuted }}>SBP-SME-2025-00142 · ABC Traders</p>

      <div className="max-w-2xl rounded-2xl border p-6" style={{ background: C.surface, border: `1.5px solid ${C.border}` }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
          {[
            { label: "Approved Amount (PKR)", ph: "e.g. 8,000,000" },
            { label: "Markup Rate (% p.a.)", ph: "e.g. 9.5" },
            { label: "Tenor", ph: "" },
            { label: "Offer Expiry Date", ph: "", type: "date" },
          ].map(({ label, ph, type }) => (
            <div key={label}>
              <label className="block text-sm font-medium mb-1.5" style={{ color: C.text }}>{label}</label>
              {label === "Tenor" ? (
                <div className="relative">
                  <select className="w-full rounded-xl border text-sm outline-none appearance-none"
                    style={{ padding: "11px 36px 11px 14px", background: C.bg, border: `1.5px solid ${C.border}`, color: C.text }}>
                    {["1 Year", "2 Years", "3 Years", "5 Years", "7 Years"].map(t => <option key={t}>{t}</option>)}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: C.textMuted }} />
                </div>
              ) : (
                <input type={type ?? "text"} placeholder={ph}
                  className="w-full rounded-xl border text-sm outline-none"
                  style={{ padding: "11px 14px", background: C.bg, border: `1.5px solid ${C.border}`, color: C.text }} />
              )}
            </div>
          ))}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1.5" style={{ color: C.text }}>Conditions</label>
            <textarea rows={3} placeholder="List any specific conditions attached to this offer..."
              className="w-full rounded-xl border text-sm outline-none resize-none"
              style={{ padding: "11px 14px", background: C.bg, border: `1.5px solid ${C.border}`, color: C.text }} />
          </div>
        </div>

        <button className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white"
          style={{ background: C.blue }}>
          <FileText className="w-4 h-4" /> Generate & Send Offer Letter
        </button>
      </div>
    </div>
  );
}


// ── Main export ──────────────────────────────────────────────────────────────
export default function BankPortal() {
  const { activeKey } = useOutletContext<OutletCtx>();

  switch (activeKey) {
    case "queue": return <ApplicationQueue key="queue" />;
    case "assessment": return <ApplicationQueue key="assessment" statusFilter={["under_review"]} title="Under Assessment" />;
    case "offers": return <ApplicationQueue key="offers" statusFilter={["offer_issued"]} title="Offers Issued" />;
    case "offers_accepted": return <ApplicationQueue key="offers_accepted" statusFilter={["approved"]} title="Offers Accepted by Applicant" />;
    case "offers_rejected": return <ApplicationQueue key="offers_rejected" statusFilter={["rejected"]} title="Offers Rejected by Applicant" />;
    case "reports": return <CreditAssessment />;
    default: return <Dashboard />;
  }
}
