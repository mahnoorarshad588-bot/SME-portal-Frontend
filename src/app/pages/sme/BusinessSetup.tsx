import { useState } from "react";
import { useNavigate } from "react-router";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import sbpLogo from "@/imports/state_bank_of_pakistan_logo-1.png";
import { C } from "../../constants/colors";
import { useApp } from "../../context/AppContext";
import { ArrowLeft, CheckCircle2, ShieldCheck, Scale, Users2, Zap, ChevronDown, Building2 } from "lucide-react";

function Field({ label, placeholder, type = "text", hint, required = false, value, onChange }: {
  label: string; placeholder: string; type?: string; hint?: string; required?: boolean;
  value: string; onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: C.text }}>
        {label} {required && <span style={{ color: "#DC2626" }}>*</span>}
      </label>
      <input type={type} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
        className="w-full rounded-xl border text-sm outline-none transition-all"
        style={{ padding: "11px 14px", background: C.surface, border: `1.5px solid ${C.border}`, color: C.text }}
        onFocus={e => { e.currentTarget.style.border = `1.5px solid ${C.green}`; e.currentTarget.style.boxShadow = `0 0 0 3px ${C.green}18`; }}
        onBlur={e => { e.currentTarget.style.border = `1.5px solid ${C.border}`; e.currentTarget.style.boxShadow = "none"; }}
      />
      {hint && <p className="text-xs mt-1" style={{ color: C.textMuted }}>{hint}</p>}
    </div>
  );
}

function TextArea({ label, placeholder, required = false, value, onChange }: {
  label: string; placeholder: string; required?: boolean; value: string; onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: C.text }}>
        {label} {required && <span style={{ color: "#DC2626" }}>*</span>}
      </label>
      <textarea rows={4} placeholder={placeholder} value={value} onChange={e => onChange(e.target.value)}
        className="w-full rounded-xl border text-sm outline-none resize-none"
        style={{ padding: "11px 14px", background: C.surface, border: `1.5px solid ${C.border}`, color: C.text }}
        onFocus={e => { e.currentTarget.style.border = `1.5px solid ${C.green}`; }}
        onBlur={e => { e.currentTarget.style.border = `1.5px solid ${C.border}`; }}
      />
    </div>
  );
}

function Select({ label, options, value, onChange, required = false }: {
  label: string; options: string[]; value: string; onChange: (v: string) => void; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: C.text }}>
        {label} {required && <span style={{ color: "#DC2626" }}>*</span>}
      </label>
      <div className="relative">
        <select value={value} onChange={e => onChange(e.target.value)}
          className="w-full rounded-xl border text-sm outline-none appearance-none"
          style={{ padding: "11px 36px 11px 14px", background: C.surface, border: `1.5px solid ${C.border}`, color: C.text }}>
          <option value="">-- Select --</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: C.textMuted }} />
      </div>
    </div>
  );
}

const BANKS = [
  "Habib Bank Limited (HBL)",
  "United Bank Limited (UBL)",
  "MCB Bank Limited",
  "Allied Bank Limited",
  "National Bank of Pakistan",
  "Bank Alfalah",
  "Meezan Bank",
  "Faysal Bank",
  "Askari Bank",
  "Standard Chartered Bank",
];

const INITIAL_FORM = {
  name: "", ownerCnic: "", contactPerson: "", cellLandline: "", email: "", ntn: "",
  address: "", annualSales: "", yearEstablished: "", employees: "",
  premise: "", nature: "", businessStatus: "", registration: "No",
  registrationNumber: "", registrationAuthority: "SECP", description: "",
  bank: "", iban: "",
};

