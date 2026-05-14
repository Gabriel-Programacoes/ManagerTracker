"use client";

import { useState, useEffect, useTransition, useCallback, useRef } from "react";
import {
  X, Search, Loader2, Plus, Check,
  ChevronLeft, ChevronRight, Users,
} from "lucide-react";
import { browseFifaPlayers } from "@/app/actions/players";
import { addPlayerToSquad } from "@/app/actions/squad";
import { ovrColor, statColor, POSITION_STYLE } from "@/lib/player-utils";

/* ── Types ─────────────────────────────────────────────── */
type FifaPlayer = {
  id: number;
  name: string;
  overall: number;
  position: string;
  age: number;
  nation: string | null;
  league: string | null;
  team: string | null;
  pace: number | null;
  shooting: number | null;
  passing: number | null;
  dribbling: number | null;
  defending: number | null;
  physicality: number | null;
};

interface AddPlayerModalProps {
  onClose: () => void;
}

/* ── Stat mini-bar ──────────────────────────────────────── */
function StatBar({ label, value }: { label: string; value: number | null }) {
  const v = value ?? 0;
  return (
    <div className="flex flex-col items-center gap-0.5" title={`${label}: ${v}`}>
      <span
        className="tabular-nums font-bold leading-none"
        style={{
          fontFamily: "var(--font-teko), sans-serif",
          fontSize: "0.95rem",
          color: statColor(v),
        }}
      >
        {v > 0 ? v : "—"}
      </span>
      <span
        className="uppercase"
        style={{ fontSize: "0.58rem", letterSpacing: "0.08em", color: "var(--muted-dim)" }}
      >
        {label}
      </span>
    </div>
  );
}

