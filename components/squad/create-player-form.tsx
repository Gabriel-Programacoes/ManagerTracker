"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import { createDetailedPlayer } from "@/app/actions/squad";
import {
  ovrColor, statColor,
  POSITIONS, POSITION_STYLE,
  type DetailedPlayerInput,
} from "@/lib/player-utils";
import {CustomSelect} from "@/components/ui/custom-select";

/* ─── Defaults ──────────────────────────────────────────── */
const DEFAULT: DetailedPlayerInput = {
  name: "", position: "ATA", age: 23, height: 178,
  feet: "Direito", skillMoves: 3, weakFoot: 3, playstyle: "",
  overall: 75,
  pace: 70, shooting: 70, passing: 65,
  dribbling: 70, defending: 30, physical: 65,
  gkDiving: 70, gkHandling: 70, gkKicking: 65,
  gkPositioning: 70, gkReflexes: 70,
  marketValue: 0, salary: 0, contractYears: 1,
};

const STATS: { key: keyof DetailedPlayerInput; label: string }[] = [
  { key: "pace",      label: "Velocidade" },
  { key: "shooting",  label: "Finalização" },
  { key: "passing",   label: "Passe" },
  { key: "dribbling", label: "Drible" },
  { key: "defending", label: "Defesa" },
  { key: "physical",  label: "Físico" },
];

const GK_STATS: { key: keyof DetailedPlayerInput; label: string }[] = [
  { key: "gkDiving",      label: "Mergulho" },
  { key: "gkHandling",    label: "Manuseio" },
  { key: "gkKicking",     label: "Chute" },
  { key: "gkPositioning", label: "Posicionamento" },
  { key: "gkReflexes",    label: "Reflexos" },
];

const FEET_OPTIONS = ["Direito", "Esquerdo", "Ambos"];

/* ─── Shared input style ───────────────────────────────── */
const inputBase: React.CSSProperties = {
  background: "var(--background)",
  border: "1px solid var(--panel-border-strong)",
  borderRadius: "8px",
  color: "var(--foreground)",
  fontSize: "0.8125rem",
  fontFamily: "inherit",
  padding: "0.5rem 0.75rem",
  outline: "none",
  width: "100%",
  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
};

function focusStyle(el: HTMLElement) {
  el.style.borderColor = "var(--accent)";
  el.style.boxShadow = "0 0 0 3px var(--accent-glow)";
}
function blurStyle(el: HTMLElement) {
  el.style.borderColor = "var(--panel-border-strong)";
  el.style.boxShadow = "none";
}

/* ─── Safe number parse ─────────────────────────────────── */
const safeInt = (val: string, fallback = 0): number => {
  const n = parseInt(val, 10);
  return isNaN(n) ? fallback : n;
};

/* ─── Stat bar (read-only preview) ─────────────────────── */
function StatBar({ label, value }: { label: string; value: number }) {
  const color = statColor(value);
  return (
    <div className="flex items-center gap-2">
      <span className="stat-label" style={{ width: "6rem", flexShrink: 0 }}>{label}</span>
      <div
        className="flex-1 overflow-hidden"
        style={{ height: "3px", background: "var(--panel-border-strong)", borderRadius: "9999px" }}
      >
        <div
          style={{
            height: "100%",
            width: `${value}%`,
            background: color,
            borderRadius: "9999px",
            transition: "width 0.3s ease, background 0.3s ease",
          }}
        />
      </div>
      <span
        className="tabular-nums text-xs font-bold"
        style={{ width: "2rem", textAlign: "right", color, transition: "color 0.3s ease" }}
      >
        {value}
      </span>
    </div>
  );
}

