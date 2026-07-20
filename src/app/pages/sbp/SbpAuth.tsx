import { useState } from "react";
import { useNavigate } from "react-router";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import sbpLogo from "@/imports/state_bank_of_pakistan_logo-1.png";
import { useApp } from "../../context/AppContext";
import { C } from "../../constants/colors";
import { Eye, EyeOff, ArrowLeft, Mail, Lock, ShieldCheck, ArrowRight, AlertTriangle, KeyRound } from "lucide-react";

export default function SbpAuth() {
  const navigate = useNavigate();
  const { setUser } = useApp();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [step, setStep] = useState<"credentials" | "mfa">("credentials");
  const [mfaCode, setMfaCode] = useState("");

  const handleCredentials = () => setStep("mfa");
  const handleMfa = () => {
    setUser({ name: "Dr. Amjad Hussain — SBP", email: email || "amjad.hussain@sbp.org.pk" });
    navigate("/sbp");
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "var(--font-display)" }}>

      {/* Left panel - orange/amber */}
      <div className="hidden lg:flex lg:w-[420px] flex-shrink-0 flex-col justify-between px-10 py-12 relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #1C0A00 0%, #3A1200 70%, #3D1400 100%)" }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #FB923C, transparent 70%)" }} />
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
            style={{ background: "rgba(251,146,60,0.15)", color: "#FB923C", fontFamily: "var(--font-mono)" }}>
            SBP Admin Portal
          </div>

          <h2 className="text-2xl font-extrabold text-white mb-2">Administrative Access</h2>
          <p className="text-white text-sm leading-relaxed mb-8">
            Restricted access for State Bank of Pakistan administrators and oversight personnel.
          </p>

          <div className="p-4 rounded-xl" style={{ background: "rgba(251,146,60,0.1)", border: "1px solid rgba(251,146,60,0.2)" }}>
            <div className="flex items-start gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: "#FB923C" }} />
              <p className="text-white text-xs font-semibold uppercase tracking-wider"
                style={{ fontFamily: "var(--font-mono)" }}>Restricted Access</p>
            </div>
            <p className="text-white text-xs leading-relaxed">
              This portal is restricted to authorized SBP personnel only. Multi-factor authentication
              is mandatory. All sessions are monitored and logged.
            </p>
          </div>
        </div>

        <div className="relative z-10 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: "rgba(251,146,60,0.15)" }}>
              <ShieldCheck className="w-3.5 h-3.5" style={{ color: "#FB923C" }} />
            </div>
            <span className="text-white text-xs">Two-factor authentication required</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: "rgba(251,146,60,0.15)" }}>
              <KeyRound className="w-3.5 h-3.5" style={{ color: "#FB923C" }} />
            </div>
            <span className="text-white text-xs">Hardware key or authenticator app</span>
          </div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12" style={{ background: C.bg }}>
        <div className="w-full max-w-md">
          <button onClick={() => navigate("/")}
            className="lg:hidden flex items-center gap-2 mb-8 text-sm"
            style={{ color: C.textMuted }}>
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          {step === "credentials" ? (
            <div className="rounded-2xl border p-6 md:p-8" style={{ border: `1.5px solid ${C.border}`, background: C.surface }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: C.orangeLight }}>
                  <ShieldCheck className="w-5 h-5" style={{ color: C.orange }} />
                </div>
                <div>
                  <h3 className="text-lg font-bold" style={{ color: C.text }}>SBP Admin Login</h3>
                  <p className="text-xs" style={{ color: C.textMuted }}>Step 1 of 2 — Credentials</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: C.text }}>Official SBP Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: C.textMuted }} />
                    <input type="email" placeholder="name@sbp.org.pk" value={email} onChange={e => setEmail(e.target.value)}
                      className="w-full rounded-xl text-sm outline-none"
                      style={{ padding: "12px 16px 12px 40px", background: C.surface, border: `1.5px solid ${C.border}`, color: C.text }} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: C.text }}>Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: C.textMuted }} />
                    <input type={showPass ? "text" : "password"} placeholder="Your password" value={password} onChange={e => setPassword(e.target.value)}
                      className="w-full rounded-xl text-sm outline-none"
                      style={{ padding: "12px 44px 12px 40px", background: C.surface, border: `1.5px solid ${C.border}`, color: C.text }} />
                    <button type="button" onClick={() => setShowPass(!showPass)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: C.textMuted }}>
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: C.text }}>Admin Access Key</label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: C.textMuted }} />
                    <input type="text" placeholder="SBP-ADMIN-XXXX-XXXX" value={adminKey} onChange={e => setAdminKey(e.target.value)}
                      className="w-full rounded-xl text-sm outline-none"
                      style={{ padding: "12px 16px 12px 40px", background: C.surface, border: `1.5px solid ${C.border}`, color: C.text, fontFamily: "var(--font-mono)" }} />
                  </div>
                </div>
              </div>

              <button onClick={handleCredentials}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90"
                style={{ background: C.orange }}>
                Continue to MFA <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="rounded-2xl border p-6 md:p-8" style={{ border: `1.5px solid ${C.border}`, background: C.surface }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: C.orangeLight }}>
                  <ShieldCheck className="w-5 h-5" style={{ color: C.orange }} />
                </div>
                <div>
                  <h3 className="text-lg font-bold" style={{ color: C.text }}>Two-Factor Authentication</h3>
                  <p className="text-xs" style={{ color: C.textMuted }}>Step 2 of 2 — MFA Verification</p>
                </div>
              </div>

              <p className="text-sm mb-6" style={{ color: C.textMuted }}>
                Enter the 6-digit code from your authenticator app or hardware key.
              </p>

              <div className="flex justify-center gap-3 mb-8">
                {[0,1,2,3,4,5].map(i => (
                  <input key={i} type="text" maxLength={1}
                    className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none"
                    style={{ border: `2px solid ${C.border}`, color: C.text, background: C.surface, fontFamily: "var(--font-mono)" }}
                    onFocus={e => e.currentTarget.style.border = `2px solid ${C.orange}`}
                    onBlur={e => e.currentTarget.style.border = `2px solid ${C.border}`}
                    onChange={e => {
                      setMfaCode(mfaCode + e.target.value);
                      const next = document.getElementById(`mfa-${i + 1}`);
                      if (e.target.value && next) (next as HTMLInputElement).focus();
                    }}
                    id={`mfa-${i}`}
                  />
                ))}
              </div>

              <button onClick={handleMfa}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90"
                style={{ background: C.orange }}>
                Verify & Enter Admin Portal <ArrowRight className="w-4 h-4" />
              </button>

              <button onClick={() => setStep("credentials")} className="w-full mt-3 text-sm py-2"
                style={{ color: C.textMuted }}>
                ← Back to credentials
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
