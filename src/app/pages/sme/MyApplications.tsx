import { useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../../context/AppContext";
import { C } from "../../constants/colors";
import { PlusCircle, Eye, Search } from "lucide-react";

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

export default function MyApplications() {
  const navigate = useNavigate();
  const { applications } = useApp();
  const [searchQ, setSearchQ] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = applications.filter(app => {
    const matchesSearch =
      app.businessName.toLowerCase().includes(searchQ.toLowerCase()) ||
      app.caseId.toLowerCase().includes(searchQ.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="px-6 py-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold" style={{ color: C.text }}>My Applications</h1>
          <p className="text-sm mt-0.5" style={{ color: C.textMuted }}>
            Track and manage all your financing applications
          </p>
        </div>
        <button
          onClick={() => navigate("/sme/apply")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ background: C.green }}>
          <PlusCircle className="w-4 h-4" /> New Application
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: C.textMuted }} />
          <input value={searchQ} onChange={e => setSearchQ(e.target.value)}
            placeholder="Search by case ID or business..."
            className="w-full rounded-xl border text-sm outline-none"
            style={{ padding: "10px 14px 10px 38px", border: `1.5px solid ${C.border}`, background: C.surface, color: C.text }} />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {["all", "draft", "submitted", "under_review", "approved", "rejected", "disbursed"].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className="px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all"
              style={{
                background: statusFilter === s ? C.green : C.surface,
                color: statusFilter === s ? "white" : C.textMuted,
                border: `1.5px solid ${statusFilter === s ? C.green : C.border}`,
              }}>
              {s === "all" ? "All" : STATUS_CONFIG[s as keyof typeof STATUS_CONFIG].label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border overflow-hidden" style={{ background: C.surface, border: `1.5px solid ${C.border}` }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: C.bg }}>
                {["Case ID", "Business", "Scheme", "Amount", "Bank", "Submitted", "Status", ""].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide"
                    style={{ color: C.textMuted, fontFamily: "var(--font-mono)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(app => (
                <tr key={app.id}
                  className="border-t transition-colors hover:bg-gray-50 cursor-pointer"
                  style={{ borderColor: C.border }}
                  onClick={() => navigate("/sme/tracking")}>
                  <td className="px-4 py-3">
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: C.text }}>{app.caseId}</span>
                  </td>
                  <td className="px-4 py-3 text-xs font-medium" style={{ color: C.text }}>{app.businessName}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: C.textMuted }}>{app.scheme}</td>
                  <td className="px-4 py-3 text-xs font-semibold" style={{ color: C.text, fontFamily: "var(--font-mono)" }}>{app.amount}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: C.textMuted }}>{app.bank}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: C.textMuted }}>{app.submittedDate}</td>
                  <td className="px-4 py-3"><StatusBadge status={app.status} /></td>
                  <td className="px-4 py-3">
                    <button className="p-1 rounded-lg hover:bg-gray-100" style={{ color: C.textMuted }}>
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="p-10 text-center">
            <p className="text-sm" style={{ color: C.textMuted }}>No applications match your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
