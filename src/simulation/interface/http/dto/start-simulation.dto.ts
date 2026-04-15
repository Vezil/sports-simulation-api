import { IsString, Length, Matches } from 'class-validator';

export class StartSimulationDTO {
  @IsString()
  @Length(8, 30)
  @Matches(/^[A-Za-z0-9 ]+$/, {
    message: 'Name can contain only letters, digits and spaces',
  })
  name!: string;
}
