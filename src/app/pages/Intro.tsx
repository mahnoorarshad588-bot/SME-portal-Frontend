import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useApp } from "../context/AppContext";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import sbpLogo from "@/imports/state_bank_of_pakistan_logo-2.png";
import sbpBuildingHero from "@/imports/sbp-building-hero.jpg";
import {
  ArrowRight, ArrowUpRight, CheckCircle2,
  Store, Landmark, ShieldCheck,
  FileText, MapPin, ClipboardCheck, Upload, Building2, Bell,
  Users, Banknote,
  ChevronDown, ChevronUp, Phone, Mail, Globe, Menu, X,
} from "lucide-react";

const G = {
  green: "#006838", greenDark: "#004F2A", greenLight: "#EAF6EF",
  blue: "#1D4ED8", blueLight: "#EFF6FF",
  orange: "#EA580C", orangeLight: "#FFF7ED",
  text: "#1F2937", textMuted: "#6B7280",
  border: "#E5E7EB", bg: "#FFFFFF", surface: "#FFFFFF",
};

const NAV_LINKS = ["Home", "About", "How It Works", "FAQ", "Contact"];

const HERO = {
  image: sbpBuildingHero,
  eyebrow: "State Bank of Pakistan — Digital Initiative",
  heading: ["Financing Growth.", "Empowering SMEs."],
  body: "Pakistan's national digital platform connecting small businesses with SBP-regulated banks for concessional financing — transparent, fast, and fully secure.",
  ctaLabel: "Apply Now",
  overlay: "linear-gradient(100deg, rgba(6,20,15,0.92) 0%, rgba(6,20,15,0.78) 32%, rgba(6,20,15,0.45) 60%, rgba(6,20,15,0.15) 100%)",
};

/* ── Scroll-triggered fade-up reveal (mirrors sbp.org.pk's data-aos="fade-up") ── */
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}>
      {children}
    </div>
  );
}

/* ── Minimal gradient-stroke border wrapper — used for every card/box on the page ── */
function GradientBox({ accent, hover = false, className = "", innerClassName = "", innerStyle = {}, children }: {
  accent: string; hover?: boolean; className?: string; innerClassName?: string; innerStyle?: React.CSSProperties; children: React.ReactNode;
}) {
  return (
    <div className={`rounded-2xl p-px ${className}`}
      style={{ background: `linear-gradient(135deg, ${accent}${hover ? "80" : "40"}, ${accent}${hover ? "35" : "0A"})`, transition: "background 0.25s" }}>
      <div className={`h-full w-full rounded-2xl ${innerClassName}`} style={innerStyle}>
        {children}
      </div>
    </div>
  );
}

const ROLES = [
  {
    id: "sme" as const, title: "SME Applicant", titleUrdu: "درخواست گزار",
    tagline: "Apply & Track", path: "/sme/login", icon: Store,
    accent: "#22C55E", accentDim: "rgba(34,197,94,0.12)",
    border: "rgba(34,197,94,0.25)", hoverBorder: "rgba(34,197,94,0.7)",
    features: ["6-step digital wizard", "Multi-business profiles", "Offer acceptance flow"],
    stat: { value: "1.2M+", label: "Active Borrowers" },
    desc: "Apply for concessional financing, manage multiple business profiles, and track every stage of your application in real time.",
  },
  {
    id: "bank" as const, title: "Participating Bank", titleUrdu: "بینک پورٹل",
    tagline: "Assess & Approve", path: "/bank/login", icon: Landmark,
    accent: "#60A5FA", accentDim: "rgba(96,165,250,0.12)",
    border: "rgba(96,165,250,0.25)", hoverBorder: "rgba(96,165,250,0.7)",
    features: ["Application queue", "Credit assessment tools", "Offer generation"],
    stat: { value: "32", label: "Partner Banks" },
    desc: "Manage your SME application queue, conduct credit assessments, generate conditional offers and process disbursements.",
  },
  {
    id: "sbp" as const, title: "SBP Administrator", titleUrdu: "ریاستی بینک",
    tagline: "Monitor & Report", path: "/sbp/login", icon: ShieldCheck,
    accent: "#FB923C", accentDim: "rgba(251,146,60,0.12)",
    border: "rgba(251,146,60,0.25)", hoverBorder: "rgba(251,146,60,0.7)",
    features: ["Executive KPI dashboard", "Bank & user management", "Audit trail"],
    stat: { value: "PKR 340B", label: "Total Disbursed" },
    desc: "Oversee the entire financing ecosystem with executive dashboards, manage participating banks, users, and generate compliance reports.",
  },
];

