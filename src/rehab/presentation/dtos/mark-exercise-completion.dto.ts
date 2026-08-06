import { IsBoolean, IsDateString, IsString } from 'class-validator';

export class MarkExerciseCompletionDto {
  @IsString()
  exerciseId: string;

  @IsDateString()
  date: string;

  @IsBoolean()
  completed: boolean;
}
