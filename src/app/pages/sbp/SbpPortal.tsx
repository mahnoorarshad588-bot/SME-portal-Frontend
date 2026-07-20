import { useState } from "react";
import { useOutletContext } from "react-router";
import { C } from "../../constants/colors";
import {
  FileText, Users, Building2, BarChart2, ShieldCheck, TrendingUp,
  CheckCircle2, XCircle, Banknote, PlusCircle, Edit2, ToggleLeft,
  ToggleRight, Search, Download, Filter, Eye, AlertCircle,
  Clock, ArrowUpRight, ChevronDown, Sparkles, ListChecks,
} from "lucide-react";

type OutletCtx = { activeKey: string };

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

// ── Executive Dashboard ──────────────────────────────────────────────────────
function SbpDashboard() {
  const METRICS = [
    { label: "Total Applications", value: "4,842", icon: FileText, color: C.blue, bg: C.blueLight, delta: "+318 this month" },
    { label: "Referred to Banks", value: "3,901", icon: ArrowUpRight, color: C.green, bg: C.greenLight, delta: "80.6% referral rate" },
    { label: "Offers Issued", value: "2,614", icon: CheckCircle2, color: "#D97706", bg: "#FEF3C7", delta: "67% offer rate" },
    { label: "Accepted Offers", value: "2,189", icon: TrendingUp, color: C.green, bg: C.greenLight, delta: "83.7% acceptance" },
    { label: "Disbursed", value: "1,847", icon: Banknote, color: C.greenDark, bg: C.greenLight, delta: "PKR 340B total" },
    { label: "Conversion Rate", value: "38.1%", icon: BarChart2, color: C.orange, bg: C.orangeLight, delta: "+2.4% vs last yr" },
  ];

  const TOP_BANKS = [
    { name: "HBL", approved: 412, disbursed: 356, rate: "86%" },
    { name: "UBL", approved: 368, disbursed: 299, rate: "81%" },
    { name: "MCB", approved: 287, disbursed: 241, rate: "84%" },
    { name: "Meezan Bank", approved: 243, disbursed: 198, rate: "81%" },
    { name: "NBP", approved: 201, disbursed: 165, rate: "82%" },
  ];

  return (
    <div className="px-6 py-6" style={{ fontFamily: "'Manrope', sans-serif" }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-4 h-4" style={{ color: C.orange }} />
            <span className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: C.textMuted, fontFamily: "var(--font-mono)" }}>
              FY 2024–25 Cumulative
            </span>
          </div>
          <h1 className="text-2xl font-black leading-tight" style={{ color: C.text, letterSpacing: "-0.02em" }}>Executive Dashboard</h1>
        </div>
        <div className="flex gap-2">
          <select className="text-xs px-3 py-2 rounded-xl border outline-none font-medium"
            style={{ border: `1.5px solid ${C.border}`, color: C.text, background: C.surface }}>
            <option>All Banks</option>
            <option>HBL</option>
            <option>UBL</option>
            <option>MCB</option>
          </select>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all hover:bg-gray-50"
            style={{ border: `1.5px solid ${C.border}`, color: C.text }}>
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
      </div>

      {/* Metric cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {METRICS.map(({ label, value, icon: Icon, color, delta }) => (
          <GradientCard key={label} accent={color}>
            <div className="p-4 rounded-2xl transition-all duration-200 hover:-translate-y-0.5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ background: color + "18" }}>
                <Icon className="w-4 h-4" style={{ color }} />
              </div>
              <div className="text-2xl font-black mb-0.5" style={{ color: C.text, fontFamily: "var(--font-mono)", letterSpacing: "-0.02em" }}>{value}</div>
              <div className="text-xs font-medium mb-1" style={{ color: C.textMuted }}>{label}</div>
              <div className="text-xs font-bold" style={{ color }}>{delta}</div>
            </div>
          </GradientCard>
        ))}
      </div>

      {/* Bank performance table */}
      <GradientCard accent={C.orange}>
        <div className="rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: C.border }}>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: C.orangeLight }}>
                <ListChecks className="w-3.5 h-3.5" style={{ color: C.orange }} />
              </div>
              <h2 className="text-sm font-bold" style={{ color: C.text }}>Bank Performance Overview</h2>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full font-bold"
              style={{ background: C.orangeLight, color: C.orange, fontFamily: "var(--font-mono)" }}>Top 5 Banks</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: C.bg }}>
                  {["Bank", "Applications Reviewed", "Approved", "Disbursed", "Disbursement Rate", ""].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide"
                      style={{ color: C.textMuted, fontFamily: "var(--font-mono)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {TOP_BANKS.map(b => (
                  <tr key={b.name} className="border-t hover:bg-gray-50 transition-colors" style={{ borderColor: C.border }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-white"
                          style={{ background: C.orange }}>
                          {b.name[0]}
                        </div>
                        <span className="text-sm font-bold" style={{ color: C.text }}>{b.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm" style={{ color: C.text, fontFamily: "var(--font-mono)" }}>{b.approved + b.disbursed}</td>
                    <td className="px-4 py-3 text-sm font-bold" style={{ color: C.green, fontFamily: "var(--font-mono)" }}>{b.approved}</td>
                    <td className="px-4 py-3 text-sm font-bold" style={{ color: C.greenDark, fontFamily: "var(--font-mono)" }}>{b.disbursed}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 rounded-full" style={{ background: C.border }}>
                          <div className="h-1.5 rounded-full" style={{ width: b.rate, background: C.green }} />
                        </div>
                        <span className="text-xs font-bold" style={{ color: C.green, fontFamily: "var(--font-mono)" }}>{b.rate}</span>
                      </div>
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

// ── Bank Management ──────────────────────────────────────────────────────────
function BankManagement() {
  const BANKS = [
    { name: "Habib Bank Limited", code: "HBL", type: "Commercial", region: "Nationwide", active: true, joined: "Jan 2023" },
    { name: "United Bank Limited", code: "UBL", type: "Commercial", region: "Nationwide", active: true, joined: "Jan 2023" },
    { name: "MCB Bank Limited", code: "MCB", type: "Commercial", region: "Nationwide", active: true, joined: "Feb 2023" },
    { name: "Meezan Bank", code: "MEEZ", type: "Islamic", region: "Nationwide", active: true, joined: "Mar 2023" },
    { name: "Bank Alfalah", code: "BAFL", type: "Commercial", region: "Nationwide", active: true, joined: "Apr 2023" },
    { name: "Faysal Bank", code: "FABL", type: "Islamic", region: "Nationwide", active: false, joined: "Jun 2023" },
  ];

  return (
    <div className="px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold" style={{ color: C.text }}>Bank Management</h1>
          <p className="text-sm mt-0.5" style={{ color: C.textMuted }}>Manage participating banks on the portal</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: C.orange }}>
          <PlusCircle className="w-4 h-4" /> Add Bank
        </button>
      </div>

      <div className="rounded-2xl border overflow-hidden" style={{ background: C.surface, border: `1.5px solid ${C.border}` }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: C.bg }}>
              {["Bank Name", "Code", "Type", "Coverage", "Status", "Joined", "Actions"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                  style={{ color: C.textMuted, fontFamily: "var(--font-mono)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {BANKS.map(bank => (
              <tr key={bank.code} className="border-t hover:bg-gray-50" style={{ borderColor: C.border }}>
                <td className="px-4 py-3 font-semibold text-sm" style={{ color: C.text }}>{bank.name}</td>
                <td className="px-4 py-3 text-xs font-bold" style={{ color: C.textMuted, fontFamily: "var(--font-mono)" }}>{bank.code}</td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{
                      background: bank.type === "Islamic" ? C.orangeLight : C.blueLight,
                      color: bank.type === "Islamic" ? C.orange : C.blue,
                    }}>{bank.type}</span>
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: C.textMuted }}>{bank.region}</td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold"
                    style={{
                      background: bank.active ? C.greenLight : "#FEE2E2",
                      color: bank.active ? C.green : "#DC2626",
                    }}>{bank.active ? "Active" : "Inactive"}</span>
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: C.textMuted }}>{bank.joined}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    <button className="p-1.5 rounded-lg hover:bg-gray-100" style={{ color: C.textMuted }}>
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 rounded-lg hover:bg-gray-100"
                      style={{ color: bank.active ? "#DC2626" : C.green }}>
                      {bank.active ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── User Management ──────────────────────────────────────────────────────────
function UserManagement() {
  const [tab, setTab] = useState<"applicants" | "bank_users">("applicants");

  const APPLICANTS = [
    { name: "Ahmed Khan", email: "ahmed@abctraders.com", businesses: 2, applications: 4, joined: "Mar 2025", status: "active" },
    { name: "Fatima Malik", email: "fatima@xyzfoods.pk", businesses: 1, applications: 2, joined: "Apr 2025", status: "active" },
    { name: "Usman Raza", email: "usman@greenfields.com", businesses: 3, applications: 6, joined: "May 2025", status: "suspended" },
    { name: "Ayesha Siddiqui", email: "ayesha@fashionhub.pk", businesses: 1, applications: 1, joined: "Jun 2025", status: "active" },
  ];

  const BANK_USERS = [
    { name: "Bilal Raza", email: "bilal.raza@hbl.com", bank: "HBL", role: "Credit Officer", status: "active" },
    { name: "Sana Iqbal", email: "sana.iqbal@ubl.com", bank: "UBL", role: "Branch Manager", status: "active" },
    { name: "Kamran Ali", email: "kamran.ali@mcb.com", bank: "MCB", role: "SME Relationship", status: "inactive" },
  ];

  return (
    <div className="px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold" style={{ color: C.text }}>User Management</h1>
          <p className="text-sm mt-0.5" style={{ color: C.textMuted }}>Manage applicants, bank users, roles and permissions</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: C.orange }}>
          <PlusCircle className="w-4 h-4" /> Add User
        </button>
      </div>

      <div className="flex gap-1 mb-5 border-b" style={{ borderColor: C.border }}>
        {(["applicants", "bank_users"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="px-4 py-2 text-sm font-medium transition-all border-b-2 -mb-px"
            style={{
              borderColor: tab === t ? C.orange : "transparent",
              color: tab === t ? C.orange : C.textMuted,
            }}>
            {t === "applicants" ? "SME Applicants" : "Bank Users"}
          </button>
        ))}
      </div>

      {tab === "applicants" && (
        <div className="rounded-2xl border overflow-hidden" style={{ background: C.surface, border: `1.5px solid ${C.border}` }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: C.bg }}>
                {["Name", "Email", "Businesses", "Applications", "Joined", "Status", ""].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                    style={{ color: C.textMuted, fontFamily: "var(--font-mono)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {APPLICANTS.map(u => (
                <tr key={u.email} className="border-t hover:bg-gray-50" style={{ borderColor: C.border }}>
                  <td className="px-4 py-3 font-semibold text-sm" style={{ color: C.text }}>{u.name}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: C.textMuted }}>{u.email}</td>
                  <td className="px-4 py-3 text-sm font-mono text-center" style={{ color: C.text }}>{u.businesses}</td>
                  <td className="px-4 py-3 text-sm font-mono text-center" style={{ color: C.text }}>{u.applications}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: C.textMuted }}>{u.joined}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold"
                      style={{
                        background: u.status === "active" ? C.greenLight : "#FEE2E2",
                        color: u.status === "active" ? C.green : "#DC2626",
                      }}>{u.status === "active" ? "Active" : "Suspended"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="p-1 rounded hover:bg-gray-100" style={{ color: C.textMuted }}>
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "bank_users" && (
        <div className="rounded-2xl border overflow-hidden" style={{ background: C.surface, border: `1.5px solid ${C.border}` }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: C.bg }}>
                {["Name", "Email", "Bank", "Role", "Status", ""].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                    style={{ color: C.textMuted, fontFamily: "var(--font-mono)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BANK_USERS.map(u => (
                <tr key={u.email} className="border-t hover:bg-gray-50" style={{ borderColor: C.border }}>
                  <td className="px-4 py-3 font-semibold text-sm" style={{ color: C.text }}>{u.name}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: C.textMuted }}>{u.email}</td>
                  <td className="px-4 py-3 text-xs font-semibold" style={{ color: C.blue }}>{u.bank}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: C.textMuted }}>{u.role}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold"
                      style={{
                        background: u.status === "active" ? C.greenLight : "#FEE2E2",
                        color: u.status === "active" ? C.green : "#DC2626",
                      }}>{u.status === "active" ? "Active" : "Inactive"}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="p-1 rounded hover:bg-gray-100" style={{ color: C.textMuted }}>
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Reports ──────────────────────────────────────────────────────────────────
function Reports() {
  const REPORTS = [
    { name: "Application Status Report", desc: "Summary of all applications by status and bank", updated: "Jul 15, 2025", type: "PDF" },
    { name: "Turnaround Time Report", desc: "Processing time per bank and application stage", updated: "Jul 15, 2025", type: "Excel" },
    { name: "Assessment Report", desc: "Credit assessment outcomes and risk distribution", updated: "Jul 14, 2025", type: "PDF" },
    { name: "Decline Analysis Report", desc: "Reasons for rejection by sector and bank", updated: "Jul 14, 2025", type: "Excel" },
    { name: "Disbursement Summary Report", desc: "Total disbursements by bank, region and scheme", updated: "Jul 13, 2025", type: "PDF" },
    { name: "Geographic Spread Report", desc: "Application and disbursement distribution by province and city", updated: "Jul 12, 2025", type: "PDF" },
  ];

  return (
    <div className="px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold" style={{ color: C.text }}>Reports</h1>
          <p className="text-sm mt-0.5" style={{ color: C.textMuted }}>Download and schedule system reports</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: C.orange }}>
          <BarChart2 className="w-4 h-4" /> Generate Custom Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {REPORTS.map(r => (
          <div key={r.name} className="rounded-2xl border p-5 flex flex-col gap-3"
            style={{ background: C.surface, border: `1.5px solid ${C.border}` }}>
            <div className="flex items-start justify-between gap-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: C.orangeLight }}>
                <BarChart2 className="w-4 h-4" style={{ color: C.orange }} />
              </div>
              <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                style={{ background: r.type === "PDF" ? "#FEE2E2" : C.blueLight, color: r.type === "PDF" ? "#DC2626" : C.blue, fontFamily: "var(--font-mono)" }}>
                {r.type}
              </span>
            </div>
            <div>
              <h3 className="text-sm font-bold mb-1" style={{ color: C.text }}>{r.name}</h3>
              <p className="text-xs leading-snug" style={{ color: C.textMuted }}>{r.desc}</p>
            </div>
            <div className="flex items-center justify-between mt-auto pt-2 border-t" style={{ borderColor: C.border }}>
              <span className="text-xs" style={{ color: C.textMuted }}>Updated {r.updated}</span>
              <button className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: C.orange }}>
                <Download className="w-3.5 h-3.5" /> Download
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Audit Trail ──────────────────────────────────────────────────────────────
function AuditTrail() {
  const LOGS = [
    { user: "Bilal Raza (HBL)", action: "Application SBP-SME-2025-00142 opened for review", time: "Jul 16, 2025 09:15", ip: "192.168.1.12", type: "view" },
    { user: "System", action: "Credit bureau check initiated for SBP-SME-2025-00142", time: "Jul 16, 2025 09:46", ip: "10.0.0.1", type: "action" },
    { user: "Sana Iqbal (UBL)", action: "Conditional offer generated for SBP-SME-2025-00139", time: "Jul 15, 2025 14:30", ip: "192.168.2.5", type: "action" },
    { user: "Ahmed Khan", action: "Login — SME Applicant Portal", time: "Jul 15, 2025 11:02", ip: "203.129.45.12", type: "auth" },
    { user: "Dr. Amjad Hussain (SBP)", action: "Exported disbursement summary report", time: "Jul 15, 2025 10:30", ip: "10.0.1.5", type: "export" },
    { user: "System", action: "Bank deactivation: Faysal Bank — admin action", time: "Jul 14, 2025 16:00", ip: "10.0.0.1", type: "admin" },
    { user: "Fatima Malik", action: "New application submitted SBP-SME-2025-00201", time: "Jul 14, 2025 15:22", ip: "110.93.210.44", type: "submit" },
    { user: "Kamran Ali (MCB)", action: "Failed login attempt — account locked", time: "Jul 14, 2025 09:05", ip: "192.168.3.8", type: "error" },
  ];

  const typeColor: Record<string, { color: string; bg: string }> = {
    view: { color: C.blue, bg: C.blueLight },
    action: { color: C.green, bg: C.greenLight },
    auth: { color: C.textMuted, bg: "#F3F4F6" },
    export: { color: C.orange, bg: C.orangeLight },
    admin: { color: "#D97706", bg: "#FEF3C7" },
    submit: { color: C.green, bg: C.greenLight },
    error: { color: "#DC2626", bg: "#FEE2E2" },
  };

  return (
    <div className="px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold" style={{ color: C.text }}>Audit Trail</h1>
          <p className="text-sm mt-0.5" style={{ color: C.textMuted }}>Immutable system activity log — all actions tracked</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border"
            style={{ border: `1.5px solid ${C.border}`, color: C.text }}>
            <Filter className="w-3.5 h-3.5" /> Filter
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border"
            style={{ border: `1.5px solid ${C.border}`, color: C.text }}>
            <Download className="w-3.5 h-3.5" /> Export
          </button>
        </div>
      </div>

      <div className="rounded-2xl border overflow-hidden" style={{ background: C.surface, border: `1.5px solid ${C.border}` }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: C.bg }}>
              {["Timestamp", "User", "Activity", "IP Address", "Type", ""].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                  style={{ color: C.textMuted, fontFamily: "var(--font-mono)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {LOGS.map((log, i) => {
              const tc = typeColor[log.type] ?? typeColor.view;
              return (
                <tr key={i} className="border-t hover:bg-gray-50" style={{ borderColor: C.border }}>
                  <td className="px-4 py-3 text-xs" style={{ color: C.textMuted, fontFamily: "var(--font-mono)" }}>{log.time}</td>
                  <td className="px-4 py-3 text-xs font-semibold" style={{ color: C.text }}>{log.user}</td>
                  <td className="px-4 py-3 text-xs max-w-xs" style={{ color: C.textMuted }}>{log.action}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: C.textMuted, fontFamily: "var(--font-mono)" }}>{log.ip}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold capitalize"
                      style={{ background: tc.bg, color: tc.color }}>{log.type}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="p-1 rounded hover:bg-gray-100" style={{ color: C.textMuted }}>
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
  );
}

// ── Applications view ────────────────────────────────────────────────────────
function AllApplications() {
  const APPS = [
    { caseId: "SBP-SME-2025-00217", business: "Green Logistics", bank: "HBL", scheme: "SAAF", amount: "PKR 9M", status: "submitted", date: "Jul 16" },
    { caseId: "SBP-SME-2025-00201", business: "Fatima Textiles", bank: "UBL", scheme: "Refinance", amount: "PKR 14M", status: "under_review", date: "Jul 14" },
    { caseId: "SBP-SME-2025-00183", business: "XYZ Foods", bank: "—", scheme: "SAAF", amount: "PKR 5M", status: "pending", date: "Jul 10" },
    { caseId: "SBP-SME-2025-00142", business: "ABC Traders", bank: "HBL", scheme: "SAAF", amount: "PKR 8.5M", status: "under_review", date: "Jun 12" },
    { caseId: "SBP-SME-2025-00098", business: "XYZ Foods", bank: "MCB", scheme: "Refinance", amount: "PKR 15M", status: "approved", date: "May 28" },
  ];

  const S: Record<string, { label: string; color: string; bg: string }> = {
    pending: { label: "New", color: C.textMuted, bg: "#F3F4F6" },
    submitted: { label: "Submitted", color: C.blue, bg: C.blueLight },
    under_review: { label: "Under Review", color: "#D97706", bg: "#FEF3C7" },
    approved: { label: "Approved", color: C.green, bg: C.greenLight },
  };

  return (
    <div className="px-6 py-6">
      <h1 className="text-xl font-bold mb-1" style={{ color: C.text }}>All Applications</h1>
      <p className="text-sm mb-5" style={{ color: C.textMuted }}>System-wide view of all financing applications</p>

      <div className="rounded-2xl border overflow-hidden" style={{ background: C.surface, border: `1.5px solid ${C.border}` }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: C.bg }}>
              {["Case ID", "Business", "Assigned Bank", "Scheme", "Amount", "Date", "Status"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                  style={{ color: C.textMuted, fontFamily: "var(--font-mono)" }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {APPS.map(a => {
              const s = S[a.status] ?? S.pending;
              return (
                <tr key={a.caseId} className="border-t hover:bg-gray-50 cursor-pointer" style={{ borderColor: C.border }}>
                  <td className="px-4 py-3 text-xs font-mono" style={{ color: C.text, fontFamily: "var(--font-mono)" }}>{a.caseId}</td>
                  <td className="px-4 py-3 text-xs font-semibold" style={{ color: C.text }}>{a.business}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: C.textMuted }}>{a.bank}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: C.textMuted }}>{a.scheme}</td>
                  <td className="px-4 py-3 text-xs font-semibold" style={{ color: C.text, fontFamily: "var(--font-mono)" }}>{a.amount}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: C.textMuted }}>{a.date}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold"
                      style={{ background: s.bg, color: s.color }}>{s.label}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Main export ──────────────────────────────────────────────────────────────
export default function SbpPortal() {
  const { activeKey } = useOutletContext<OutletCtx>();

  switch (activeKey) {
    case "applications": return <AllApplications />;
    case "users": return <UserManagement />;
    case "banks": return <BankManagement />;
    case "reports": return <Reports />;
    case "audit": return <AuditTrail />;
    default: return <SbpDashboard />;
  }
}
