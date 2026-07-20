import { useState } from "react";
import { useOutletContext } from "react-router";
import { C } from "../../constants/colors";
import {
  FileText, Clock, CheckCircle2, XCircle, Banknote, Search, Filter,
  Eye, ChevronDown, ArrowRight, TrendingUp, AlertCircle, Download,
  ClipboardCheck, BadgeCheck, ShieldCheck, MessageSquare,
  Sparkles, Landmark, ListChecks,
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

type OutletCtx = { activeKey: string };

// ── shared sample data ──────────────────────────────────────────────────────
const QUEUE = [
  { id: "A001", caseId: "SBP-SME-2025-00142", business: "ABC Traders", scheme: "SAAF", amount: "PKR 8.5M", submitted: "Jun 12", status: "under_review", risk: "Low" },
  { id: "A002", caseId: "SBP-SME-2025-00139", business: "Karachi Steel Works", scheme: "Tech Upgrade", amount: "PKR 22M", submitted: "Jun 10", status: "pending", risk: "Medium" },
  { id: "A003", caseId: "SBP-SME-2025-00131", business: "Fresh Farm Exports", scheme: "Agri-SME", amount: "PKR 12M", submitted: "Jun 8", status: "pending", risk: "Low" },
  { id: "A004", caseId: "SBP-SME-2025-00128", business: "TechSoft Solutions", scheme: "SAAF", amount: "PKR 6M", submitted: "Jun 5", status: "offer_issued", risk: "Low" },
  { id: "A005", caseId: "SBP-SME-2025-00119", business: "Lahore Textile Mills", scheme: "Refinance", amount: "PKR 18M", submitted: "Jun 2", status: "approved", risk: "High" },
];

const STATUS_CFG: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "Pending Review", color: C.textMuted, bg: "#F3F4F6" },
  under_review: { label: "Under Review", color: "#D97706", bg: "#FEF3C7" },
  offer_issued: { label: "Offer Issued", color: C.blue, bg: C.blueLight },
  approved: { label: "Approved", color: C.green, bg: C.greenLight },
  rejected: { label: "Rejected", color: "#DC2626", bg: "#FEE2E2" },
  disbursed: { label: "Disbursed", color: C.greenDark, bg: C.greenLight },
};

function Badge({ status }: { status: string }) {
  const c = STATUS_CFG[status] ?? STATUS_CFG.pending;
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{ background: c.bg, color: c.color }}>{c.label}</span>
  );
}

