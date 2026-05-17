"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { UserPlus } from "lucide-react";
import { ovrColor, POSITION_STYLE, type SquadPlayer } from "@/lib/player-utils";
import { PlayerDetailModal } from "./player-detail-modal";

interface SquadTableProps {
  players: SquadPlayer[];
}

const COLS = ["Jogador", "Posição", "OVR", "JG", "Gols", "Assist.", "CA", "CV", "CS"];

/** Posições defensivas que exibem "Clean Sheets" */
const DEFENSIVE_POSITIONS = new Set(["GOL", "ZAG", "LAT"]);

export function SquadTable({ players }: SquadTableProps) {
  const [selected, setSelected] = useState<SquadPlayer | null>(null);

  /* Whenever the server refreshes `players` (via revalidatePath after a save),
     keep `selected` in sync so the modal always shows the latest data. */
  useEffect(() => {
    if (!selected) return;
    const updated = players.find((p) => p.id === selected.id);
    if (updated) setSelected(updated);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [players]);

  return (
    <>
      {/* ── Table ───────────────────────────────────────── */}
      <div
        style={{
          border: "1px solid var(--panel-border)",
          borderRadius: "12px",
          overflow: "hidden",
          background: "var(--panel-bg)",
          boxShadow: "0 4px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)",
        }}
      >
        <table className="w-full text-left">
          <thead>
            <tr style={{ borderBottom: "1px solid var(--divider)" }}>
              {COLS.map((col, i) => (
                <th
                  key={col}
                  className="stat-label px-5 py-3"
                  title={
                    col === "JG" ? "Jogos disputados" :
                    col === "CA" ? "Cartões Amarelos" :
                    col === "CV" ? "Cartões Vermelhos" :
                    col === "CS" ? "Jogos sem sofrer gols (GOL / ZAG / LAT)" :
                    undefined
                  }
                  style={{
                    textAlign: i >= 2 ? "center" : "left",
                    background: "var(--panel-bg-subtle)",
                    cursor: ["JG","CA","CV","CS"].includes(col) ? "help" : undefined,
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {players.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <p className="text-sm" style={{ color: "var(--muted)" }}>
                      Elenco vazio
                    </p>
                    <p className="stat-label">Use a busca acima para adicionar jogadores</p>
                    <Link
                      href="/squad/new"
                      className="mt-1 flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs transition-colors"
                      style={{
                        background: "rgba(82,222,229,0.08)",
                        border: "1px solid rgba(82,222,229,0.2)",
                        color: "var(--accent)",
                      }}
                    >
                      <UserPlus className="h-3 w-3" aria-hidden="true" />
                      Criar jogador detalhado
                    </Link>
                  </div>
                </td>
              </tr>
            ) : (
              players.map((player) => {
                const pos      = player.position ?? "—";
                const posStyle = POSITION_STYLE[pos] ?? { color: "var(--muted)", bg: "rgba(255,255,255,0.05)" };

                return (
                  <tr
                    key={player.id}
                    className="row-item cursor-pointer"
                    style={{ display: "table-row" }}
                    onClick={() => setSelected(player)}
                    title={`Ver detalhes de ${player.name}`}
                  >
                    {/* Name */}
                    <td
                      className="px-5 py-3 text-sm font-medium"
                      style={{ color: "var(--foreground)" }}
                    >
                      {player.name}
                    </td>

                    {/* Position */}
                    <td className="px-5 py-3">
                      <span
                        className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold"
                        style={{
                          background: posStyle.bg,
                          color: posStyle.color,
                          border: `1px solid ${posStyle.color}22`,
                          letterSpacing: "0.06em",
                        }}
                      >
                        {pos}
                      </span>
                    </td>

                    {/* OVR */}
                    <td className="px-5 py-3 text-center">
                      <span
                        className="inline-block rounded-full px-2.5 py-0.5 font-bold tabular-nums"
                        style={{
                          color: ovrColor(player.currentOverall),
                          background: `${ovrColor(player.currentOverall)}14`,
                          border: `1px solid ${ovrColor(player.currentOverall)}28`,
                          fontFamily: "var(--font-teko), sans-serif",
                          fontSize: "1rem",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {player.currentOverall}
                      </span>
                    </td>

                    {/* Matches */}
                    <td
                      className="px-5 py-3 text-center text-sm tabular-nums"
                      style={{ color: (player.matches ?? 0) > 0 ? "var(--foreground)" : "var(--muted-dim)" }}
                    >
                      {player.matches ?? 0}
                    </td>

                    {/* Goals */}
                    <td
                      className="px-5 py-3 text-center text-sm tabular-nums"
                      style={{ color: (player.goals ?? 0) > 0 ? "var(--accent-strong)" : "var(--muted-dim)" }}
                    >
                      {player.goals ?? 0}
                    </td>

                    {/* Assists */}
                    <td
                      className="px-5 py-3 text-center text-sm tabular-nums"
                      style={{ color: (player.assists ?? 0) > 0 ? "var(--accent)" : "var(--muted-dim)" }}
                    >
                      {player.assists ?? 0}
                    </td>

                    {/* Yellow Cards */}
                    <td className="px-5 py-3 text-center text-sm tabular-nums">
                      {(player.yellowCards ?? 0) > 0 ? (
                        <span
                          className="inline-flex items-center justify-center rounded px-2 py-0.5 font-bold"
                          style={{
                            background: "rgba(250,200,60,0.15)",
                            color: "#f5c518",
                            border: "1px solid rgba(250,200,60,0.3)",
                            minWidth: "1.75rem",
                          }}
                        >
                          {player.yellowCards}
                        </span>
                      ) : (
                        <span style={{ color: "var(--muted-dim)" }}>0</span>
                      )}
                    </td>

                    {/* Red Cards */}
                    <td className="px-5 py-3 text-center text-sm tabular-nums">
                      {(player.redCards ?? 0) > 0 ? (
                        <span
                          className="inline-flex items-center justify-center rounded px-2 py-0.5 font-bold"
                          style={{
                            background: "rgba(220,60,60,0.15)",
                            color: "var(--loss)",
                            border: "1px solid rgba(220,60,60,0.3)",
                            minWidth: "1.75rem",
                          }}
                        >
                          {player.redCards}
                        </span>
                      ) : (
                        <span style={{ color: "var(--muted-dim)" }}>0</span>
                      )}
                    </td>

                    {/* Clean Sheets — only for defensive positions */}
                    <td className="px-5 py-3 text-center text-sm tabular-nums">
                      {DEFENSIVE_POSITIONS.has(pos) ? (
                        (player.cleanSheets ?? 0) > 0 ? (
                          <span
                            className="inline-flex items-center justify-center rounded px-2 py-0.5 font-bold"
                            style={{
                              background: "rgba(82,222,229,0.12)",
                              color: "var(--accent)",
                              border: "1px solid rgba(82,222,229,0.25)",
                              minWidth: "1.75rem",
                            }}
                          >
                            {player.cleanSheets}
                          </span>
                        ) : (
                          <span style={{ color: "var(--muted-dim)" }}>0</span>
                        )
                      ) : (
                        <span style={{ color: "var(--muted-dim)", fontSize: "0.7rem" }}>—</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Detail modal ────────────────────────────────── */}
      {selected && (
        <PlayerDetailModal
          player={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  );
}

