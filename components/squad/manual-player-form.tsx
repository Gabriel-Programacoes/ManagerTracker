"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Plus, X, UserPlus, CheckCircle2 } from "lucide-react";
import { addCustomPlayerToSquad } from "@/app/actions/squad";

/* ─── Position map ──────────────────────────────────────── */
const POSITIONS = [
  { value: "GOL", label: "GOL — Goleiro" },
  { value: "ZAG", label: "ZAG — Zagueiro" },
  { value: "LAT", label: "LAT — Lateral" },
  { value: "VOL", label: "VOL — Volante" },
  { value: "MC",  label: "MC — Meia Central" },
  { value: "MEI", label: "MEI — Meia Atacante" },
  { value: "PTE", label: "PTE — Ponta Esq." },
  { value: "PTD", label: "PTD — Ponta Dir." },
  { value: "ATA", label: "ATA — Atacante" },
];

/* ─── OVR rating color ──────────────────────────────────── */
function ovrColor(ovr: number): string {
  if (ovr >= 90) return "var(--caution)";       // gold — elite
  if (ovr >= 80) return "var(--accent-strong)"; // cyan — very good
  if (ovr >= 70) return "var(--accent)";        // light cyan — good
  if (ovr >= 60) return "var(--muted)";         // muted — average
  return "var(--muted-dim)";                    // dim — weak
}

/* ─── Shared input style ────────────────────────────────── */
const inputBase: React.CSSProperties = {
  background: "var(--background)",
  border: "1px solid var(--panel-border-strong)",
  borderRadius: "8px",
  color: "var(--foreground)",
  fontSize: "0.8125rem",
  fontFamily: "inherit",
  padding: "0.5rem 0.75rem",
  outline: "none",
  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  width: "100%",
};

type FormData = { name: string; position: string; overall: number; marketValue: number; salary: number; contractYears: number };

const DEFAULT: FormData = { name: "", position: "ATA", overall: 75, marketValue: 0, salary: 0, contractYears: 1 };

