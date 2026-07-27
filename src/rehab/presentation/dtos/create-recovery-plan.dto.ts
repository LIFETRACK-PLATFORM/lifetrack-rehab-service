import { IsDateString, IsString, MinLength } from 'class-validator';

export class CreateRecoveryPlanDto {
  @IsString()
  @MinLength(2)
  bodyPart: string;

  @IsString()
  @MinLength(2)
  injuryType: string;

  @IsDateString()
  surgeryDate: string;
}
