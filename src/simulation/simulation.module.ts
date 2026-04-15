import { Module } from '@nestjs/common';
import { SimulationService } from './application/services/simulation.service';
import { SimulationScheduler } from './application/services/simulation-scheduler.service';
import { MathRandomGenerator } from './infrastructure/random/math-random.generator';
import { RANDOM_GENERATOR_PORT } from './application/ports/random-generator.port';
import { SimulationController } from './interface/http/controllers/simulation.controller';

@Module({
  controllers: [SimulationController],
  providers: [
    SimulationScheduler,
    {
      provide: RANDOM_GENERATOR_PORT,
      useClass: MathRandomGenerator,
    },
    {
      provide: SimulationService,
      useFactory: (random: MathRandomGenerator, scheduler: SimulationScheduler) =>
        new SimulationService(random, scheduler),
      inject: [RANDOM_GENERATOR_PORT, SimulationScheduler],
    },
  ],
  exports: [SimulationService],
})
export class SimulationModule {}