export default function BusinessSetup() {
  const navigate = useNavigate();
  const { addBusiness } = useApp();
  const [showSuccess, setShowSuccess] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);

  const set = (key: keyof typeof form) => (v: string) => setForm(f => ({ ...f, [key]: v }));

  const handleSave = () => {
    addBusiness({
      id: `b${Date.now()}`,
      name: form.name,
      nature: form.nature,
      ntn: form.ntn,
      address: form.address,
      status: "Active",
      ownerCnic: form.ownerCnic,
      contactPerson: form.contactPerson,
      cellLandline: form.cellLandline,
      email: form.email,
      yearEstablished: form.yearEstablished,
      annualSales: form.annualSales,
      employees: form.employees,
      premise: form.premise,
      businessStatus: form.businessStatus,
      registration: form.registration,
      registrationNumber: form.registration === "Yes" ? form.registrationNumber : undefined,
      registrationAuthority: form.registration === "Yes" ? form.registrationAuthority : undefined,
      description: form.description,
      bank: form.bank || undefined,
      iban: form.iban || undefined,
    });
    setShowSuccess(true);
    setTimeout(() => navigate("/sme"), 1500);
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "var(--font-display)", background: C.bg }}>
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-[360px] flex-shrink-0 flex-col justify-between px-10 py-12 relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #042614 0%, #063D1C 70%)" }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #4ADE80, transparent 70%)" }} />
        </div>

        <div className="relative z-10">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-7 mx-auto"
            style={{
              background: "linear-gradient(160deg, rgba(255,255,255,0.14), rgba(255,255,255,0.04))",
              border: "1px solid rgba(255,255,255,0.18)",
              boxShadow: "0 0 24px rgba(74,222,128,0.25)",
            }}>
            <ImageWithFallback src={sbpLogo} alt="SBP" className="w-12 h-12 object-contain"
              style={{ filter: "brightness(0) invert(1)" }} />
          </div>

          <h2 className="text-3xl font-black tracking-tight leading-[1.15] mb-2">
            <span className="text-white">Create Your</span><br />
            <span style={{
              background: "linear-gradient(90deg, #4ADE80, #A7F3D0)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>Business Profile</span>
          </h2>
          <p className="text-white text-xs leading-relaxed mb-6">
            A single account can manage multiple businesses. Add your business details below to start applying for financing.
          </p>

          <h3 className="text-white text-base font-bold mb-3">
            Why It Works For You
          </h3>
          <div className="space-y-2">
            {[
              { icon: ShieldCheck, text: "Predefined requirements reduce rejections." },
              { icon: Scale, text: "Fair process, less discretionary conduct." },
              { icon: Users2, text: "Every eligible business can apply." },
              { icon: Zap, text: "Faster loan processing time." },
            ].map(({ icon: Icon, text }, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl transition-all"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(74,222,128,0.15)" }}>
                  <Icon className="w-4 h-4" style={{ color: "#4ADE80" }} />
                </div>
                <span className="text-white text-xs leading-snug">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 p-4 rounded-xl"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <p className="text-white/40 text-[11px] leading-relaxed">
            Your business data is encrypted and used solely for financing evaluation under SBP&apos;s SME framework.
          </p>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-10">
          <button onClick={() => navigate("/")} className="flex items-center gap-2 mb-6 text-sm"
            style={{ color: C.textMuted }}>
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          {/* Mobile brand header — the left panel above is hidden below lg */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `linear-gradient(160deg, ${C.green}, ${C.greenDark})` }}>
              <ImageWithFallback src={sbpLogo} alt="SBP" className="w-9 h-9 object-contain"
                style={{ filter: "brightness(0) invert(1)" }} />
            </div>
            <div>
              <h2 className="text-base font-extrabold" style={{ color: C.text }}>Create Your Business Profile</h2>
              <p className="text-xs" style={{ color: C.textMuted }}>State Bank of Pakistan</p>
            </div>
          </div>

          {/* Header */}
          <div className="mb-6 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${C.green}, ${C.greenDark})` }}>
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold leading-tight" style={{ color: C.text, letterSpacing: "-0.01em" }}>Business Information</h3>
              <div className="h-[3px] w-10 rounded-full mt-1.5" style={{ background: `linear-gradient(90deg, ${C.green}, ${C.blue})` }} />
            </div>
          </div>

          <div className="rounded-2xl border p-5 md:p-6" style={{ border: `1.5px solid ${C.border}`, background: C.surface }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Name of Business" placeholder="ABC Traders" required value={form.name} onChange={set("name")} />
              <Field label="Owner CNIC" placeholder="XXXXX-XXXXXXX-X" required value={form.ownerCnic} onChange={set("ownerCnic")} />
              <Field label="Contact Person" placeholder="Ahmed Khan" required value={form.contactPerson} onChange={set("contactPerson")} />
              <Field label="Cell / Landline No." placeholder="+92 300 0000000" type="tel" required value={form.cellLandline} onChange={set("cellLandline")} />
              <Field label="Business Email Address" placeholder="info@business.com" type="email" required value={form.email} onChange={set("email")} />
              <Field label="NTN No. (If applicable)" placeholder="1234567-8" value={form.ntn} onChange={set("ntn")} />
              <div className="md:col-span-2">
                <TextArea label="Business Address" placeholder="Plot 45, SITE Industrial Area, Karachi" required value={form.address} onChange={set("address")} />
              </div>
              <Field label="Annual Sales (Rs.)" placeholder="0" type="number" required value={form.annualSales} onChange={set("annualSales")} />
              <Field label="Year of Establishment" placeholder="0" type="number" required value={form.yearEstablished} onChange={set("yearEstablished")} />
              <Field label="No. of Employees" placeholder="0" type="number" required value={form.employees} onChange={set("employees")} />
              <Select label="Business Premise" options={["Owned", "Rented"]} required value={form.premise} onChange={set("premise")} />
              <Select label="Business Nature" options={["Manufacturing", "Services", "Trading", "Agri-SME"]} required value={form.nature} onChange={set("nature")} />
              <Select label="Business Status" options={["Proprietorship", "Partnership", "Private Limited Company"]} required value={form.businessStatus} onChange={set("businessStatus")} />
              <Select label="Business Registration" options={["Yes", "No"]} required value={form.registration} onChange={set("registration")} />
              {form.registration === "Yes" && (
                <>
                  <Field label="Registration Number" placeholder="e.g. 0123456" required value={form.registrationNumber} onChange={set("registrationNumber")} />
                  <Select label="Registration Authority" options={["SECP"]} required value={form.registrationAuthority} onChange={set("registrationAuthority")} />
                </>
              )}
              <div className="md:col-span-2">
                <TextArea label="Business Description" placeholder="Briefly describe your main products or services..." required value={form.description} onChange={set("description")} />
              </div>
            </div>
          </div>

          {/* Bank Detail (Optional) */}
          <div className="mt-8 rounded-2xl border overflow-hidden" style={{ border: `1.5px solid ${C.border}` }}>
            <div className="px-5 py-4 border-l-4" style={{ borderColor: C.green, background: C.greenLight }}>
              <span className="text-sm font-bold" style={{ color: C.text }}>Bank Detail</span>
              <span className="text-xs ml-1" style={{ color: C.textMuted }}>(Optional)</span>
            </div>
            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4" style={{ background: C.surface }}>
              <Select label="Bank" options={BANKS} value={form.bank} onChange={set("bank")} />
              <Field label="Business IBAN" placeholder="e.g. PK36SCBL0000001123456702"
                hint="International Bank Account Number (IBAN)" value={form.iban} onChange={set("iban")} />
            </div>
          </div>

          {/* Success overlay */}
          {showSuccess && (
            <div className="fixed inset-0 z-50 flex items-center justify-center"
              style={{ background: "rgba(0,0,0,0.4)" }}>
              <div className="bg-white rounded-2xl p-8 text-center shadow-2xl">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: C.greenLight }}>
                  <CheckCircle2 className="w-8 h-8" style={{ color: C.green }} />
                </div>
                <h3 className="text-lg font-bold mb-1" style={{ color: C.text }}>Business Profile Created!</h3>
                <p className="text-sm" style={{ color: C.textMuted }}>Redirecting to your dashboard...</p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t" style={{ borderColor: C.border }}>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-medium transition-all hover:bg-gray-50"
              style={{ border: `1.5px solid ${C.border}`, color: C.text }}>
              Cancel
            </button>

            <button onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: C.green }}>
              Save & Continue to Verification <CheckCircle2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
