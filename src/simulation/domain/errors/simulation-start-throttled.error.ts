export class SimulationStartThrottledError extends Error {
  constructor() {
    super('Simulation cannot be started more frequently than once per 5 seconds.');
    this.name = 'SimulationStartThrottledError';
  }
}
