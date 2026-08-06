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
      targetSets: input.targetSets,
      targetReps: input.targetReps,
      referenceMediaUrl: input.referenceMediaUrl,
      phase: input.phase,
      daysOfWeek: input.daysOfWeek,
    });

    return {
      exerciseId: exercise.id,
      recoveryPlanId: exercise.recoveryPlanId,
      name: exercise.name,
      targetSets: exercise.targetSets,
      targetReps: exercise.targetReps,
      phase: exercise.phase,
      daysOfWeek: exercise.daysOfWeek,
    };
  }
}
