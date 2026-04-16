import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { StartSimulationDTO } from './start-simulation.dto';

describe('StartSimulationDTO', () => {
  it('should validate correct name', async () => {
    const dto = plainToInstance(StartSimulationDTO, {
      name: 'Katar 2023',
    });

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
  });

  it('should trim surrounding whitespace and still validate correct name', async () => {
    const dto = plainToInstance(StartSimulationDTO, {
      name: '   Katar 2023   ',
    });

    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
    expect(dto.name).toBe('Katar 2023');
  });

  it('should fail when name is too short', async () => {
    const dto = plainToInstance(StartSimulationDTO, {
      name: 'abc',
    });

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail when name is too long', async () => {
    const dto = plainToInstance(StartSimulationDTO, {
      name: 'This simulation name is definitely too long',
    });

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail when name contains invalid characters', async () => {
    const dto = plainToInstance(StartSimulationDTO, {
      name: 'Katar@2023',
    });

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail when name contains only spaces', async () => {
    const dto = plainToInstance(StartSimulationDTO, {
      name: '        ',
    });

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail when name is missing', async () => {
    const dto = plainToInstance(StartSimulationDTO, {});

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
  });

  it('should fail when name is not a string', async () => {
    const dto = plainToInstance(StartSimulationDTO, {
      name: 2023,
    });

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
  });
});