export function ManualPlayerForm() {
  const [isOpen, setIsOpen]   = useState(false);
  const [done, setDone]       = useState(false);
  const [form, setForm]       = useState<FormData>(DEFAULT);
  const [isPending, start]    = useTransition();
  const reduce                = useReducedMotion();

  const patch = (patch: Partial<FormData>) => setForm((f) => ({ ...f, ...patch }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    start(async () => {
      await addCustomPlayerToSquad({
        name:          form.name.trim(),
        position:      form.position,
        overall:       form.overall,
        marketValue:   form.marketValue,
        salary:        form.salary,
        contractYears: form.contractYears,
      });
      setDone(true);
      setTimeout(() => {
        setDone(false);
        setForm(DEFAULT);
        setIsOpen(false);
      }, 1400);
    });
  };

  /* ── Trigger button ─────────────────────────────────── */
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="group flex items-center gap-1.5 transition-colors"
        style={{ color: "var(--muted)" }}
      >
        <Plus
          className="h-3.5 w-3.5 transition-colors"
          style={{ color: "var(--muted-dim)" }}
          aria-hidden="true"
        />
        <span
          className="text-xs"
          style={{
            fontFamily: "inherit",
            letterSpacing: "0.06em",
            textDecoration: "underline",
            textUnderlineOffset: "3px",
            textDecorationColor: "var(--panel-border-strong)",
          }}
        >
          Não achou? Criar manualmente
        </span>
      </button>
    );
  }

  /* ── Expanded form ──────────────────────────────────── */
  return (
    <AnimatePresence>
      <motion.div
        initial={reduce ? undefined : { opacity: 0, y: -8, scale: 0.98 }}
        animate={reduce ? undefined : { opacity: 1, y: 0, scale: 1 }}
        exit={reduce ? undefined : { opacity: 0, y: -8, scale: 0.98 }}
        transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          background: "var(--panel-bg)",
          border: "1px solid var(--panel-border-strong)",
          borderRadius: "12px",
          boxShadow: "0 4px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
          padding: "1rem 1.125rem 1.125rem",
          marginTop: "0.5rem",
        }}
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="h-3.5 w-3.5" style={{ color: "var(--accent)" }} aria-hidden="true" />
            <span
              style={{
                fontFamily: "var(--font-teko), sans-serif",
                fontSize: "1rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--foreground)",
              }}
            >
              Jogador Personalizado
            </span>
          </div>
          <button
            onClick={() => { setIsOpen(false); setForm(DEFAULT); }}
            className="flex items-center gap-1 transition-colors"
            style={{ color: "var(--muted-dim)", fontSize: "0.7rem", letterSpacing: "0.08em" }}
            aria-label="Fechar formulário"
          >
            <X className="h-3 w-3" aria-hidden="true" />
            <span>CANCELAR</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-3">

            {/* Name field */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="mp-name"
                className="stat-label"
                style={{ paddingLeft: "2px" }}
              >
                Nome do jogador
              </label>
              <input
                id="mp-name"
                type="text"
                required
                placeholder="Ex: Calleri, Vegetti..."
                style={inputBase}
                value={form.name}
                onChange={(e) => patch({ name: e.target.value })}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "var(--accent)";
                  e.currentTarget.style.boxShadow = "0 0 0 3px var(--accent-glow)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "var(--panel-border-strong)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            {/* Position + OVR row */}
            <div className="flex gap-3">

              {/* Position */}
              <div className="flex flex-1 flex-col gap-1">
                <label htmlFor="mp-pos" className="stat-label" style={{ paddingLeft: "2px" }}>
                  Posição
                </label>
                <select
                  id="mp-pos"
                  style={{ ...inputBase }}
                  value={form.position}
                  onChange={(e) => patch({ position: e.target.value })}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "var(--accent)";
                    e.currentTarget.style.boxShadow = "0 0 0 3px var(--accent-glow)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "var(--panel-border-strong)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {POSITIONS.map((p) => (
                    <option key={p.value} value={p.value} style={{ background: "var(--panel-bg)" }}>
                      {p.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* OVR */}
              <div className="flex flex-col gap-1" style={{ width: "7rem" }}>
                <label htmlFor="mp-ovr" className="stat-label flex items-center gap-1.5" style={{ paddingLeft: "2px" }}>
                  OVR
                  <span
                    style={{
                      display: "inline-block", width: "6px", height: "6px",
                      borderRadius: "9999px", background: ovrColor(form.overall),
                      transition: "background 0.3s ease",
                    }}
                    aria-hidden="true"
                  />
                </label>
                <input
                  id="mp-ovr" type="number" required min={40} max={99}
                  style={{
                    ...inputBase, color: ovrColor(form.overall), fontWeight: 700,
                    textAlign: "center", transition: "border-color 0.2s ease, box-shadow 0.2s ease, color 0.3s ease",
                  }}
                  value={form.overall}
                  onChange={(e) => patch({ overall: Number(e.target.value) })}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = "var(--accent)";
                    e.currentTarget.style.boxShadow = "0 0 0 3px var(--accent-glow)";
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = "var(--panel-border-strong)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                />
              </div>
            </div>

            {/* Contract row */}
            <div
              className="grid gap-2 pt-1"
              style={{ gridTemplateColumns: "1fr 1fr 1fr", borderTop: "1px solid var(--divider)" }}
            >
              <div className="flex flex-col gap-1">
                <label htmlFor="mp-mv" className="stat-label" style={{ paddingLeft: "2px" }}>Valor Merc. (k€)</label>
                <input
                  id="mp-mv" type="number" min={0} placeholder="0"
                  style={inputBase} value={form.marketValue}
                  onChange={(e) => patch({ marketValue: Math.max(0, Number(e.target.value)) })}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.boxShadow = "0 0 0 3px var(--accent-glow)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "var(--panel-border-strong)"; e.currentTarget.style.boxShadow = "none"; }}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="mp-sal" className="stat-label" style={{ paddingLeft: "2px" }}>Salário (k€/sem)</label>
                <input
                  id="mp-sal" type="number" min={0} placeholder="0"
                  style={inputBase} value={form.salary}
                  onChange={(e) => patch({ salary: Math.max(0, Number(e.target.value)) })}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.boxShadow = "0 0 0 3px var(--accent-glow)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "var(--panel-border-strong)"; e.currentTarget.style.boxShadow = "none"; }}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="mp-ct" className="stat-label" style={{ paddingLeft: "2px" }}>Contrato (anos)</label>
                <input
                  id="mp-ct" type="number" min={0} max={10}
                  style={inputBase} value={form.contractYears}
                  onChange={(e) => patch({ contractYears: Math.max(0, Math.floor(Number(e.target.value))) })}
                  onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.boxShadow = "0 0 0 3px var(--accent-glow)"; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = "var(--panel-border-strong)"; e.currentTarget.style.boxShadow = "none"; }}
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending || done}
              style={{
                marginTop: "0.25rem",
                padding: "0.5625rem 1rem",
                borderRadius: "8px",
                border: done
                  ? "1px solid rgba(82, 222, 229, 0.3)"
                  : "1px solid rgba(82, 222, 229, 0.25)",
                background: done
                  ? "rgba(82, 222, 229, 0.12)"
                  : isPending
                  ? "rgba(82, 222, 229, 0.06)"
                  : "rgba(82, 222, 229, 0.10)",
                color: done ? "var(--accent-strong)" : "var(--accent)",
                fontFamily: "inherit",
                fontSize: "0.8125rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                cursor: isPending || done ? "default" : "pointer",
                transition: "background 0.2s ease, border-color 0.2s ease, color 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
                width: "100%",
              }}
              onMouseEnter={(e) => {
                if (!isPending && !done)
                  e.currentTarget.style.background = "rgba(82, 222, 229, 0.16)";
              }}
              onMouseLeave={(e) => {
                if (!isPending && !done)
                  e.currentTarget.style.background = "rgba(82, 222, 229, 0.10)";
              }}
            >
              {done ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Jogador Adicionado
                </>
              ) : isPending ? (
                <>
                  <span
                    className="live-dot"
                    style={{ background: "var(--accent)" }}
                    aria-hidden="true"
                  />
                  Salvando...
                </>
              ) : (
                "Adicionar ao Elenco"
              )}
            </button>

          </div>
        </form>
      </motion.div>
    </AnimatePresence>
  );
}

