import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class UpdateExerciseDto {
  @IsUUID()
  exerciseId!: string;

  @IsString()
  name!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  targetSets!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  targetReps!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  phase!: number;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  daysOfWeek?: number[];
}
