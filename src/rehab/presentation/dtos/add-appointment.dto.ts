import { IsDateString, IsOptional, IsString, MinLength } from 'class-validator';

export class AddAppointmentDto {
  @IsString()
  recoveryPlanId: string;

  @IsDateString()
  date: string;

  @IsString()
  @MinLength(2)
  provider: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
