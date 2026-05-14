import { Heading, Table, Text } from "@radix-ui/themes";
import { AppShell } from "@/components/app-shell";
import { youthPlayers } from "@/lib/mock-data";
import { ChalkboardRevealCard } from "@/components/chalkboard-reveal-card";

export default function YouthAcademyPage() {
  return (
    <AppShell>
      <Heading size="6" className="mb-4 text-lime-200">Youth Academy</Heading>
      <div className="grid gap-4 md:grid-cols-2">
        {youthPlayers.map((p) => (
          <ChalkboardRevealCard key={p.id} className="p-4">
            <Text size="4">{p.name}</Text>
            <Text size="2" className="terminal-muted">{p.position} • Age {p.age}</Text>
            <div className="mt-3 flex h-12 items-end gap-1">
              {p.monthlyOvr.map((m) => (
                <div key={`${p.id}-${m.month}`} className="flex-1 bg-emerald-900/60">
                  <div className="bg-lime-200" style={{ height: `${m.ovr}%` }} />
                </div>
              ))}
            </div>
            <Table.Root className="mt-3 tactical-panel">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Month</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>OVR</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {p.monthlyOvr.map((m) => (
                  <Table.Row key={m.month}>
                    <Table.RowHeaderCell>{m.month}</Table.RowHeaderCell>
                    <Table.Cell>{m.ovr}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </ChalkboardRevealCard>
        ))}
      </div>
    </AppShell>
  );
}
