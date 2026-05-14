import { Grid, Heading, Select, Table, Text } from "@radix-ui/themes";
import { AppShell } from "@/components/app-shell";
import { players } from "@/lib/mock-data";
import { ChalkboardRevealCard } from "@/components/chalkboard-reveal-card";

export default function SquadPage() {
  return (
    <AppShell>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Heading size="6" className="text-lime-200">Hall of Fame</Heading>
        <div className="flex items-center gap-2">
          <Select.Root defaultValue="all">
            <Select.Trigger aria-label="Filter by position" />
            <Select.Content>
              <Select.Item value="all">All Positions</Select.Item>
              <Select.Item value="GK">GK</Select.Item>
              <Select.Item value="DF">DF</Select.Item>
              <Select.Item value="MF">MF</Select.Item>
              <Select.Item value="FW">FW</Select.Item>
            </Select.Content>
          </Select.Root>
        </div>
      </div>

      <Grid columns={{ initial: "1", lg: "3" }} gap="3" className="mb-4">
        {players.slice(0, 3).map((p) => (
          <ChalkboardRevealCard key={`poster-${p.id}`} className="p-4">
            <Text className="text-6xl leading-none text-lime-200">{p.overall}</Text>
            <Text size="5" className="mt-2 text-gray-100">{p.name}</Text>
            <Text size="2" className="terminal-muted">{p.goals}G / {p.assists}A • {p.position}</Text>
          </ChalkboardRevealCard>
        ))}
      </Grid>

      <div className="tactical-panel p-2">
        <Table.Root className="[font-variant-numeric:tabular-nums]">
          <Table.Header>
            <Table.Row className="border-b-2 border-zinc-700">
              <Table.ColumnHeaderCell>Player</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Pos</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>OVR</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>POT</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Age</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>G/A</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {players.map((p) => (
              <Table.Row key={p.id} className="border-b border-zinc-800">
                <Table.RowHeaderCell>{p.name}</Table.RowHeaderCell>
                <Table.Cell>{p.position}</Table.Cell>
                <Table.Cell>{p.overall}</Table.Cell>
                <Table.Cell>{p.potential}</Table.Cell>
                <Table.Cell>{p.age}</Table.Cell>
                <Table.Cell>{p.goals}/{p.assists}</Table.Cell>
                <Table.Cell>{p.status}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </div>
    </AppShell>
  );
}
