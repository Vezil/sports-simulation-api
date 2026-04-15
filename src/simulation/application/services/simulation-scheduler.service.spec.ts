import { SimulationScheduler } from './simulation-scheduler.service';

describe('SimulationScheduler', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  it('should call onTick 9 times and then onFinish once', () => {
    const scheduler = new SimulationScheduler();
    const onTick = jest.fn();
    const onFinish = jest.fn();

    scheduler.start(onTick, onFinish, 9, 1000);

    jest.advanceTimersByTime(9000);

    expect(onTick).toHaveBeenCalledTimes(9);
    expect(onFinish).toHaveBeenCalledTimes(1);
  });

  it('should stop scheduler and prevent future ticks', () => {
    const scheduler = new SimulationScheduler();
    const onTick = jest.fn();
    const onFinish = jest.fn();

    scheduler.start(onTick, onFinish, 9, 1000);
    scheduler.stop();

    jest.advanceTimersByTime(9000);

    expect(onTick).not.toHaveBeenCalled();
    expect(onFinish).not.toHaveBeenCalled();
  });
});
