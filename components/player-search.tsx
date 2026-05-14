"use client";

import { useState, useTransition } from "react";
import { Search, Loader2, Plus } from "lucide-react";
import { searchFifaPlayers } from "@/app/actions/players";
import { addPlayerToSquad } from "@/app/actions/squad";

type PlayerResult = {
  id: number;
  name: string;
  overall: number;
  position: string;
  age: number;
};

function ovrColor(ovr: number): string {
  if (ovr >= 90) return "var(--caution)";
  if (ovr >= 80) return "var(--accent-strong)";
  if (ovr >= 70) return "var(--accent)";
  if (ovr >= 60) return "var(--muted)";
  return "var(--muted-dim)";
}

export default function PlayerSearch() {
  const [query, setQuery]     = useState("");
  const [results, setResults] = useState<PlayerResult[]>([]);
  const [adding, setAdding]   = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    startTransition(async () => {
      if (value.length >= 2) {
        const players = await searchFifaPlayers(value);
        setResults(players);
      } else {
        setResults([]);
      }
    });
  };

  const handleAdd = async (player: PlayerResult) => {
    setAdding(player.id);
    await addPlayerToSquad({
      id: player.id, name: player.name,
      overall: player.overall, position: player.position,
    });
    setQuery("");
    setResults([]);
    setAdding(null);
  };

  return (
    <div className="relative w-full">

      {/* Input */}
      <div className="relative">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2"
          style={{ color: "var(--muted-dim)" }}
          aria-hidden="true"
        />
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Buscar jogador do jogo base..."
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
            transition: "border-color 0.2s ease, box-shadow 0.2s ease",
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
            aria-label="A procurar..."
          />
        )}
      </div>

      {/* Dropdown */}
      {results.length > 0 && (
        <ul
          className="absolute z-20 mt-1.5 w-full overflow-hidden"
          style={{
            background: "var(--panel-bg)",
            border: "1px solid var(--panel-border-strong)",
            borderRadius: "10px",
            boxShadow: "0 8px 40px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.04)",
          }}
        >
          {results.map((player, i) => (
            <li
              key={player.id}
              onClick={() => handleAdd(player)}
              className="group flex cursor-pointer items-center justify-between px-4 py-2.5 transition-colors"
              style={{
                borderBottom: i < results.length - 1 ? "1px solid var(--divider)" : "none",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "var(--panel-bg-subtle)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
            >
              {/* Player info */}
              <div className="min-w-0">
                <p className="truncate text-sm font-medium" style={{ color: "var(--foreground)" }}>
                  {player.name}
                </p>
                <p className="stat-label mt-0.5">
                  {player.position} · {player.age} anos
                </p>
              </div>

              {/* Right side: OVR + add icon */}
              <div className="ml-3 flex shrink-0 items-center gap-2">
                <span
                  className="rounded-full px-2 py-0.5 text-sm font-bold tabular-nums"
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
                {adding === player.id ? (
                  <Loader2
                    className="h-3.5 w-3.5 animate-spin"
                    style={{ color: "var(--accent)" }}
                    aria-hidden="true"
                  />
                ) : (
                  <Plus
                    className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100"
                    style={{ color: "var(--accent)" }}
                    aria-hidden="true"
                  />
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}