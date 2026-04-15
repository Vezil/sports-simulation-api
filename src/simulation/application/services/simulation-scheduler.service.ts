export class SimulationScheduler {
  private interval: NodeJS.Timeout | null = null;

  start(onTick: () => void, onFinish: () => void, totalTicks: number, intervalMs: number): void {
    let currentTick = 0;

    this.stop(); // duplicate guard

    this.interval = setInterval(() => {
      currentTick += 1;

      onTick();

      if (currentTick >= totalTicks) {
        this.stop();
        onFinish();
      }
    }, intervalMs);
  }

  stop(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}
