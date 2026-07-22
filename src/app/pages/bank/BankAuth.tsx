import { useState } from "react";
import { useNavigate } from "react-router";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import sbpLogo from "@/imports/state_bank_of_pakistan_logo-1.png";
import { useApp } from "../../context/AppContext";
import { C } from "../../constants/colors";
import { ArrowLeft, Mail, Building2, ArrowRight, KeyRound, ChevronDown, ShieldCheck } from "lucide-react";

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

function SsoIconRow({ onSelect }: { onSelect: (provider: "Google" | "Microsoft" | "Apple") => void }) {
  const providers = [
    { label: "Continue with Google",    provider: "Google" as const,    Logo: GoogleLogo },
    { label: "Continue with Microsoft", provider: "Microsoft" as const, Logo: MicrosoftLogo },
    { label: "Continue with Apple",     provider: "Apple" as const,     Logo: AppleLogo },
  ];
  return (
    <div className="flex items-center justify-center gap-3">
      {providers.map(({ label, provider, Logo }) => (
        <button key={label} type="button" aria-label={label} title={label} onClick={() => onSelect(provider)}
          className="flex items-center justify-center w-12 h-12 rounded-xl border transition-all hover:bg-gray-50 active:scale-[0.98]"
          style={{ border: `1.5px solid ${C.border}`, background: "#fff" }}>
          <Logo />
        </button>
      ))}
    </div>
  );
}

export default function BankAuth() {
  const navigate = useNavigate();
  const { setUser } = useApp();
  const [email, setEmail] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [otp, setOtp] = useState("");

  const handleSendOtp = () => setStep("otp");

  const handleVerify = () => {
    setUser({ name: "Bilal Raza — HBL Credit", email: email || "bilal.raza@hbl.com" });
    navigate("/bank");
  };

  const handleSso = (provider: "Google" | "Microsoft" | "Apple") => {
    setUser({ name: "Bilal Raza — HBL Credit", email: `bilal.raza@${provider.toLowerCase()}.com` });
    navigate("/bank");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12" style={{ fontFamily: "var(--font-display)", background: C.bg }}>
      <div className="w-full max-w-md">
        <button onClick={() => navigate("/")}
          className="flex items-center gap-2 mb-6 text-sm"
          style={{ color: C.textMuted }}>
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Brand header */}
        <div className="flex items-center gap-3 mb-8">
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

        {step === "credentials" ? (
          <div className="rounded-2xl border p-6 md:p-8" style={{ border: `1.5px solid ${C.border}`, background: C.surface }}>
            <h3 className="text-2xl font-bold mb-1" style={{ color: C.text }}>Bank Officer Sign In</h3>
            <p className="text-sm mb-8" style={{ color: C.textMuted }}>
              Enter your details to receive a one-time passcode
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
            </div>

            <button onClick={handleSendOtp}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90 mt-6"
              style={{ background: C.blue }}>
              Send OTP <ArrowRight className="w-4 h-4" />
            </button>

            <div className="mt-6">
              <SsoIconRow onSelect={handleSso} />
            </div>

            <div className="mt-6 p-4 rounded-xl flex gap-3"
              style={{ background: C.blueLight, border: `1.5px solid ${C.blue}20` }}>
              <KeyRound className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: C.blue }} />
              <p className="text-xs leading-relaxed" style={{ color: C.blue }}>
                <span className="font-semibold">Authorized access only.</span> Unauthorized access attempts
                are logged and reported to SBP compliance. Use your official institutional credentials.
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border p-6 md:p-8" style={{ border: `1.5px solid ${C.border}`, background: C.surface }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: C.blueLight }}>
                <ShieldCheck className="w-5 h-5" style={{ color: C.blue }} />
              </div>
              <div>
                <h3 className="text-lg font-bold" style={{ color: C.text }}>Enter OTP</h3>
                <p className="text-xs" style={{ color: C.textMuted }}>Step 2 of 2 — Verification</p>
              </div>
            </div>

            <p className="text-sm mb-6" style={{ color: C.textMuted }}>
              We&apos;ve sent a 6-digit one-time passcode to <span className="font-semibold" style={{ color: C.text }}>{email || "your registered email"}</span>.
            </p>

            <div className="flex justify-center gap-3 mb-8">
              {[0,1,2,3,4,5].map(i => (
                <input key={i} type="text" maxLength={1}
                  className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none"
                  style={{ border: `2px solid ${C.border}`, color: C.text, background: C.surface, fontFamily: "var(--font-mono)" }}
                  onFocus={e => e.currentTarget.style.border = `2px solid ${C.blue}`}
                  onBlur={e => e.currentTarget.style.border = `2px solid ${C.border}`}
                  onChange={e => {
                    setOtp(otp + e.target.value);
                    const next = document.getElementById(`bank-otp-${i + 1}`);
                    if (e.target.value && next) (next as HTMLInputElement).focus();
                  }}
                  id={`bank-otp-${i}`}
                />
              ))}
            </div>

            <button onClick={handleVerify}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90"
              style={{ background: C.blue }}>
              Verify & Sign In <ArrowRight className="w-4 h-4" />
            </button>

            <button className="w-full mt-3 text-xs font-medium" style={{ color: C.blue }}>
              Resend OTP
            </button>

            <button onClick={() => setStep("credentials")} className="w-full mt-1 text-sm py-2"
              style={{ color: C.textMuted }}>
              ← Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
