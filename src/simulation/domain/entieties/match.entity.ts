export class MatchEntity {
  constructor(
    public readonly homeTeam: string,
    public readonly awayTeam: string,
    private _homeScore = 0,
    private _awayScore = 0,
  ) {}

  get homeScore(): number {
    return this._homeScore;
  }

  get awayScore(): number {
    return this._awayScore;
  }

  incrementHomeScore(): void {
    this._homeScore += 1;
  }

  incrementAwayScore(): void {
    this._awayScore += 1;
  }

  resetScore(): void {
    this._homeScore = 0;
    this._awayScore = 0;
  }

  includesTeam(teamName: string): boolean {
    return this.homeTeam === teamName || this.awayTeam === teamName;
  }

  awardGoalTo(teamName: string): void {
    if (teamName === this.homeTeam) {
      this.incrementHomeScore();
      return;
    }

    if (teamName === this.awayTeam) {
      this.incrementAwayScore();
      return;
    }

    throw new Error(`Team "${teamName}" does not belong to this match.`);
  }

  toPrimitives() {
    return {
      homeTeam: this.homeTeam,
      awayTeam: this.awayTeam,
      homeScore: this.homeScore,
      awayScore: this.awayScore,
    };
  }
}
