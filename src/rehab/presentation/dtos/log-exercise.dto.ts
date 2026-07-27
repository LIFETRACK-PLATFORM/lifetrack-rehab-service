import { IsDateString, IsInt, IsString, Min } from 'class-validator';

export class LogExerciseDto {
  @IsString()
  exerciseId: string;

  @IsInt()
  @Min(0)
  setsDone: number;

  @IsInt()
  @Min(0)
  repsDone: number;

  @IsDateString()
  date: string;
}
