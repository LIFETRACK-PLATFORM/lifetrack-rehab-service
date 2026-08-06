import { ExerciseNotFoundError } from '../../domain/exceptions/rehab.errors';
import type { ExerciseRepositoryPort } from '../../domain/ports/exercise.repository.port';
import type { RecoveryPlanRepositoryPort } from '../../domain/ports/recovery-plan.repository.port';

export type DeleteExerciseInput = {
  userId: string;
  exerciseId: string;
};

export class DeleteExerciseUseCase {
  constructor(
    private readonly recoveryPlanRepository: RecoveryPlanRepositoryPort,
    private readonly exerciseRepository: ExerciseRepositoryPort,
  ) {}

  async execute(input: DeleteExerciseInput) {
    const exercise = await this.exerciseRepository.findById(input.exerciseId);
    if (!exercise) throw new ExerciseNotFoundError(input.exerciseId);

    const plan = await this.recoveryPlanRepository.findByIdAndUserId(
      exercise.recoveryPlanId,
      input.userId,
    );
    if (!plan) throw new ExerciseNotFoundError(input.exerciseId);

    await this.exerciseRepository.deleteById(input.exerciseId);

    return {
      exerciseId: input.exerciseId,
      recoveryPlanId: exercise.recoveryPlanId,
      deleted: true,
    };
  }
}
