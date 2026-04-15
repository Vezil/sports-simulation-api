import { SimulationScheduler } from './simulation-scheduler.service';

jest.useFakeTimers();

describe('SimulationScheduler', () => {
  it('should call onTick 9 times and then onFinish', () => {
    const scheduler = new SimulationScheduler();

    const onTick = jest.fn();
    const onFinish = jest.fn();

    scheduler.start(onTick, onFinish, 9, 1000);

    jest.advanceTimersByTime(9000);

    expect(onTick).toHaveBeenCalledTimes(9);
    expect(onFinish).toHaveBeenCalledTimes(1);
  });

  it('should stop scheduler', () => {
    const scheduler = new SimulationScheduler();

    const onTick = jest.fn();

    scheduler.start(onTick, jest.fn(), 9, 1000);
    scheduler.stop();

    jest.advanceTimersByTime(9000);

    expect(onTick).toHaveBeenCalledTimes(0);
  });
});
