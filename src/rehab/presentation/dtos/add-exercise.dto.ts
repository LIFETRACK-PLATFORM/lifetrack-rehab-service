import { IsInt, IsOptional, IsString, Min, MinLength } from 'class-validator';

export class AddExerciseDto {
  @IsString()
  recoveryPlanId: string;

  @IsString()
  @MinLength(2)
  name: string;

  @IsInt()
  @Min(1)
  targetSets: number;

  @IsInt()
  @Min(1)
  targetReps: number;

  @IsOptional()
  @IsString()
  referenceMediaUrl?: string;

  @IsInt()
  @Min(1)
  phase: number;
}