// ── Dashboard ───────────────────────────────────────────────────────────────
function Dashboard() {
  const STAT_CARDS = [
    { label: "Applications Received", value: "48", icon: FileText, color: C.blue, bg: C.blueLight, delta: "+12 this week" },
    { label: "Pending Assessment", value: "14", icon: Clock, color: "#D97706", bg: "#FEF3C7", delta: "3 overdue" },
    { label: "Approved", value: "18", icon: CheckCircle2, color: C.green, bg: C.greenLight, delta: "62% approval rate" },
    { label: "Rejected", value: "8", icon: XCircle, color: "#DC2626", bg: "#FEE2E2", delta: "" },
    { label: "Disbursed", value: "12", icon: Banknote, color: C.greenDark, bg: C.greenLight, delta: "PKR 86M total" },
  ];

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

      {/* Recent applications */}
      <GradientCard accent={C.blue}>
        <div className="rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: C.border }}>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: C.blueLight }}>
                <ListChecks className="w-3.5 h-3.5" style={{ color: C.blue }} />
              </div>
              <h2 className="text-sm font-bold" style={{ color: C.text }}>Recent Applications</h2>
            </div>
            <span className="text-xs font-bold flex items-center gap-1" style={{ color: C.blue }}>View All Queue <ArrowRight className="w-3 h-3" /></span>
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
                {QUEUE.slice(0, 4).map(app => (
                  <tr key={app.id} className="border-t hover:bg-gray-50 cursor-pointer" style={{ borderColor: C.border }}>
                    <td className="px-4 py-3 text-xs font-mono" style={{ color: C.text, fontFamily: "var(--font-mono)" }}>{app.caseId}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-white"
                          style={{ background: C.blue }}>
                          {app.business[0]}
                        </div>
                        <span className="text-xs font-semibold" style={{ color: C.text }}>{app.business}</span>
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
                      <button className="p-1.5 rounded-lg hover:bg-gray-100" style={{ color: C.textMuted }}>
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </GradientCard>
    </div>
  );
}

// ── Application Queue ────────────────────────────────────────────────────────
function ApplicationQueue() {
  const [selected, setSelected] = useState<(typeof QUEUE)[0] | null>(null);
  const [activeTab, setActiveTab] = useState("info");
  const [searchQ, setSearchQ] = useState("");

  const filtered = QUEUE.filter(a =>
    a.business.toLowerCase().includes(searchQ.toLowerCase()) ||
    a.caseId.toLowerCase().includes(searchQ.toLowerCase())
  );

  const TABS = ["info", "ownership", "financing", "documents", "audit"];
  const TAB_LABELS: Record<string, string> = {
    info: "Business Information", ownership: "Ownership", financing: "Financing Details",
    documents: "Documents", audit: "Audit Trail",
  };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left: queue list */}
      <div className="w-80 flex-shrink-0 flex flex-col border-r overflow-hidden"
        style={{ background: C.surface, borderColor: C.border }}>
        <div className="p-4 border-b" style={{ borderColor: C.border }}>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-sm font-semibold flex-1" style={{ color: C.text }}>Application Queue</h2>
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
          {filtered.map(app => (
            <button key={app.id}
              onClick={() => setSelected(app)}
              className="w-full text-left p-4 hover:bg-gray-50 transition-all"
              style={{ background: selected?.id === app.id ? C.blueLight : undefined }}>
              <div className="flex items-start justify-between gap-2 mb-1">
                <span className="text-xs font-semibold" style={{ color: C.text }}>{app.business}</span>
                <Badge status={app.status} />
              </div>
              <div className="text-xs mb-1" style={{ color: C.textMuted, fontFamily: "var(--font-mono)" }}>{app.caseId}</div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold" style={{ color: C.text }}>{app.amount}</span>
                <span className="text-xs" style={{ color: C.textMuted }}>{app.submitted}</span>
              </div>
            </button>
          ))}
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
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border"
                  style={{ border: `1.5px solid ${C.border}`, color: C.text }}>
                  <Download className="w-3.5 h-3.5" /> Export
                </button>
                <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold text-white"
                  style={{ background: C.blue }}>
                  <ClipboardCheck className="w-3.5 h-3.5" /> Begin Assessment
                </button>
              </div>
            </div>

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
                {["CNIC (Front & Back)", "Business Registration", "Financial Statements", "Feasibility Report"].map(d => (
                  <div key={d} className="flex items-center gap-3 p-3 rounded-xl"
                    style={{ background: C.bg, border: `1.5px solid ${C.border}` }}>
                    <FileText className="w-4 h-4 flex-shrink-0" style={{ color: C.blue }} />
                    <span className="text-sm flex-1" style={{ color: C.text }}>{d}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                      style={{ background: C.greenLight, color: C.green }}>Uploaded</span>
                    <button className="p-1 rounded" style={{ color: C.textMuted }}><Eye className="w-3.5 h-3.5" /></button>
                  </div>
                ))}
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
            <div className="mt-6 pt-5 border-t flex gap-3" style={{ borderColor: C.border }}>
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: C.green }}>
                <BadgeCheck className="w-4 h-4" /> Approve
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border"
                style={{ border: `1.5px solid ${C.orange}`, color: C.orange }}>
                <MessageSquare className="w-4 h-4" /> Request Info
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border"
                style={{ border: "1.5px solid #DC2626", color: "#DC2626" }}>
                <XCircle className="w-4 h-4" /> Reject
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Credit Assessment ────────────────────────────────────────────────────────
function CreditAssessment() {
  const [submitted, setSubmitted] = useState(false);

  const CHECKS = [
    { label: "Credit Bureau Result (eCIB)", value: "Clean · No defaults", status: "pass", note: "Score: 742/850" },
    { label: "Risk Assessment Result", value: "Medium Risk", status: "warn", note: "Manufacturing sector exposure within limits" },
    { label: "AML Screening Status", value: "Clear", status: "pass", note: "No match on OFAC / UN sanctions list" },
    { label: "Due Diligence Status", value: "Completed", status: "pass", note: "Site visit conducted June 14, 2025" },
  ];

  return (
    <div className="px-6 py-6">
      <h1 className="text-xl font-bold mb-1" style={{ color: C.text }}>Credit Assessment</h1>
      <p className="text-sm mb-6" style={{ color: C.textMuted }}>SBP-SME-2025-00142 · ABC Traders</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-3">
          {CHECKS.map(({ label, value, status, note }) => (
            <div key={label} className="rounded-xl p-4 border flex items-start gap-4"
              style={{
                background: status === "pass" ? C.greenLight : "#FEF3C7",
                border: `1.5px solid ${status === "pass" ? C.green + "40" : "#D97706"}`,
              }}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}
                style={{ background: status === "pass" ? C.green : "#D97706" }}>
                {status === "pass"
                  ? <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  : <AlertCircle className="w-3.5 h-3.5 text-white" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold" style={{ color: C.text }}>{label}</span>
                  <span className="text-xs font-bold" style={{ color: status === "pass" ? C.green : "#D97706" }}>{value}</span>
                </div>
                <p className="text-xs mt-0.5" style={{ color: C.textMuted }}>{note}</p>
              </div>
            </div>
          ))}

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
            <div className="space-y-3">
              <button onClick={() => setSubmitted(true)}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2"
                style={{ background: C.green }}>
                <BadgeCheck className="w-4 h-4" /> Approve & Generate Offer
              </button>
              <button className="w-full py-3 rounded-xl text-sm font-semibold border flex items-center justify-center gap-2"
                style={{ border: `1.5px solid ${C.orange}`, color: C.orange }}>
                <MessageSquare className="w-4 h-4" /> Request More Information
              </button>
              <button className="w-full py-3 rounded-xl text-sm font-semibold border flex items-center justify-center gap-2"
                style={{ border: "1.5px solid #DC2626", color: "#DC2626" }}>
                <XCircle className="w-4 h-4" /> Decline Application
              </button>
            </div>
          </div>
          {submitted && (
            <div className="rounded-2xl p-4 text-center" style={{ background: C.greenLight, border: `1.5px solid ${C.green}` }}>
              <CheckCircle2 className="w-8 h-8 mx-auto mb-2" style={{ color: C.green }} />
              <p className="text-sm font-bold" style={{ color: C.green }}>Assessment submitted!</p>
              <p className="text-xs mt-1" style={{ color: C.textMuted }}>Offer generation form is now available.</p>
            </div>
          )}
        </div>
      </div>
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

// ── Disbursement ─────────────────────────────────────────────────────────────
function Disbursement() {
  return (
    <div className="px-6 py-6">
      <h1 className="text-xl font-bold mb-1" style={{ color: C.text }}>Disbursement</h1>
      <p className="text-sm mb-6" style={{ color: C.textMuted }}>Process financing disbursement for approved applications</p>

      <div className="max-w-lg rounded-2xl border p-6" style={{ background: C.surface, border: `1.5px solid ${C.border}` }}>
        <div className="space-y-4">
          {[
            { label: "Case ID", ph: "SBP-SME-2025-00098" },
            { label: "Disbursement Amount (PKR)", ph: "8,000,000" },
            { label: "Account Number / IBAN", ph: "PK36HABB0000949473010010" },
          ].map(({ label, ph }) => (
            <div key={label}>
              <label className="block text-sm font-medium mb-1.5" style={{ color: C.text }}>{label}</label>
              <input type="text" placeholder={ph}
                className="w-full rounded-xl border text-sm outline-none"
                style={{ padding: "11px 14px", background: C.bg, border: `1.5px solid ${C.border}`, color: C.text, fontFamily: label.includes("IBAN") || label === "Case ID" ? "var(--font-mono)" : undefined }} />
            </div>
          ))}
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: C.text }}>Value Date</label>
            <input type="date" className="w-full rounded-xl border text-sm outline-none"
              style={{ padding: "11px 14px", background: C.bg, border: `1.5px solid ${C.border}`, color: C.text }} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: C.text }}>Disbursement Status</label>
            <div className="relative">
              <select className="w-full rounded-xl border text-sm outline-none appearance-none"
                style={{ padding: "11px 36px 11px 14px", background: C.bg, border: `1.5px solid ${C.border}`, color: C.text }}>
                <option>Pending</option>
                <option>Processing</option>
                <option>Completed</option>
                <option>Failed</option>
              </select>
              <ChevronDown className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: C.textMuted }} />
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-5 pt-5 border-t" style={{ borderColor: C.border }}>
          <button className="flex-1 py-3 rounded-xl text-sm font-semibold text-white" style={{ background: C.green }}>
            Process Disbursement
          </button>
          <button className="flex-1 py-3 rounded-xl text-sm font-semibold border" style={{ border: `1.5px solid ${C.border}`, color: C.text }}>
            Save Draft
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main export ──────────────────────────────────────────────────────────────
export default function BankPortal() {
  const { activeKey } = useOutletContext<OutletCtx>();

  switch (activeKey) {
    case "queue":
    case "assessment":
    case "offers":
    case "pending": return <ApplicationQueue />;
    case "reports": return <CreditAssessment />;
    case "disbursed": return <Disbursement />;
    default: return <Dashboard />;
  }
}
