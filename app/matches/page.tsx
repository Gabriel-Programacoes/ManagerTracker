import { Badge, Grid, Heading, Table, Text } from "@radix-ui/themes";
import { AppShell } from "@/components/app-shell";
import { matches } from "@/lib/mock-data";
import { ChalkboardRevealCard } from "@/components/chalkboard-reveal-card";

export default function MatchesPage() {
  return (
    <AppShell>
      <div className="mb-4 flex items-center justify-between">
        <Heading size="6" className="text-lime-200">Tactical Archive</Heading>
        <Badge variant="soft" className="bg-emerald-950 text-lime-200">Dossiers</Badge>
      </div>

      <Grid columns={{ initial: "1", md: "2" }} gap="3" className="mb-4">
        {matches.slice(0, 2).map((m) => (
          <ChalkboardRevealCard key={`dossier-${m.id}`} className="p-4">
            <Text size="2" className="terminal-muted">{`${m.date} // ${m.competition}`}</Text>
            <Text size="5" className="mt-2 text-gray-100">VS {m.opponent}</Text>
            <Text size="2" className="terminal-muted">Primary Shape: 4-2-3-1</Text>
          </ChalkboardRevealCard>
        ))}
      </Grid>

      <div className="tactical-panel p-2">
        <Table.Root className="[font-variant-numeric:tabular-nums]">
          <Table.Header>
            <Table.Row className="border-b-2 border-zinc-700">
              <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Opponent</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Comp</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Venue</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Score</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Possession</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {matches.map((m) => (
              <Table.Row key={m.id} className="border-b border-zinc-800">
                <Table.RowHeaderCell>{m.date}</Table.RowHeaderCell>
                <Table.Cell>{m.opponent}</Table.Cell>
                <Table.Cell>{m.competition}</Table.Cell>
                <Table.Cell>{m.venue}</Table.Cell>
                <Table.Cell>
                  {m.goalsFor !== undefined ? `${m.goalsFor}-${m.goalsAgainst}` : <Text size="2" className="terminal-muted">Pending</Text>}
                </Table.Cell>
                <Table.Cell>{m.possession ? `${m.possession}%` : "-"}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </div>
    </AppShell>
  );
}
