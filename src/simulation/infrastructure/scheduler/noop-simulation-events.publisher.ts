import { Injectable } from '@nestjs/common';
import { SimulationSnapshot } from '../../domain/interfaces/simulation-snapshot.interface';
import { SimulationEventsPort } from '../../application/ports/simulation-events.port';

@Injectable()
export class NoopSimulationEventsPublisher implements SimulationEventsPort {
  publishStarted(snapshot: SimulationSnapshot): void {
    void snapshot;
  }

  publishScoreUpdated(snapshot: SimulationSnapshot, scoredTeam: string): void {
    void snapshot;
    void scoredTeam;
  }

  publishFinished(snapshot: SimulationSnapshot): void {
    void snapshot;
  }

  publishRestarted(snapshot: SimulationSnapshot): void {
    void snapshot;
  }
}
