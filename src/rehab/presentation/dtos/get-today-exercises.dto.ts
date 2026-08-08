import { IsOptional, IsString } from 'class-validator';

export class GetTodayExercisesDto {
  @IsString()
  recoveryPlanId: string;

  @IsOptional()
  @IsString()
  todayIso?: string;
}
