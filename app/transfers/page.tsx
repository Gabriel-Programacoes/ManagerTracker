import { Badge, Card, Grid, Heading, Table, Text } from "@radix-ui/themes";
import { AppShell } from "@/components/app-shell";
import { career, shortlist, transfers } from "@/lib/mock-data";
import { ChalkboardRevealCard } from "@/components/chalkboard-reveal-card";

const netSpend = transfers.reduce((acc, t) => acc + (t.type === "In" ? t.fee : -t.fee), 0);
const recordSigning = Math.max(...transfers.map((t) => t.fee));

export default function TransfersPage() {
  return (
    <AppShell>
      <Heading size="6" className="mb-4 text-lime-200">Transfer Ledger</Heading>
      <Grid columns={{ initial: "1", md: "3" }} gap="4" className="mb-4">
        <ChalkboardRevealCard className="p-4">
          <Text size="2" className="terminal-muted">Current Budget</Text>
          <Text size="5" className="mt-2">EUR {(career.budget / 1_000_000).toFixed(1)}M</Text>
        </ChalkboardRevealCard>
        <ChalkboardRevealCard className="p-4">
          <Text size="2" className="terminal-muted">Net Spend</Text>
          <Text size="5" className="mt-2">EUR {(netSpend / 1_000_000).toFixed(1)}M</Text>
        </ChalkboardRevealCard>
        <Card className="tactical-panel">
          <Text size="2" className="terminal-muted">Shortlist</Text>
          <div className="mt-2 flex flex-wrap gap-2">
            {shortlist.map((name) => (
              <Badge key={name} variant="soft" className="bg-neutral-900 text-gray-100">{name}</Badge>
            ))}
          </div>
        </Card>
      </Grid>
      <div className="tactical-panel p-2">
        <Table.Root className="[font-variant-numeric:tabular-nums]">
          <Table.Header>
            <Table.Row className="border-b-2 border-zinc-700">
              <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Player</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Type</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Fee</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {transfers.map((t) => (
              <Table.Row key={t.id} className="border-b-2 border-zinc-800">
                <Table.RowHeaderCell>{t.date}</Table.RowHeaderCell>
                <Table.Cell className={t.type === "In" ? "text-gray-100" : "text-zinc-500"}>{t.playerName}</Table.Cell>
                <Table.Cell className={t.type === "In" ? "text-lime-200" : "text-zinc-500"}>{t.type}</Table.Cell>
                <Table.Cell className={t.fee === recordSigning ? "text-lime-200" : ""}>
                  EUR {(t.fee / 1_000_000).toFixed(1)}M
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </div>
    </AppShell>
  );
}
