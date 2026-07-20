import { useState } from "react";
import { useNavigate } from "react-router";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import sbpLogo from "@/imports/state_bank_of_pakistan_logo-1.png";
import { useApp } from "../../context/AppContext";
import { C } from "../../constants/colors";
import { Eye, EyeOff, ArrowLeft, Mail, Lock, Building2, ArrowRight, KeyRound, ChevronDown } from "lucide-react";

const GoogleLogo = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
    <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
  </svg>
);

const MicrosoftLogo = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect x="0" y="0" width="8.5" height="8.5" fill="#F25022"/>
    <rect x="9.5" y="0" width="8.5" height="8.5" fill="#7FBA00"/>
    <rect x="0" y="9.5" width="8.5" height="8.5" fill="#00A4EF"/>
    <rect x="9.5" y="9.5" width="8.5" height="8.5" fill="#FFB900"/>
  </svg>
);

const AppleLogo = () => (
  <svg width="18" height="18" viewBox="0 0 814 1000" fill="currentColor">
    <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.3-161-39.3c-73.3 0-98.7 40.1-167.4 40.1s-107.9-58.7-155.5-127.5c-55.1-77.7-98.5-209.5-98.5-334.6 0-197.5 133.2-302 264.7-302 70.2 0 128.7 45.7 172.3 45.7 41.7 0 107.4-48.1 185.5-48.1 29.6 0 108.2 2.6 168.4 101zM541.9 58.4c26.7-30.7 45.7-73.3 45.7-115.9 0-6.4-.6-12.9-1.9-18.1-44.5 1.9-98.7 30.1-131.5 63.5-24.8 26.7-47.5 69.9-47.5 113.1 0 7 1.3 14 1.9 16.4 2.6.6 7 1.3 11.3 1.3 40.1 0 91.4-26.8 121.9-60.3z"/>
  </svg>
);

function SsoButtons() {
  const providers = [
    { label: "Continue with Google",    Logo: GoogleLogo },
    { label: "Continue with Microsoft", Logo: MicrosoftLogo },
    { label: "Continue with Apple",     Logo: AppleLogo },
  ];
  return (
    <div className="flex flex-col gap-2.5">
      {providers.map(({ label, Logo }) => (
        <button key={label}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all hover:bg-gray-50 active:scale-[0.98]"
          style={{ border: `1.5px solid ${C.border}`, color: C.text, background: "#fff" }}>
          <Logo />
          <span className="flex-1 text-center">{label}</span>
        </button>
      ))}
    </div>
  );
}

