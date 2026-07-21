import { useState } from "react";
import { useNavigate } from "react-router";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import sbpLogo from "@/imports/state_bank_of_pakistan_logo-1.png";
import { useApp } from "../../context/AppContext";
import { C } from "../../constants/colors";
import { ArrowLeft, Mail, Building2, ArrowRight, KeyRound, ChevronDown, ShieldCheck } from "lucide-react";

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