/* ── Main component ─────────────────────────────────────── */
export function AddPlayerModal({ onClose }: AddPlayerModalProps) {
  const [query, setQuery]       = useState("");
  const [debouncedQ, setDQ]     = useState("");
  const [page, setPage]         = useState(0);
  const [players, setPlayers]   = useState<FifaPlayer[]>([]);
  const [total, setTotal]       = useState(0);
  const [pageSize]              = useState(50);
  const [added, setAdded]       = useState<Set<number>>(new Set());
  const [adding, setAdding]     = useState<number | null>(null);
  const [isPending, startT]     = useTransition();
  const inputRef                = useRef<HTMLInputElement>(null);

  /* focus on open */
  useEffect(() => { inputRef.current?.focus(); }, []);

  /* debounce search query */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDQ(query);
      setPage(0);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  /* fetch whenever debounced query or page changes */
  const loadPlayers = useCallback((q: string, p: number) => {
    startT(async () => {
      const res = await browseFifaPlayers(q, p);
      setPlayers(res.players as FifaPlayer[]);
      setTotal(res.total);
    });
  }, []);

  useEffect(() => { loadPlayers(debouncedQ, page); }, [debouncedQ, page, loadPlayers]);

  /* close on Escape */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const handleAdd = async (player: FifaPlayer) => {
    if (adding !== null || added.has(player.id)) return;
    setAdding(player.id);
    await addPlayerToSquad({
      id: player.id,
      name: player.name,
      overall: player.overall,
      position: player.position,
    });
    setAdded(prev => new Set(prev).add(player.id));
    setAdding(null);
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Panel */}
      <div
        className="flex flex-col w-full"
        style={{
          maxWidth: "900px",
          maxHeight: "90vh",
          background: "var(--panel-bg)",
          border: "1px solid var(--panel-border-strong)",
          borderRadius: "16px",
          boxShadow: "0 24px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05)",
        }}
      >
        {/* ── Header ── */}
        <div
          className="flex items-center gap-3 px-5 py-4 shrink-0"
          style={{ borderBottom: "1px solid var(--divider)" }}
        >
          <Users className="h-4 w-4 shrink-0" style={{ color: "var(--accent)" }} />
          <div className="flex-1 min-w-0">
            <h2
              className="uppercase leading-none"
              style={{
                fontFamily: "var(--font-teko), sans-serif",
                fontSize: "1.5rem",
                fontWeight: 700,
                letterSpacing: "0.06em",
                color: "var(--foreground)",
              }}
            >
              Adicionar{" "}
              <span style={{ color: "var(--accent)" }}>Jogador</span>
            </h2>
            <p className="stat-label mt-0.5">
              {isPending ? "A procurar…" : `${total.toLocaleString("pt-BR")} jogador${total !== 1 ? "es" : ""} encontrado${total !== 1 ? "s" : ""}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 flex items-center justify-center rounded-lg p-1.5 transition-colors"
            style={{ color: "var(--muted)", border: "1px solid var(--panel-border)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "var(--panel-bg-subtle)";
              (e.currentTarget as HTMLElement).style.color = "var(--foreground)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
              (e.currentTarget as HTMLElement).style.color = "var(--muted)";
            }}
            aria-label="Fechar modal"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* ── Search bar ── */}
        <div className="px-5 py-3 shrink-0" style={{ borderBottom: "1px solid var(--divider)" }}>
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2"
              style={{ color: "var(--muted-dim)" }}
              aria-hidden="true"
            />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filtrar por nome…"
              style={{
                width: "100%",
                paddingLeft: "2.25rem",
                paddingRight: isPending ? "2.5rem" : "0.75rem",
                paddingTop: "0.5rem",
                paddingBottom: "0.5rem",
                background: "var(--background)",
                border: "1px solid var(--panel-border-strong)",
                borderRadius: "8px",
                color: "var(--foreground)",
                fontSize: "0.8125rem",
                fontFamily: "inherit",
                outline: "none",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.boxShadow = "0 0 0 3px var(--accent-glow)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "var(--panel-border-strong)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
            {isPending && (
              <Loader2
                className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 animate-spin"
                style={{ color: "var(--accent)" }}
                aria-hidden="true"
              />
            )}
          </div>
        </div>

        {/* ── Table ── */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <table className="w-full text-left">
            <thead className="sticky top-0" style={{ background: "var(--panel-bg-subtle)", zIndex: 1 }}>
              <tr style={{ borderBottom: "1px solid var(--divider)" }}>
                <th className="stat-label px-5 py-2.5">Jogador</th>
                <th className="stat-label px-3 py-2.5 text-center">Pos</th>
                <th className="stat-label px-3 py-2.5 text-center">OVR</th>
                <th className="stat-label px-3 py-2.5 text-center">Idade</th>
                <th className="stat-label px-3 py-2.5 text-center">PAC</th>
                <th className="stat-label px-3 py-2.5 text-center">FIN</th>
                <th className="stat-label px-3 py-2.5 text-center">PAS</th>
                <th className="stat-label px-3 py-2.5 text-center">DRI</th>
                <th className="stat-label px-3 py-2.5 text-center">DEF</th>
                <th className="stat-label px-3 py-2.5 text-center">FIS</th>
                <th className="stat-label px-3 py-2.5 text-right">Ação</th>
              </tr>
            </thead>
            <tbody>
              {players.length === 0 && !isPending ? (
                <tr>
                  <td colSpan={11} className="px-5 py-16 text-center">
                    <p className="text-sm" style={{ color: "var(--muted)" }}>
                      {query.length >= 2
                        ? "Nenhum jogador encontrado"
                        : "Nenhum jogador no banco de dados"}
                    </p>
                  </td>
                </tr>
              ) : (
                players.map((player, i) => {
                  const pos      = player.position ?? "—";
                  const posStyle = POSITION_STYLE[pos] ?? { color: "var(--muted)", bg: "rgba(255,255,255,0.05)" };
                  const isAdded  = added.has(player.id);
                  const isAdding = adding === player.id;

                  return (
                    <tr
                      key={player.id}
                      className="group"
                      style={{
                        borderBottom: i < players.length - 1 ? "1px solid var(--divider)" : "none",
                        opacity: isPending ? 0.5 : 1,
                        transition: "background 0.15s, opacity 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "var(--panel-bg-subtle)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = "transparent";
                      }}
                    >
                      {/* Name + meta */}
                      <td className="px-5 py-2.5">
                        <p className="text-sm font-medium truncate" style={{ color: "var(--foreground)", maxWidth: "200px" }}>
                          {player.name}
                        </p>
                        {(player.team || player.nation) && (
                          <p className="stat-label mt-0.5 truncate" style={{ maxWidth: "200px" }}>
                            {[player.team, player.nation].filter(Boolean).join(" · ")}
                          </p>
                        )}
                      </td>

                      {/* Position */}
                      <td className="px-3 py-2.5 text-center">
                        <span
                          className="inline-flex items-center justify-center rounded-full px-2 py-0.5 text-xs font-bold"
                          style={{
                            background: posStyle.bg,
                            color: posStyle.color,
                            border: `1px solid ${posStyle.color}22`,
                            letterSpacing: "0.06em",
                            minWidth: "2.5rem",
                          }}
                        >
                          {pos}
                        </span>
                      </td>

                      {/* OVR */}
                      <td className="px-3 py-2.5 text-center">
                        <span
                          className="inline-block rounded-full px-2 py-0.5 font-bold tabular-nums"
                          style={{
                            fontFamily: "var(--font-teko), sans-serif",
                            fontSize: "1rem",
                            color: ovrColor(player.overall),
                            background: `${ovrColor(player.overall)}14`,
                            border: `1px solid ${ovrColor(player.overall)}28`,
                          }}
                        >
                          {player.overall}
                        </span>
                      </td>

                      {/* Age */}
                      <td className="px-3 py-2.5 text-center text-sm tabular-nums" style={{ color: "var(--muted)" }}>
                        {player.age}
                      </td>

                      {/* Stats */}
                      <td className="px-3 py-2.5 text-center"><StatBar label="" value={player.pace} /></td>
                      <td className="px-3 py-2.5 text-center"><StatBar label="" value={player.shooting} /></td>
                      <td className="px-3 py-2.5 text-center"><StatBar label="" value={player.passing} /></td>
                      <td className="px-3 py-2.5 text-center"><StatBar label="" value={player.dribbling} /></td>
                      <td className="px-3 py-2.5 text-center"><StatBar label="" value={player.defending} /></td>
                      <td className="px-3 py-2.5 text-center"><StatBar label="" value={player.physicality} /></td>

                      {/* Add button */}
                      <td className="px-4 py-2.5 text-right">
                        <button
                          onClick={() => handleAdd(player)}
                          disabled={isAdded || isAdding}
                          className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition-all"
                          style={{
                            background: isAdded
                              ? "rgba(82,222,229,0.12)"
                              : "rgba(82,222,229,0.07)",
                            border: isAdded
                              ? "1px solid rgba(82,222,229,0.4)"
                              : "1px solid rgba(82,222,229,0.2)",
                            color: isAdded ? "var(--accent)" : "var(--muted)",
                            cursor: isAdded ? "default" : "pointer",
                            opacity: isAdding ? 0.7 : 1,
                          }}
                          onMouseEnter={(e) => {
                            if (isAdded || isAdding) return;
                            (e.currentTarget as HTMLElement).style.background = "rgba(82,222,229,0.15)";
                            (e.currentTarget as HTMLElement).style.color = "var(--accent)";
                            (e.currentTarget as HTMLElement).style.borderColor = "rgba(82,222,229,0.4)";
                          }}
                          onMouseLeave={(e) => {
                            if (isAdded || isAdding) return;
                            (e.currentTarget as HTMLElement).style.background = "rgba(82,222,229,0.07)";
                            (e.currentTarget as HTMLElement).style.color = "var(--muted)";
                            (e.currentTarget as HTMLElement).style.borderColor = "rgba(82,222,229,0.2)";
                          }}
                        >
                          {isAdding ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : isAdded ? (
                            <><Check className="h-3 w-3" />Adicionado</>
                          ) : (
                            <><Plus className="h-3 w-3" />Adicionar</>
                          )}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        <div
          className="flex items-center justify-between px-5 py-3 shrink-0"
          style={{ borderTop: "1px solid var(--divider)" }}
        >
          <p className="stat-label">
            Página {page + 1} de {totalPages} · {total.toLocaleString("pt-BR")} jogadores
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0 || isPending}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-all"
              style={{
                background: page === 0 ? "transparent" : "var(--panel-bg-subtle)",
                border: "1px solid var(--panel-border)",
                color: page === 0 ? "var(--muted-dim)" : "var(--muted)",
                cursor: page === 0 ? "not-allowed" : "pointer",
              }}
              onMouseEnter={(e) => {
                if (page === 0 || isPending) return;
                (e.currentTarget as HTMLElement).style.color = "var(--foreground)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = page === 0 ? "var(--muted-dim)" : "var(--muted)";
              }}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Anterior
            </button>

            {/* Page numbers — show up to 5 around current */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let p: number;
                if (totalPages <= 5) {
                  p = i;
                } else if (page < 3) {
                  p = i;
                } else if (page >= totalPages - 3) {
                  p = totalPages - 5 + i;
                } else {
                  p = page - 2 + i;
                }
                return (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    disabled={isPending}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-xs font-medium tabular-nums transition-all"
                    style={{
                      background: p === page ? "rgba(82,222,229,0.15)" : "transparent",
                      border: p === page ? "1px solid rgba(82,222,229,0.4)" : "1px solid transparent",
                      color: p === page ? "var(--accent)" : "var(--muted)",
                      cursor: "pointer",
                    }}
                  >
                    {p + 1}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1 || isPending}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs transition-all"
              style={{
                background: page >= totalPages - 1 ? "transparent" : "var(--panel-bg-subtle)",
                border: "1px solid var(--panel-border)",
                color: page >= totalPages - 1 ? "var(--muted-dim)" : "var(--muted)",
                cursor: page >= totalPages - 1 ? "not-allowed" : "pointer",
              }}
              onMouseEnter={(e) => {
                if (page >= totalPages - 1 || isPending) return;
                (e.currentTarget as HTMLElement).style.color = "var(--foreground)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.color = page >= totalPages - 1 ? "var(--muted-dim)" : "var(--muted)";
              }}
            >
              Próxima
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


