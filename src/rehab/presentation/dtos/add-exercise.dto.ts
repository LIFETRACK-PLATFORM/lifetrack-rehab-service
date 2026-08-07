import {
  ArrayUnique,
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { ExerciseMetricType } from '../../domain/entities/exercise.entity';

export class AddExerciseDto {
  @IsString()
  recoveryPlanId: string;

  @IsString()
  @MinLength(2)
  name: string;

  @IsIn(Object.values(ExerciseMetricType))
  metricType: ExerciseMetricType;

  @IsInt()
  @Min(1)
  targetSets: number;

  @IsInt()
  @Min(1)
  targetReps: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  targetDurationMinutes?: number;

  @IsOptional()
  @IsString()
  referenceMediaUrl?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(6, { each: true })
  daysOfWeek?: number[];
}
