import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../../context/AppContext";
import { C } from "../../constants/colors";
import {
  CheckCircle2, ArrowLeft, ArrowRight, Plus, Trash2, Upload,
  Building2, Users, Banknote, FileUp, ClipboardList, ChevronDown,
} from "lucide-react";

const ALL_STEPS = [
  { key: "business", label: "Business Info", icon: Building2 },
  { key: "shareholders", label: "Shareholders", icon: Users },
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

function Select({ label, options, value, onChange }: {
  label: string; options: string[]; value: string; onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: C.text }}>{label}</label>
      <div className="relative">
        <select value={value} onChange={e => onChange(e.target.value)}
          className="w-full rounded-xl border text-sm outline-none appearance-none"
          style={{ padding: "11px 36px 11px 14px", background: C.surface, border: `1.5px solid ${C.border}`, color: C.text }}>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: C.textMuted }} />
      </div>
    </div>
  );
}

interface Shareholder { name: string; cnic: string; phone: string; email: string; share: string; }
interface DocItem { label: string; file: string | null; required: boolean; }

export default function NewApplication() {
  const navigate = useNavigate();
  const { selectedBusiness } = useApp();
  const [step, setStep] = useState(0);
  const [businessStatus, setBusinessStatus] = useState(selectedBusiness?.businessStatus || "Proprietorship");
  useEffect(() => {
    setBusinessStatus(selectedBusiness?.businessStatus || "Proprietorship");
  }, [selectedBusiness?.id]);
  const showShareholders = businessStatus !== "Proprietorship";
  const STEPS = ALL_STEPS.filter(s => s.key !== "shareholders" || showShareholders);
  const [shareholders, setShareholders] = useState<Shareholder[]>([
    { name: "", cnic: "", phone: "", email: "", share: "" },
  ]);
  const [docs, setDocs] = useState<DocItem[]>([
    { label: "CNIC (Front & Back)", file: null, required: true },
    { label: "Business Registration Certificate", file: null, required: true },
    { label: "Financial Statements (last 2 years)", file: null, required: true },
    { label: "Feasibility Report", file: null, required: false },
    { label: "Other Supporting Documents", file: null, required: false },
  ]);
  const addShareholder = () =>
    setShareholders([...shareholders, { name: "", cnic: "", phone: "", email: "", share: "" }]);

  const removeShareholder = (i: number) =>
    setShareholders(shareholders.filter((_, idx) => idx !== i));

  const markDoc = (i: number) => {
    const updated = [...docs];
    updated[i].file = "document.pdf";
    setDocs(updated);
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

        {/* Step 1: Business Information */}
        {STEPS[step]?.key === "business" && (
          <div>
            <div className="mb-5 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${C.green}, ${C.greenDark})` }}>
                <Building2 className="w-4.5 h-4.5 text-white" style={{ width: "18px", height: "18px" }} />
              </div>
              <div>
                <h2 className="text-base font-extrabold leading-tight" style={{ color: C.text, letterSpacing: "-0.01em" }}>Business Information</h2>
                <div className="h-[3px] w-8 rounded-full mt-1" style={{ background: `linear-gradient(90deg, ${C.green}, ${C.blue})` }} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Business Name" placeholder="" value={selectedBusiness?.name} readOnly />
              <Field label="Owner CNIC" placeholder="" value={selectedBusiness?.ownerCnic} readOnly />
              <Field label="Contact Person" placeholder="" value={selectedBusiness?.contactPerson} readOnly />
              <Field label="Cell / Landline No." placeholder="" value={selectedBusiness?.cellLandline} readOnly />
              <Field label="Business Email Address" placeholder="" value={selectedBusiness?.email} readOnly />
              <Field label="Business Nature" placeholder="" value={selectedBusiness?.nature} readOnly />
              <Field label="NTN" placeholder="" value={selectedBusiness?.ntn} readOnly />
              <Select label="Business Status" options={["Proprietorship", "Partnership", "Pvt Ltd"]}
                value={businessStatus} onChange={setBusinessStatus} />
              <div className="md:col-span-2">
                <Field label="Business Address" placeholder="" value={selectedBusiness?.address} readOnly />
              </div>
              <Field label="Year of Establishment" placeholder="" value={selectedBusiness?.yearEstablished} readOnly />
              <Field label="Annual Sales (PKR)" placeholder="" value={selectedBusiness?.annualSales} readOnly />
              <Field label="No. of Employees" placeholder="" value={selectedBusiness?.employees} readOnly />
              <Field label="Business Premise" placeholder="" value={selectedBusiness?.premise} readOnly />
              {selectedBusiness?.registration === "Yes" && (
                <>
                  <Field label="Registration Number" placeholder="" value={selectedBusiness?.registrationNumber} readOnly />
                  <Field label="Registration Authority" placeholder="" value={selectedBusiness?.registrationAuthority} readOnly />
                </>
              )}
            </div>
            <div className="mt-4 p-3 rounded-xl flex gap-3"
              style={{ background: C.greenLight, border: `1.5px solid ${C.green}20` }}>
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: C.green }} />
              <p className="text-xs" style={{ color: C.greenDark }}>
                Business details are auto-populated from your profile. To update, go to My Businesses.
              </p>
            </div>
          </div>
        )}

        {/* Step 2: Shareholders (Partnership / Pvt Ltd only) */}
        {STEPS[step]?.key === "shareholders" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold" style={{ color: C.text }}>Partners / Shareholders</h2>
              <button onClick={addShareholder}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all hover:bg-gray-50"
                style={{ border: `1.5px solid ${C.green}`, color: C.green }}>
                <Plus className="w-3.5 h-3.5" /> Add Shareholder
              </button>
            </div>
            <div className="space-y-4">
              {shareholders.map((sh, i) => (
                <div key={i} className="p-4 rounded-xl border"
                  style={{ border: `1.5px solid ${C.border}`, background: C.bg }}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold" style={{ color: C.textMuted }}>SHAREHOLDER {i + 1}</span>
                    {shareholders.length > 1 && (
                      <button onClick={() => removeShareholder(i)} style={{ color: "#DC2626" }}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Full Name" placeholder="Ahmed Khan" value={sh.name} />
                    <Field label="CNIC" placeholder="XXXXX-XXXXXXX-X" value={sh.cnic} />
                    <Field label="Contact Number" placeholder="+92 300 0000000" value={sh.phone} />
                    <Field label="Email Address" placeholder="email@domain.com" type="email" value={sh.email} />
                    <Field label="Shareholding %" placeholder="e.g. 60" value={sh.share} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Financing Requirement */}
        {STEPS[step]?.key === "financing" && (
          <div>
            <h2 className="text-base font-bold mb-4" style={{ color: C.text }}>Financing Requirement</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1.5" style={{ color: C.text }}>Facility Type</label>
                <div className="relative">
                  <select className="w-full rounded-xl border text-sm outline-none appearance-none"
                    style={{ padding: "11px 36px 11px 14px", background: C.surface, border: `1.5px solid ${C.border}`, color: C.text }}>
                    <option>SME Asaan Finance (SAAF)</option>
                    <option>Refinance Facility for SMEs</option>
                    <option>Technology Upgrade Scheme</option>
                    <option>Women Entrepreneurship Finance</option>
                    <option>Agri-SME Financing</option>
                    <option>Export Finance for SMEs</option>
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: C.textMuted }} />
                </div>
              </div>
              <Field label="Requested Amount (PKR)" placeholder="e.g. 8,500,000" type="text" />
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: C.text }}>Tenor</label>
                <div className="relative">
                  <select className="w-full rounded-xl border text-sm outline-none appearance-none"
                    style={{ padding: "11px 36px 11px 14px", background: C.surface, border: `1.5px solid ${C.border}`, color: C.text }}>
                    {["6 months", "1 year", "2 years", "3 years", "5 years", "7 years"].map(t => <option key={t}>{t}</option>)}
                  </select>
                  <ChevronDown className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: C.textMuted }} />
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1.5" style={{ color: C.text }}>Financing Purpose</label>
                <textarea rows={4} placeholder="Describe how you intend to use the financing..."
                  className="w-full rounded-xl border text-sm outline-none resize-none"
                  style={{ padding: "11px 14px", background: C.surface, border: `1.5px solid ${C.border}`, color: C.text }} />
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Documents */}
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
                    <div className="text-xs" style={{ color: C.textMuted }}>
                      {doc.required ? "Required" : "Optional"} {doc.file && "· document.pdf"}
                    </div>
                  </div>
                  <button onClick={() => markDoc(i)}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium border transition-all"
                    style={{
                      border: `1.5px solid ${doc.file ? C.green : C.border}`,
                      color: doc.file ? C.green : C.textMuted,
                      background: doc.file ? C.greenLight : C.surface,
                    }}>
                    {doc.file ? "Uploaded" : "Upload"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 6: Review */}
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
                  <ReviewRow label="Facility Type" value="SME Asaan Finance (SAAF)" />
                  <ReviewRow label="Requested Amount" value="PKR 8,500,000" />
                  <ReviewRow label="Tenor" value="3 years" />
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-2"
                  style={{ color: C.textMuted, fontFamily: "var(--font-mono)" }}>Documents</h3>
                <div className="rounded-xl p-4" style={{ background: C.bg, border: `1.5px solid ${C.border}` }}>
                  <ReviewRow label="CNIC" value="✓ Uploaded" />
                  <ReviewRow label="Registration" value="✓ Uploaded" />
                  <ReviewRow label="Financial Statements" value="✓ Uploaded" />
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
          <button onClick={() => navigate("/sme/success")}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white hover:opacity-90"
            style={{ background: C.green }}>
            Submit Application <CheckCircle2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
