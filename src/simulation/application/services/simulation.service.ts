import { Inject, Injectable } from '@nestjs/common';
import { SimulationEntity } from '../../domain/entities/simulation.entity';
import { SimulationNameVO } from '../../domain/value-objects/simulation-name.vo';
import { SimulationScheduler } from './simulation-scheduler.service';
import { RANDOM_GENERATOR_PORT, RandomGeneratorPort } from '../ports/random-generator.port';
import { SimulationGateway } from '../../interface/websocket/simulation.gateway';
import { SimulationNotRunningError } from '../../domain/errors/simulation-not-running.error';

@Injectable()
export class SimulationService {
  private readonly simulation = new SimulationEntity();

  constructor(
    @Inject(RANDOM_GENERATOR_PORT)
    private readonly random: RandomGeneratorPort,
    private readonly scheduler: SimulationScheduler,
    private readonly gateway: SimulationGateway,
  ) {}

  start(name: string): void {
    const now = new Date();
    const nameVO = SimulationNameVO.create(name);

    this.simulation.start(nameVO, now);
    this.gateway.emitSimulationStarted(this.simulation.toSnapshot());

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
    this.gateway.emitSimulationFinished(this.simulation.toSnapshot());
  }

  restart(): void {
    const now = new Date();

    this.simulation.restart(now);
    this.gateway.emitSimulationRestarted(this.simulation.toSnapshot());

    this.scheduler.start(
      () => this.handleTick(),
      () => this.handleAutoFinish(),
      9,
      1000,
    );
  }

  getState(): ReturnType<SimulationEntity['toSnapshot']> {
    return this.simulation.toSnapshot();
  }

  private handleTick(): void {
    const teams = this.simulation.getAllTeams();
    const index = this.random.nextInt(teams.length);
    const selectedTeam = teams[index];

    this.simulation.awardGoalTo(selectedTeam);
    this.gateway.emitSimulationScoreUpdated(this.simulation.toSnapshot());
  }

  private handleAutoFinish(): void {
    const now = new Date();

    try {
      this.simulation.finish(now);
      this.gateway.emitSimulationFinished(this.simulation.toSnapshot());
    } catch (error) {
      if (!(error instanceof SimulationNotRunningError)) {
        throw error;
      }
      // Simulation already finished manually — safe to ignore
    }
  }
}
