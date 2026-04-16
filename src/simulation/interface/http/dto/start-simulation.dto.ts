import { IsString, Length, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class StartSimulationDTO {
  @IsString()
  @Length(8, 30)
  @Matches(/^[A-Za-z0-9 ]+$/, {
    message: 'Name can contain only letters, digits and spaces',
  })
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  name!: string;
}
