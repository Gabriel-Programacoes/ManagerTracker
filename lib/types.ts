export type Position = "GK" | "DF" | "MF" | "FW";

export type Career = {
  managerName: string;
  currentClub: string;
  currentSeason: string;
  budget: number;
  leaguePosition: number;
  recentForm: Array<"W" | "D" | "L">;
  /** Season record */
  wins: number;
  draws: number;
  losses: number;
  trophies: number;
};

export type Player = {
  id: string;
  name: string;
  position: Position;
  overall: number;
  potential: number;
  age: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  status: "Fit" | "Injured" | "Suspended";
};

export type Match = {
  id: string;
  date: string;
  opponent: string;
  competition: "League" | "Cup" | "Continental";
  venue: "H" | "A";
  goalsFor?: number;
  goalsAgainst?: number;
  possession?: number;
};

export type Transfer = {
  id: string;
  playerName: string;
  type: "In" | "Out";
  fee: number;
  date: string;
};

export type YouthPlayer = {
  id: string;
  name: string;
  position: Position;
  age: number;
  monthlyOvr: { month: string; ovr: number }[];
};
