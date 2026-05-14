"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Trophy } from "lucide-react";
import type { Career } from "@/lib/types";

interface DashboardHeroProps {
  career: Career;
}

function positionColor(pos: number): string {
  if (pos <= 4)  return "var(--win)";
  if (pos <= 6)  return "var(--caution)";
  if (pos <= 10) return "var(--neutral-mid)";
  return "var(--loss)";
}

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0]);
}

function fadeUp(delay: number) {
  return {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay, ease: [0.25, 0.1, 0.25, 1] },
  } as const;
}

export function DashboardHero({ career }: DashboardHeroProps) {
  const reduce = useReducedMotion();
  const totalGames = career.wins + career.draws + career.losses;
  const winRate = totalGames > 0 ? Math.round((career.wins / totalGames) * 100) : 0;

  // Ticker items duplicated for seamless infinite loop
  const tickerItems = [
    `WIN RATE ${winRate}%`,
    `TROPHIES ${career.trophies}`,
    `CLUB ${career.currentClub.toUpperCase()}`,
    `SEASON ${career.currentSeason}`,
    `POSITION ${ordinal(career.leaguePosition).toUpperCase()}`,
    `RECORD ${career.wins}W ${career.draws}D ${career.losses}L`,
  ];
  const tickerDouble = [...tickerItems, ...tickerItems];

  const anim = (delay: number) =>
    reduce ? {} : fadeUp(delay);

  return (
    <header className="mb-6 pb-5" style={{ borderBottom: "1px solid var(--divider)" }}>

      {/* ── Top row: label + trophy count ─────────────────── */}
      <motion.div
        {...anim(0)}
        className="mb-3 flex items-center justify-between"
      >
        <p className="stat-label">Manager · EA FC Career Mode</p>

        <div className="flex items-center gap-1.5 rounded-full border border-(--panel-border) px-3 py-1">
          <Trophy className="h-3 w-3" style={{ color: "var(--accent)" }} aria-hidden="true" />
          <span className="stat-label" style={{ color: "var(--accent)" }}>
            {career.trophies} Trophies
          </span>
        </div>
      </motion.div>

      {/* ── Manager Name ───────────────────────────────────── */}
      <motion.h1
        {...anim(0.07)}
        className="leading-[0.82] tracking-wide uppercase"
        style={{
          fontFamily: "var(--font-teko), sans-serif",
          fontSize: "clamp(3rem, 9vw, 6.5rem)",
          fontWeight: 700,
          letterSpacing: "0.02em",
          color: "var(--foreground)",
        }}
      >
        MGR //{" "}
        <span style={{ color: "var(--accent)" }}>
          {career.managerName.toUpperCase()}
        </span>
      </motion.h1>

      {/* ── Club · Season · Position row ───────────────────── */}
      <motion.div
        {...anim(0.14)}
        className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1"
      >
        <span className="text-sm font-medium" style={{ color: "var(--muted)" }}>
          {career.currentClub}
        </span>
        <span className="text-(--muted-dim)">·</span>
        <span className="stat-label">{career.currentSeason}</span>
        <span className="text-(--muted-dim)">·</span>
        <span
          className="stat-label font-semibold"
          style={{ color: positionColor(career.leaguePosition) }}
        >
          {ordinal(career.leaguePosition)} in the league
        </span>
      </motion.div>

      {/* ── W / D / L record pills ─────────────────────────── */}
      <motion.div
        {...anim(0.21)}
        className="mt-3 flex items-center gap-2"
        aria-label="Season record"
      >
        {/* Wins */}
        <div className="flex items-center gap-1.5 rounded-full border border-(--win)/20 bg-(--win)/5 px-3 py-1">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: "var(--win)" }}
            aria-hidden="true"
          />
          <span className="stat-label" style={{ color: "var(--win)" }}>
            {career.wins}W
          </span>
        </div>
        {/* Draws */}
        <div className="flex items-center gap-1.5 rounded-full border border-(--draw)/30 bg-(--draw)/5 px-3 py-1">
          <span
            className="h-1.5 w-1.5 rounded-full bg-(--draw)"
            aria-hidden="true"
          />
          <span className="stat-label text-(--draw)">{career.draws}D</span>
        </div>
        {/* Losses */}
        <div className="flex items-center gap-1.5 rounded-full border border-(--loss)/20 bg-(--loss)/5 px-3 py-1">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ background: "var(--loss)" }}
            aria-hidden="true"
          />
          <span className="stat-label" style={{ color: "var(--loss)" }}>
            {career.losses}L
          </span>
        </div>

        <span className="text-(--muted-dim) text-xs">·</span>

        {/* Win rate */}
        <span className="stat-label">
          {winRate}%{" "}
          <span className="text-(--muted-dim)">WIN RATE</span>
        </span>
      </motion.div>

      {/* ── Ticker strip ───────────────────────────────────── */}
      <motion.div
        {...anim(0.28)}
        className="mt-4 ticker-wrap ticker-border py-2"
        aria-hidden="true"
      >
        <div className="ticker-track">
          {tickerDouble.map((item, i) => (
            <span
              key={i}
              className="flex items-center text-xs tracking-widest tabular-nums"
              style={{ color: "var(--accent)" }}
            >
              <span className="px-4">{item}</span>
              <span style={{ color: "var(--muted-dim)" }}>•</span>
            </span>
          ))}
        </div>
      </motion.div>
      {/* Accessible static version */}
      <p className="sr-only">{tickerItems.join(" · ")}</p>
    </header>
  );
}

