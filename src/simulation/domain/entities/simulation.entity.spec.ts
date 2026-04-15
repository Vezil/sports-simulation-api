import { SimulationEntity } from './simulation.entity';
import { SimulationNameVO } from '../value-objects/simulation-name.vo';

describe('SimulationEntity', () => {
  it('should start simulation', () => {
    const sim = new SimulationEntity();
    const now = new Date();

    sim.start(SimulationNameVO.create('Katar 2023'), now);

    expect(sim.status).toBe('RUNNING');
    expect(sim.tick).toBe(0);
  });

  it('should not allow start when already running', () => {
    const sim = new SimulationEntity();
    const now = new Date();

    sim.start(SimulationNameVO.create('Katar 2023'), now);

    expect(() => sim.start(SimulationNameVO.create('Katar 2023'), now)).toThrow();
  });

  it('should increment score and tick', () => {
    const sim = new SimulationEntity();
    const now = new Date();

    sim.start(SimulationNameVO.create('Katar 2023'), now);

    sim.awardGoalTo('Germany');

    expect(sim.tick).toBe(1);
    expect(sim.totalGoals).toBe(1);
  });

  it('should finish simulation', () => {
    const sim = new SimulationEntity();
    const now = new Date();

    sim.start(SimulationNameVO.create('Katar 2023'), now);
    sim.finish(now);

    expect(sim.status).toBe('FINISHED');
  });
});
