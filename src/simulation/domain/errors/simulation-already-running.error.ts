export class SimulationAlreadyRunningError extends Error {
  constructor() {
    super('Simulation is already running.');
    this.name = 'SimulationAlreadyRunningError';
  }
}
