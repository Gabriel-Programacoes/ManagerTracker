"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Home, MapPin, Shield, TrendingUp, Users } from "lucide-react";
import { career } from "@/lib/mock-data";

const navItems = [
  { href: "/",              label: "Dashboard",     icon: Home },
  { href: "/squad",         label: "Squad",         icon: Users },
  { href: "/matches",       label: "Matches",       icon: CalendarDays },
  { href: "/transfers",     label: "Transfers",     icon: TrendingUp },
  { href: "/youth-academy", label: "Youth Academy", icon: Shield },
];

/** Returns a CSS color value based on league position */
function positionColor(pos: number): string {
  if (pos <= 4)  return "var(--win)";
  if (pos <= 6)  return "var(--caution)";
  if (pos <= 10) return "var(--neutral-mid)";
  return "var(--loss)";
}

/** Ordinal suffix: 1 → "1st", 2 → "2nd", etc. */
function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <main className="min-h-screen" style={{ background: "var(--background)", color: "var(--foreground)" }}>
      <div className="flex w-full min-h-screen gap-4 px-3 py-4 md:gap-0 md:px-0 md:py-0">

        {/* ── Desktop Sidebar ───────────────────────────────── */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col tactical-panel-structural md:flex" style={{ borderTop: "none", borderBottom: "none", borderLeft: "none" }}>

          {/* Brand + Identity */}
          <div className="sidebar-divider-b px-4 py-4">
            <p className="stat-label mb-2">Tactical Noir</p>
            <p
              className="text-2xl font-semibold uppercase leading-none tracking-wide"
              style={{ fontFamily: "var(--font-teko), sans-serif", color: "var(--foreground)" }}
            >
              ManagerTracker
            </p>
          </div>

          {/* Club Info */}
          <div className="sidebar-divider-b px-4 py-3">
            <p className="stat-label mb-1.5">Current Club</p>
            <p className="text-sm font-medium" style={{ color: "var(--foreground)" }}>{career.currentClub}</p>
            <div className="mt-1.5 flex items-center gap-2">
              <MapPin className="h-3 w-3 text-(--muted)" aria-hidden="true" />
              <span
                className="text-xs font-semibold tabular-nums"
                style={{ color: positionColor(career.leaguePosition) }}
              >
                {ordinal(career.leaguePosition)} Place
              </span>
              <span className="text-(--muted-dim)">·</span>
              <span className="text-xs text-(--muted)">{career.currentSeason}</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-2 py-3" aria-label="Primary Navigation">
            <p className="stat-label px-3 pb-2">Navigation</p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`nav-item ${isActive ? "active" : ""}`}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="min-w-0 truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="sidebar-divider-t px-4 py-3">
            <div className="mb-2 flex items-center gap-2">
              <span className="live-dot" aria-hidden="true" />
              <span className="stat-label">Season Active</span>
            </div>
            <p className="text-xs text-(--muted)">{career.managerName}</p>
            <p className="stat-label mt-0.5">{career.currentSeason}</p>
          </div>
        </aside>

        {/* ── Main Content ──────────────────────────────────── */}
        <div className="min-w-0 flex-1 flex flex-col min-h-screen">

          {/* Mobile Header */}
          <header className="mb-4 tactical-panel p-3 md:hidden">
            <div className="mb-2.5 flex items-center justify-between">
              <div>
                <p
                  className="text-xl font-semibold uppercase leading-none tracking-wide"
                  style={{ fontFamily: "var(--font-teko), sans-serif", color: "var(--foreground)" }}
                >
                  ManagerTracker
                </p>
                <p className="stat-label mt-0.5">{career.currentClub} · {career.currentSeason}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="live-dot" aria-hidden="true" />
                <span
                  className="text-xs font-semibold tabular-nums"
                  style={{ color: positionColor(career.leaguePosition) }}
                >
                  {ordinal(career.leaguePosition)}
                </span>
              </div>
            </div>
            <nav className="flex flex-wrap gap-1.5" aria-label="Mobile Navigation">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className="rounded-full border px-3 py-1 text-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--accent)"
                    style={isActive
                      ? { borderColor: "rgba(82,222,229,0.3)", background: "rgba(82,222,229,0.06)", color: "var(--accent-strong)" }
                      : { borderColor: "var(--panel-border)", background: "var(--panel-bg)", color: "var(--muted)" }
                    }
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </header>

          <section className="tactical-panel-structural flex-1 p-6 md:p-8" style={{ borderTop: "none", borderBottom: "none", borderRight: "none" }}>{children}</section>
        </div>
      </div>
    </main>
  );
}
