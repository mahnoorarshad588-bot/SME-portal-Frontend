import { useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import sbpLogo from "@/imports/state_bank_of_pakistan_logo-1.png";
import { useApp } from "../../context/AppContext";
import { C } from "../../constants/colors";
import {
  LayoutDashboard, Users, Building2, BarChart2, ScrollText,
  Bell, LogOut, Settings, Menu, ShieldCheck,
} from "lucide-react";

const NAV = [
  { label: "Executive Dashboard", icon: LayoutDashboard, key: "dashboard" },
  { label: "Applications", icon: ScrollText, key: "applications" },
  { label: "User Management", icon: Users, key: "users" },
  { label: "Bank Management", icon: Building2, key: "banks" },
  { label: "Reports", icon: BarChart2, key: "reports" },
  { label: "Audit Trail", icon: ShieldCheck, key: "audit" },
];

export default function SbpLayout() {
  const navigate = useNavigate();
  const { user } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeKey, setActiveKey] = useState("dashboard");

  const sidebar = (
    <div className="flex flex-col h-full"
      style={{ background: "#ffffff", borderRight: `1.5px solid ${C.border}` }}>
      <div className="px-5 py-5 flex items-center gap-3 border-b" style={{ borderColor: C.border }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: C.orangeLight, border: `1px solid ${C.orange}30` }}>
          <ImageWithFallback src={sbpLogo} alt="SBP" className="w-8 h-8 object-contain" />
        </div>
        <div className="min-w-0">
          <div className="font-bold text-xs leading-tight truncate" style={{ color: C.text }}>SBP SME Portal</div>
          <div className="text-xs" style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: C.textMuted }}>
            Administrator
          </div>
        </div>
      </div>

      <div className="px-3 py-2 mx-3 mt-3 rounded-xl flex items-center gap-2"
        style={{ background: C.orangeLight, border: `1px solid ${C.orange}25` }}>
        <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" style={{ color: C.orange }} />
        <div>
          <div className="text-xs font-semibold" style={{ color: C.orange }}>SBP Admin</div>
          <div className="text-xs" style={{ color: C.textMuted }}>Elevated Privileges</div>
        </div>
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
                background: active ? C.orangeLight : "transparent",
                color: active ? C.orange : C.textMuted,
                borderLeft: active ? `3px solid ${C.orange}` : "3px solid transparent",
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
            style={{ background: C.orange }}>
            {user?.name?.[0] ?? "A"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold truncate" style={{ color: C.text }}>{user?.name ?? "SBP Admin"}</div>
            <div className="text-xs truncate" style={{ fontSize: "10px", color: C.textMuted }}>{user?.email ?? ""}</div>
          </div>
          <Settings className="w-3.5 h-3.5 flex-shrink-0" style={{ color: C.textMuted }} />
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
            <div className="text-sm font-semibold" style={{ color: C.text }}>
              {NAV.find(n => n.key === activeKey)?.label ?? "Dashboard"}
            </div>
          </div>
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-all" style={{ color: C.textMuted }}>
            <Bell className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: C.orange }}>
              {user?.name?.[0] ?? "A"}
            </div>
            <span className="hidden md:block text-sm font-medium" style={{ color: C.text }}>
              {user?.name?.split(" ")[0] ?? "Admin"}
            </span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet context={{ activeKey }} />
        </main>
      </div>
    </div>
  );
}
