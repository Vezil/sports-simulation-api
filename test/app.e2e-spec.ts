import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';

describe('Simulation (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());

    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should start simulation', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/simulation/start')
      .send({ name: 'Katar 2023' })
      .expect(201);

    expect(res.body.status).toBe('RUNNING');
    expect(res.body.name).toBe('Katar 2023');
  });

  it('should return validation error for invalid simulation name', async () => {
    await request(app.getHttpServer())
      .post('/api/simulation/start')
      .send({ name: 'abc' })
      .expect(400);
  });

  it('should return current simulation state after start', async () => {
    await request(app.getHttpServer())
      .post('/api/simulation/start')
      .send({ name: 'Katar 2023' })
      .expect(201);

    const res = await request(app.getHttpServer()).get('/api/simulation').expect(200);

    expect(res.body.status).toBe('RUNNING');
    expect(res.body.matches).toHaveLength(3);
  });
});
