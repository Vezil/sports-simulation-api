export const RANDOM_GENERATOR_PORT = Symbol('RANDOM_GENERATOR_PORT');

export interface RandomGeneratorPort {
  nextInt(maxExclusive: number): number;
}
