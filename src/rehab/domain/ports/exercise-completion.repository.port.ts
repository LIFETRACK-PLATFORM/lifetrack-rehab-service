import { ExerciseCompletionEntity } from '../entities/exercise-completion.entity';

export type MarkExerciseCompletionInput = {
  exerciseId: string;
  date: Date;
};

export interface ExerciseCompletionRepositoryPort {
  markCompleted(
    data: MarkExerciseCompletionInput,
  ): Promise<ExerciseCompletionEntity>;
  unmarkCompleted(exerciseId: string, date: Date): Promise<void>;
  listByExerciseIds(
    exerciseIds: string[],
    range?: { from: Date; to: Date },
  ): Promise<ExerciseCompletionEntity[]>;
}
