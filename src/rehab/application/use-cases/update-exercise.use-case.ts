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
      metricType: input.metricType,
      targetSets: input.targetSets,
      targetReps: input.targetReps,
      targetDurationMinutes: input.targetDurationMinutes,
      notes: input.notes,
      daysOfWeek: input.daysOfWeek,
    });

    return {
      exerciseId: updated.id,
      recoveryPlanId: updated.recoveryPlanId,
      name: updated.name,
      metricType: updated.metricType,
      targetSets: updated.targetSets,
      targetReps: updated.targetReps,
      targetDurationMinutes: updated.targetDurationMinutes ?? undefined,
      notes: updated.notes ?? undefined,
      daysOfWeek: updated.daysOfWeek,
    };
  }
}
