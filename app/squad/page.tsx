import Link from "next/link";
import { UserPlus, Users } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { SquadTable } from "@/components/squad/squad-table";
import { SquadActions } from "@/components/squad/squad-actions";
import { getMySquad } from "@/app/actions/squad";
import type { SquadPlayer } from "@/lib/player-utils";

export default async function SquadPage() {
  const rawTeam = await getMySquad();
  const myTeam  = rawTeam as unknown as SquadPlayer[];

  return (
    <AppShell>
      {/* ── Page header ───────────────────────────────── */}
      <header className="mb-6 pb-5" style={{ borderBottom: "1px solid var(--divider)" }}>
        <div className="mb-4 flex items-center gap-2">
          <Users className="h-4 w-4" style={{ color: "var(--accent)" }} aria-hidden="true" />
          <p className="stat-label">Gestão de Plantel</p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1
              className="uppercase leading-none"
              style={{
                fontFamily: "var(--font-teko), sans-serif",
                fontSize: "clamp(2rem, 6vw, 3.5rem)",
                fontWeight: 700,
                letterSpacing: "0.02em",
                color: "var(--foreground)",
              }}
            >
              Seu{" "}
              <span style={{ color: "var(--accent)" }}>Elenco</span>
            </h1>
            <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
              {myTeam.length} jogador{myTeam.length !== 1 ? "es" : ""} · clique em um jogador para ver detalhes
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <SquadActions />
            <Link
              href="/squad/new"
              className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all"
              style={{
                background: "rgba(82,222,229,0.05)",
                border: "1px solid rgba(82,222,229,0.2)",
                color: "var(--muted)",
                letterSpacing: "0.04em",
              }}
              onMouseEnter={undefined}
            >
              <UserPlus className="h-3.5 w-3.5" aria-hidden="true" />
              Criar jogador
            </Link>
          </div>
        </div>
      </header>

      {/* ── Squad table with modal ─────────────────────── */}
      <SquadTable players={myTeam} />
    </AppShell>
  );
}