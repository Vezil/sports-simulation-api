import { SimulationService } from './simulation.service';
import { SimulationScheduler } from './simulation-scheduler.service';

class FakeRandom {
  private values = [0, 1, 2];

  nextInt(): number {
    return this.values.shift() ?? 0;
  }
}

describe('SimulationService', () => {
  it('should start simulation and schedule ticks', () => {
    const scheduler = new SimulationScheduler();
    const random = new FakeRandom();
    const gateway = {
      emitSimulationStarted: jest.fn(),
      emitSimulationScoreUpdated: jest.fn(),
      emitSimulationFinished: jest.fn(),
      emitSimulationRestarted: jest.fn(),
    };

    const service = new SimulationService(random as any, scheduler, gateway as any);

    service.start('Katar 2023');

    expect(gateway.emitSimulationStarted).toHaveBeenCalled();
  });
});
