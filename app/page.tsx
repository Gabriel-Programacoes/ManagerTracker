import { Grid, Heading, Text } from "@radix-ui/themes";
import { AlertTriangle, Goal, Hand, ShieldAlert } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { career, players } from "@/lib/mock-data";
import { ChalkboardRevealCard } from "@/components/chalkboard-reveal-card";
import { DashboardHero } from "@/components/dashboard/dashboard-hero";

export default function DashboardPage() {
  const topScorers = [...players].sort((a, b) => b.goals - a.goals).slice(0, 5);
  const topAssistProviders = [...players].sort((a, b) => b.assists - a.assists).slice(0, 5);
  const topYellowCards = [...players].sort((a, b) => b.yellowCards - a.yellowCards).slice(0, 5);
  const topRedCards = [...players].sort((a, b) => b.redCards - a.redCards).slice(0, 5);

  return (
    <AppShell>
      <DashboardHero career={career} />

      <Heading size="6" className="mb-4 mt-2" style={{ color: "var(--foreground)", fontFamily: "var(--font-teko), sans-serif", letterSpacing: "0.04em" }}>Team Statistics</Heading>
      <Grid columns={{ initial: "1", lg: "2" }} gap="4">
        <ChalkboardRevealCard className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <Text as="p" size="2" className="terminal-muted">Top 5 Scorers</Text>
            <Goal className="size-4 text-(--accent-strong)" aria-hidden="true" />
          </div>
          <div className="flex flex-col">
            {topScorers.map((player, index) => (
              <div key={player.id} className="row-item gap-3">
                <Text as="p" size="1" style={{ color: "var(--muted-dim)", minWidth: "1rem", textAlign: "right" }}>{index + 1}</Text>
                <Text as="p" size="2" className="flex-1 truncate" style={{ color: "var(--foreground)" }}>{player.name}</Text>
                <Text as="p" size="2" style={{ color: "var(--accent)", fontVariantNumeric: "tabular-nums" }}>{player.goals} <span style={{ color: "var(--muted-dim)" }}>G</span></Text>
              </div>
            ))}
          </div>
        </ChalkboardRevealCard>

        <ChalkboardRevealCard className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <Text as="p" size="2" className="terminal-muted">Top 5 Assist Providers</Text>
            <Hand className="size-4 text-(--accent)" aria-hidden="true" />
          </div>
          <div className="flex flex-col">
            {topAssistProviders.map((player, index) => (
              <div key={player.id} className="row-item gap-3">
                <Text as="p" size="1" style={{ color: "var(--muted-dim)", minWidth: "1rem", textAlign: "right" }}>{index + 1}</Text>
                <Text as="p" size="2" className="flex-1 truncate" style={{ color: "var(--foreground)" }}>{player.name}</Text>
                <Text as="p" size="2" style={{ color: "var(--accent)", fontVariantNumeric: "tabular-nums" }}>{player.assists} <span style={{ color: "var(--muted-dim)" }}>A</span></Text>
              </div>
            ))}
          </div>
        </ChalkboardRevealCard>

        <ChalkboardRevealCard className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <Text as="p" size="2" className="terminal-muted">Top 5 Yellow Cards</Text>
            <AlertTriangle className="size-4 text-(--caution)" aria-hidden="true" />
          </div>
          <div className="flex flex-col">
            {topYellowCards.map((player, index) => (
              <div key={player.id} className="row-item gap-3">
                <Text as="p" size="1" style={{ color: "var(--muted-dim)", minWidth: "1rem", textAlign: "right" }}>{index + 1}</Text>
                <Text as="p" size="2" className="flex-1 truncate" style={{ color: "var(--foreground)" }}>{player.name}</Text>
                <Text as="p" size="2" style={{ color: "var(--caution)", fontVariantNumeric: "tabular-nums" }}>{player.yellowCards} <span style={{ color: "var(--muted-dim)" }}>YC</span></Text>
              </div>
            ))}
          </div>
        </ChalkboardRevealCard>

        <ChalkboardRevealCard className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <Text as="p" size="2" className="terminal-muted">Top 5 Red Cards</Text>
            <ShieldAlert className="size-4 text-(--loss)" aria-hidden="true" />
          </div>
          <div className="flex flex-col">
            {topRedCards.map((player, index) => (
              <div key={player.id} className="row-item gap-3">
                <Text as="p" size="1" style={{ color: "var(--muted-dim)", minWidth: "1rem", textAlign: "right" }}>{index + 1}</Text>
                <Text as="p" size="2" className="flex-1 truncate" style={{ color: "var(--foreground)" }}>{player.name}</Text>
                <Text as="p" size="2" style={{ color: "var(--loss)", fontVariantNumeric: "tabular-nums" }}>{player.redCards} <span style={{ color: "var(--muted-dim)" }}>RC</span></Text>
              </div>
            ))}
          </div>
        </ChalkboardRevealCard>
      </Grid>

      <ChalkboardRevealCard className="mt-4 p-5">
        <Text as="p" size="2" className="terminal-muted mb-4">Season Record</Text>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <span className="stat-label">Wins</span>
            <span className="text-4xl font-bold leading-none" style={{ fontFamily: "var(--font-teko), sans-serif", color: "var(--win)" }}>{career.wins}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="stat-label">Draws</span>
            <span className="text-4xl font-bold leading-none" style={{ fontFamily: "var(--font-teko), sans-serif", color: "var(--draw)" }}>{career.draws}</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="stat-label">Losses</span>
            <span className="text-4xl font-bold leading-none" style={{ fontFamily: "var(--font-teko), sans-serif", color: "var(--loss)" }}>{career.losses}</span>
          </div>
        </div>
      </ChalkboardRevealCard>
    </AppShell>
  );
}
