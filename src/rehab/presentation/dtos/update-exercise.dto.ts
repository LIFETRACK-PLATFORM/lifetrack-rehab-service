import { Type } from 'class-transformer';
import {
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { ExerciseMetricType } from '../../domain/entities/exercise.entity';

export class UpdateExerciseDto {
  @IsUUID()
  exerciseId!: string;

  @IsString()
  name!: string;

  @IsIn(Object.values(ExerciseMetricType))
  metricType!: ExerciseMetricType;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  targetSets!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  targetReps!: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  targetDurationMinutes?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  daysOfWeek?: number[];
}