/* ─── Main component ────────────────────────────────────── */
export function CreatePlayerForm() {
  const [form, setForm]        = useState<DetailedPlayerInput>(DEFAULT);
  const [isPending, start]     = useTransition();
  const [success, setSuccess]  = useState(false);
  const router                 = useRouter();

  const patch = (p: Partial<DetailedPlayerInput>) => setForm((f) => ({ ...f, ...p }));

  const isGK     = form.position === "GOL";
  const ovr      = form.overall ?? 75;
  const posStyle = POSITION_STYLE[form.position] ?? { color: "var(--muted)", bg: "rgba(255,255,255,0.05)" };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    start(async () => {
      await createDetailedPlayer(form);
      setSuccess(true);
      setTimeout(() => router.push("/squad"), 1200);
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">

        {/* ── Left: all fields ─────────────────────────────── */}
        <div className="flex flex-col gap-6">

          {/* Identity */}
          <section>
            <p className="stat-label mb-3">Identidade</p>
            <div className="grid gap-3 sm:grid-cols-2">

              {/* Name */}
              <div className="sm:col-span-2 flex flex-col gap-1">
                <label htmlFor="cp-name" className="stat-label" style={{ paddingLeft: 2 }}>Nome</label>
                <input
                  id="cp-name" type="text" required
                  placeholder="Nome completo do jogador"
                  style={inputBase} value={form.name}
                  onChange={(e) => patch({ name: e.target.value })}
                  onFocus={(e) => focusStyle(e.currentTarget)}
                  onBlur={(e) => blurStyle(e.currentTarget)}
                />
              </div>

              {/* Position */}
              <div className="flex flex-col gap-1">
                <label className="stat-label" style={{ paddingLeft: 2 }}>Posição</label>
                <CustomSelect
                  id="cp-pos"
                  value={form.position}
                  onChange={(v) => patch({ position: v })}
                  options={POSITIONS}
                />
              </div>

              {/* Overall */}
              <div className="flex flex-col gap-1">
                <label htmlFor="cp-ovr" className="stat-label" style={{ paddingLeft: 2 }}>Overall</label>
                <input
                  id="cp-ovr" type="number" min={1} max={99} required
                  style={inputBase} value={form.overall ?? 75}
                  onChange={(e) => patch({ overall: Math.min(99, Math.max(1, safeInt(e.target.value, 75))) })}
                  onFocus={(e) => focusStyle(e.currentTarget)}
                  onBlur={(e) => blurStyle(e.currentTarget)}
                />
              </div>

              {/* Age */}
              <div className="flex flex-col gap-1">
                <label htmlFor="cp-age" className="stat-label" style={{ paddingLeft: 2 }}>Idade</label>
                <input
                  id="cp-age" type="number" min={15} max={45}
                  style={inputBase} value={form.age ?? 23}
                  onChange={(e) => patch({ age: safeInt(e.target.value, 23) })}
                  onFocus={(e) => focusStyle(e.currentTarget)}
                  onBlur={(e) => blurStyle(e.currentTarget)}
                />
              </div>

              {/* Height */}
              <div className="flex flex-col gap-1">
                <label htmlFor="cp-height" className="stat-label" style={{ paddingLeft: 2 }}>Altura (cm)</label>
                <input
                  id="cp-height" type="number" min={150} max={210}
                  style={inputBase} value={form.height ?? 178}
                  onChange={(e) => patch({ height: safeInt(e.target.value, 178) })}
                  onFocus={(e) => focusStyle(e.currentTarget)}
                  onBlur={(e) => blurStyle(e.currentTarget)}
                />
              </div>

              {/* Feet — left cell */}
              <div className="flex flex-col gap-1">
                <span className="stat-label" style={{ paddingLeft: 2 }}>Pé Preferido</span>
                <div className="flex gap-1.5 items-center h-9.5">
                  {FEET_OPTIONS.map((opt) => (
                    <button
                      key={opt} type="button"
                      onClick={() => patch({ feet: opt })}
                      className="flex-1 rounded-lg py-1.5 text-xs font-medium transition-all"
                      style={{
                        background: form.feet === opt ? "rgba(82,222,229,0.12)" : "var(--background)",
                        border: form.feet === opt ? "1px solid rgba(82,222,229,0.4)" : "1px solid var(--panel-border-strong)",
                        color: form.feet === opt ? "var(--accent-strong)" : "var(--muted)",
                      }}
                    >{opt}</button>
                  ))}
                </div>
              </div>

              {/* Skill Moves + Perna Ruim — right cell, side by side */}
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-4">
                  <span className="stat-label" style={{ paddingLeft: 2 }}>Skill Moves</span>
                  <span style={{ color: "var(--muted-dim)" }}>·</span>
                  <span className="stat-label" style={{ paddingLeft: 2 }}>Perna Ruim</span>
                </div>
                <div className="flex items-center gap-3 h-9.5">
                  {/* SM */}
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map((star) => (
                      <button key={star} type="button" onClick={() => patch({ skillMoves: star })}
                        className="text-lg leading-none"
                        style={{
                          color: star <= form.skillMoves ? "var(--caution)" : "var(--panel-border-strong)",
                          transform: star <= form.skillMoves ? "scale(1.15)" : "scale(1)",
                          transition: "color 0.15s ease, transform 0.15s ease",
                        }}
                        aria-label={`Skill moves: ${star}★`}
                      >★</button>
                    ))}
                    <span className="stat-label ml-1" style={{ color: "var(--caution)" }}>{form.skillMoves}★</span>
                  </div>

                  <span style={{ color: "var(--muted-dim)" }}>|</span>

                  {/* WF */}
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map((star) => (
                      <button key={star} type="button" onClick={() => patch({ weakFoot: star })}
                        className="text-lg leading-none"
                        style={{
                          color: star <= form.weakFoot ? "var(--accent)" : "var(--panel-border-strong)",
                          transform: star <= form.weakFoot ? "scale(1.15)" : "scale(1)",
                          transition: "color 0.15s ease, transform 0.15s ease",
                        }}
                        aria-label={`Perna ruim: ${star}★`}
                      >★</button>
                    ))}
                    <span className="stat-label ml-1" style={{ color: "var(--accent)" }}>{form.weakFoot}★</span>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* Stats */}
          <section>
            <p className="stat-label mb-4">Atributos</p>
            <div className="flex flex-col gap-4">
              {(isGK ? GK_STATS : STATS).map(({ key, label }) => {
                const val = (form[key] as number) ?? 70;
                return (
                  <div key={key} className="flex items-center gap-3">
                    <span className="stat-label" style={{ width: "7rem", flexShrink: 0 }}>{label}</span>
                    <input
                      type="range" min={1} max={99}
                      className="stat-slider flex-1"
                      style={{ accentColor: statColor(val) }}
                      value={val}
                      onChange={(e) => patch({ [key]: Number(e.target.value) })}
                    />
                    <span
                      className="tabular-nums text-sm font-bold"
                      style={{ width: "2.25rem", textAlign: "right", color: statColor(val), transition: "color 0.25s ease" }}
                    >
                      {val}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Contract & Finances */}
          <section>
            <p className="stat-label mb-3">Contrato &amp; Finanças</p>
            <div className="grid gap-3 sm:grid-cols-3">

              {/* Market Value */}
              <div className="flex flex-col gap-1">
                <label htmlFor="cp-mv" className="stat-label" style={{ paddingLeft: 2 }}>
                  Valor de Mercado (k€)
                </label>
                <input
                  id="cp-mv" type="number" min={0}
                  placeholder="Ex: 5000 = €5M"
                  style={inputBase} value={form.marketValue ?? 0}
                  onChange={(e) => patch({ marketValue: Math.max(0, safeInt(e.target.value, 0)) })}
                  onFocus={(e) => focusStyle(e.currentTarget)}
                  onBlur={(e) => blurStyle(e.currentTarget)}
                />
              </div>

              {/* Salary */}
              <div className="flex flex-col gap-1">
                <label htmlFor="cp-sal" className="stat-label" style={{ paddingLeft: 2 }}>
                  Salário Semanal (k€)
                </label>
                <input
                  id="cp-sal" type="number" min={0}
                  placeholder="Ex: 50 = €50k/sem"
                  style={inputBase} value={form.salary ?? 0}
                  onChange={(e) => patch({ salary: Math.max(0, safeInt(e.target.value, 0)) })}
                  onFocus={(e) => focusStyle(e.currentTarget)}
                  onBlur={(e) => blurStyle(e.currentTarget)}
                />
              </div>

              {/* Contract Years */}
              <div className="flex flex-col gap-1">
                <label htmlFor="cp-ct" className="stat-label" style={{ paddingLeft: 2 }}>
                  Anos de Contrato
                </label>
                <input
                  id="cp-ct" type="number" min={0} max={10}
                  style={inputBase} value={form.contractYears ?? 1}
                  onChange={(e) => patch({ contractYears: Math.max(0, safeInt(e.target.value, 1)) })}
                  onFocus={(e) => focusStyle(e.currentTarget)}
                  onBlur={(e) => blurStyle(e.currentTarget)}
                />
              </div>

            </div>
          </section>
        </div>

        {/* ── Right: live preview card ──────────────────────── */}
        <div className="lg:sticky lg:top-8 h-fit">
          <p className="stat-label mb-3">Prévia</p>
          <motion.div
            layout
            style={{
              background: "var(--panel-bg)",
              border: "1px solid var(--panel-border)",
              borderRadius: "14px",
              padding: "1.5rem",
              boxShadow: "0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)",
            }}
          >
            {/* Position + OVR */}
            <div className="mb-4 flex items-start justify-between">
              <span
                className="rounded-full px-2.5 py-0.5 text-xs font-bold"
                style={{
                  color: posStyle.color,
                  background: posStyle.bg,
                  border: `1px solid ${posStyle.color}33`,
                  letterSpacing: "0.06em",
                }}
              >
                {form.position}
              </span>
              <motion.span
                key={ovr}
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.2 }}
                style={{
                  fontFamily: "var(--font-teko), sans-serif",
                  fontSize: "3rem",
                  fontWeight: 700,
                  lineHeight: 1,
                  letterSpacing: "0.02em",
                  color: ovrColor(ovr),
                }}
              >
                {ovr}
              </motion.span>
            </div>

            {/* Name */}
            <p
              className="mb-1 uppercase leading-none"
              style={{
                fontFamily: "var(--font-teko), sans-serif",
                fontSize: "1.5rem",
                fontWeight: 600,
                color: form.name ? "var(--foreground)" : "var(--muted-dim)",
                letterSpacing: "0.04em",
              }}
            >
              {form.name || "Nome do Jogador"}
            </p>

            {/* Meta row */}
            <div className="mb-5 flex flex-wrap items-center gap-x-2 gap-y-0.5">
              {form.age > 0 && <span className="stat-label">{form.age} anos</span>}
              {form.age > 0 && <span style={{ color: "var(--muted-dim)" }}>·</span>}
              {form.height > 0 && <span className="stat-label">{form.height}cm</span>}
              {form.height > 0 && <span style={{ color: "var(--muted-dim)" }}>·</span>}
              <span className="stat-label">{form.feet}</span>
              <span style={{ color: "var(--muted-dim)" }}>·</span>
              <span className="stat-label" style={{ color: "var(--caution)" }} title="Skill Moves">SM {"★".repeat(form.skillMoves)}</span>
              <span style={{ color: "var(--muted-dim)" }}>·</span>
              <span className="stat-label" style={{ color: "var(--accent)" }} title="Perna Ruim">PR {"★".repeat(form.weakFoot)}</span>
            </div>

            {/* Stat bars */}
            <div className="flex flex-col gap-2.5">
              {(isGK ? GK_STATS : STATS).map(({ key, label }) => (
                <StatBar key={key} label={label} value={(form[key] as number) ?? 70} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Submit */}
      <div className="mt-8 flex justify-end">
        <button
          type="submit"
          disabled={isPending || success || !form.name.trim()}
          className="flex items-center gap-2 rounded-xl px-8 py-3 text-sm font-semibold uppercase tracking-widest transition-all disabled:opacity-60"
          style={{
            background: success ? "rgba(82,222,229,0.15)" : "rgba(82,222,229,0.12)",
            border: "1px solid rgba(82,222,229,0.3)",
            color: success ? "var(--accent-strong)" : "var(--accent)",
            cursor: isPending || success || !form.name.trim() ? "default" : "pointer",
          }}
          onMouseEnter={(e) => { if (!isPending && !success) e.currentTarget.style.background = "rgba(82,222,229,0.2)"; }}
          onMouseLeave={(e) => { if (!isPending && !success) e.currentTarget.style.background = "rgba(82,222,229,0.12)"; }}
        >
          {success ? (
            <><CheckCircle2 className="h-4 w-4" /> Jogador Criado — Redirecionando...</>
          ) : isPending ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Salvando...</>
          ) : (
            "Criar Jogador"
          )}
        </button>
      </div>
    </form>
  );
}

