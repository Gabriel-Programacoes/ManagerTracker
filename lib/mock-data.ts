import type { Career, Match, Player, Transfer, YouthPlayer } from "@/lib/types";

export const career: Career = {
  managerName: "Alex Kemp",
  currentClub: "Arsenal FC",
  currentSeason: "2026/27",
  budget: 68400000,
  leaguePosition: 2,
  recentForm: ["W", "W", "D", "L", "W"],
  wins: 19,
  draws: 4,
  losses: 6,
  trophies: 4,
};

export const players: Player[] = [
  { id: "p1", name: "David Raya", position: "GK", overall: 84, potential: 85, age: 30, goals: 0, assists: 0, yellowCards: 1, redCards: 0, status: "Fit" },
  { id: "p2", name: "William Saliba", position: "DF", overall: 87, potential: 90, age: 25, goals: 2, assists: 1, yellowCards: 7, redCards: 1, status: "Fit" },
  { id: "p3", name: "Declan Rice", position: "MF", overall: 89, potential: 90, age: 27, goals: 6, assists: 7, yellowCards: 8, redCards: 0, status: "Fit" },
  { id: "p4", name: "Bukayo Saka", position: "FW", overall: 90, potential: 92, age: 25, goals: 18, assists: 13, yellowCards: 3, redCards: 0, status: "Fit" },
  { id: "p5", name: "Gabriel Jesus", position: "FW", overall: 84, potential: 84, age: 29, goals: 10, assists: 4, yellowCards: 5, redCards: 1, status: "Injured" },
];

export const matches: Match[] = [
  { id: "m1", date: "2026-03-15", opponent: "West Ham", competition: "League", venue: "H", goalsFor: 3, goalsAgainst: 1, possession: 58 },
  { id: "m2", date: "2026-03-11", opponent: "Inter", competition: "Continental", venue: "A", goalsFor: 1, goalsAgainst: 1, possession: 52 },
  { id: "m3", date: "2026-03-22", opponent: "Aston Villa", competition: "League", venue: "A" },
  { id: "m4", date: "2026-03-29", opponent: "Spurs", competition: "Cup", venue: "H" },
];

export const transfers: Transfer[] = [
  { id: "t1", playerName: "M. Diomande", type: "In", fee: 34500000, date: "2026-01-14" },
  { id: "t2", playerName: "F. Vieira", type: "Out", fee: 21000000, date: "2026-01-18" },
];

export const shortlist = ["L. Yamal", "A. Balde", "J. Frimpong"];

export const youthPlayers: YouthPlayer[] = [
  {
    id: "y1",
    name: "D. Nwaneri",
    position: "MF",
    age: 17,
    monthlyOvr: [
      { month: "Jan", ovr: 63 },
      { month: "Feb", ovr: 64 },
      { month: "Mar", ovr: 66 },
    ],
  },
  {
    id: "y2",
    name: "R. Edwards",
    position: "FW",
    age: 16,
    monthlyOvr: [
      { month: "Jan", ovr: 61 },
      { month: "Feb", ovr: 62 },
      { month: "Mar", ovr: 63 },
    ],
  },
];
