import { MatchEntity } from './match.entity';
import { SimulationStatus } from '../enums/simulation-status.enum';
import { SimulationAlreadyRunningError } from '../errors/simulation-already-running.error';
import { SimulationNotFinishedError } from '../errors/simulation-not-finished.error';
import { SimulationNotRunningError } from '../errors/simulation-not-running.error';
import { SimulationStartThrottledError } from '../errors/simulation-start-throttled.error';
import { SimulationNameVO } from '../value-objects/simulation-name.vo';
import { SimulationSnapshot } from '../interfaces/simulation-snapshot.interface';

export class SimulationEntity {
  private static readonly START_THROTTLE_MS = 5000;

  private _name: string | null = null;
  private _status: SimulationStatus = SimulationStatus.IDLE;
  private _matches: MatchEntity[] = [
    new MatchEntity('Germany', 'Poland'),
    new MatchEntity('Brazil', 'Mexico'),
    new MatchEntity('Argentina', 'Uruguay'),
  ];
  private _tick = 0;
  private _lastStartedAt: Date | null = null;
  private _startedAt: Date | null = null;
  private _finishedAt: Date | null = null;

  get name(): string | null {
    return this._name;
  }

  get status(): SimulationStatus {
    return this._status;
  }

  get matches(): MatchEntity[] {
    return this._matches;
  }

  get tick(): number {
    return this._tick;
  }

  get startedAt(): Date | null {
    return this._startedAt;
  }

  get finishedAt(): Date | null {
    return this._finishedAt;
  }

  get totalGoals(): number {
    return this._matches.reduce((sum, match) => sum + match.homeScore + match.awayScore, 0);
  }

  start(name: SimulationNameVO, now: Date): void {
    if (this._status === SimulationStatus.RUNNING) {
      throw new SimulationAlreadyRunningError();
    }

    this.ensureStartThrottle(now);

    this.resetMatches();
    this._tick = 0;
    this._name = name.getValue();
    this._status = SimulationStatus.RUNNING;
    this._startedAt = now;
    this._finishedAt = null;
    this._lastStartedAt = now;
  }

  restart(now: Date): void {
    if (this._status !== SimulationStatus.FINISHED) {
      throw new SimulationNotFinishedError();
    }

    this.ensureStartThrottle(now);

    this.resetMatches();
    this._tick = 0;
    this._status = SimulationStatus.RUNNING;
    this._startedAt = now;
    this._finishedAt = null;
    this._lastStartedAt = now;
  }

  finish(now: Date): void {
    if (this._status !== SimulationStatus.RUNNING) {
      throw new SimulationNotRunningError();
    }

    this._status = SimulationStatus.FINISHED;
    this._finishedAt = now;
  }

  awardGoalTo(teamName: string): void {
    if (this._status !== SimulationStatus.RUNNING) {
      throw new SimulationNotRunningError();
    }

    const match = this._matches.find((item) => item.includesTeam(teamName));

    if (!match) {
      throw new Error(`Team "${teamName}" is not part of this simulation.`);
    }

    match.awardGoalTo(teamName);
    this._tick += 1;
  }

  getAllTeams(): string[] {
    return this._matches.flatMap((match) => [match.homeTeam, match.awayTeam]);
  }

  toSnapshot(): SimulationSnapshot {
    return {
      name: this._name,
      status: this._status,
      tick: this._tick,
      startedAt: this._startedAt?.toISOString() ?? null,
      finishedAt: this._finishedAt?.toISOString() ?? null,
      totalGoals: this.totalGoals,
      matches: this._matches.map((match) => match.toPrimitives()),
    };
  }

  private ensureStartThrottle(now: Date): void {
    if (!this._lastStartedAt) {
      return;
    }

    const diffMs = now.getTime() - this._lastStartedAt.getTime();

    if (diffMs < SimulationEntity.START_THROTTLE_MS) {
      throw new SimulationStartThrottledError();
    }
  }

  private resetMatches(): void {
    this._matches.forEach((match) => match.resetScore());
  }
}
