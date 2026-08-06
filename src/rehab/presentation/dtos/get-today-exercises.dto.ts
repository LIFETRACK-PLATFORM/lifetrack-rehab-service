import { IsString } from 'class-validator';

export class GetTodayExercisesDto {
  @IsString()
  recoveryPlanId: string;
}
