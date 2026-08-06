import {
  ExerciseNotFoundError,
  RecoveryPlanNotFoundError,
} from '../../domain/exceptions/rehab.errors';
import type { ExerciseRepositoryPort } from '../../domain/ports/exercise.repository.port';
import type { ExerciseCompletionRepositoryPort } from '../../domain/ports/exercise-completion.repository.port';
import type { RecoveryPlanRepositoryPort } from '../../domain/ports/recovery-plan.repository.port';
import type { MarkExerciseCompletionInput } from '../dtos/mark-exercise-completion.input';

function toDateOnly(iso: string): Date {
  return new Date(iso.slice(0, 10));
}

export class MarkExerciseCompletionUseCase {
  constructor(
    private readonly exerciseRepository: ExerciseRepositoryPort,
    private readonly recoveryPlanRepository: RecoveryPlanRepositoryPort,
    private readonly exerciseCompletionRepository: ExerciseCompletionRepositoryPort,
  ) {}

  async execute(input: MarkExerciseCompletionInput) {
    const exercise = await this.exerciseRepository.findById(input.exerciseId);
    if (!exercise) throw new ExerciseNotFoundError(input.exerciseId);

    const plan = await this.recoveryPlanRepository.findByIdAndUserId(
      exercise.recoveryPlanId,
      input.userId,
    );
    if (!plan) throw new RecoveryPlanNotFoundError(exercise.recoveryPlanId);

    const date = toDateOnly(input.date);

    if (input.completed) {
      await this.exerciseCompletionRepository.markCompleted({
        exerciseId: input.exerciseId,
        date,
      });
    } else {
      await this.exerciseCompletionRepository.unmarkCompleted(
        input.exerciseId,
        date,
      );
    }

    return {
      exerciseId: input.exerciseId,
      date: input.date.slice(0, 10),
      completed: input.completed,
    };
  }
}
