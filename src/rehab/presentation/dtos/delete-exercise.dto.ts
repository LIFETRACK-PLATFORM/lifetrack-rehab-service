import { IsUUID } from 'class-validator';

export class DeleteExerciseDto {
  @IsUUID()
  exerciseId!: string;
}
