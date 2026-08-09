import { RecoveryPlanNotFoundError } from '../../domain/exceptions/rehab.errors';
import type { RecoveryPlanRepositoryPort } from '../../domain/ports/recovery-plan.repository.port';
import type { ExerciseRepositoryPort } from '../../domain/ports/exercise.repository.port';
import type { ExerciseCompletionRepositoryPort } from '../../domain/ports/exercise-completion.repository.port';
import type { GetTodayExercisesInput } from '../dtos/get-today-exercises.input';
import {
  addDays,
  dayOfWeek,
  isSameDay,
  resolveToday,
} from '../utils/schedule.util';

export class GetTodayExercisesUseCase {
  constructor(
    private readonly recoveryPlanRepository: RecoveryPlanRepositoryPort,
    private readonly exerciseRepository: ExerciseRepositoryPort,
    private readonly exerciseCompletionRepository: ExerciseCompletionRepositoryPort,
  ) {}

  async execute(input: GetTodayExercisesInput) {
    const plan = await this.recoveryPlanRepository.findByIdAndUserId(
      input.recoveryPlanId,
      input.userId,
    );
    if (!plan) throw new RecoveryPlanNotFoundError(input.recoveryPlanId);

    const today = resolveToday(input.todayIso);
    const yesterday = addDays(today, -1);
    const exercises = await this.exerciseRepository.listByRecoveryPlan(
      input.recoveryPlanId,
    );

    const completions =
      await this.exerciseCompletionRepository.listByExerciseIds(
        exercises.map((e) => e.id),
        { from: yesterday, to: today },
      );

    const dueToday = exercises.filter((e) => e.isScheduledOn(dayOfWeek(today)));
    const dueYesterday = exercises.filter((e) =>
      e.isScheduledOn(dayOfWeek(yesterday)),
    );
    const dueYesterdayIds = new Set(dueYesterday.map((e) => e.id));

    const relevant = new Map(dueToday.map((e) => [e.id, e]));
    for (const e of dueYesterday) relevant.set(e.id, e);

    return Array.from(relevant.values()).map((exercise) => {
      const completedToday = completions.some(
        (c) => c.exerciseId === exercise.id && isSameDay(c.date, today),
      );
      const completedYesterday = completions.some(
        (c) => c.exerciseId === exercise.id && isSameDay(c.date, yesterday),
      );
      const urgent = dueYesterdayIds.has(exercise.id) && !completedYesterday;

      return {
        exerciseId: exercise.id,
        name: exercise.name,
        targetSets: exercise.targetSets,
        targetReps: exercise.targetReps,
        scheduledToday: dueToday.some((e) => e.id === exercise.id),
        completedToday,
        urgent,
      };
    });
  }
}
