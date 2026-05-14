"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  X, Pencil, Check, Loader2,
  Goal, Activity,
  ShieldCheck,
  Trophy, Star, Dumbbell,
  TrendingUp, Wallet, CalendarClock,
} from "lucide-react";
import { ovrColor, statColor, POSITION_STYLE, type SquadPlayer } from "@/lib/player-utils";
import { updatePlayerContract, type ContractData } from "@/app/actions/squad";

/* ── Types ─────────────────────────────────────────────── */
interface PlayerDetailModalProps {
  player: SquadPlayer | null;
  onClose: () => void;
}

/* ── Helpers ────────────────────────────────────────────── */
function formatMoney(val: number): string {
  if (val === 0) return "—";
  if (val >= 1000) return `€${(val / 1000).toFixed(1)}M`;
  return `€${val}k`;
}

function formatSalary(val: number): string {
  if (val === 0) return "—";
  return `€${val}k / sem`;
}

/* ── Radar SVG ──────────────────────────────────────────── */
const RADAR_AXES = [
  { key: "pace",      label: "VEL", angle: -90 },
  { key: "shooting",  label: "FIN", angle: -30 },
  { key: "dribbling", label: "DRI", angle:  30 },
  { key: "physical",  label: "FIS", angle:  90 },
  { key: "defending", label: "DEF", angle: 150 },
  { key: "passing",   label: "PAS", angle: 210 },
] as const;

function radarCoord(cx: number, cy: number, r: number, angleDeg: number, val: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: cx + (val / 100) * r * Math.cos(rad),
    y: cy + (val / 100) * r * Math.sin(rad),
  };
}

