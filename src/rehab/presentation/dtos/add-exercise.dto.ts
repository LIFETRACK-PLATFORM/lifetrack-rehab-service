import {
  ArrayUnique,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

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

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(6, { each: true })
  daysOfWeek?: number[];
}
