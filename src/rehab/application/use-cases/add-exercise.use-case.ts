import { RecoveryPlanNotFoundError } from '../../domain/exceptions/rehab.errors';
import type { RecoveryPlanRepositoryPort } from '../../domain/ports/recovery-plan.repository.port';
import type { ExerciseRepositoryPort } from '../../domain/ports/exercise.repository.port';
import type { AddExerciseInput } from '../dtos/add-exercise.input';

export class AddExerciseUseCase {
  constructor(
    private readonly recoveryPlanRepository: RecoveryPlanRepositoryPort,
    private readonly exerciseRepository: ExerciseRepositoryPort,
  ) {}

  async execute(input: AddExerciseInput) {
    const plan = await this.recoveryPlanRepository.findByIdAndUserId(
      input.recoveryPlanId,
      input.userId,
    );
    if (!plan) throw new RecoveryPlanNotFoundError(input.recoveryPlanId);

    const exercise = await this.exerciseRepository.create({
      recoveryPlanId: input.recoveryPlanId,
      name: input.name,
      metricType: input.metricType,
      targetSets: input.targetSets,
      targetReps: input.targetReps,
      targetDurationMinutes: input.targetDurationMinutes,
      referenceMediaUrl: input.referenceMediaUrl,
      notes: input.notes,
      daysOfWeek: input.daysOfWeek,
    });

    return {
      exerciseId: exercise.id,
      recoveryPlanId: exercise.recoveryPlanId,
      name: exercise.name,
      metricType: exercise.metricType,
      targetSets: exercise.targetSets,
      targetReps: exercise.targetReps,
      targetDurationMinutes: exercise.targetDurationMinutes ?? undefined,
      notes: exercise.notes ?? undefined,
      daysOfWeek: exercise.daysOfWeek,
    };
  }
}
