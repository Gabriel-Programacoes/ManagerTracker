import Link from "next/link";
import { ArrowLeft, UserPlus } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { CreatePlayerForm } from "@/components/squad/create-player-form";

export default function NewPlayerPage() {
  return (
    <AppShell>
      {/* ── Page header ───────────────────────────────── */}
      <header className="mb-8 pb-5" style={{ borderBottom: "1px solid var(--divider)" }}>
        <Link
          href="/squad"
          className="mb-4 inline-flex items-center gap-1.5 text-xs transition-colors"
          style={{ color: "var(--muted)", letterSpacing: "0.06em" }}
        >
          <ArrowLeft className="h-3 w-3" aria-hidden="true" />
          Voltar ao Elenco
        </Link>

        <div className="flex items-end gap-3">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <UserPlus className="h-4 w-4" style={{ color: "var(--accent)" }} aria-hidden="true" />
              <p className="stat-label">Cadastro de Jogador</p>
            </div>
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
              Novo{" "}
              <span style={{ color: "var(--accent)" }}>Jogador</span>
            </h1>
            <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
              Preencha os atributos — o overall será calculado pela posição
            </p>
          </div>
        </div>
      </header>

      <CreatePlayerForm />
    </AppShell>
  );
}

