import { useState } from "react";
import { useNavigate } from "react-router";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import sbpLogo from "@/imports/state_bank_of_pakistan_logo-1.png";
import { useApp } from "../../context/AppContext";
import { C } from "../../constants/colors";
import {
  Eye, EyeOff, ArrowLeft, Mail, Lock, User, Phone,
  ArrowRight, RefreshCw, Target, Workflow, ShieldCheck, Link2,
} from "lucide-react";

type AuthMode = "login" | "register" | "otp";

function FormField({
  label, type = "text", placeholder, icon: Icon, value, onChange, hint,
}: {
  label: string; type?: string; placeholder: string; icon?: React.ComponentType<{ className?: string }>;
  value: string; onChange: (v: string) => void; hint?: string;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5" style={{ color: C.text }}>{label}</label>
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <Icon className="w-4 h-4" style={{ color: C.textMuted }} />
          </div>
        )}
        <input
          type={isPassword && show ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full rounded-xl border text-sm outline-none transition-all"
          style={{
            padding: Icon ? "12px 16px 12px 40px" : "12px 16px",
            background: C.surface,
            border: `1.5px solid ${C.border}`,
            color: C.text,
            paddingRight: isPassword ? "44px" : "16px",
          }}
          onFocus={e => { e.currentTarget.style.border = `1.5px solid ${C.green}`; e.currentTarget.style.boxShadow = `0 0 0 3px ${C.green}18`; }}
          onBlur={e => { e.currentTarget.style.border = `1.5px solid ${C.border}`; e.currentTarget.style.boxShadow = "none"; }}
        />
        {isPassword && (
          <button type="button" onClick={() => setShow(!show)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2"
            style={{ color: C.textMuted }}>
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {hint && <p className="text-xs mt-1" style={{ color: C.textMuted }}>{hint}</p>}
    </div>
  );
}

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

function SsoButtons({ accentColor }: { accentColor: string }) {
  const providers = [
    { label: "Continue with Google",    Logo: GoogleLogo,    border: "#DADCE0" },
    { label: "Continue with Microsoft", Logo: MicrosoftLogo, border: "#D1D5DB" },
    { label: "Continue with Apple",     Logo: AppleLogo,     border: "#D1D5DB" },
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

export default function SmeAuth() {
  const navigate = useNavigate();
  const { setUser } = useApp();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);

  const handleLogin = () => {
    setUser({ name: "Ahmed Khan", email: email || "ahmed.khan@abctraders.com" });
    navigate("/sme/setup");
  };

  const handleRegister = () => { setMode("otp"); };

  const handleOtp = () => {
    setUser({ name: name || "Ahmed Khan", email: email || "ahmed.khan@abctraders.com" });
    navigate("/sme/setup");
  };

  const handleOtpInput = (idx: number, val: string) => {
    if (val.length > 1) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    if (val && idx < 5) {
      const nextInput = document.getElementById(`otp-${idx + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "var(--font-display)" }}>

      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-[400px] xl:w-[460px] flex-shrink-0 flex-col justify-between px-10 py-12 relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #042614 0%, #063D1C 70%, #083E1C 100%)" }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle, #4ADE80, transparent 70%)" }} />
        </div>

        <div className="relative z-10">
          <button onClick={() => navigate("/")}
            className="flex items-center gap-2 mb-10 text-white/60 hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Portal
          </button>

          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 mx-auto"
            style={{
              background: "linear-gradient(160deg, rgba(255,255,255,0.14), rgba(255,255,255,0.04))",
              border: "1px solid rgba(255,255,255,0.18)",
              boxShadow: "0 0 24px rgba(74,222,128,0.25)",
            }}>
            <ImageWithFallback src={sbpLogo} alt="SBP" className="w-14 h-14 object-contain"
              style={{ filter: "brightness(0) invert(1)" }} />
          </div>

          <h2 className="text-2xl font-extrabold text-white mb-2">SME Applicant Portal</h2>
          <p className="text-white text-xs leading-relaxed mb-8">
            Access Pakistan&apos;s central SME financing platform backed by the State Bank of Pakistan.
          </p>

          <h3 className="text-white text-base font-bold mb-3">Our Objective</h3>
          <div className="space-y-2">
            {[
              { icon: Target, text: "Provide easy, collateral-free business loans to eligible SMEs.", color: "#4ADE80", bg: "rgba(74,222,128,0.15)" },
              { icon: Workflow, text: "Simplify and speed up the financing application process.", color: "#FB923C", bg: "rgba(251,146,60,0.15)" },
              { icon: Link2, text: "Connect eligible businesses with multiple participating banks.", color: "#4ADE80", bg: "rgba(74,222,128,0.15)" },
              { icon: ShieldCheck, text: "Promote inclusive growth for underserved and women-led SMEs.", color: "#FB923C", bg: "rgba(251,146,60,0.15)" },
            ].map(({ icon: Icon, text, color, bg }, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl transition-all"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: bg }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <span className="text-white text-xs leading-snug">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10">
          <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <p className="text-white/40 text-xs leading-relaxed">
              This portal is operated under the regulatory oversight of the State Bank of Pakistan.
              All data is encrypted and stored securely in compliance with Pakistan&apos;s data protection framework.
            </p>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12" style={{ background: C.bg }}>
        <div className="w-full max-w-md">

          {/* Mobile back */}
          <button onClick={() => navigate("/")}
            className="lg:hidden flex items-center gap-2 mb-8 text-sm"
            style={{ color: C.textMuted }}>
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          {/* ── LOGIN ── */}
          {mode === "login" && (
            <div className="rounded-2xl border p-6 md:p-8" style={{ border: `1.5px solid ${C.border}`, background: C.surface }}>
              <h3 className="text-2xl font-bold mb-1" style={{ color: C.text }}>Welcome back</h3>
              <p className="text-sm mb-8" style={{ color: C.textMuted }}>
                Sign in to your SME applicant account
              </p>

              <div className="space-y-4">
                <FormField label="Email Address" type="email" placeholder="ahmed@company.com"
                  icon={Mail} value={email} onChange={setEmail} />
                <FormField label="Password" type="password" placeholder="Enter your password"
                  icon={Lock} value={password} onChange={setPassword} />
              </div>

              <div className="flex items-center justify-between mt-3 mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  <span className="text-xs" style={{ color: C.textMuted }}>Remember me</span>
                </label>
                <button className="text-xs font-medium" style={{ color: C.green }}>Forgot Password?</button>
              </div>

              <button onClick={handleLogin}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90"
                style={{ background: C.green }}>
                Sign In <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px" style={{ background: C.border }} />
                <span className="text-xs" style={{ color: C.textMuted }}>or continue with</span>
                <div className="flex-1 h-px" style={{ background: C.border }} />
              </div>

              <SsoButtons accentColor={C.green} />

              <p className="text-center text-sm mt-6" style={{ color: C.textMuted }}>
                Don&apos;t have an account?{" "}
                <button onClick={() => setMode("register")} className="font-semibold" style={{ color: C.green }}>
                  Sign Up
                </button>
              </p>
            </div>
          )}

          {/* ── REGISTER ── */}
          {mode === "register" && (
            <div className="rounded-2xl border p-6 md:p-8" style={{ border: `1.5px solid ${C.border}`, background: C.surface }}>
              <h3 className="text-2xl font-bold mb-1" style={{ color: C.text }}>Create Account</h3>
              <p className="text-sm mb-8" style={{ color: C.textMuted }}>
                Register as an SME applicant
              </p>

              <div className="space-y-4">
                <FormField label="Full Name" placeholder="Ahmed Khan" icon={User} value={name} onChange={setName} />
                <FormField label="Mobile Number" placeholder="+92 300 0000000" icon={Phone} value={phone} onChange={setPhone} />
                <FormField label="Email Address" type="email" placeholder="ahmed@company.com" icon={Mail} value={email} onChange={setEmail} />
                <FormField label="Password" type="password" placeholder="Min. 8 characters"
                  icon={Lock} value={password} onChange={setPassword}
                  hint="Must contain uppercase, lowercase, number and special character" />
                <FormField label="Confirm Password" type="password" placeholder="Re-enter your password"
                  icon={Lock} value="" onChange={() => {}} />
              </div>

              <div className="mt-4 mb-6">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input type="checkbox" className="mt-0.5 rounded" />
                  <span className="text-xs leading-snug" style={{ color: C.textMuted }}>
                    I agree to the{" "}
                    <a href="#" className="underline" style={{ color: C.green }}>Terms of Service</a>
                    {" "}and{" "}
                    <a href="#" className="underline" style={{ color: C.green }}>Privacy Policy</a>
                  </span>
                </label>
              </div>

              <button onClick={handleRegister}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90"
                style={{ background: C.green }}>
                Create Account <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-center text-sm mt-6" style={{ color: C.textMuted }}>
                Already have an account?{" "}
                <button onClick={() => setMode("login")} className="font-semibold" style={{ color: C.green }}>
                  Sign In
                </button>
              </p>
            </div>
          )}

          {/* ── OTP ── */}
          {mode === "otp" && (
            <div className="text-center rounded-2xl border p-6 md:p-8" style={{ border: `1.5px solid ${C.border}`, background: C.surface }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                style={{ background: C.greenLight }}>
                <Mail className="w-7 h-7" style={{ color: C.green }} />
              </div>
              <h3 className="text-2xl font-bold mb-2" style={{ color: C.text }}>Verify Your Email</h3>
              <p className="text-sm mb-2" style={{ color: C.textMuted }}>
                We sent a 6-digit code to
              </p>
              <p className="font-semibold text-sm mb-8" style={{ color: C.text }}>
                {email || "ahmed@company.com"}
              </p>

              <div className="flex justify-center gap-3 mb-8">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`otp-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleOtpInput(idx, e.target.value)}
                    className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all"
                    style={{
                      border: `2px solid ${digit ? C.green : C.border}`,
                      color: C.text,
                      background: digit ? C.greenLight : C.surface,
                    }}
                    onFocus={e => { e.currentTarget.style.border = `2px solid ${C.green}`; e.currentTarget.style.boxShadow = `0 0 0 3px ${C.green}18`; }}
                    onBlur={e => { if (!digit) e.currentTarget.style.border = `2px solid ${C.border}`; e.currentTarget.style.boxShadow = "none"; }}
                  />
                ))}
              </div>

              <button onClick={handleOtp}
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-sm text-white mb-4 transition-all hover:opacity-90"
                style={{ background: C.green }}>
                Verify Code <ArrowRight className="w-4 h-4" />
              </button>

              <button className="flex items-center justify-center gap-1.5 mx-auto text-sm"
                style={{ color: C.textMuted }}>
                <RefreshCw className="w-3.5 h-3.5" />
                Resend code in <span className="font-medium" style={{ color: C.green }}>00:58</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
