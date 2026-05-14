/* ─── Shared player types & utilities ───────────────────── */

/** Extended squad player — base fields from Prisma + optional detailed attrs */
export type SquadPlayer = {
  id: string;
  name: string;
  position: string | null;
  currentOverall: number;
  // Season stats
  goals: number | null;
  assists: number | null;
  matches: number | null;
  yellowCards: number | null;
  redCards: number | null;
  cleanSheets: number | null;
  // Contract & finances (in thousands €)
  marketValue: number | null;
  salary: number | null;
  contractYears: number | null;
  // Season awards
  awardPlayerOfSeason: boolean | null;
  awardTopScorer: boolean | null;
  awardBestGoalkeeper: boolean | null;
  awardBestYoungPlayer: boolean | null;
  awardBestDefender: boolean | null;
  // FIFA ref
  fifaPlayerId?: number | null;
  // Detailed attributes
  pace?: number | null;
  shooting?: number | null;
  passing?: number | null;
  dribbling?: number | null;
  defending?: number | null;
  physical?: number | null;
  skillMoves?: number | null;
  weakFoot?: number | null;
  height?: number | null;
  feet?: string | null;
  age?: number | null;
  playstyle?: string | null;
};

export type DetailedPlayerInput = {
  name: string;
  position: string;
  age: number;
  height: number;
  feet: string;
  skillMoves: number;
  weakFoot: number;
  playstyle: string;
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
  // Contract & finances
  marketValue: number;
  salary: number;
  contractYears: number;
};

/* ─── Color utilities ────────────────────────────────────── */
export function ovrColor(ovr: number): string {
  if (ovr >= 90) return "var(--caution)";
  if (ovr >= 80) return "var(--accent-strong)";
  if (ovr >= 70) return "var(--accent)";
  if (ovr >= 60) return "var(--muted)";
  return "var(--muted-dim)";
}

export function statColor(val: number): string {
  if (val >= 85) return "var(--caution)";
  if (val >= 75) return "var(--accent-strong)";
  if (val >= 65) return "var(--accent)";
  if (val >= 50) return "var(--muted)";
  return "var(--loss)";
}

/* ─── Position metadata ──────────────────────────────────── */
export const POSITION_STYLE: Record<string, { color: string; bg: string }> = {
  GOL: { color: "var(--comp-league)",       bg: "rgba(146,220,229,0.08)" },
  ZAG: { color: "var(--comp-cup)",          bg: "rgba(168,168,232,0.08)" },
  LAT: { color: "var(--comp-cup)",          bg: "rgba(168,168,232,0.08)" },
  VOL: { color: "var(--comp-continental)",  bg: "rgba(184,194,144,0.08)" },
  MC:  { color: "var(--comp-continental)",  bg: "rgba(184,194,144,0.08)" },
  MEI: { color: "var(--caution)",           bg: "rgba(196,169,122,0.08)" },
  PTE: { color: "var(--loss)",              bg: "rgba(211,158,171,0.08)" },
  PTD: { color: "var(--loss)",              bg: "rgba(211,158,171,0.08)" },
  ATA: { color: "var(--loss)",              bg: "rgba(211,158,171,0.08)" },
};

export const POSITIONS = [
  { value: "GOL", label: "GOL — Goleiro" },
  { value: "ZAG", label: "ZAG — Zagueiro" },
  { value: "LAT", label: "LAT — Lateral" },
  { value: "VOL", label: "VOL — Volante" },
  { value: "MC",  label: "MC  — Meia Central" },
  { value: "MEI", label: "MEI — Meia Atacante" },
  { value: "PTE", label: "PTE — Ponta Esq." },
  { value: "PTD", label: "PTD — Ponta Dir." },
  { value: "ATA", label: "ATA — Atacante" },
];

/* ─── Position-weighted overall calculation ──────────────── */
const POS_WEIGHTS: Record<string, [number, number, number, number, number, number]> = {
  //              pace  shoot  pass  drib  def   phys
  GOL: [0.10, 0.05, 0.10, 0.10, 0.35, 0.30],
  ZAG: [0.15, 0.05, 0.10, 0.10, 0.35, 0.25],
  LAT: [0.20, 0.05, 0.15, 0.15, 0.25, 0.20],
  VOL: [0.10, 0.10, 0.25, 0.15, 0.25, 0.15],
  MC:  [0.10, 0.15, 0.25, 0.20, 0.15, 0.15],
  MEI: [0.10, 0.20, 0.25, 0.25, 0.05, 0.15],
  PTE: [0.20, 0.20, 0.15, 0.30, 0.05, 0.10],
  PTD: [0.20, 0.20, 0.15, 0.30, 0.05, 0.10],
  ATA: [0.15, 0.35, 0.10, 0.25, 0.05, 0.10],
};

export function calcOverall(
  position: string,
  pace: number, shooting: number, passing: number,
  dribbling: number, defending: number, physical: number,
): number {
  const w = POS_WEIGHTS[position] ?? [1/6, 1/6, 1/6, 1/6, 1/6, 1/6];
  const vals = [pace, shooting, passing, dribbling, defending, physical];
  return Math.round(vals.reduce((sum, v, i) => sum + v * w[i], 0));
}

