import { useNavigate } from "react-router";
import { useApp } from "../../context/AppContext";
import { C } from "../../constants/colors";
import {
  PlusCircle, FileText, Eye, Clock, CheckCircle2, XCircle,
  Banknote, ArrowRight, Activity, ChevronRight,
  ArrowUpRight, Building2, Hash, ListChecks, History, Sparkles, PieChart,
} from "lucide-react";

const STATUS_CONFIG = {
  draft: { label: "Draft", color: C.textMuted, bg: "#F3F4F6" },
  submitted: { label: "Submitted", color: C.blue, bg: C.blueLight },
  under_review: { label: "Under Review", color: "#D97706", bg: "#FEF3C7" },
  approved: { label: "Approved", color: C.green, bg: C.greenLight },
  rejected: { label: "Rejected", color: "#DC2626", bg: "#FEE2E2" },
  disbursed: { label: "Disbursed", color: C.greenDark, bg: C.greenLight },
};

function StatusBadge({ status }: { status: keyof typeof STATUS_CONFIG }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={{ background: cfg.bg, color: cfg.color }}>
      {cfg.label}
    </span>
  );
}

/* Visible gradient-stroke border — the app's shared card treatment */
function GradientCard({ accent, className = "", children }: { accent: string; className?: string; children: React.ReactNode }) {
  return (
    <div className={`rounded-2xl p-[1.5px] ${className}`}
      style={{ background: `linear-gradient(135deg, ${accent}90, ${accent}40)` }}>
      <div className="h-full w-full rounded-2xl" style={{ background: C.surface }}>
        {children}
      </div>
    </div>
  );
}

