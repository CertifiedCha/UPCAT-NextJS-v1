"use client";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { useState } from "react";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard", href: "/dashboard" },
  { id: "materials", label: "Study Materials", icon: "menu_book", href: "/materials" },
  { id: "mockexams", label: "Mock Exams", icon: "quiz", href: "/mock-exams" },
  { id: "analytics", label: "Analytics", icon: "leaderboard", href: "/analytics" },
  { id: "archive", label: "Archive", icon: "inventory_2", href: "/archive" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, streak, resetAll } = useStore();
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <>
      {/* ── DESKTOP SIDEBAR ── */}
      <aside
        className="hidden md:flex fixed left-0 top-0 h-full w-64 z-40 flex-col py-6 pt-20 gap-2"
        style={{
          backgroundColor: "#fcf9f1",
          borderRight: "1px solid rgba(223, 191, 188, 0.15)",
        }}
      >
        <div className="px-6 mb-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
            Academic Archive
          </p>
          <p className="text-[10px] mt-0.5" style={{ color: "rgba(88,65,63,0.5)" }}>
            UPCAT Preparatory Hub
          </p>
        </div>

        <nav className="flex flex-col gap-1 flex-1" id="sidebar-nav">
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <button
                key={item.id}
                onClick={() => router.push(item.href)}
                className="flex items-center gap-3 px-4 py-3 mx-2 rounded-xl transition-all cursor-pointer text-left"
                style={
                  active
                    ? { background: "linear-gradient(135deg,#570005,#7B1113)", color: "#fff" }
                    : { color: "#58413f" }
                }
                onMouseEnter={(e) => {
                  if (!active) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#f0eee5";
                }}
                onMouseLeave={(e) => {
                  if (!active) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
                }}
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}
                >
                  {item.icon}
                </span>
                <span className="text-sm font-medium tracking-wide">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="px-4 mt-auto">
          <div
            className="flex flex-col gap-1 pt-3"
            style={{ borderTop: "1px solid rgba(223,191,188,0.15)" }}
          >
            {streak.currentStreak > 0 && (
              <div className="flex items-center gap-2 px-4 py-2 mb-1">
                <span>🔥</span>
                <span className="text-xs font-bold text-on-surface-variant">
                  {streak.currentStreak} day streak
                </span>
              </div>
            )}
            <button
              onClick={() => setSettingsOpen(true)}
              className="flex items-center gap-3 text-[#58413f] px-4 py-2 hover:bg-[#f0eee5] rounded-xl text-sm cursor-pointer transition-colors"
            >
              <span className="material-symbols-outlined text-sm">settings</span>
              <span className="font-medium">Settings</span>
            </button>
            <button className="flex items-center gap-3 text-[#58413f] px-4 py-2 hover:bg-[#f0eee5] rounded-xl text-sm transition-colors">
              <span className="material-symbols-outlined text-sm">help_outline</span>
              <span className="font-medium">Help</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ── TOP BAR ── */}
      <header
        className="fixed top-0 w-full z-50 flex justify-between items-center h-16 px-6"
        style={{
          backgroundColor: "rgba(252,249,241,0.9)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(223,191,188,0.2)",
        }}
      >
        <span
          className="text-[#7B1113] font-black tracking-tighter text-2xl cursor-pointer select-none"
          onClick={() => router.push("/dashboard")}
        >
          UPCAT Hub
        </span>

        <div className="hidden sm:flex items-center bg-surface-container px-3 py-1.5 rounded-full gap-2">
          <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 18 }}>
            search
          </span>
          <input
            className="bg-transparent border-none focus:ring-0 text-sm placeholder:text-on-surface-variant/50 w-52 outline-none"
            placeholder="Search resources..."
            type="text"
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-on-surface-variant hidden sm:block">
            {profile?.avatar} <span className="font-semibold">{profile?.name || "Scholar"}</span>
          </span>
          <button
            onClick={() => setSettingsOpen(true)}
            className="text-[#58413f] hover:bg-[#f0eee5] transition-colors p-2 rounded-xl"
          >
            <span className="material-symbols-outlined text-lg">settings</span>
          </button>
        </div>
      </header>

      {/* ── MOBILE BOTTOM NAV ── */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-50 flex"
        style={{
          backgroundColor: "rgba(252,249,241,0.95)",
          backdropFilter: "blur(12px)",
          borderTop: "1px solid rgba(223,191,188,0.2)",
        }}
      >
        {navItems.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <button
              key={item.id}
              onClick={() => router.push(item.href)}
              className="flex-1 flex flex-col items-center gap-0.5 py-3"
            >
              <span
                className="material-symbols-outlined text-xl"
                style={{
                  color: active ? "#7B1113" : "#58413f",
                  fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0",
                }}
              >
                {item.icon}
              </span>
              <span className="text-[9px] font-bold" style={{ color: active ? "#7B1113" : "#58413f" }}>
                {item.label.split(" ")[0]}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── SETTINGS MODAL ── */}
      {settingsOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center"
          style={{ background: "rgba(28,28,23,0.5)" }}
          onClick={() => setSettingsOpen(false)}
        >
          <div
            className="rounded-[1.5rem] p-8 w-full max-w-md mx-4 shadow-2xl"
            style={{ backgroundColor: "#fcf9f1", border: "1px solid rgba(223,191,188,0.2)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-[#7B1113] tracking-tight">Settings</h2>
              <button
                onClick={() => setSettingsOpen(false)}
                className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg hover:bg-[#f0eee5] transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-surface-container-low rounded-xl p-5">
                <h3 className="text-sm font-bold text-on-surface mb-1">Progress Data</h3>
                <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
                  Download your study progress and bookmarks as a JSON file.
                </p>
                <button className="w-full editorial-gradient text-white py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-sm">download</span>
                  Download Progress
                </button>
              </div>
              <div className="bg-surface-container-low rounded-xl p-5">
                <h3 className="text-sm font-bold text-on-surface mb-1">Reset Progress</h3>
                <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">
                  Clear all studied items, bookmarks, and saved data. Cannot be undone.
                </p>
                <button
                  onClick={() => {
                    if (confirm("Reset all progress? This cannot be undone.")) {
                      resetAll();
                      setSettingsOpen(false);
                      window.location.href = "/onboarding";
                    }
                  }}
                  className="w-full bg-transparent border border-[#7B1113]/30 text-[#7B1113] py-2.5 rounded-xl text-sm font-bold hover:bg-[#7B1113]/5 transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-sm">delete_forever</span>
                  Reset All Progress
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
