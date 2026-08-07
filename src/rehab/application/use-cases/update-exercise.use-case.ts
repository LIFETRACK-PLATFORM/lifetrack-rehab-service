import { ExerciseNotFoundError } from '../../domain/exceptions/rehab.errors';
import type { ExerciseRepositoryPort } from '../../domain/ports/exercise.repository.port';
import type { RecoveryPlanRepositoryPort } from '../../domain/ports/recovery-plan.repository.port';
import type { UpdateExerciseInput } from '../dtos/update-exercise.input';

export class UpdateExerciseUseCase {
  constructor(
    private readonly recoveryPlanRepository: RecoveryPlanRepositoryPort,
    private readonly exerciseRepository: ExerciseRepositoryPort,
  ) {}

  async execute(input: UpdateExerciseInput) {
    const exercise = await this.exerciseRepository.findById(input.exerciseId);
    if (!exercise) throw new ExerciseNotFoundError(input.exerciseId);

    const plan = await this.recoveryPlanRepository.findByIdAndUserId(
      exercise.recoveryPlanId,
      input.userId,
    );
    if (!plan) throw new ExerciseNotFoundError(input.exerciseId);

    const updated = await this.exerciseRepository.update(input.exerciseId, {
      name: input.name,
      targetSets: input.targetSets,
      targetReps: input.targetReps,
      phase: input.phase,
      daysOfWeek: input.daysOfWeek,
    });

    return {
      exerciseId: updated.id,
      recoveryPlanId: updated.recoveryPlanId,
      name: updated.name,
      targetSets: updated.targetSets,
      targetReps: updated.targetReps,
      phase: updated.phase,
      daysOfWeek: updated.daysOfWeek,
    };
  }
}