export default function BankAuth() {
  const navigate = useNavigate();
  const { setUser } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleLogin = () => {
    setUser({ name: "Bilal Raza — HBL Credit", email: email || "bilal.raza@hbl.com" });
    navigate("/bank");
  };

  const inputStyle = (focused: boolean) => ({
    width: "100%",
    padding: "12px 16px 12px 40px",
    borderRadius: "12px",
    border: `1.5px solid ${focused ? C.blue : C.border}`,
    background: C.surface,
    color: C.text,
    fontSize: "14px",
    outline: "none",
    boxShadow: focused ? `0 0 0 3px ${C.blue}18` : "none",
    transition: "all 0.15s",
  });

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "var(--font-display)" }}>

      {/* Left brand panel - blue */}
      <div className="hidden lg:flex lg:w-[420px] flex-shrink-0 flex-col justify-between px-10 py-12 relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #0A1628 0%, #0D2045 70%, #0F2550 100%)" }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #60A5FA, transparent 70%)" }} />
        </div>

        <div className="relative z-10">
          <button onClick={() => navigate("/")}
            className="flex items-center gap-2 mb-10 text-white transition-opacity hover:opacity-80 text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Portal
          </button>

          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
            style={{ background: "rgba(255,255,255,0.08)" }}>
            <ImageWithFallback src={sbpLogo} alt="SBP" className="w-14 h-14 object-contain"
              style={{ filter: "brightness(0) invert(1)" }} />
          </div>

          <div className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"
            style={{ background: "rgba(96,165,250,0.15)", color: "#60A5FA", fontFamily: "var(--font-mono)" }}>
            Participating Bank Portal
          </div>

          <h2 className="text-2xl font-extrabold text-white mb-2">Bank Officer Access</h2>
          <p className="text-white text-sm leading-relaxed mb-8">
            Access your institution&apos;s SME application queue and processing tools.
          </p>

          <div className="p-4 rounded-xl" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <p className="text-white text-xs font-semibold uppercase tracking-wider mb-2"
              style={{ fontFamily: "var(--font-mono)" }}>Authorized Banks</p>
            <div className="flex flex-wrap gap-2">
              {["HBL", "UBL", "MCB", "NBP", "Allied", "Meezan", "Alfalah", "Faysal"].map(b => (
                <span key={b} className="text-xs px-2 py-1 rounded-lg text-white"
                  style={{ background: "rgba(255,255,255,0.1)" }}>{b}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="relative z-10">
          <p className="text-white text-xs">
            Access restricted to authorized bank officers only.
            All actions are logged and audited by SBP.
          </p>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12" style={{ background: C.bg }}>
        <div className="w-full max-w-md">
          <button onClick={() => navigate("/")}
            className="lg:hidden flex items-center gap-2 mb-6 text-sm"
            style={{ color: C.textMuted }}>
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          {/* Mobile brand header — the left panel above is hidden below lg */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "linear-gradient(160deg, #1D4ED8, #1E3A8A)" }}>
              <ImageWithFallback src={sbpLogo} alt="SBP" className="w-9 h-9 object-contain"
                style={{ filter: "brightness(0) invert(1)" }} />
            </div>
            <div>
              <h2 className="text-base font-extrabold" style={{ color: C.text }}>Participating Bank Portal</h2>
              <p className="text-xs" style={{ color: C.textMuted }}>State Bank of Pakistan</p>
            </div>
          </div>

          <div className="rounded-2xl border p-6 md:p-8" style={{ border: `1.5px solid ${C.border}`, background: C.surface }}>
          <h3 className="text-2xl font-bold mb-1" style={{ color: C.text }}>Bank Officer Sign In</h3>
          <p className="text-sm mb-8" style={{ color: C.textMuted }}>
            Enter your credentials to access the bank portal
          </p>

          <div className="space-y-4">
            {/* Bank Code */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: C.text }}>Bank Code</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Building2 className="w-4 h-4" style={{ color: C.textMuted }} />
                </div>
                <select
                  value={bankCode}
                  onChange={e => setBankCode(e.target.value)}
                  className="w-full rounded-xl border text-sm outline-none appearance-none"
                  style={{ padding: "12px 40px 12px 40px", background: C.surface, border: `1.5px solid ${C.border}`, color: C.text }}
                >
                  <option value="">Select your bank</option>
                  {["HBL", "UBL", "MCB", "NBP", "Allied Bank", "Meezan Bank", "Bank Alfalah", "Faysal Bank"].map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                  style={{ color: C.textMuted }} />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: C.text }}>Officer Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: C.textMuted }} />
                <input type="email" placeholder="officer@bank.com" value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full rounded-xl text-sm outline-none"
                  style={{ padding: "12px 16px 12px 40px", background: C.surface, border: `1.5px solid ${C.border}`, color: C.text }} />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: C.text }}>Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: C.textMuted }} />
                <input type={showPass ? "text" : "password"} placeholder="Enter password" value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full rounded-xl text-sm outline-none"
                  style={{ padding: "12px 44px 12px 40px", background: C.surface, border: `1.5px solid ${C.border}`, color: C.text }} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: C.textMuted }}>
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3 mb-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="rounded" />
              <span className="text-xs" style={{ color: C.textMuted }}>Remember this device</span>
            </label>
            <button className="text-xs font-medium" style={{ color: C.blue }}>Forgot Password?</button>
          </div>

          <button onClick={handleLogin}
            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90"
            style={{ background: C.blue }}>
            Sign In to Bank Portal <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: C.border }} />
            <span className="text-xs" style={{ color: C.textMuted }}>or continue with</span>
            <div className="flex-1 h-px" style={{ background: C.border }} />
          </div>

          <SsoButtons />

          <div className="mt-6 p-4 rounded-xl flex gap-3"
            style={{ background: C.blueLight, border: `1.5px solid ${C.blue}20` }}>
            <KeyRound className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: C.blue }} />
            <p className="text-xs leading-relaxed" style={{ color: C.blue }}>
              <span className="font-semibold">Authorized access only.</span> Unauthorized access attempts
              are logged and reported to SBP compliance. Use your official institutional credentials.
            </p>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
}