function gridCoord(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function RadarChart({ stats }: { stats: Record<string, number> }) {
  const cx = 110; const cy = 110; const r = 78;
  const labelR = r + 16;

  const gridLevels = [0.25, 0.5, 0.75, 1];

  const statPolygon = RADAR_AXES.map((ax) =>
    radarCoord(cx, cy, r, ax.angle, stats[ax.key] ?? 0)
  ).map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");

  return (
    <svg viewBox="0 0 220 220" width="220" height="220" aria-hidden="true">
      {/* Grid rings */}
      {gridLevels.map((level) => {
        const pts = RADAR_AXES.map((ax) => {
          const { x, y } = gridCoord(cx, cy, r * level, ax.angle);
          return `${x.toFixed(2)},${y.toFixed(2)}`;
        }).join(" ");
        return (
          <polygon
            key={level}
            points={pts}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />
        );
      })}

      {/* Axis lines */}
      {RADAR_AXES.map((ax) => {
        const { x, y } = gridCoord(cx, cy, r, ax.angle);
        return (
          <line
            key={ax.key}
            x1={cx} y1={cy} x2={x} y2={y}
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="1"
          />
        );
      })}

      {/* Stat fill — animate opacity only; SVG scale via transform attr */}
      <motion.polygon
        points={statPolygon}
        fill="rgba(82,222,229,0.15)"
        stroke="rgba(82,222,229,0.7)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />

      {/* Axis labels */}
      {RADAR_AXES.map((ax) => {
        const { x, y } = gridCoord(cx, cy, labelR, ax.angle);
        const val = stats[ax.key] ?? 0;
        const color = val > 0 ? statColor(val) : "var(--muted-dim)";
        return (
          <g key={ax.key}>
            <text
              x={x} y={y - 5}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="8"
              fontFamily="var(--font-chakra), sans-serif"
              letterSpacing="0.1em"
              fill="var(--muted-dim)"
            >
              {ax.label}
            </text>
            <text
              x={x} y={y + 6}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="9"
              fontFamily="var(--font-teko), sans-serif"
              fontWeight="700"
              fill={color}
            >
              {val > 0 ? val : "?"}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ── Stat bar ───────────────────────────────────────────── */
function StatBar({ label, value }: { label: string; value: number }) {
  const color = statColor(value);
  return (
    <div className="flex items-center gap-3">
      <span className="stat-label" style={{ width: "6rem", flexShrink: 0 }}>{label}</span>
      <div
        className="flex-1 overflow-hidden"
        style={{ height: "3px", background: "var(--panel-border-strong)", borderRadius: "9999px" }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ height: "100%", background: color, borderRadius: "9999px" }}
        />
      </div>
      <span className="tabular-nums text-xs font-bold" style={{ width: "2rem", textAlign: "right", color }}>
        {value}
      </span>
    </div>
  );
}

/* ── Season stat box ────────────────────────────────────── */
function SeasonBox({
  label, value, color, title,
}: { label: string; value: string | number; color?: string; title?: string }) {
  return (
    <div
      className="flex flex-col items-center gap-0.5 py-3"
      title={title}
      style={{ background: "var(--panel-bg-subtle)", borderRadius: "8px" }}
    >
      <span
        style={{
          fontFamily: "var(--font-teko), sans-serif",
          fontSize: "1.6rem",
          fontWeight: 700,
          lineHeight: 1,
          color: color ?? "var(--foreground)",
        }}
      >
        {value}
      </span>
      <span className="stat-label">{label}</span>
    </div>
  );
}

/* ── Award badge ────────────────────────────────────────── */
const AWARDS = [
  { key: "awardPlayerOfSeason",  label: "Melhor Jogador",    icon: Star,      color: "#c4a97a" },
  { key: "awardTopScorer",       label: "Artilheiro",        icon: Goal,      color: "#52dee5" },
  { key: "awardBestGoalkeeper",  label: "Melhor Goleiro",    icon: ShieldCheck, color: "#a8a8e8" },
  { key: "awardBestYoungPlayer", label: "Jovem do Ano",      icon: TrendingUp,color: "#b8c290" },
  { key: "awardBestDefender",    label: "Melhor Defensor",   icon: Dumbbell,  color: "#d39eab" },
] as const;

/* ── Number input (inline) ──────────────────────────────── */
function ContractInput({
  label, value, onChange, suffix,
}: { label: string; value: number; onChange: (v: number) => void; suffix?: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="stat-label">{label}</span>
      <div
        className="flex items-center gap-1 rounded-lg px-2 py-1"
        style={{ background: "var(--background)", border: "1px solid var(--panel-border-strong)" }}
      >
        <input
          type="number"
          min={0}
          value={value}
          onChange={(e) => onChange(Math.max(0, Number(e.target.value)))}
          className="w-full bg-transparent text-right text-sm font-medium tabular-nums outline-none"
          style={{ color: "var(--foreground)", fontFamily: "inherit" }}
        />
        {suffix && <span className="stat-label shrink-0">{suffix}</span>}
      </div>
    </div>
  );
}

/* ── Main modal ─────────────────────────────────────────── */
export function PlayerDetailModal({ player, onClose }: PlayerDetailModalProps) {
  const reduce = useReducedMotion();

  const [editing, setEditing] = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [form, setForm]       = useState<ContractData>({
    marketValue: 0, salary: 0, contractYears: 1,
    awardPlayerOfSeason: false, awardTopScorer: false,
    awardBestGoalkeeper: false, awardBestYoungPlayer: false, awardBestDefender: false,
  });

  /* Sync form whenever player changes */
  useEffect(() => {
    if (!player) return;
    setForm({
      marketValue:         player.marketValue      ?? 0,
      salary:              player.salary           ?? 0,
      contractYears:       player.contractYears    ?? 1,
      awardPlayerOfSeason:  player.awardPlayerOfSeason  ?? false,
      awardTopScorer:       player.awardTopScorer       ?? false,
      awardBestGoalkeeper:  player.awardBestGoalkeeper  ?? false,
      awardBestYoungPlayer: player.awardBestYoungPlayer ?? false,
      awardBestDefender:    player.awardBestDefender    ?? false,
    });
    setEditing(false);
  }, [player?.id]);

  /* ESC to close */
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  if (!player) return null;

  const pos      = player.position ?? "—";
  const posStyle = POSITION_STYLE[pos] ?? { color: "var(--muted)", bg: "rgba(255,255,255,0.05)" };
  const ovr      = player.currentOverall;

  const STAT_DEFS = [
    { key: "pace",      label: "Velocidade" },
    { key: "shooting",  label: "Finalização" },
    { key: "passing",   label: "Passe" },
    { key: "dribbling", label: "Drible" },
    { key: "defending", label: "Defesa" },
    { key: "physical",  label: "Físico" },
  ] as const;

  const hasDetailedStats = STAT_DEFS.some(({ key }) => player[key] != null);
  const radarStats = Object.fromEntries(
    STAT_DEFS.map(({ key }) => [key, player[key] ?? 0])
  );
  // Show radar if any stat was populated (even 0 is a valid stored value)
  const hasRadarData = STAT_DEFS.some(({ key }) => player[key] != null);

  const isDefensive = ["GOL", "ZAG", "LAT"].includes(pos);
  const activeAwards = AWARDS.filter((a) => form[a.key]);

  const handleSave = async () => {
    setSaving(true);
    await updatePlayerContract(player.id, form);
    setSaving(false);
    setEditing(false);
  };

  const backdropV = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
  const modalV    = { hidden: { opacity: 0, y: 20, scale: 0.97 }, visible: { opacity: 1, y: 0, scale: 1 } };

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        variants={reduce ? undefined : backdropV}
        initial="hidden" animate="visible" exit="hidden"
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-40 flex items-center justify-center p-4"
        style={{ background: "rgba(12,9,16,0.85)", backdropFilter: "blur(6px)" }}
        onClick={onClose}
      >
        <motion.div
          key="modal"
          variants={reduce ? undefined : modalV}
          initial="hidden" animate="visible" exit="hidden"
          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full flex flex-col"
          style={{
            maxWidth: "680px",
            maxHeight: "90vh",
            background: "var(--panel-bg)",
            border: "1px solid var(--panel-border-strong)",
            borderRadius: "16px",
            boxShadow: "0 24px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)",
            overflow: "hidden",
          }}
        >
          {/* ── Hero ──────────────────────────────────────── */}
          <div
            className="px-6 pb-5 pt-5 shrink-0"
            style={{
              background: `linear-gradient(135deg, ${posStyle.bg.replace("0.08","0.10")} 0%, transparent 55%)`,
              borderBottom: "1px solid var(--divider)",
            }}
          >
            {/* Row 1: position badge + close button (no overlap) */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                  style={{ color: posStyle.color, background: posStyle.bg, border: `1px solid ${posStyle.color}33`, letterSpacing: "0.06em" }}
                >
                  {pos}
                </span>
                {player.playstyle && (
                  <span className="stat-label" style={{ color: "var(--caution)" }}>{player.playstyle}</span>
                )}
              </div>

              <button
                onClick={onClose}
                aria-label="Fechar"
                className="shrink-0 flex items-center gap-1 rounded-full px-2 py-1"
                style={{
                  color: "var(--muted-dim)", background: "rgba(255,255,255,0.04)",
                  border: "1px solid var(--panel-border)", fontSize: "0.7rem", letterSpacing: "0.06em",
                }}
              >
                <X className="h-3 w-3" aria-hidden="true" />
                FECHAR
              </button>
            </div>

            {/* Row 2: name (left) + OVR (right) — no conflict */}
            <div className="flex items-end justify-between gap-4">
              <div className="min-w-0">
                <h2
                  className="uppercase leading-none"
                  style={{
                    fontFamily: "var(--font-teko), sans-serif",
                    fontSize: "clamp(1.6rem,4vw,2.4rem)",
                    fontWeight: 700,
                    color: "var(--foreground)",
                    letterSpacing: "0.03em",
                  }}
                >
                  {player.name}
                </h2>

                <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                  {player.age != null && <span className="stat-label">{player.age} anos</span>}
                  {player.age != null && player.height != null && <span style={{ color: "var(--muted-dim)" }}>·</span>}
                  {player.height != null && <span className="stat-label">{player.height}cm</span>}
                  {player.feet && <><span style={{ color: "var(--muted-dim)" }}>·</span><span className="stat-label">Pé {player.feet}</span></>}
                  {player.skillMoves != null && <><span style={{ color: "var(--muted-dim)" }}>·</span><span className="stat-label" style={{ color: "var(--caution)" }}>SM {"★".repeat(player.skillMoves)}</span></>}
                  {player.weakFoot != null && <><span style={{ color: "var(--muted-dim)" }}>·</span><span className="stat-label" style={{ color: "var(--accent)" }}>WF {"★".repeat(player.weakFoot)}</span></>}
                </div>
              </div>

              <div className="shrink-0 text-right">
                <span className="stat-label block mb-0.5">Overall</span>
                <span style={{
                  fontFamily: "var(--font-teko), sans-serif", fontSize: "4rem",
                  fontWeight: 700, lineHeight: 1, color: ovrColor(ovr), letterSpacing: "0.02em",
                }}>
                  {ovr}
                </span>
              </div>
            </div>
          </div>

          {/* ── Scrollable body ───────────────────────────── */}
          <div className="flex-1 overflow-y-auto min-h-0">

            {/* ── Atributos + Radar ─────────────────────── */}
            <div
              className="flex gap-0"
              style={{ borderBottom: "1px solid var(--divider)" }}
            >
              {/* Left: stat bars (only for detailed players) */}
              {hasDetailedStats && (
                <div className="flex-1 px-6 py-5 flex flex-col gap-3 min-w-0">
                  <p className="stat-label mb-1">Atributos</p>
                  {STAT_DEFS.map(({ key, label }) => {
                    const val = player[key] as number | null | undefined;
                    if (val == null) return null;
                    return <StatBar key={key} label={label} value={val} />;
                  })}
                </div>
              )}

              {/* Right: radar */}
              <div
                className="flex flex-col items-center justify-center p-5"
                style={{ minWidth: hasDetailedStats ? "220px" : "100%", flexShrink: 0 }}
              >
                {!hasDetailedStats && (
                  <p className="stat-label mb-3 text-center">Atributos</p>
                )}
                {hasRadarData ? (
                  <RadarChart stats={radarStats} />
                ) : (
                  <div className="flex flex-col items-center gap-2 py-6">
                    <Activity className="h-6 w-6" style={{ color: "var(--muted-dim)" }} />
                    <p className="text-sm" style={{ color: "var(--muted)" }}>Sem dados de atributos</p>
                    <p className="stat-label text-center">Crie um jogador detalhado para ver atributos</p>
                  </div>
                )}
              </div>
            </div>

            {/* ── Temporada ─────────────────────────────── */}
            <div className="px-6 py-5" style={{ borderBottom: "1px solid var(--divider)" }}>
              <p className="stat-label mb-3">Temporada</p>
              <div className="grid gap-2" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(70px, 1fr))" }}>
                <SeasonBox label="Jogos" value={player.matches ?? 0} />
                <SeasonBox label="Gols" value={player.goals ?? 0}
                  color={(player.goals ?? 0) > 0 ? "var(--accent-strong)" : "var(--muted-dim)"} />
                <SeasonBox label="Assist." value={player.assists ?? 0}
                  color={(player.assists ?? 0) > 0 ? "var(--accent)" : "var(--muted-dim)"} />
                <SeasonBox label="CA" value={player.yellowCards ?? 0}
                  color={(player.yellowCards ?? 0) > 0 ? "#f5c518" : "var(--muted-dim)"}
                  title="Cartões Amarelos" />
                <SeasonBox label="CV" value={player.redCards ?? 0}
                  color={(player.redCards ?? 0) > 0 ? "var(--loss)" : "var(--muted-dim)"}
                  title="Cartões Vermelhos" />
                {isDefensive && (
                  <SeasonBox label="CS" value={player.cleanSheets ?? 0}
                    color={(player.cleanSheets ?? 0) > 0 ? "var(--accent)" : "var(--muted-dim)"}
                    title="Jogos sem sofrer gols" />
                )}
              </div>
            </div>

            {/* ── Contrato & finanças ───────────────────── */}
            <div className="px-6 py-5" style={{ borderBottom: "1px solid var(--divider)" }}>
              <div className="flex items-center justify-between mb-4">
                <p className="stat-label">Contrato &amp; Finanças</p>
                {!editing ? (
                  <button
                    onClick={() => setEditing(true)}
                    className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs transition-all"
                    style={{
                      background: "rgba(82,222,229,0.07)",
                      border: "1px solid rgba(82,222,229,0.2)",
                      color: "var(--muted)",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.color = "var(--accent)";
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(82,222,229,0.4)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.color = "var(--muted)";
                      (e.currentTarget as HTMLElement).style.borderColor = "rgba(82,222,229,0.2)";
                    }}
                  >
                    <Pencil className="h-3 w-3" />
                    Editar
                  </button>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => { setEditing(false); }}
                      className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs"
                      style={{ border: "1px solid var(--panel-border)", color: "var(--muted)" }}
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs"
                      style={{
                        background: "rgba(82,222,229,0.15)",
                        border: "1px solid rgba(82,222,229,0.4)",
                        color: "var(--accent)",
                      }}
                    >
                      {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                      Salvar
                    </button>
                  </div>
                )}
              </div>

              {editing ? (
                <div className="grid grid-cols-3 gap-3">
                  <ContractInput
                    label="Valor de Merc. (k€)"
                    value={form.marketValue}
                    onChange={(v) => setForm((f) => ({ ...f, marketValue: v }))}
                    suffix="k€"
                  />
                  <ContractInput
                    label="Salário semanal (k€)"
                    value={form.salary}
                    onChange={(v) => setForm((f) => ({ ...f, salary: v }))}
                    suffix="k€"
                  />
                  <ContractInput
                    label="Anos de contrato"
                    value={form.contractYears}
                    onChange={(v) => setForm((f) => ({ ...f, contractYears: Math.max(0, Math.floor(v)) }))}
                    suffix="anos"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { Icon: TrendingUp, label: "Valor de Mercado", value: formatMoney(form.marketValue) },
                    { Icon: Wallet,     label: "Salário / Semana",  value: formatSalary(form.salary) },
                    { Icon: CalendarClock, label: "Contrato",       value: form.contractYears > 0 ? `${form.contractYears} ano${form.contractYears !== 1 ? "s" : ""}` : "—" },
                  ].map(({ Icon, label, value }) => (
                    <div
                      key={label}
                      className="flex flex-col gap-2 rounded-lg px-4 py-3"
                      style={{ background: "var(--panel-bg-subtle)", border: "1px solid var(--panel-border)" }}
                    >
                      <Icon className="h-4 w-4" style={{ color: "var(--muted-dim)" }} />
                      <div>
                        <p
                          className="font-bold tabular-nums"
                          style={{ fontFamily: "var(--font-teko), sans-serif", fontSize: "1.25rem", color: "var(--foreground)", lineHeight: 1 }}
                        >
                          {value}
                        </p>
                        <p className="stat-label mt-0.5">{label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ── Prêmios ───────────────────────────────── */}
            <div className="px-6 py-5">
              <div className="flex items-center justify-between mb-4">
                <p className="stat-label">Prêmios da Temporada</p>
                {editing && (
                  <span className="stat-label" style={{ color: "var(--accent)" }}>
                    clique para marcar/desmarcar
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {AWARDS.map(({ key, label, icon: Icon, color }) => {
                  const active = form[key];
                  return editing ? (
                    <button
                      key={key}
                      onClick={() => setForm((f) => ({ ...f, [key]: !f[key] }))}
                      className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-all"
                      style={{
                        background: active ? `${color}18` : "var(--panel-bg-subtle)",
                        border: `1px solid ${active ? color + "55" : "var(--panel-border)"}`,
                        color: active ? color : "var(--muted)",
                        cursor: "pointer",
                      }}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {label}
                      {active && <Check className="h-3 w-3 ml-0.5" />}
                    </button>
                  ) : active ? (
                    <div
                      key={key}
                      className="flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium"
                      style={{
                        background: `${color}18`,
                        border: `1px solid ${color}44`,
                        color,
                      }}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {label}
                    </div>
                  ) : null;
                })}

                {!editing && activeAwards.length === 0 && (
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4" style={{ color: "var(--muted-dim)" }} />
                    <p className="stat-label">
                      Nenhum prêmio ainda — clique em{" "}
                      <span style={{ color: "var(--accent)" }}>Editar</span> para adicionar
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>{/* end scrollable body */}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

