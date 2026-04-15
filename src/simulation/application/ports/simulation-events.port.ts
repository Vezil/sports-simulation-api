import { SimulationSnapshot } from '../../domain/interfaces/simulation-snapshot.interface';

export const SIMULATION_EVENTS_PORT = Symbol('SIMULATION_EVENTS_PORT');

export interface SimulationEventsPort {
  publishStarted(snapshot: SimulationSnapshot): void;

  publishScoreUpdated(snapshot: SimulationSnapshot, scoredTeam: string): void;

  publishFinished(snapshot: SimulationSnapshot): void;

  publishRestarted(snapshot: SimulationSnapshot): void;
}
