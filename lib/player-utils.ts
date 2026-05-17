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
  awardBallondOr?: boolean | null;
  awardMonthlyBest?: number | null;
  awardMotm?: number | null;
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
  // GK attributes
  gkDiving?: number | null;
  gkHandling?: number | null;
  gkKicking?: number | null;
  gkPositioning?: number | null;
  gkReflexes?: number | null;
};

export type DetailedPlayerInput = {
  name: string;
  position: string;
  overall: number;
  age: number;
  height: number;
  feet: string;
  skillMoves: number;
  weakFoot: number;
  playstyle?: string;
  // Outfield stats
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
  // GK stats
  gkDiving?: number;
  gkHandling?: number;
  gkKicking?: number;
  gkPositioning?: number;
  gkReflexes?: number;
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
  // Goleiro
  GOL: { color: "var(--comp-league)",       bg: "rgba(146,220,229,0.08)" },
  // Defensores
  ZAG: { color: "var(--comp-cup)",          bg: "rgba(168,168,232,0.08)" },
  LAT: { color: "var(--comp-cup)",          bg: "rgba(168,168,232,0.08)" },
  LE:  { color: "var(--comp-cup)",          bg: "rgba(168,168,232,0.08)" },
  LD:  { color: "var(--comp-cup)",          bg: "rgba(168,168,232,0.08)" },
  AE:  { color: "var(--comp-cup)",          bg: "rgba(168,168,232,0.08)" },
  AD:  { color: "var(--comp-cup)",          bg: "rgba(168,168,232,0.08)" },
  // Meio-campo defensivo / central
  VOL: { color: "var(--comp-continental)",  bg: "rgba(184,194,144,0.08)" },
  MC:  { color: "var(--comp-continental)",  bg: "rgba(184,194,144,0.08)" },
  ME:  { color: "var(--comp-continental)",  bg: "rgba(184,194,144,0.08)" },
  MD:  { color: "var(--comp-continental)",  bg: "rgba(184,194,144,0.08)" },
  // Meio-campo ofensivo
  MEI: { color: "var(--caution)",           bg: "rgba(196,169,122,0.08)" },
  // Atacantes / Pontas
  PTE: { color: "var(--loss)",              bg: "rgba(211,158,171,0.08)" },
  PTD: { color: "var(--loss)",              bg: "rgba(211,158,171,0.08)" },
  ATA: { color: "var(--loss)",              bg: "rgba(211,158,171,0.08)" },
};

export const POSITIONS = [
  { value: "GOL", label: "GOL — Goleiro" },
  { value: "ZAG", label: "ZAG — Zagueiro" },
  { value: "LD",  label: "LD  — Lateral Direito" },
  { value: "LE",  label: "LE  — Lateral Esquerdo" },
  { value: "AD",  label: "AD  — Ala Direita" },
  { value: "AE",  label: "AE  — Ala Esquerda" },
  { value: "LAT", label: "LAT — Lateral" },
  { value: "VOL", label: "VOL — Volante" },
  { value: "MC",  label: "MC  — Meia Central" },
  { value: "MD",  label: "MD  — Meia Direita" },
  { value: "ME",  label: "ME  — Meia Esquerda" },
  { value: "MEI", label: "MEI — Meia Atacante" },
  { value: "PTE", label: "PTE — Ponta Esq." },
  { value: "PTD", label: "PTD — Ponta Dir." },
  { value: "ATA", label: "ATA — Atacante" },
];

/** Maps FIFA English positions to PT-BR equivalents used in the app */
export const FIFA_POSITION_MAP: Record<string, string> = {
  GK:  "GOL",
  CB:  "ZAG",
  LB:  "LE", RB:  "LD", LWB: "AE", RWB: "AD",
  CDM: "VOL", DM:  "VOL",
  CM:  "MC",
  CAM: "MEI", AM:  "MEI",
  LM:  "ME", RM:  "MD",
  LW:  "PTE", LF:  "PTE",
  RW:  "PTD", RF:  "PTD",
  ST:  "ATA", CF:  "ATA", SS: "ATA",
};

export function normalizeFifaPosition(pos: string): string {
  return FIFA_POSITION_MAP[pos.toUpperCase()] ?? pos;
}

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

export function calcOverallGK(
  diving: number, handling: number, kicking: number,
  positioning: number, reflexes: number,
): number {
  // Reflexes and Diving are most important for a GK
  return Math.round(diving * 0.25 + handling * 0.15 + kicking * 0.10 + positioning * 0.20 + reflexes * 0.30);
}

