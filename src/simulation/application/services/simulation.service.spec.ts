import { SimulationService } from './simulation.service';
import { SimulationScheduler } from './simulation-scheduler.service';
import { RandomGeneratorPort } from '../ports/random-generator.port';
import { SimulationGateway } from '../../interface/websocket/simulation.gateway';
import { SimulationStatus } from '../../domain/enums/simulation-status.enum';

class FakeRandomGenerator implements RandomGeneratorPort {
  constructor(private readonly values: number[] = [0]) {}

  nextInt(maxExclusive: number): number {
    const value = this.values.shift();

    if (value === undefined) {
      return 0;
    }

    if (value < 0 || value >= maxExclusive) {
      throw new Error(`Fake random value ${value} is out of range 0..${maxExclusive - 1}`);
    }

    return value;
  }
}

describe('SimulationService', () => {
  let scheduler: jest.Mocked<SimulationScheduler>;
  let gateway: jest.Mocked<SimulationGateway>;

  beforeEach(() => {
    scheduler = {
      start: jest.fn(),
      stop: jest.fn(),
    } as unknown as jest.Mocked<SimulationScheduler>;

    gateway = {
      emitSimulationStarted: jest.fn(),
      emitSimulationScoreUpdated: jest.fn(),
      emitSimulationFinished: jest.fn(),
      emitSimulationRestarted: jest.fn(),
    } as unknown as jest.Mocked<SimulationGateway>;
  });

  it('should start simulation, emit started event and schedule ticks', () => {
    const random = new FakeRandomGenerator([0]);
    const service = new SimulationService(random, scheduler, gateway);

    service.start('Katar 2023');

    expect(gateway.emitSimulationStarted).toHaveBeenCalledTimes(1);
    expect(scheduler.start).toHaveBeenCalledTimes(1);

    const state = service.getState();
    expect(state.status).toBe(SimulationStatus.RUNNING);
    expect(state.name).toBe('Katar 2023');
    expect(state.totalGoals).toBe(0);
  });

  it('should finish simulation, stop scheduler and emit finished event', () => {
    const random = new FakeRandomGenerator([0]);
    const service = new SimulationService(random, scheduler, gateway);

    service.start('Katar 2023');
    service.finish();

    expect(scheduler.stop).toHaveBeenCalledTimes(1);
    expect(gateway.emitSimulationFinished).toHaveBeenCalledTimes(1);

    const state = service.getState();
    expect(state.status).toBe('FINISHED');
  });

  it('should restart finished simulation after throttle window, emit restarted event and schedule again', () => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-04-15T12:00:00.000Z'));

    const random = new FakeRandomGenerator([0]);
    const service = new SimulationService(random, scheduler, gateway);

    service.start('Katar 2023');
    service.finish();

    jest.setSystemTime(new Date('2026-04-15T12:00:06.000Z'));

    service.restart();

    expect(gateway.emitSimulationRestarted).toHaveBeenCalledTimes(1);
    expect(scheduler.start).toHaveBeenCalledTimes(2);

    const state = service.getState();
    expect(state.status).toBe(SimulationStatus.RUNNING);
    expect(state.tick).toBe(0);
    expect(state.totalGoals).toBe(0);

    jest.useRealTimers();
  });

  it('should award a goal on scheduled tick and emit score update', () => {
    const random = new FakeRandomGenerator([0]); // Germany
    const service = new SimulationService(random, scheduler, gateway);

    service.start('Katar 2023');

    const startCall = scheduler.start.mock.calls[0];
    const onTick = startCall[0] as () => void;

    onTick();

    expect(gateway.emitSimulationScoreUpdated).toHaveBeenCalledTimes(1);

    const state = service.getState();
    expect(state.tick).toBe(1);
    expect(state.totalGoals).toBe(1);
    expect(state.matches[0].homeScore).toBe(1);
    expect(state.matches[0].awayScore).toBe(0);
  });

  it('should auto-finish simulation when scheduler finish callback is invoked', () => {
    const random = new FakeRandomGenerator([0]);
    const service = new SimulationService(random, scheduler, gateway);

    service.start('Katar 2023');

    const startCall = scheduler.start.mock.calls[0];
    const onFinish = startCall[1] as () => void;

    onFinish();

    expect(gateway.emitSimulationFinished).toHaveBeenCalledTimes(1);

    const state = service.getState();
    expect(state.status).toBe('FINISHED');
  });

  it('should not emit finished event twice when auto-finish happens after manual finish', () => {
    const random = new FakeRandomGenerator([0]);
    const service = new SimulationService(random, scheduler, gateway);

    service.start('Katar 2023');
    service.finish();

    const startCall = scheduler.start.mock.calls[0];
    const onFinish = startCall[1] as () => void;

    onFinish();

    expect(gateway.emitSimulationFinished).toHaveBeenCalledTimes(1);
  });

  it('should throw when finishing simulation that is not running', () => {
    const random = new FakeRandomGenerator([0]);
    const service = new SimulationService(random, scheduler, gateway);

    expect(() => service.finish()).toThrow('Simulation is not running.');
  });

  it('should throw when restarting simulation that is not finished', () => {
    const random = new FakeRandomGenerator([0]);
    const service = new SimulationService(random, scheduler, gateway);

    expect(() => service.restart()).toThrow(
      'Simulation must be finished before it can be restarted.',
    );
  });

  it('should throw when starting simulation twice immediately', () => {
    const random = new FakeRandomGenerator([0, 0]);
    const service = new SimulationService(random, scheduler, gateway);

    service.start('Katar 2023');

    expect(() => service.start('Katar 2023')).toThrow();
  });
});
