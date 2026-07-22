import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../../context/AppContext";
import { C } from "../../constants/colors";
import {
  CheckCircle2, ArrowLeft, ArrowRight, Upload,
  Banknote, FileUp, ClipboardList, ChevronDown, Building2, Plus, Trash2,
} from "lucide-react";

const ALL_STEPS = [
  { key: "financing", label: "Financing", icon: Banknote },
  { key: "documents", label: "Documents", icon: FileUp },
  { key: "review", label: "Review", icon: ClipboardList },
];

function Field({ label, placeholder, value, readOnly = false, type = "text" }: {
  label: string; placeholder: string; value?: string; readOnly?: boolean; type?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: C.text }}>
        {label}
      </label>
      <input
        type={type} placeholder={placeholder} readOnly={readOnly}
        {...(readOnly ? { value: value ?? "" } : { defaultValue: value })}
        className="w-full rounded-xl border text-sm outline-none"
        style={{
          padding: "11px 14px",
          background: readOnly ? C.greenLight : C.surface,
          border: `1.5px solid ${readOnly ? C.green + "40" : C.border}`,
          color: readOnly ? C.greenDark : C.text,
        }} />
    </div>
  );
}

interface DocItem { label: string; file: File | null; fileUrl: string | null; required: boolean; }
interface Facility { type: string; amount: string; collateralType: string; collateralValue: string; }

const FACILITY_TYPE_OPTIONS = [
  "Financing for Asset Purchase", "Term Finance", "Running Finance", "Over Draft", "Working Capital",
];

const PROPRIETORSHIP_DOCS = [
  "CNIC of Owner",
  "Financial Statement(s)/ Projected Financial(s)",
  "Feasibility Report",
];
const PARTNERSHIP_DOCS = [
  "CNIC of Borrower(s)",
  "Memorandum & Articles of Association",
  "Financial Statement(s)/Projected Financial(s)",
  "Feasibility Report",
];