const CORE_FUNCTIONS = [
  { icon: Banknote,       title: "SME Financing",         desc: "Collateral-free concessional loans for eligible small businesses.", accent: G.green },
  { icon: Landmark,       title: "Bank Assessment",        desc: "Credit evaluation and approval through 32 partner banks.",          accent: G.blue },
  { icon: MapPin,         title: "Application Tracking",   desc: "Real-time visibility into every stage of your application.",        accent: G.orange },
  { icon: Upload,         title: "Digital Documentation",  desc: "Secure, paperless submission of all required documents.",          accent: G.green },
  { icon: ShieldCheck,    title: "Regulatory Oversight",   desc: "Full compliance and audit trail under SBP supervision.",             accent: G.blue },
];

const FEATURES = [
  { icon: FileText,       title: "Loan Applications",      desc: "Submit financing applications end-to-end through a guided 6-step digital wizard.",              color: G.green,  bg: G.greenLight },
  { icon: MapPin,         title: "Application Tracking",   desc: "Monitor every stage in real time with live status updates and interactive timelines.",            color: G.blue,   bg: G.blueLight  },
  { icon: ClipboardCheck, title: "Eligibility Check",      desc: "Instantly verify your eligibility for SBP concessional schemes before submitting.",               color: G.orange, bg: G.orangeLight},
  { icon: Upload,         title: "Secure Document Upload", desc: "Upload required documents through a fully encrypted, SBP-compliant document vault.",              color: G.green,  bg: G.greenLight },
  { icon: Building2,      title: "Bank Integration",       desc: "Connect seamlessly with 32 SBP-regulated partner banks for assessment and disbursement.",          color: G.blue,   bg: G.blueLight  },
  { icon: Bell,           title: "Notifications",          desc: "Receive instant alerts at every decision point — application received, assessed, or approved.",    color: G.orange, bg: G.orangeLight},
];

const HOW_STEPS = [
  { n: "01", title: "Register & Verify",    desc: "Create your account, verify CNIC and business registration through SBP's secure digital KYC." },
  { n: "02", title: "Complete Application", desc: "Fill the guided wizard: business info, shareholders, financing need, bank selection, documents." },
  { n: "03", title: "Bank Assessment",      desc: "Your chosen bank reviews the application, conducts credit assessment and issues a conditional offer." },
  { n: "04", title: "Accept & Disburse",    desc: "Accept the offer, submit post-approval legal documents, and receive disbursement to your account." },
];

const ANNOUNCEMENTS = [
  { date: "July 15, 2026", tag: "Scheme Launch", title: "SBP Expands Rozgar Scheme Financing Limit to PKR 10 Million",            tagColor: G.green  },
  { date: "July 09, 2026", tag: "Policy Update", title: "Revised Eligibility Criteria for Women Entrepreneurs Fund Effective Aug 2026", tagColor: G.blue  },
  { date: "July 02, 2026", tag: "Notification",  title: "New Agricultural Credit Now Available Through 8 Additional Partner Banks",  tagColor: G.orange },
  { date: "June 28, 2026", tag: "Circular",      title: "SBP Issues Guidelines on Digital Documentation for SME Applications",       tagColor: G.green  },
];

const FAQS = [
  { q: "Who is eligible to apply for SME financing through this portal?", a: "Any registered business with a valid CNIC, NTN, and business registration certificate operating in Pakistan's SME sector. Use the Eligibility Check feature before applying." },
  { q: "How long does the financing approval process take?", a: "Average approval is 7 working days from complete submission. This depends on the bank's internal assessment and completeness of submitted documents." },
  { q: "Which banks are available on the portal?", a: "32 SBP-regulated commercial and microfinance banks are integrated, including HBL, MCB, UBL, NBP, Allied Bank, Meezan Bank, Bank Alfalah, and more." },
  { q: "Is my data secure on this platform?", a: "All data is 256-bit encrypted, stored in SBP-compliant data centres, and subject to Pakistan's data protection guidelines. Regular security audits are conducted." },
  { q: "What documents are required for the application?", a: "Core documents: CNIC, business registration, NTN certificate, 2 years of audited financials, and 6-month bank statements. Additional docs may be required per scheme." },
];

