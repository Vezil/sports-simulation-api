import { SimulationNameVO } from './simulation-name.vo';

describe('SimulationNameVO', () => {
  it('should create valid simulation name', () => {
    const valueObject = SimulationNameVO.create('Katar 2023');

    expect(valueObject.getValue()).toBe('Katar 2023');
  });

  it('should reject name shorter than 8 characters', () => {
    expect(() => SimulationNameVO.create('abc')).toThrow();
  });

  it('should reject name longer than 30 characters', () => {
    expect(() => SimulationNameVO.create('This simulation name is definitely too long')).toThrow();
  });

  it('should reject invalid characters', () => {
    expect(() => SimulationNameVO.create('Katar@2023')).toThrow();
  });
});
