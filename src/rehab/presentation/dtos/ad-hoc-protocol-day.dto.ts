import { IsDateString, IsOptional, IsString } from 'class-validator';

export class SetAdHocProtocolDayDto {
  @IsString()
  recoveryPlanId: string;

  @IsDateString()
  targetDate: string;

  @IsDateString()
  sourceDate: string;

  @IsOptional()
  @IsString()
  todayIso?: string;
}

export class ClearAdHocProtocolDayDto {
  @IsString()
  recoveryPlanId: string;

  @IsDateString()
  targetDate: string;
}
