import { useNavigate } from "react-router";
import { useApp } from "../../context/AppContext";
import { C } from "../../constants/colors";
import { Building2, PlusCircle, CheckCircle2, MapPin, Hash } from "lucide-react";

export default function MyBusinesses() {
  const navigate = useNavigate();
  const { businesses, selectedBusiness, setSelectedBusiness } = useApp();

  return (
    <div className="px-6 py-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold" style={{ color: C.text }}>My Businesses</h1>
          <p className="text-sm mt-0.5" style={{ color: C.textMuted }}>
            Manage the business profiles linked to your account
          </p>
        </div>
        <button
          onClick={() => navigate("/sme/setup")}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
          style={{ background: C.green }}>
          <PlusCircle className="w-4 h-4" /> Add Business
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {businesses.map(biz => {
          const active = selectedBusiness?.id === biz.id;
          return (
            <button key={biz.id}
              onClick={() => setSelectedBusiness(biz)}
              className="text-left rounded-2xl border p-5 transition-all hover:shadow-md"
              style={{
                background: C.surface,
                border: `1.5px solid ${active ? C.green : C.border}`,
                boxShadow: active ? `0 0 0 3px ${C.green}18` : undefined,
              }}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: C.greenLight }}>
                  <Building2 className="w-5 h-5" style={{ color: C.green }} />
                </div>
                {active && (
                  <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: C.greenLight, color: C.green }}>
                    <CheckCircle2 className="w-3 h-3" /> Active
                  </span>
                )}
              </div>

              <h2 className="text-base font-bold mb-0.5" style={{ color: C.text }}>{biz.name}</h2>
              <p className="text-xs mb-3" style={{ color: C.textMuted }}>{biz.nature}</p>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs" style={{ color: C.textMuted }}>
                  <Hash className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>NTN: {biz.ntn || "—"}</span>
                </div>
                <div className="flex items-start gap-2 text-xs" style={{ color: C.textMuted }}>
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  <span className="leading-snug">{biz.address || "—"}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t flex items-center justify-between" style={{ borderColor: C.border }}>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: C.greenLight, color: C.green }}>{biz.status}</span>
                {!active && (
                  <span className="text-xs font-medium" style={{ color: C.green }}>Select →</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {businesses.length === 0 && (
        <div className="rounded-2xl border p-10 text-center" style={{ background: C.surface, border: `1.5px solid ${C.border}` }}>
          <Building2 className="w-10 h-10 mx-auto mb-3 opacity-30" style={{ color: C.textMuted }} />
          <p className="text-sm" style={{ color: C.textMuted }}>No businesses added yet.</p>
        </div>
      )}
    </div>
  );
}
