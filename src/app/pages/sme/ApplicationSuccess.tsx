import { useNavigate } from "react-router";
import { C } from "../../constants/colors";
import { CheckCircle2, ArrowRight, Copy, FileText, MapPin } from "lucide-react";

export default function ApplicationSuccess() {
  const navigate = useNavigate();

  const details = [
    { label: "Case ID", value: "SBP-SME-2025-00217", mono: true },
    { label: "Submission Date", value: "July 16, 2025  ·  11:42 AM", mono: false },
    { label: "Assigned Bank", value: "HBL — SME Finance Division", mono: false },
    { label: "Status", value: "Submitted · Under Processing", mono: false },
  ];

  return (
    <div className="min-h-full flex items-center justify-center px-6 py-12" style={{ background: C.bg }}>
      <div className="w-full max-w-lg text-center">
        {/* Success icon */}
        <div className="relative inline-flex mb-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center"
            style={{ background: C.greenLight }}>
            <CheckCircle2 className="w-10 h-10" style={{ color: C.green }} />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ background: C.green }}>✓</div>
        </div>

        <h1 className="text-2xl font-extrabold mb-2" style={{ color: C.text }}>
          Application Submitted!
        </h1>
        <p className="text-sm mb-8" style={{ color: C.textMuted }}>
          Your SME financing application has been successfully submitted. The assigned bank will begin
          assessment within 2–3 business days.
        </p>

        {/* Detail card */}
        <div className="rounded-2xl border text-left overflow-hidden mb-6"
          style={{ background: C.surface, border: `1.5px solid ${C.border}` }}>
          <div className="px-5 py-3 border-b flex items-center justify-between"
            style={{ borderColor: C.border, background: C.greenLight }}>
            <span className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: C.green, fontFamily: "var(--font-mono)" }}>Application Reference</span>
            <button className="flex items-center gap-1 text-xs" style={{ color: C.green }}>
              <Copy className="w-3.5 h-3.5" /> Copy
            </button>
          </div>
          <div className="p-5 space-y-3">
            {details.map(({ label, value, mono }) => (
              <div key={label} className="flex items-center justify-between py-1 border-b last:border-0"
                style={{ borderColor: C.border }}>
                <span className="text-xs" style={{ color: C.textMuted }}>{label}</span>
                <span className="text-sm font-semibold"
                  style={{ color: C.text, fontFamily: mono ? "var(--font-mono)" : undefined }}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* What's next */}
        <div className="rounded-2xl border p-5 text-left mb-6"
          style={{ background: C.surface, border: `1.5px solid ${C.border}` }}>
          <h3 className="text-sm font-bold mb-3" style={{ color: C.text }}>What happens next?</h3>
          {[
            { step: "1", text: "HBL will review your application and documents (2–3 days)" },
            { step: "2", text: "Credit assessment and verification will be conducted" },
            { step: "3", text: "You will receive a notification once an offer is issued" },
            { step: "4", text: "Accept the offer and complete legal documentation" },
          ].map(({ step, text }) => (
            <div key={step} className="flex items-start gap-3 mb-2 last:mb-0">
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold text-white"
                style={{ background: C.green }}>{step}</div>
              <p className="text-xs leading-snug" style={{ color: C.textMuted }}>{text}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <button onClick={() => navigate("/sme/tracking")}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border transition-all hover:bg-gray-50"
            style={{ border: `1.5px solid ${C.border}`, color: C.text }}>
            <MapPin className="w-4 h-4" /> Track Application
          </button>
          <button onClick={() => navigate("/sme")}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
            style={{ background: C.green }}>
            Back to Dashboard <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
