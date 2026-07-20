import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import sbpLogo from "@/imports/state_bank_of_pakistan_logo-1.png";
import { useApp } from "../../context/AppContext";
import { C } from "../../constants/colors";
import {
  LayoutDashboard, Building2, PlusCircle, FileText, MapPin,
  Bell, ChevronDown, LogOut, Settings, Menu, X, User,
  ChevronRight, Home, Search,
} from "lucide-react";

const NAV = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/sme", color: C.green },
  { label: "My Businesses", icon: Building2, path: "/sme/businesses", color: C.blue },
  { label: "New Application", icon: PlusCircle, path: "/sme/apply", color: C.orange },
  { label: "My Applications", icon: FileText, path: "/sme/applications", color: C.blue },
  { label: "Track Application", icon: MapPin, path: "/sme/tracking", color: C.green },
];

export default function SmeLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, businesses, selectedBusiness, setSelectedBusiness } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bizDropdown, setBizDropdown] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const isActive = (path: string) =>
    path === "/sme" ? location.pathname === "/sme" : location.pathname.startsWith(path);

  const sidebar = (
    <div className="flex flex-col h-full" style={{ background: "#ffffff", borderRight: `1.5px solid ${C.border}` }}>
      {/* Logo */}
      <div className="px-5 py-5 flex items-center gap-3 border-b" style={{ borderColor: C.border }}>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: C.greenLight, border: `1px solid ${C.green}30` }}>
          <ImageWithFallback src={sbpLogo} alt="SBP" className="w-8 h-8 object-contain" />
        </div>
        <div className="min-w-0">
          <div className="font-bold text-xs leading-tight truncate" style={{ color: C.text }}>SBP SME Portal</div>
          <div className="text-xs" style={{ fontFamily: "var(--font-mono)", fontSize: "10px", color: C.textMuted }}>
            Applicant
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <div className="px-3 mb-3 flex items-center gap-2">
          <div className="w-1 h-3.5 rounded-full" style={{ background: C.green }} />
          <span className="text-xs font-extrabold uppercase tracking-widest"
            style={{ fontFamily: "var(--font-mono)", fontSize: "11px", color: C.green }}>Main Menu</span>
        </div>
        {NAV.map(({ label, icon: Icon, path, color }) => {
          const active = isActive(path);
          return (
            <button
              key={path}
              onClick={() => { navigate(path); setSidebarOpen(false); }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
              style={{
                background: active ? `${color}15` : "transparent",
                color: active ? color : C.text,
                borderLeft: active ? `3px solid ${color}` : "3px solid transparent",
              }}
            >
              <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all"
                style={{ background: active ? color : `${color}15` }}>
                <Icon className="w-4 h-4" style={{ color: active ? "#FFFFFF" : color }} />
              </div>
              {label}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-3 py-4 border-t" style={{ borderColor: C.border }}>
        <button onClick={() => { navigate("/"); setSidebarOpen(false); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left hover:bg-gray-50 mb-1"
          style={{ color: C.text }}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${C.gold}18` }}>
            <Home className="w-4 h-4" style={{ color: C.gold }} />
          </div>
          Home Page
        </button>
        <button onClick={() => navigate("/")}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left hover:bg-gray-50"
          style={{ color: C.textMuted }}>
          <LogOut className="w-4 h-4 flex-shrink-0" />
          Sign Out
        </button>
        <div className="flex items-center gap-3 px-3 pt-3 mt-2 border-t" style={{ borderColor: C.border }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
            style={{ background: C.green }}>
            {user?.name?.[0] ?? "A"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-xs font-semibold truncate" style={{ color: C.text }}>{user?.name ?? "User"}</div>
            <div className="text-xs truncate" style={{ fontSize: "10px", color: C.textMuted }}>{user?.email ?? ""}</div>
          </div>
          <Settings className="w-3.5 h-3.5 flex-shrink-0" style={{ color: C.textMuted }} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden" style={{ fontFamily: "'Manrope', sans-serif", background: C.bg }}>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex w-[240px] flex-shrink-0 flex-col h-full"
        style={{ background: "#ffffff" }}>
        {sidebar}
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="w-64 flex-shrink-0 h-full">{sidebar}</div>
          <div className="flex-1" style={{ background: "rgba(0,0,0,0.5)" }} onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="h-auto min-h-14 flex flex-wrap items-center px-3 sm:px-5 py-2 gap-2 sm:gap-3 flex-shrink-0 border-b"
          style={{ background: C.surface, borderColor: C.border }}>

          <button className="lg:hidden p-1 flex-shrink-0" onClick={() => setSidebarOpen(true)} style={{ color: C.textMuted }}>
            <Menu className="w-5 h-5" />
          </button>

          {/* Page title */}
          <div className="hidden xl:block pr-4 mr-1 border-r flex-shrink-0" style={{ borderColor: C.border }}>
            <div className="text-sm font-bold leading-tight" style={{ color: C.text }}>
              {NAV.find(n => isActive(n.path))?.label ?? "Dashboard"}
            </div>
            <div className="text-xs" style={{ color: C.textMuted, fontFamily: "var(--font-mono)", fontSize: "10px" }}>
              SME Applicant Portal
            </div>
          </div>

          {/* Business selector */}
          <div className="relative flex-shrink-0 min-w-0">
            <button
              onClick={() => setBizDropdown(!bizDropdown)}
              className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg border text-sm font-medium transition-all min-w-0"
              style={{ border: `1.5px solid ${C.border}`, color: C.text, background: C.bg }}>
              <Building2 className="w-3.5 h-3.5 flex-shrink-0" style={{ color: C.green }} />
              <span className="max-w-[90px] sm:max-w-[140px] truncate">{selectedBusiness?.name}</span>
              <ChevronDown className="w-3.5 h-3.5 flex-shrink-0" style={{ color: C.textMuted }} />
            </button>
            {bizDropdown && (
              <div className="absolute top-full left-0 mt-1 w-56 max-w-[85vw] rounded-xl border shadow-lg overflow-hidden z-10"
                style={{ background: C.surface, border: `1.5px solid ${C.border}` }}>
                {businesses.map(b => (
                  <button key={b.id} onClick={() => { setSelectedBusiness(b); setBizDropdown(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition-all hover:bg-gray-50"
                    style={{ color: C.text, background: selectedBusiness?.id === b.id ? C.greenLight : undefined }}>
                    <div>
                      <div className="font-medium text-xs">{b.name}</div>
                      <div className="text-xs" style={{ color: C.textMuted }}>{b.nature}</div>
                    </div>
                    {selectedBusiness?.id === b.id && <ChevronRight className="w-3 h-3" style={{ color: C.green }} />}
                  </button>
                ))}
                <div className="border-t" style={{ borderColor: C.border }}>
                  <button onClick={() => { navigate("/sme/setup"); setBizDropdown(false); }}
                    className="w-full text-left px-4 py-2.5 text-sm font-medium flex items-center gap-2 hover:bg-gray-50"
                    style={{ color: C.green }}>
                    <PlusCircle className="w-3.5 h-3.5" /> Add New Business
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Search */}
          <div className="hidden md:flex relative flex-1 min-w-[100px] max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: C.textMuted }} />
            <input type="text" placeholder="Search applications, businesses..."
              className="w-full rounded-lg border text-xs outline-none transition-all"
              style={{ padding: "8px 12px 8px 30px", border: `1.5px solid ${C.border}`, background: C.bg, color: C.text }}
              onFocus={e => { e.currentTarget.style.border = `1.5px solid ${C.green}`; e.currentTarget.style.background = C.surface; }}
              onBlur={e => { e.currentTarget.style.border = `1.5px solid ${C.border}`; e.currentTarget.style.background = C.bg; }} />
          </div>

          <div className="hidden md:block flex-1" />

          {/* Notifications */}
          <div className="relative flex-shrink-0 ml-auto md:ml-0">
            <button onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-all"
              style={{ color: C.textMuted }}>
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full" style={{ background: C.orange }} />
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-full mt-1 w-72 max-w-[90vw] rounded-xl border shadow-lg z-10"
                style={{ background: C.surface, border: `1.5px solid ${C.border}` }}>
                <div className="px-4 py-3 border-b flex items-center justify-between"
                  style={{ borderColor: C.border }}>
                  <span className="text-sm font-semibold" style={{ color: C.text }}>Notifications</span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                    style={{ background: C.orangeLight, color: C.orange }}>3 New</span>
                </div>
                {[
                  { title: "Application Under Review", desc: "SBP-SME-2025-00142 is being reviewed by HBL", time: "2h ago", dot: C.blue },
                  { title: "Offer Received", desc: "MCB Bank has issued a conditional offer for XYZ Foods", time: "Yesterday", dot: C.green },
                  { title: "Document Required", desc: "Additional documents requested for ABC Traders application", time: "2 days ago", dot: C.orange },
                ].map(({ title, desc, time, dot }) => (
                  <div key={title} className="px-4 py-3 border-b hover:bg-gray-50 cursor-pointer"
                    style={{ borderColor: C.border }}>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: dot }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold" style={{ color: C.text }}>{title}</p>
                        <p className="text-xs leading-snug mt-0.5" style={{ color: C.textMuted }}>{desc}</p>
                        <p className="text-xs mt-1" style={{ color: C.textMuted, fontSize: "10px" }}>{time}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User avatar */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{ background: C.green }}>
              {user?.name?.[0] ?? "A"}
            </div>
            <span className="hidden lg:block text-sm font-medium" style={{ color: C.text }}>
              {user?.name?.split(" ")[0] ?? "User"}
            </span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