export default function SmeDashboard() {
  const navigate = useNavigate();
  const { applications, selectedBusiness } = useApp();

  const counts = {
    draft: applications.filter(a => a.status === "draft").length,
    submitted: applications.filter(a => a.status === "submitted").length,
    under_review: applications.filter(a => a.status === "under_review").length,
    approved: applications.filter(a => a.status === "approved").length,
    rejected: applications.filter(a => a.status === "rejected").length,
    disbursed: applications.filter(a => a.status === "disbursed").length,
  };

  const CARDS = [
    { label: "Draft", value: counts.draft, icon: FileText, color: C.textMuted, path: "" },
    { label: "Submitted", value: counts.submitted, icon: ArrowUpRight, color: C.blue, path: "" },
    { label: "Under Review", value: counts.under_review, icon: Clock, color: "#D97706", path: "/sme/tracking" },
    { label: "Approved", value: counts.approved, icon: CheckCircle2, color: C.green, path: "/sme/offer" },
    { label: "Rejected", value: counts.rejected, icon: XCircle, color: "#DC2626", path: "" },
    { label: "Disbursed", value: counts.disbursed, icon: Banknote, color: C.greenDark, path: "" },
  ];

  // Part-to-whole composition of the applicant's applications by status.
  // Single sequential hue (opacity-stepped) — the app's own status colors (esp.
  // red vs. green) fail a colorblind-safety check when used as adjacent segments,
  // so identity here rides on the always-visible legend labels, not hue alone.
  const totalApps = Math.max(1, applications.length);
  const COMPOSITION = [
    { name: "Draft", value: counts.draft, opacity: 0.28 },
    { name: "Submitted", value: counts.submitted, opacity: 0.44 },
    { name: "Under Review", value: counts.under_review, opacity: 0.6 },
    { name: "Approved", value: counts.approved, opacity: 0.76 },
    { name: "Rejected", value: counts.rejected, opacity: 0.88 },
    { name: "Disbursed", value: counts.disbursed, opacity: 1 },
  ].filter(d => d.value > 0);

  return (
    <div className="px-6 py-6" style={{ fontFamily: "'Manrope', sans-serif" }}>
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4" style={{ color: C.orange }} />
            <span className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: C.textMuted, fontFamily: "var(--font-mono)" }}>
              Welcome back
            </span>
          </div>
          <h1 className="text-2xl font-black leading-tight" style={{ color: C.text, letterSpacing: "-0.02em" }}>
            Dashboard
          </h1>
        </div>
        <button
          onClick={() => navigate("/sme/apply")}
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ background: `linear-gradient(135deg, ${C.green}, ${C.greenDark})`, boxShadow: `0 8px 20px -6px ${C.green}55` }}>
          <PlusCircle className="w-4 h-4" /> New Application
        </button>
      </div>

      {/* Business snapshot strip */}
      <GradientCard accent={C.green} className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 px-3.5 sm:px-5 py-3 sm:py-4">
          <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: `linear-gradient(135deg, ${C.green}, ${C.greenDark})` }}>
            <Building2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-base font-extrabold truncate" style={{ color: C.text }}>{selectedBusiness?.name ?? "—"}</div>
            <div className="text-xs mt-0.5" style={{ color: C.textMuted }}>{selectedBusiness?.nature ?? "—"} · {selectedBusiness?.address ?? "—"}</div>
          </div>
          <div className="flex items-center gap-4 sm:pl-4 sm:border-l" style={{ borderColor: C.border }}>
            <div className="flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5" style={{ color: C.textMuted }} />
              <span className="text-xs font-semibold" style={{ color: C.text, fontFamily: "var(--font-mono)" }}>{selectedBusiness?.ntn ?? "—"}</span>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: C.greenLight, color: C.green }}>
              {selectedBusiness?.status ?? "Active"}
            </span>
          </div>
        </div>
      </GradientCard>

      {/* Stat cards */}
      <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 mb-6">
        {CARDS.map(({ label, value, icon: Icon, color, path }) => (
          <GradientCard key={label} accent={color}>
            <button
              onClick={() => path ? navigate(path) : undefined}
              className="w-full h-full text-left p-2.5 sm:p-4 rounded-2xl transition-all duration-200 hover:-translate-y-0.5"
              style={{ background: C.surface }}>
              <div className="w-6 h-6 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center mb-1.5 sm:mb-3"
                style={{ background: color + "18" }}>
                <Icon className="w-3 h-3 sm:w-4 sm:h-4" style={{ color }} />
              </div>
              <div className="text-base sm:text-2xl font-black leading-none mb-0.5 sm:mb-1"
                style={{ color: C.text, fontFamily: "var(--font-mono)", letterSpacing: "-0.02em" }}>{value}</div>
              <div className="text-[10px] sm:text-xs font-medium leading-snug" style={{ color: C.textMuted }}>{label}</div>
            </button>
          </GradientCard>
        ))}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Applications table — 2/3 width */}
        <GradientCard accent={C.green} className="lg:col-span-2">
          <div className="rounded-2xl overflow-hidden" style={{ background: C.surface }}>
            <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: C.border }}>
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: C.greenLight }}>
                  <ListChecks className="w-3.5 h-3.5" style={{ color: C.green }} />
                </div>
                <h2 className="text-sm font-bold" style={{ color: C.text }}>Recent Applications</h2>
              </div>
              <button className="text-xs flex items-center gap-1 font-bold" style={{ color: C.green }}>
                View all <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: C.bg }}>
                    {["Case ID", "Business", "Scheme", "Amount", "Bank", "Status", ""].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide"
                        style={{ color: C.textMuted, fontFamily: "var(--font-mono)" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {applications.map(app => (
                    <tr key={app.id}
                      className="border-t transition-colors hover:bg-gray-50 cursor-pointer"
                      style={{ borderColor: C.border }}
                      onClick={() => { navigate("/sme/tracking"); }}>
                      <td className="px-4 py-3">
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: C.text }}>{app.caseId}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-white"
                            style={{ background: C.green }}>
                            {app.businessName?.[0] ?? "?"}
                          </div>
                          <span className="text-xs font-semibold" style={{ color: C.text }}>{app.businessName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: C.textMuted }}>{app.scheme}</td>
                      <td className="px-4 py-3 text-xs font-bold" style={{ color: C.text, fontFamily: "'Manrope', sans-serif" }}>{app.amount}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: C.textMuted }}>{app.bank}</td>
                      <td className="px-4 py-3"><StatusBadge status={app.status} /></td>
                      <td className="px-4 py-3">
                        <button className="p-1.5 rounded-lg hover:bg-gray-100" style={{ color: C.textMuted }}>
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {applications.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-4 py-10 text-center text-xs" style={{ color: C.textMuted }}>
                        No applications yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </GradientCard>

        {/* Right column */}
        <div className="space-y-4">
          {/* Application composition */}
          <GradientCard accent={C.green}>
            <div className="p-3.5 sm:p-5">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: C.greenLight }}>
                  <PieChart className="w-3.5 h-3.5" style={{ color: C.green }} />
                </div>
                <h2 className="text-sm font-bold" style={{ color: C.text }}>By Status</h2>
              </div>

              {/* composition bar */}
              <div className="flex w-full h-3 rounded-full overflow-hidden mb-4" style={{ gap: "2px", background: C.bg }}>
                {COMPOSITION.length === 0 ? (
                  <div className="w-full h-full rounded-full" style={{ background: C.border }} />
                ) : (
                  COMPOSITION.map(d => (
                    <div key={d.name} className="h-full rounded-full transition-all"
                      style={{ width: `${(d.value / totalApps) * 100}%`, background: C.green, opacity: d.opacity, minWidth: "3px" }}
                      title={`${d.name}: ${d.value}`} />
                  ))
                )}
              </div>

              {/* legend */}
              <div className="space-y-2">
                {COMPOSITION.length === 0 ? (
                  <p className="text-xs" style={{ color: C.textMuted }}>No applications yet.</p>
                ) : (
                  COMPOSITION.map(d => (
                    <div key={d.name} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: C.green, opacity: d.opacity }} />
                        <span className="text-xs font-medium truncate" style={{ color: C.text }}>{d.name}</span>
                      </div>
                      <span className="text-xs font-bold flex-shrink-0" style={{ color: C.textMuted, fontFamily: "var(--font-mono)" }}>
                        {d.value} · {Math.round((d.value / totalApps) * 100)}%
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </GradientCard>

          {/* Quick actions */}
          <GradientCard accent={C.blue}>
            <div className="p-3.5 sm:p-5">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: C.blueLight }}>
                  <Activity className="w-3.5 h-3.5" style={{ color: C.blue }} />
                </div>
                <h2 className="text-sm font-bold" style={{ color: C.text }}>Quick Actions</h2>
              </div>
              <div className="space-y-2">
                {[
                  { label: "Apply for Financing", desc: "Start a new application", icon: PlusCircle, path: "/sme/apply", color: C.green },
                  { label: "Track Application", desc: "View application status", icon: Activity, path: "/sme/tracking", color: C.blue },
                  { label: "View Offer Letter", desc: "Review & accept offers", icon: FileText, path: "/sme/offer", color: C.orange },
                ].map(({ label, desc, icon: Icon, path, color }) => (
                  <button key={label} onClick={() => navigate(path)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl text-left border transition-all hover:shadow-sm"
                    style={{ border: `1.5px solid ${C.border}` }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: color + "18" }}>
                      <Icon className="w-4 h-4" style={{ color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold" style={{ color: C.text }}>{label}</div>
                      <div className="text-xs" style={{ color: C.textMuted }}>{desc}</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" style={{ color: C.textMuted }} />
                  </button>
                ))}
              </div>
            </div>
          </GradientCard>

          {/* Timeline */}
          <GradientCard accent={C.orange}>
            <div className="p-3.5 sm:p-5">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: C.orangeLight }}>
                  <History className="w-3.5 h-3.5" style={{ color: C.orange }} />
                </div>
                <h2 className="text-sm font-bold" style={{ color: C.text }}>Application Timeline</h2>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Application Submitted", date: "June 12, 2025", done: true },
                  { label: "Referred to HBL", date: "June 13, 2025", done: true },
                  { label: "Under Assessment", date: "June 15, 2025", done: true },
                  { label: "Offer Issued", date: "Pending", done: false },
                  { label: "Disbursement", date: "Pending", done: false },
                ].map(({ label, date, done }, i) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="relative flex-shrink-0 mt-0.5">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center"
                        style={{ background: done ? C.green : C.border }}>
                        {done && <CheckCircle2 className="w-3 h-3 text-white" />}
                      </div>
                      {i < 4 && <div className="absolute top-4 left-1.5 w-px h-6"
                        style={{ background: done ? C.green : C.border }} />}
                    </div>
                    <div className="pb-4">
                      <div className="text-xs font-semibold" style={{ color: done ? C.text : C.textMuted }}>{label}</div>
                      <div className="text-xs mt-0.5" style={{ color: C.textMuted, fontFamily: "var(--font-mono)", fontSize: "10px" }}>{date}</div>
                    </div>
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
