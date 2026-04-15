export class SimulationNotFinishedError extends Error {
  constructor() {
    super('Simulation must be finished before it can be restarted.');
    this.name = 'SimulationNotFinishedError';
  }
}
