import { RandomGeneratorPort } from '../../application/ports/random-generator.port';

export class MathRandomGenerator implements RandomGeneratorPort {
  nextInt(maxExclusive: number): number {
    return Math.floor(Math.random() * maxExclusive);
  }
}
