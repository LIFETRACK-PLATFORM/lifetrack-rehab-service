import { IsDateString, IsOptional, IsString } from 'class-validator';

export class GetWeeklySummaryDto {
  @IsString()
  recoveryPlanId: string;

  @IsOptional()
  @IsDateString()
  referenceDate?: string;

  @IsOptional()
  @IsString()
  todayIso?: string;
}