export default function NewApplication() {
  const navigate = useNavigate();
  const { businesses, selectedBusiness, setSelectedBusiness, addApplication } = useApp();
  const [step, setStep] = useState(0);
  const [facilities, setFacilities] = useState<Facility[]>([
    { type: FACILITY_TYPE_OPTIONS[0], amount: "", collateralType: "", collateralValue: "" },
  ]);
  const STEPS = ALL_STEPS;
  const businessStatus = selectedBusiness?.businessStatus ?? "Proprietorship";
  const requiredDocLabels = businessStatus === "Proprietorship" ? PROPRIETORSHIP_DOCS : PARTNERSHIP_DOCS;
  const [docs, setDocs] = useState<DocItem[]>(
    requiredDocLabels.map(label => ({ label, file: null, fileUrl: null, required: true }))
  );

  useEffect(() => {
    setDocs(requiredDocLabels.map(label => ({ label, file: null, fileUrl: null, required: true })));
  }, [businessStatus]);

  const addFacility = () =>
    setFacilities(f => [...f, { type: FACILITY_TYPE_OPTIONS[0], amount: "", collateralType: "", collateralValue: "" }]);
  const removeFacility = (i: number) =>
    setFacilities(f => f.filter((_, idx) => idx !== i));
  const updateFacility = (i: number, key: keyof Facility) => (v: string) =>
    setFacilities(prev => prev.map((row, idx) => idx === i ? { ...row, [key]: v } : row));

  const totalFacilityAmount = facilities.reduce((sum, f) => sum + (parseFloat(f.amount.replace(/,/g, "")) || 0), 0);

  const handleDocUpload = (i: number, file: File) => {
    setDocs(prev => prev.map((d, idx) => idx === i ? { ...d, file, fileUrl: URL.createObjectURL(file) } : d));
  };

  const ReviewRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex items-start py-2 border-b" style={{ borderColor: C.border }}>
      <span className="w-40 flex-shrink-0 text-xs font-medium" style={{ color: C.textMuted }}>{label}</span>
      <span className="text-sm flex-1" style={{ color: C.text }}>{value}</span>
    </div>
  );

  return (
    <div className="px-6 py-6" style={{ fontFamily: "var(--font-display)" }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate("/sme")} className="p-2 rounded-xl hover:bg-white border"
          style={{ border: `1.5px solid ${C.border}` }}>
          <ArrowLeft className="w-4 h-4" style={{ color: C.textMuted }} />
        </button>
        <div>
          <h1 className="text-lg font-bold" style={{ color: C.text }}>New Financing Application</h1>
          <p className="text-xs" style={{ color: C.textMuted }}>{selectedBusiness?.name}</p>
        </div>
      </div>

      {/* Select Business — choosing one auto-fills all business details, no form needed */}
      <div className="max-w-2xl rounded-2xl border p-5 mb-6" style={{ background: C.surface, border: `1.5px solid ${C.border}` }}>
        <label className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: C.text }}>
          <Building2 className="w-4 h-4" style={{ color: C.green }} />
          Applying For
        </label>
        <div className="relative">
          <select
            value={selectedBusiness?.id ?? ""}
            onChange={e => {
              const biz = businesses.find(b => b.id === e.target.value);
              if (biz) setSelectedBusiness(biz);
            }}
            className="w-full rounded-xl border text-sm outline-none appearance-none font-medium"
            style={{ padding: "12px 40px 12px 14px", background: C.greenLight, border: `1.5px solid ${C.green}40`, color: C.greenDark }}>
            {businesses.length === 0 && <option value="">No businesses found</option>}
            {businesses.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: C.green }} />
        </div>
        {selectedBusiness && (
          <p className="text-xs mt-2" style={{ color: C.textMuted }}>
            {selectedBusiness.nature} · NTN {selectedBusiness.ntn} · {selectedBusiness.address}
          </p>
        )}
      </div>

      {/* Stepper */}
      <div className="relative flex items-center mb-8 overflow-x-auto">
        {STEPS.map(({ label, icon: Icon }, i) => (
          <div key={label} className="flex items-center flex-shrink-0">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all`}
                style={{
                  background: i < step ? C.green : i === step ? C.green : C.surface,
                  borderColor: i <= step ? C.green : C.border,
                  color: i <= step ? "white" : C.textMuted,
                }}>
                {i < step ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
              </div>
              <span className="text-xs font-medium whitespace-nowrap hidden sm:block"
                style={{ color: i === step ? C.green : i < step ? C.greenDark : C.textMuted }}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="w-12 md:w-16 h-0.5 mx-1 flex-shrink-0"
                style={{ background: i < step ? C.green : C.border }} />
            )}
          </div>
        ))}
      </div>

      {/* Form card */}
      <div className="max-w-2xl rounded-2xl border p-6" style={{ background: C.surface, border: `1.5px solid ${C.border}` }}>

        {/* Step 1: Financing Requirement */}
        {STEPS[step]?.key === "financing" && (
          <div>
            <h2 className="text-base font-bold mb-1" style={{ color: C.text }}>Financing Requirement</h2>

            <div className="flex items-center justify-between mb-1.5 mt-4">
              <label className="text-sm font-medium" style={{ color: C.text }}>Facility(ies) Requested</label>
              <button onClick={addFacility}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all hover:bg-gray-50"
                style={{ border: `1.5px solid ${C.green}`, color: C.green }}>
                <Plus className="w-3.5 h-3.5" /> Add Facility
              </button>
            </div>
            <p className="text-xs mb-3" style={{ color: C.textMuted }}>
              e.g. Financing for Asset Purchase, Term Finance, Running Finance, Over Draft, Working Capital etc.
            </p>

            <div className="space-y-4">
              {facilities.map((f, i) => (
                <div key={i} className="p-4 rounded-xl border"
                  style={{ border: `1.5px solid ${C.border}`, background: C.bg }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold" style={{ color: C.textMuted }}>FACILITY {i + 1}</span>
                    {facilities.length > 1 && (
                      <button onClick={() => removeFacility(i)} style={{ color: "#DC2626" }}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: C.text }}>Type of Facility</label>
                      <div className="relative">
                        <select value={f.type} onChange={e => updateFacility(i, "type")(e.target.value)}
                          className="w-full rounded-xl border text-sm outline-none appearance-none"
                          style={{ padding: "11px 36px 11px 14px", background: C.surface, border: `1.5px solid ${C.border}`, color: C.text }}>
                          {FACILITY_TYPE_OPTIONS.map(t => <option key={t}>{t}</option>)}
                        </select>
                        <ChevronDown className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                          style={{ color: C.textMuted }} />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: C.text }}>Amount (Rs.)</label>
                      <input type="text" placeholder="e.g. 2,000,000" value={f.amount}
                        onChange={e => updateFacility(i, "amount")(e.target.value)}
                        className="w-full rounded-xl border text-sm outline-none"
                        style={{ padding: "11px 14px", background: C.surface, border: `1.5px solid ${C.border}`, color: C.text }} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: C.text }}>Collateral Type</label>
                      <input type="text" placeholder="e.g. Land, Vehicle, Cash, Bond" value={f.collateralType}
                        onChange={e => updateFacility(i, "collateralType")(e.target.value)}
                        className="w-full rounded-xl border text-sm outline-none"
                        style={{ padding: "11px 14px", background: C.surface, border: `1.5px solid ${C.border}`, color: C.text }} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: C.text }}>Collateral Value (Rs.)</label>
                      <input type="text" placeholder="e.g. 3,000,000" value={f.collateralValue}
                        onChange={e => updateFacility(i, "collateralValue")(e.target.value)}
                        className="w-full rounded-xl border text-sm outline-none"
                        style={{ padding: "11px 14px", background: C.surface, border: `1.5px solid ${C.border}`, color: C.text }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Documents */}
        {STEPS[step]?.key === "documents" && (
          <div>
            <h2 className="text-base font-bold mb-4" style={{ color: C.text }}>Document Upload</h2>
            <div className="border-2 border-dashed rounded-xl p-6 text-center mb-5 transition-all hover:border-green-400 cursor-pointer"
              style={{ borderColor: C.border, background: C.bg }}>
              <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: C.textMuted }} />
              <p className="text-sm font-medium" style={{ color: C.text }}>Drag & drop files here</p>
              <p className="text-xs mt-1" style={{ color: C.textMuted }}>or click to browse — PDF, JPG, PNG up to 10MB each</p>
            </div>
            <div className="space-y-2">
              {docs.map((doc, i) => (
                <div key={doc.label} className="flex items-center gap-3 p-3 rounded-xl border"
                  style={{ border: `1.5px solid ${doc.file ? C.green + "40" : C.border}`, background: doc.file ? C.greenLight : C.surface }}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0`}
                    style={{ background: doc.file ? C.green : C.bg }}>
                    {doc.file
                      ? <CheckCircle2 className="w-4 h-4 text-white" />
                      : <FileUp className="w-4 h-4" style={{ color: C.textMuted }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium" style={{ color: C.text }}>{doc.label}</div>
                    <div className="text-xs truncate" style={{ color: C.textMuted }}>
                      {doc.required ? "Required" : "Optional"} {doc.file && `· ${doc.file.name}`}
                    </div>
                  </div>
                  <label
                    className="text-xs px-3 py-1.5 rounded-lg font-medium border transition-all cursor-pointer flex-shrink-0"
                    style={{
                      border: `1.5px solid ${doc.file ? C.green : C.border}`,
                      color: doc.file ? C.green : C.textMuted,
                      background: doc.file ? C.greenLight : C.surface,
                    }}>
                    <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png"
                      onChange={e => { const f = e.target.files?.[0]; if (f) handleDocUpload(i, f); }} />
                    {doc.file ? "Replace" : "Upload"}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {STEPS[step]?.key === "review" && (
          <div>
            <h2 className="text-base font-bold mb-4" style={{ color: C.text }}>Review & Submit</h2>
            <div className="space-y-5">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-2"
                  style={{ color: C.textMuted, fontFamily: "var(--font-mono)" }}>Business</h3>
                <div className="rounded-xl p-4" style={{ background: C.bg, border: `1.5px solid ${C.border}` }}>
                  <div className="ReviewRow"><ReviewRow label="Business Name" value={selectedBusiness?.name ?? ""} /></div>
                  <ReviewRow label="Nature" value={selectedBusiness?.nature ?? ""} />
                  <ReviewRow label="NTN" value={selectedBusiness?.ntn ?? ""} />
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-2"
                  style={{ color: C.textMuted, fontFamily: "var(--font-mono)" }}>Financing</h3>
                <div className="rounded-xl p-4" style={{ background: C.bg, border: `1.5px solid ${C.border}` }}>
                  {facilities.map((f, i) => (
                    <ReviewRow key={i} label={f.type}
                      value={`PKR ${f.amount || "0"}${f.collateralType ? ` · Collateral: ${f.collateralType} (PKR ${f.collateralValue || "0"})` : ""}`} />
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-2"
                  style={{ color: C.textMuted, fontFamily: "var(--font-mono)" }}>Documents</h3>
                <div className="rounded-xl p-4" style={{ background: C.bg, border: `1.5px solid ${C.border}` }}>
                  {docs.map(doc => (
                    <ReviewRow key={doc.label} label={doc.label} value={doc.file ? `✓ ${doc.file.name}` : "Not uploaded"} />
                  ))}
                </div>
              </div>
              <div className="p-4 rounded-xl" style={{ background: "#FEF3C7", border: "1.5px solid #D97706" }}>
                <p className="text-xs" style={{ color: "#92400E" }}>
                  By submitting, you confirm all information is accurate and authorize SBP to process your application.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="max-w-2xl flex items-center justify-between mt-5">
        <button
          onClick={() => step > 0 ? setStep(step - 1) : navigate("/sme")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-medium hover:bg-gray-50"
          style={{ border: `1.5px solid ${C.border}`, color: C.text }}>
          <ArrowLeft className="w-4 h-4" /> {step === 0 ? "Cancel" : "Previous"}
        </button>

        {step < STEPS.length - 1 ? (
          <button onClick={() => setStep(step + 1)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90"
            style={{ background: C.green }}>
            Save & Continue <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={() => {
            const caseId = addApplication({
              businessName: selectedBusiness?.name ?? "",
              scheme: facilities.map(f => f.type).join(", "),
              amount: `PKR ${totalFacilityAmount.toLocaleString()}`,
              bank: "HBL",
              documents: docs.filter(d => d.file).map(d => ({ label: d.label, fileName: d.file!.name, fileUrl: d.fileUrl! })),
            });
            navigate("/sme/success", { state: { caseId } });
          }}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90"
            style={{ background: C.green }}>
            Submit Application <CheckCircle2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
