export class SimulationNotRunningError extends Error {
  constructor() {
    super('Simulation is not running.');
    this.name = 'SimulationNotRunningError';
  }
}