export default function Intro() {
  const navigate = useNavigate();
  const { setRole } = useApp();
  const [hoveredRole, setHoveredRole]       = useState<string | null>(null);
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [openFaq, setOpenFaq]               = useState<number | null>(null);
  const [mobileNavOpen, setMobileNavOpen]   = useState(false);

  const visibleRoles = ROLES;

  const handleRole = (id: "sme" | "bank" | "sbp", path: string) => {
    setRole(id);
    navigate(path);
  };

  return (
    <div className="flex flex-col bg-white" style={{ fontFamily: "'Manrope', sans-serif" }}>

      {/* top accent line */}
      <div className="h-[3px]" style={{ background: `linear-gradient(90deg, ${G.green}, #3B82F6 50%, ${G.orange})` }} />

      {/* ── NAVBAR ── */}
      <header className="sticky top-0 z-30 bg-white" style={{ borderBottom: `1px solid ${G.border}` }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 h-[66px] flex items-center justify-between gap-8">
          <div className="flex items-center gap-3 flex-shrink-0">
            <ImageWithFallback src={sbpLogo} alt="SBP" className="w-11 h-11 object-contain" />
            <div>
              <div className="font-black text-xs uppercase tracking-widest" style={{ color: G.green, letterSpacing: "0.1em" }}>State Bank of Pakistan</div>
              <div className="text-xs" style={{ color: G.textMuted, fontFamily: "var(--font-mono)", fontSize: "9px" }}>SME Elevate Portal — بینک دولت پاکستان</div>
            </div>
          </div>
          <nav className="hidden lg:flex items-center gap-7">
            {NAV_LINKS.map((link, i) => (
              <a key={link} href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                className="text-xs font-bold uppercase transition-colors"
                style={{ color: i === 0 ? G.green : G.text, letterSpacing: "0.08em", borderBottom: i === 0 ? `2px solid ${G.green}` : "2px solid transparent", paddingBottom: "3px" }}>
                {link}
              </a>
            ))}
          </nav>

          <button onClick={() => document.getElementById("access-portal")?.scrollIntoView({ behavior: "smooth" })}
            className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold text-white hover:opacity-90 active:scale-[0.97] transition-all flex-shrink-0"
            style={{ background: G.blue }}>
            Login / Sign Up <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Mobile menu toggle */}
          <button onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="lg:hidden p-2 rounded-lg flex-shrink-0" style={{ color: G.text }}
            aria-label="Toggle navigation menu">
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu panel */}
        {mobileNavOpen && (
          <div className="lg:hidden px-6 py-4 border-t" style={{ borderColor: G.border, background: "#fff" }}>
            <nav className="flex flex-col gap-1 mb-4">
              {NAV_LINKS.map((link, i) => (
                <a key={link} href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
                  onClick={() => setMobileNavOpen(false)}
                  className="text-sm py-2.5 px-2 rounded-lg transition-colors"
                  style={{ color: i === 0 ? G.green : G.text, fontWeight: i === 0 ? 700 : 500, background: i === 0 ? G.greenLight : "transparent" }}>
                  {link}
                </a>
              ))}
            </nav>
            <button onClick={() => { setMobileNavOpen(false); document.getElementById("access-portal")?.scrollIntoView({ behavior: "smooth" }); }}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-bold text-white hover:opacity-90 active:scale-[0.97] transition-all"
              style={{ background: G.blue }}>
              Login / Sign Up <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </header>

      {/* ══════════════════════════════════════════
          HERO — full-bleed image (sbp.org.pk-inspired)
      ══════════════════════════════════════════ */}
      <section id="home" className="relative overflow-hidden bg-black">
        <div className="relative" style={{ height: "min(600px, 78vh)" }}>
          <ImageWithFallback src={HERO.image} alt="State Bank of Pakistan head office"
            className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: HERO.overlay }} />

          <div className="relative z-10 h-full max-w-7xl mx-auto px-6 lg:px-10 flex items-center">
            <div className="max-w-xl">
              <span className="block text-xs font-black uppercase tracking-[0.22em] text-white/90 mb-4">
                {HERO.eyebrow}
              </span>
              <h1 className="mb-5" style={{ lineHeight: 1.08, letterSpacing: "-0.02em" }}>
                <span style={{ display: "block", fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: "clamp(2rem,3.6vw,3.1rem)", color: "#fff", textShadow: "0 2px 16px rgba(0,0,0,0.4)" }}>
                  {HERO.heading[0]}
                </span>
                <span style={{ display: "block", fontFamily: "'Manrope', sans-serif", fontWeight: 900, fontSize: "clamp(2rem,3.6vw,3.1rem)", background: "linear-gradient(110deg, #FCD34D 0%, #A7F3D0 55%, #93C5FD 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", paddingBottom: "6px" }}>
                  {HERO.heading[1]}
                </span>
              </h1>
              <p className="mb-8 text-[15px] leading-relaxed text-white/90" style={{ maxWidth: "460px", textShadow: "0 1px 8px rgba(0,0,0,0.35)" }}>
                {HERO.body}
              </p>
              <button onClick={() => navigate("/sme/login")}
                className="flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-bold text-white hover:opacity-90 active:scale-[0.97] transition-all"
                style={{ background: G.green }}>
                {HERO.ctaLabel} <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* stat strip */}
        <div className="relative z-10 bg-white" style={{ borderBottom: `1.5px solid ${G.border}` }}>
          <div className="max-w-5xl mx-auto px-6 lg:px-10 grid grid-cols-3">
            {[
              { val: "1.2M+",    label: "Registered SMEs", dot: G.green },
              { val: "PKR 340B", label: "Disbursed",        dot: G.blue },
              { val: "32",       label: "Partner Banks",    dot: G.orange },
            ].map(({ val, label, dot }, i) => (
              <div key={label} className="flex items-center justify-center gap-2.5 py-5"
                style={{ borderLeft: i > 0 ? `1.5px solid ${G.border}` : "none" }}>
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: dot }} />
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "14px", fontWeight: 700, color: "#0A0A0A" }}>{val}</div>
                  <div style={{ fontSize: "10px", color: G.textMuted }}>{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          MISSION STATEMENT — full-width bold text
      ══════════════════════════════════════════ */}
      <section id="about" style={{ background: "#fff", borderBottom: `1.5px solid ${G.border}` }}>
        <div className="max-w-5xl mx-auto px-6 lg:px-10 py-20 text-center">
          <Reveal>
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="h-px w-16 rounded-full" style={{ background: G.border }} />
              <span className="text-base font-black uppercase tracking-[0.28em]" style={{ color: G.green, fontFamily: "var(--font-mono)" }}>Our Mission</span>
              <div className="h-px w-16 rounded-full" style={{ background: G.border }} />
            </div>
            <blockquote style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: "clamp(1.4rem,2.8vw,2.2rem)", color: "#0A0A0A", lineHeight: 1.25, letterSpacing: "-0.025em" }} className="mb-12">
              "Pakistan's 5.2 million small businesses deserve fast, fair, and fully digital access to financing — backed by the full authority of the State Bank."
            </blockquote>
          </Reveal>

          {/* four horizontal pillars */}
          <Reveal delay={150}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px overflow-hidden rounded-2xl" style={{ border: `1.5px solid ${G.border}` }}>
              {[
                { val: "5.2M",    sub: "SMEs in Pakistan",       accent: G.green  },
                { val: "PKR 340B",sub: "Total disbursed",         accent: G.blue   },
                { val: "32",      sub: "Regulated partner banks", accent: G.orange },
                { val: "7 Days",  sub: "Avg. approval time",      accent: G.green  },
              ].map(({ val, sub, accent }) => (
                <div key={sub} className="py-8 px-4 text-center bg-white hover:bg-gray-50 transition-colors">
                  <div style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 800, fontSize: "clamp(1.4rem,2.5vw,2rem)", color: accent, lineHeight: 1, letterSpacing: "-0.03em" }}>{val}</div>
                  <div className="text-xs font-semibold mt-2.5" style={{ color: G.textMuted }}>{sub}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          KEY FEATURES + STATS
      ══════════════════════════════════════════ */}
      <section style={{ background: G.bg, borderBottom: `1.5px solid ${G.border}` }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">

          {/* Header row */}
          <Reveal>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-[2px] w-6 rounded-full" style={{ background: G.green }} />
                  <span className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: G.green, fontFamily: "var(--font-mono)" }}>Platform Capabilities</span>
                </div>
                <h2 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 900, fontSize: "clamp(1.6rem,2.5vw,2.1rem)", color: "#0A0A0A", letterSpacing: "-0.025em", lineHeight: 1.1 }}>
                  Everything you need,<br />built into one portal.
                </h2>
              </div>

              {/* Inline stat pills — unique horizontal ticker style */}
              <div className="flex flex-wrap gap-0 overflow-hidden rounded-xl" style={{ border: `1.5px solid ${G.border}`, background: "#fff" }}>
                {[
                  { val: "1.2M+",    label: "Registered SMEs", accent: G.green  },
                  { val: "PKR 340B", label: "Disbursed",        accent: G.blue   },
                  { val: "32",       label: "Partner Banks",    accent: G.orange },
                ].map(({ val, label, accent }, i) => (
                  <div key={label}
                    className="px-6 py-4 flex flex-col items-center justify-center"
                    style={{ borderLeft: i > 0 ? `1px solid ${G.border}` : "none", minWidth: "110px" }}>
                    <span style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 900, fontSize: "1.3rem", color: accent, letterSpacing: "-0.03em", lineHeight: 1 }}>{val}</span>
                    <span className="text-[10px] font-semibold mt-1 text-center" style={{ color: G.textMuted }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Feature grid — 2 col left + 1 tall right */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Left block: 2×2 smaller cards */}
            <div className="lg:col-span-2 grid grid-cols-2 gap-3 sm:gap-4">
              {FEATURES.slice(0, 4).map(({ icon: Icon, title, desc, color, bg }, i) => {
                const isHov = hoveredFeature === i;
                return (
                  <Reveal key={title} delay={i * 80} className="h-full">
                    <GradientBox accent={color} hover={isHov} className="h-full">
                      <div
                        onMouseEnter={() => setHoveredFeature(i)}
                        onMouseLeave={() => setHoveredFeature(null)}
                        className="h-full rounded-2xl p-3 sm:p-6 flex flex-col gap-2 sm:gap-4 transition-all duration-200 cursor-default"
                        style={{ background: isHov ? "#fff" : "#FAFBFB", boxShadow: isHov ? `0 12px 36px -4px ${color}22` : "none", transform: isHov ? "translateY(-3px)" : "none" }}>
                        <div className="flex items-center justify-between">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center" style={{ background: bg }}>
                            <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" style={{ color, width: "16px", height: "16px" }} />
                          </div>
                          <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 700, color: color + "55" }}>0{i + 1}</span>
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-bold mb-1 sm:mb-1.5" style={{ color: "#0A0A0A" }}>{title}</div>
                          <p className="text-[11px] sm:text-xs leading-relaxed" style={{ color: G.textMuted }}>{desc}</p>
                        </div>
                      </div>
                    </GradientBox>
                  </Reveal>
                );
              })}
            </div>

            {/* Right block: 2 stacked cards (2-up on mobile, stacked from lg) */}
            <div className="grid grid-cols-2 lg:flex lg:flex-col gap-3 sm:gap-4">
              {FEATURES.slice(4).map(({ icon: Icon, title, desc, color, bg }, i) => {
                const idx = i + 4;
                const isHov = hoveredFeature === idx;
                return (
                  <Reveal key={title} delay={idx * 80} className="flex-1">
                    <GradientBox accent={color} hover={isHov} className="h-full">
                      <div
                        onMouseEnter={() => setHoveredFeature(idx)}
                        onMouseLeave={() => setHoveredFeature(null)}
                        className="h-full rounded-2xl p-3 sm:p-6 flex flex-col gap-2 sm:gap-4 transition-all duration-200 cursor-default"
                        style={{ background: isHov ? "#fff" : "#FAFBFB", boxShadow: isHov ? `0 12px 36px -4px ${color}22` : "none", transform: isHov ? "translateY(-3px)" : "none" }}>
                        <div className="flex items-center justify-between">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center" style={{ background: bg }}>
                            <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5" style={{ color, width: "16px", height: "16px" }} />
                          </div>
                          <span style={{ fontFamily: "var(--font-mono)", fontSize: "11px", fontWeight: 700, color: color + "55" }}>0{idx + 1}</span>
                        </div>
                        <div>
                          <div className="text-xs sm:text-sm font-bold mb-1 sm:mb-1.5" style={{ color: "#0A0A0A" }}>{title}</div>
                          <p className="text-[11px] sm:text-xs leading-relaxed" style={{ color: G.textMuted }}>{desc}</p>
                        </div>
                      </div>
                    </GradientBox>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CORE FUNCTIONS — icon cards row
      ══════════════════════════════════════════ */}
      <section style={{ background: "#FFFFFF", borderBottom: `1.5px solid ${G.border}` }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
          <Reveal>
            <div className="text-center mb-12">
              <h2 className="mb-2" style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 900, fontSize: "clamp(1.8rem,3vw,2.4rem)", color: "#0A0A0A", lineHeight: 1.1, letterSpacing: "-0.03em" }}>
                Core Functions
              </h2>
              <p className="text-sm" style={{ color: G.textMuted }}>Explore our roles and responsibilities</p>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            {CORE_FUNCTIONS.map(({ icon: Icon, title, desc, accent }, i) => (
              <Reveal key={title} delay={i * 80} className="h-full">
                <GradientBox accent={accent} className="h-full">
                <button
                  onClick={() => document.getElementById("access-portal")?.scrollIntoView({ behavior: "smooth" })}
                  className="w-full h-full text-left rounded-2xl p-3 sm:p-6 flex flex-col gap-2 sm:gap-4 transition-all duration-200 hover:-translate-y-1"
                  style={{ background: "#FAFBFB", boxShadow: "0 1px 8px rgba(0,0,0,0.03)" }}>
                  <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center" style={{ background: accent + "18" }}>
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: accent }} />
                  </div>
                  <div>
                    <div className="text-xs sm:text-sm font-bold mb-1 sm:mb-1.5" style={{ color: "#0A0A0A" }}>{title}</div>
                    <p className="text-[11px] sm:text-xs leading-relaxed" style={{ color: G.textMuted }}>{desc}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold mt-auto pt-2" style={{ color: accent }}>
                    View more <ArrowRight className="w-3 h-3" />
                  </div>
                </button>
                </GradientBox>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          HOW IT WORKS — horizontal timeline
      ══════════════════════════════════════════ */}
      <section id="how-it-works" className="bg-white" style={{ borderBottom: `1.5px solid ${G.border}` }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16">
          <Reveal>
            <div className="text-center mb-14">
              <h2 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 900, fontSize: "clamp(1.5rem,2.5vw,2rem)", color: "#0A0A0A", letterSpacing: "-0.025em" }}>How It Works</h2>
            </div>
          </Reveal>

          {/* Connecting timeline row — always a single horizontal line of steps */}
          <div className="grid grid-cols-4 gap-0 relative">
            {/* connector line */}
            <div className="absolute top-[16px] sm:top-[22px] left-[12.5%] right-[12.5%] h-px" style={{ background: `linear-gradient(90deg, ${G.green}00, ${G.green}40 20%, ${G.green}40 80%, ${G.green}00)` }} />

            {HOW_STEPS.map(({ n, title, desc }, i) => (
              <Reveal key={n} delay={i * 100}>
                <div className="relative flex flex-col items-center text-center px-1 sm:px-4">
                  {/* step indicator */}
                  <div className="relative z-10 mb-2 sm:mb-6 flex flex-col items-center gap-2">
                    <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-white text-xs sm:text-sm font-black flex-shrink-0"
                      style={{ background: i === 0 ? G.green : "#fff", border: `2px solid ${G.green}`, color: i === 0 ? "#fff" : G.green, fontFamily: "var(--font-mono)" }}>
                      {n}
                    </div>
                  </div>
                  <div className="text-[11px] sm:text-sm font-bold mb-1 sm:mb-2 leading-tight" style={{ color: G.text }}>{title}</div>
                  <p className="hidden sm:block text-xs leading-relaxed" style={{ color: G.textMuted }}>{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          ACCESS PORTAL — role cards
      ══════════════════════════════════════════ */}
      <section id="access-portal" style={{ background: G.bg, borderBottom: `1.5px solid ${G.border}` }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14">
          <Reveal>
            <div className="text-center mb-10">
              <h2 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 900, fontSize: "clamp(1.5rem,2.5vw,2rem)", color: "#0A0A0A", letterSpacing: "-0.02em" }} className="mb-2">Access the Portal</h2>
              <p className="text-xs font-semibold tracking-[0.25em] uppercase mt-3" style={{ color: G.textMuted, fontFamily: "var(--font-mono)" }}>Select your role to continue</p>
            </div>
          </Reveal>
          <div className={`grid grid-cols-1 gap-4 ${visibleRoles.length === 1 ? "max-w-sm mx-auto" : visibleRoles.length === 2 ? "md:grid-cols-2 max-w-2xl mx-auto" : "md:grid-cols-3"}`}>
            {visibleRoles.map((role, i) => {
              const Icon = role.icon;
              const isHov = hoveredRole === role.id;
              return (
                <Reveal key={role.id} delay={i * 100} className="h-full">
                <GradientBox accent={role.accent} hover={isHov} className="h-full">
                <button
                  onClick={() => handleRole(role.id, role.path)}
                  onMouseEnter={() => setHoveredRole(role.id)}
                  onMouseLeave={() => setHoveredRole(null)}
                  className="w-full h-full relative text-left rounded-2xl overflow-hidden transition-all duration-300"
                  style={{ background: isHov ? G.surface : "#FAFBFC", transform: isHov ? "translateY(-5px)" : "none", boxShadow: isHov ? `0 20px 60px ${role.accent}22,0 4px 20px rgba(0,0,0,0.08)` : "0 1px 8px rgba(0,0,0,0.05)" }}>
                  <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: `linear-gradient(90deg,${role.accent},${role.accent}88)`, opacity: isHov ? 1 : 0.35 }} />
                  <div className="relative z-10 p-7">
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300" style={{ background: isHov ? role.accentDim : "#F0F2F0", border: `1.5px solid ${isHov ? role.border : "#E8ECEB"}` }}>
                        <Icon className="w-6 h-6" style={{ color: role.accent }} />
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold leading-none" style={{ color: "#000", fontFamily: "var(--font-mono)" }}>{role.stat.value}</div>
                        <div className="text-xs mt-0.5" style={{ color: G.textMuted }}>{role.stat.label}</div>
                      </div>
                    </div>
                    <h3 className="text-xl font-extrabold leading-tight mb-0.5" style={{ color: "#000" }}>{role.title}</h3>
                    <div className="text-xs font-bold uppercase tracking-wider mb-0.5" style={{ color: role.accent, fontFamily: "var(--font-mono)" }}>{role.tagline}</div>
                    <div className="text-xs mb-3" style={{ color: G.textMuted }}>{role.titleUrdu}</div>
                    <p className="text-sm leading-relaxed mb-5" style={{ color: G.textMuted }}>{role.desc}</p>
                    <div className="space-y-2 mb-6">
                      {role.features.map(f => (
                        <div key={f} className="flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: role.accent }} />
                          <span className="text-xs" style={{ color: G.textMuted }}>{f}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-4" style={{ borderTop: `1.5px solid ${isHov ? role.border : "#EAEEEC"}` }}>
                      <span className="text-sm font-bold" style={{ color: "#000" }}>Enter Portal</span>
                      <div className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300" style={{ background: isHov ? role.accent : "#F0F2F0", border: `1.5px solid ${isHov ? "transparent" : "#E0E5E3"}` }}>
                        <ArrowUpRight className="w-4 h-4" style={{ color: isHov ? "white" : G.textMuted }} />
                      </div>
                    </div>
                  </div>
                </button>
                </GradientBox>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── LATEST ANNOUNCEMENTS ── */}
      <section style={{ background: G.bg, borderBottom: `1.5px solid ${G.border}` }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
          <Reveal>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 900, fontSize: "clamp(1.4rem,2.5vw,1.9rem)", color: "#0A0A0A", letterSpacing: "-0.02em" }}>Latest Announcements</h2>
                <p className="text-sm mt-1" style={{ color: G.textMuted }}>Circulars, scheme updates and SBP notifications</p>
              </div>
              <button className="hidden sm:flex items-center gap-1.5 text-sm font-semibold hover:opacity-80 transition-all" style={{ color: G.green }}>
                View All <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </Reveal>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {ANNOUNCEMENTS.map(({ date, tag, title, tagColor }, i) => (
              <Reveal key={title} delay={i * 80} className="h-full">
                <GradientBox accent={tagColor} className="h-full">
                  <div className="h-full rounded-2xl p-3 sm:p-5 bg-white flex flex-col gap-2 sm:gap-3 hover:-translate-y-1 transition-all cursor-pointer"
                    style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.04)" }}>
                    <span className="text-[11px] sm:text-xs" style={{ color: G.textMuted }}>{date}</span>
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 sm:px-2.5 py-1 rounded-full w-fit"
                      style={{ background: tagColor + "18", color: tagColor, border: `1px solid ${tagColor}30` }}>{tag}</span>
                    <p className="text-xs sm:text-sm font-semibold leading-snug" style={{ color: G.green }}>{title}</p>
                  </div>
                </GradientBox>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="bg-white" style={{ borderBottom: `1.5px solid ${G.border}` }}>
        <div className="max-w-3xl mx-auto px-6 lg:px-10 py-14">
          <Reveal>
            <div className="text-center mb-10">
              <h2 style={{ fontFamily: "'Manrope', sans-serif", fontWeight: 900, fontSize: "clamp(1.5rem,2.5vw,2rem)", color: "#0A0A0A", letterSpacing: "-0.02em" }} className="mb-2">Frequently Asked Questions</h2>
              <p className="text-sm" style={{ color: G.textMuted }}>Common questions about eligibility, process, and documentation</p>
            </div>
          </Reveal>
          <div className="space-y-3">
            {FAQS.map(({ q, a }, i) => (
              <Reveal key={i} delay={i * 60}>
                <div className="rounded-2xl overflow-hidden transition-all"
                  style={{ border: `1.5px solid ${openFaq === i ? G.green + "50" : G.border}`, background: openFaq === i ? G.greenLight : G.surface }}>
                  <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left gap-4">
                    <span className="text-sm font-semibold" style={{ color: G.text }}>{q}</span>
                    {openFaq === i
                      ? <ChevronUp   className="w-4 h-4 flex-shrink-0" style={{ color: G.green }} />
                      : <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: G.textMuted }} />}
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-4">
                      <p className="text-sm leading-relaxed" style={{ color: G.textMuted }}>{a}</p>
                    </div>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: "#FFFFFF", borderTop: `1.5px solid ${G.border}` }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <ImageWithFallback src={sbpLogo} alt="SBP" className="w-10 h-10 object-contain" />
                <div>
                  <div className="font-bold text-xs uppercase tracking-widest" style={{ color: G.green }}>State Bank</div>
                  <div className="font-bold text-xs uppercase tracking-widest" style={{ color: G.green }}>of Pakistan</div>
                </div>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: G.textMuted }}>SME Elevate Portal — Pakistan's national digital platform for SME concessional financing.</p>
            </div>
            {[
              { heading: "Portal",    links: ["SME Applicant","Participating Bank","SBP Administrator","Register Now"], accent: G.green },
              { heading: "Resources", links: ["Eligibility Criteria","Required Documents","Financing Schemes","Help Center"], accent: G.blue },
              { heading: "Legal",     links: ["Privacy Policy","Terms of Use","Data Protection","Cookie Policy"], accent: G.orange },
            ].map(({ heading, links, accent }) => (
              <div key={heading}>
                <div className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: accent }}>{heading}</div>
                <ul className="space-y-2.5">
                  {links.map(l => (
                    <li key={l}><a href="#" className="text-xs transition-colors" style={{ color: G.textMuted }}>{l}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-5 pb-8 mb-6" style={{ borderBottom: `1px solid ${G.border}` }}>
            {[{ icon: Phone, text: "111-727-273 (Helpline)", accent: G.green },{ icon: Mail, text: "smefinance@sbp.org.pk", accent: G.blue },{ icon: Globe, text: "www.sbp.org.pk", accent: G.orange }].map(({ icon: Icon, text, accent }) => (
              <div key={text} className="flex items-center gap-2">
                <Icon className="w-3.5 h-3.5" style={{ color: accent }} />
                <span className="text-xs" style={{ color: G.textMuted }}>{text}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs" style={{ color: G.textMuted }}>© 2025 State Bank of Pakistan · بینک دولت پاکستان · All rights reserved</p>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: G.green }} />
              <span className="text-xs" style={{ color: G.textMuted, fontFamily: "var(--font-mono)" }}>SYSTEM OPERATIONAL</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
