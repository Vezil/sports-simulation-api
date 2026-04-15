export interface MatchSnapshot {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
}

export interface SimulationSnapshot {
  name: string | null;
  status: string;
  tick: number;
  startedAt: string | null;
  finishedAt: string | null;
  totalGoals: number;
  matches: MatchSnapshot[];
}
