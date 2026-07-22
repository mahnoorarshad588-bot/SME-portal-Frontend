import { useNavigate } from "react-router";
import { C } from "../../constants/colors";
import { CheckCircle2, Clock, Circle, ArrowLeft, ArrowRight, Building2 } from "lucide-react";

const STAGES = [
  {
    label: "Application Submitted",
    desc: "Your application has been received and assigned a case ID.",
    done: true, active: false,
  },
  {
    label: "Referred to Bank",
    desc: "Application has been forwarded to HBL SME Finance Division for assessment.",
    done: true, active: false,
  },
  {
    label: "Under Assessment",
    desc: "HBL is conducting credit bureau check, AML screening and due diligence.",
    done: false, active: true,
  },
  {
    label: "Offer Issued",
    desc: "A conditional financing offer will be generated upon successful assessment.",
    done: false, active: false,
  },
  {
    label: "Offer Accepted",
    desc: "Accept the conditional offer to proceed with legal documentation.",
    done: false, active: false,
  },
  {
    label: "Disbursed",
    desc: "Financing amount credited to your nominated bank account.",
    done: false, active: false,
  },
];

export default function ApplicationTracking() {
  const navigate = useNavigate();

  return (
    <div className="px-6 py-6" style={{ fontFamily: "var(--font-display)" }}>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate("/sme")} className="p-2 rounded-xl hover:bg-white border"
          style={{ border: `1.5px solid ${C.border}` }}>
          <ArrowLeft className="w-4 h-4" style={{ color: C.textMuted }} />
        </button>
        <div>
          <h1 className="text-lg font-bold" style={{ color: C.text }}>Application Tracking</h1>
          <p className="text-xs" style={{ color: C.textMuted }}>SME Asaan Finance — ABC Traders</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Timeline */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border overflow-hidden" style={{ background: C.surface, border: `1.5px solid ${C.border}` }}>
            <div className="px-5 py-4 border-b flex items-center justify-between"
              style={{ borderColor: C.border }}>
              <h2 className="text-sm font-semibold" style={{ color: C.text }}>Application Journey</h2>
              <span className="text-xs px-3 py-1 rounded-full font-semibold"
                style={{ background: "#FEF3C7", color: "#D97706" }}>Under Assessment</span>
            </div>
            <div className="p-5">
              {STAGES.map(({ label, desc, done, active }, i) => (
                <div key={label} className="flex gap-4">
                  {/* Icon column */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center`}
                      style={{
                        background: done ? C.green : active ? "#FEF3C7" : C.bg,
                        border: `2px solid ${done ? C.green : active ? "#D97706" : C.border}`,
                      }}>
                      {done
                        ? <CheckCircle2 className="w-4 h-4 text-white" />
                        : active
                        ? <Clock className="w-4 h-4" style={{ color: "#D97706" }} />
                        : <Circle className="w-4 h-4" style={{ color: C.border }} />}
                    </div>
                    {i < STAGES.length - 1 && (
                      <div className="w-0.5 flex-1 my-1 min-h-8"
                        style={{ background: done ? C.green : C.border }} />
                    )}
                  </div>
                  {/* Content */}
                  <div className="pb-6 flex-1 min-w-0">
                    <h3 className="text-sm font-semibold mb-0.5"
                      style={{ color: done || active ? C.text : C.textMuted }}>
                      {label}
                      {active && <span className="ml-2 text-xs px-2 py-0.5 rounded-full"
                        style={{ background: "#FEF3C7", color: "#D97706" }}>In Progress</span>}
                    </h3>
                    <p className="text-xs leading-snug"
                      style={{ color: done || active ? C.textMuted : "#CBD5E1" }}>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Case details */}
        <div className="space-y-4">
          <div className="rounded-2xl border p-5" style={{ background: C.surface, border: `1.5px solid ${C.border}` }}>
            <h2 className="text-sm font-semibold mb-4" style={{ color: C.text }}>Case Summary</h2>
            <div className="space-y-3">
              {[
                { label: "Case ID", value: "SBP-SME-2025-00142", mono: true },
                { label: "Scheme", value: "SME Asaan Finance (SAAF)", mono: false },
                { label: "Amount Requested", value: "PKR 8,500,000", mono: true },
                { label: "Assigned Bank", value: "HBL SME Finance", mono: false },
                { label: "Submission Date", value: "June 12, 2025", mono: false },
                { label: "Current Stage", value: "Under Assessment (3/6)", mono: false },
              ].map(({ label, value, mono }) => (
                <div key={label} className="flex flex-col gap-0.5 pb-2 border-b last:border-0"
                  style={{ borderColor: C.border }}>
                  <span className="text-xs" style={{ color: C.textMuted }}>{label}</span>
                  <span className="text-sm font-semibold"
                    style={{ color: C.text, fontFamily: mono ? "var(--font-mono)" : undefined }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border p-5" style={{ background: C.surface, border: `1.5px solid ${C.border}` }}>
            <h2 className="text-sm font-semibold mb-3" style={{ color: C.text }}>Assigned Bank</h2>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: C.blueLight }}>
                <Building2 className="w-5 h-5" style={{ color: C.blue }} />
              </div>
              <div>
                <div className="text-sm font-bold" style={{ color: C.text }}>HBL</div>
                <div className="text-xs" style={{ color: C.textMuted }}>Habib Bank Limited</div>
              </div>
            </div>
            <div className="text-xs leading-snug" style={{ color: C.textMuted }}>
              SME Finance Division<br />
              I.I. Chundrigar Road, Karachi<br />
              Contact: 021-111-425-888
            </div>
          </div>

          <button onClick={() => navigate("/sme/offer")}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white"
            style={{ background: C.green }}>
            View Offer Letter <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
