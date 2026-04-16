import { SimulationEntity } from './simulation.entity';
import { SimulationNameVO } from '../value-objects/simulation-name.vo';
import { SimulationStatus } from '../enums/simulation-status.enum';

describe('SimulationEntity', () => {
  it('should start simulation', () => {
    const simulation = new SimulationEntity();
    const now = new Date();

    simulation.start(SimulationNameVO.create('Katar 2023'), now);

    expect(simulation.status).toBe(SimulationStatus.RUNNING);
    expect(simulation.tick).toBe(0);
  });

  it('should not allow start when already running', () => {
    const simulation = new SimulationEntity();
    const now = new Date();

    simulation.start(SimulationNameVO.create('Katar 2023'), now);

    expect(() => simulation.start(SimulationNameVO.create('Katar 2023'), now)).toThrow();
  });

  it('should increment score and tick', () => {
    const simulation = new SimulationEntity();
    const now = new Date();

    simulation.start(SimulationNameVO.create('Katar 2023'), now);

    simulation.awardGoalTo('Germany');

    expect(simulation.tick).toBe(1);
    expect(simulation.totalGoals).toBe(1);
  });

  it('should finish simulation', () => {
    const simulation = new SimulationEntity();
    const now = new Date();

    simulation.start(SimulationNameVO.create('Katar 2023'), now);
    simulation.finish(now);

    expect(simulation.status).toBe(SimulationStatus.FINISHED);
  });
});
