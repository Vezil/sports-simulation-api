import { Module } from '@nestjs/common';
import { SimulationService } from './application/services/simulation.service';
import { SimulationScheduler } from './application/services/simulation-scheduler.service';
import { MathRandomGenerator } from './infrastructure/random/math-random.generator';
import { RANDOM_GENERATOR_PORT } from './application/ports/random-generator.port';
import { SimulationController } from './interface/http/controllers/simulation.controller';
import { SimulationGateway } from './interface/websocket/simulation.gateway';

@Module({
  controllers: [SimulationController],
  providers: [
    SimulationGateway,
    SimulationScheduler,
    SimulationService,
    {
      provide: RANDOM_GENERATOR_PORT,
      useClass: MathRandomGenerator,
    },
  ],
  exports: [SimulationService],
})
export class SimulationModule {}
