import { Body, Controller, Get, Post } from '@nestjs/common';
import { SimulationService } from '../../../application/services/simulation.service';
import { StartSimulationDTO } from '../dto/start-simulation.dto';

@Controller('simulation')
export class SimulationController {
  constructor(private readonly simulationService: SimulationService) {}

  @Post('start')
  start(@Body() dto: StartSimulationDTO) {
    this.simulationService.start(dto.name);

    return this.simulationService.getState();
  }

  @Post('finish')
  finish() {
    this.simulationService.finish();

    return this.simulationService.getState();
  }

  @Post('restart')
  restart() {
    this.simulationService.restart();

    return this.simulationService.getState();
  }

  @Get()
  getState() {
    return this.simulationService.getState();
  }
}
