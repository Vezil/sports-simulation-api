export class SimulationNameVO {
  private static readonly MIN_LENGTH = 8;
  private static readonly MAX_LENGTH = 30;
  private static readonly VALID_NAME_REGEX = /^[\p{L}\d ]+$/u;

  private constructor(private readonly value: string) {}

  static create(rawName: string): SimulationNameVO {
    const normalizedName = rawName?.trim();

    if (!normalizedName) {
      throw new Error('Simulation name is required.');
    }

    if (normalizedName.length < this.MIN_LENGTH) {
      throw new Error(`Simulation name must be at least ${this.MIN_LENGTH} characters long.`);
    }

    if (normalizedName.length > this.MAX_LENGTH) {
      throw new Error(`Simulation name must be at most ${this.MAX_LENGTH} characters long.`);
    }

    if (!this.VALID_NAME_REGEX.test(normalizedName)) {
      throw new Error('Simulation name can contain only letters, digits and spaces.');
    }

    return new SimulationNameVO(normalizedName);
  }

  getValue(): string {
    return this.value;
  }
}
