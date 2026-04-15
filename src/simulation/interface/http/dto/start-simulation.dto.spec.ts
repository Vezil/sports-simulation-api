import { validate } from 'class-validator';
import { StartSimulationDTO } from './start-simulation.dto';

describe('StartSimulationDto', () => {
  it('should validate correct name', async () => {
    const dto = new StartSimulationDTO();
    dto.name = 'Katar 2023';

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should fail on short name', async () => {
    const dto = new StartSimulationDTO();
    dto.name = 'abc';

    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
  });
});
