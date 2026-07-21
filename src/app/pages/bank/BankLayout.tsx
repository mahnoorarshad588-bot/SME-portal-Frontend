import { useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import sbpLogo from "@/imports/state_bank_of_pakistan_logo-1.png";
import { useApp } from "../../context/AppContext";
import { C } from "../../constants/colors";
import {
  LayoutDashboard, FileText, ClipboardCheck,
  Bell, LogOut, Settings, Menu, CheckCircle2,
  X, User as UserIcon, Mail, ThumbsUp, ThumbsDown,
} from "lucide-react";

const NAV = [
  { label: "Dashboard", icon: LayoutDashboard, key: "dashboard" },
  { label: "Application Queue", icon: FileText, key: "queue" },
  { label: "Under Assessment", icon: ClipboardCheck, key: "assessment" },
  { label: "Offers Issued", icon: CheckCircle2, key: "offers" },
  { label: "Offers Accepted by Applicant", icon: ThumbsUp, key: "offers_accepted" },
  { label: "Offers Rejected by Applicant", icon: ThumbsDown, key: "offers_rejected" },
];

// Pages reachable only via in-context actions (e.g. "Start assessment"), not a sidebar item
const HIDDEN_PAGE_TITLES: Record<string, string> = {
  reports: "Credit Assessment",
};

function SettingsModal({ onClose }: { onClose: () => void }) {
  const { user, setUser } = useApp();
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifyApp, setNotifyApp] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setUser({ name: name.trim() || "Bank Officer", email: email.trim() });
    setSaved(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(15,23,42,0.5)" }}>
      <div className="w-full max-w-md rounded-2xl border" style={{ background: C.surface, border: `1.5px solid ${C.border}` }}>
        <div className="flex items-start justify-between p-5 border-b" style={{ borderColor: C.border }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: C.blueLight }}>
              <Settings className="w-4.5 h-4.5" style={{ color: C.blue }} />
            </div>
            <h3 className="text-sm font-bold" style={{ color: C.text }}>Account Settings</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100" style={{ color: C.textMuted }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: C.text }}>Full Name</label>
            <div className="relative">
              <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: C.textMuted }} />
              <input type="text" value={name} onChange={e => { setName(e.target.value); setSaved(false); }}
                className="w-full rounded-xl border text-sm outline-none"
                style={{ padding: "10px 12px 10px 38px", border: `1.5px solid ${C.border}`, background: C.bg, color: C.text }} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: C.text }}>Email</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: C.textMuted }} />
              <input type="email" value={email} onChange={e => { setEmail(e.target.value); setSaved(false); }}
                className="w-full rounded-xl border text-sm outline-none"
                style={{ padding: "10px 12px 10px 38px", border: `1.5px solid ${C.border}`, background: C.bg, color: C.text }} />
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <label className="flex items-center justify-between p-2.5 rounded-xl border cursor-pointer" style={{ border: `1.5px solid ${C.border}` }}>
              <span className="text-sm" style={{ color: C.text }}>Email notifications</span>
              <input type="checkbox" className="rounded" checked={notifyEmail} onChange={() => { setNotifyEmail(v => !v); setSaved(false); }} />
            </label>
            <label className="flex items-center justify-between p-2.5 rounded-xl border cursor-pointer" style={{ border: `1.5px solid ${C.border}` }}>
              <span className="text-sm" style={{ color: C.text }}>In-app notifications</span>
              <input type="checkbox" className="rounded" checked={notifyApp} onChange={() => { setNotifyApp(v => !v); setSaved(false); }} />
            </label>
          </div>

          {saved && (
            <div className="rounded-xl p-3 flex gap-2.5" style={{ background: C.greenLight, border: `1.5px solid ${C.green}` }}>
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: C.green }} />
              <p className="text-xs leading-relaxed" style={{ color: C.green }}>Settings saved.</p>
            </div>
          )}
        </div>

        <div className="flex gap-3 p-5 border-t" style={{ borderColor: C.border }}>
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold border"
            style={{ border: `1.5px solid ${C.border}`, color: C.text }}>
            Close
          </button>
          <button onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ background: C.blue }}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BankLayout() {
  const navigate = useNavigate();
  const { user } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeKey, setActiveKey] = useState("dashboard");
  const [showSettings, setShowSettings] = useState(false);

  const sidebar = (
    <div className="flex flex-col h-full"
      style={{ background: "#ffffff", borderRight: `1.5px solid ${C.border}` }}>
      <div className="px-5 py-5 flex items-center gap-3 border-b" style={{ borderColor: C.border }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: C.blueLight, border: `1px solid ${C.blue}30` }}>
          <ImageWithFallback src={sbpLogo} alt="SBP" className="w-8 h-8 object-contain" />
        </div>
        <div className="min-w-0">
          <div className="font-bold text-xs leading-tight truncate" style={{ color: C.text }}>SBP SME Portal</div>
          <div className="text-xs" style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: C.textMuted }}>
            Bank Portal
          </div>
        </div>
      </div>

      <div className="px-3 py-2 mx-3 mt-3 rounded-xl" style={{ background: C.blueLight, border: `1px solid ${C.blue}25` }}>
        <div className="text-xs font-semibold" style={{ color: C.blue }}>HBL — SME Finance</div>
        <div className="text-xs" style={{ color: C.textMuted }}>Karachi Region</div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV.map(({ label, icon: Icon, key }) => {
          const active = activeKey === key;
          return (
            <button
              key={key}
              onClick={() => { setActiveKey(key); setSidebarOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
              style={{
                background: active ? C.blueLight : "transparent",
                color: active ? C.blue : C.textMuted,
                borderLeft: active ? `3px solid ${C.blue}` : "3px solid transparent",
              }}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </button>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t" style={{ borderColor: C.border }}>
        <button onClick={() => navigate("/")}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left hover:bg-gray-50"
          style={{ color: C.textMuted }}>
          <LogOut className="w-4 h-4 flex-shrink-0" />
          Sign Out
        </button>
        <div className="flex items-center gap-3 px-3 pt-3 mt-2 border-t" style={{ borderColor: C.border }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ background: C.blue }}>
            {user?.name?.[0] ?? "B"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold truncate" style={{ color: C.text }}>{user?.name ?? "Bank Officer"}</div>
            <div className="text-xs truncate" style={{ fontSize: "10px", color: C.textMuted }}>{user?.email ?? ""}</div>
          </div>
          <button onClick={() => setShowSettings(true)} className="p-1 rounded-lg hover:bg-gray-100 flex-shrink-0">
            <Settings className="w-3.5 h-3.5" style={{ color: C.textMuted }} />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Manrope', sans-serif", background: C.bg }}>
      <div className="hidden lg:flex w-[240px] flex-shrink-0 flex-col h-full">
        {sidebar}
      </div>

      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64 flex-shrink-0 h-full">{sidebar}</div>
          <div className="flex-1" style={{ background: "rgba(0,0,0,0.5)" }} onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-14 flex items-center px-5 gap-4 flex-shrink-0 border-b"
          style={{ background: C.surface, borderColor: C.border }}>
          <button className="lg:hidden p-1" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" style={{ color: C.textMuted }} />
          </button>

          <div className="flex-1">
            <div className="text-sm font-semibold capitalize" style={{ color: C.text }}>
              {NAV.find(n => n.key === activeKey)?.label ?? HIDDEN_PAGE_TITLES[activeKey] ?? "Dashboard"}
            </div>
          </div>

          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-all" style={{ color: C.textMuted }}>
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: C.orange }} />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: C.blue }}>
              {user?.name?.[0] ?? "B"}
            </div>
            <span className="hidden md:block text-sm font-medium" style={{ color: C.text }}>
              {user?.name?.split(" ")[0] ?? "Officer"}
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet context={{ activeKey, setActiveKey }} />
        </main>
      </div>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </div>
  );
}
