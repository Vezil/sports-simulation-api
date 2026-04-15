import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SimulationService } from './simulation/application/services/simulation.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // const simulationService = app.get(SimulationService);
  //
  // simulationService.start('Katar 2023');
  //
  // setTimeout(() => {
  //   console.log(simulationService.getState());
  // }, 5000);

  await app.listen(3000);
}

bootstrap()
  .then()
  .catch((error) => {});
