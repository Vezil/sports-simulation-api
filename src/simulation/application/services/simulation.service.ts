import { SimulationEntity } from '../../domain/entities/simulation.entity';
import { SimulationNameVO } from '../../domain/value-objects/simulation-name.vo';
import { SimulationScheduler } from './simulation-scheduler.service';
import { RandomGeneratorPort } from '../ports/random-generator.port';

export class SimulationService {
  private readonly simulation = new SimulationEntity();

  constructor(
    private readonly random: RandomGeneratorPort,
    private readonly scheduler: SimulationScheduler,
  ) {}

  start(name: string): void {
    const now = new Date();
    const nameVO = SimulationNameVO.create(name);

    this.simulation.start(nameVO, now);

    this.scheduler.start(
      () => this.handleTick(),
      () => this.handleAutoFinish(),
      9,
      1000,
    );
  }

  finish(): void {
    const now = new Date();

    this.simulation.finish(now);
    this.scheduler.stop();
  }

  restart(): void {
    const now = new Date();

    this.simulation.restart(now);

    this.scheduler.start(
      () => this.handleTick(),
      () => this.handleAutoFinish(),
      9,
      1000,
    );
  }

  getState() {
    return this.simulation.toSnapshot();
  }

  private handleTick(): void {
    const teams = this.simulation.getAllTeams();

    const index = this.random.nextInt(teams.length);
    const selectedTeam = teams[index];

    this.simulation.awardGoalTo(selectedTeam);

    // TODO: WebSocket event
  }

  private handleAutoFinish(): void {
    const now = new Date();

    try {
      this.simulation.finish(now);
    } catch {
      // TODO: catch
    }

    // TODO: event WebSocket
  }
}
