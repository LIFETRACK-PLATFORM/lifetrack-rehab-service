import { RecoveryPlanNotFoundError } from '../../domain/exceptions/rehab.errors';
import type { RecoveryPlanRepositoryPort } from '../../domain/ports/recovery-plan.repository.port';
import type { ExerciseRepositoryPort } from '../../domain/ports/exercise.repository.port';
import type { ExerciseCompletionRepositoryPort } from '../../domain/ports/exercise-completion.repository.port';
import type { AppointmentRepositoryPort } from '../../domain/ports/appointment.repository.port';
import type { AdHocProtocolDayRepositoryPort } from '../../domain/ports/ad-hoc-protocol-day.repository.port';
import { AppointmentType } from '../../domain/entities/appointment.entity';
import type { ExerciseEntity } from '../../domain/entities/exercise.entity';
import type { ExerciseCompletionEntity } from '../../domain/entities/exercise-completion.entity';
import type { GetWeeklySummaryInput } from '../dtos/get-weekly-summary.input';
import {
  addDays,
  dayOfWeek,
  isSameDay,
  startOfDay,
  startOfWeek,
} from '../utils/schedule.util';

const STREAK_LOOKBACK_DAYS = 60;

function isDayCompliant(
  day: Date,
  scheduleDate: Date,
  exercises: ExerciseEntity[],
  completions: ExerciseCompletionEntity[],
): { due: number; completed: number; compliant: boolean } {
  const due = exercises.filter((e) => e.isScheduledOn(dayOfWeek(scheduleDate)));
  const completed = due.filter((e) =>
    completions.some((c) => c.exerciseId === e.id && isSameDay(c.date, day)),
  );
  return {
    due: due.length,
    completed: completed.length,
    compliant: due.length > 0 && completed.length === due.length,
  };
}

export class GetWeeklySummaryUseCase {
  constructor(
    private readonly recoveryPlanRepository: RecoveryPlanRepositoryPort,
    private readonly exerciseRepository: ExerciseRepositoryPort,
    private readonly exerciseCompletionRepository: ExerciseCompletionRepositoryPort,
    private readonly appointmentRepository: AppointmentRepositoryPort,
    private readonly adHocProtocolDayRepository: AdHocProtocolDayRepositoryPort,
  ) {}

  async execute(input: GetWeeklySummaryInput) {
    const plan = await this.recoveryPlanRepository.findByIdAndUserId(
      input.recoveryPlanId,
      input.userId,
    );
    if (!plan) throw new RecoveryPlanNotFoundError(input.recoveryPlanId);

    const today = startOfDay(new Date());
    const referenceDate = input.referenceDate
      ? startOfDay(new Date(input.referenceDate))
      : today;
    const weekStart = startOfWeek(referenceDate);
    const weekEnd = addDays(weekStart, 6);

    const exercises = await this.exerciseRepository.listByRecoveryPlan(
      input.recoveryPlanId,
    );
    const exerciseIds = exercises.map((e) => e.id);

    const streakLookbackStart = addDays(today, -STREAK_LOOKBACK_DAYS);
    const queryFrom =
      weekStart.getTime() < streakLookbackStart.getTime()
        ? weekStart
        : streakLookbackStart;
    const queryTo = weekEnd.getTime() > today.getTime() ? weekEnd : today;

    const completions =
      await this.exerciseCompletionRepository.listByExerciseIds(exerciseIds, {
        from: queryFrom,
        to: queryTo,
      });

    const adHocProtocolDays =
      await this.adHocProtocolDayRepository.listByRecoveryPlan(
        input.recoveryPlanId,
      );
    const adHocSourceByTargetDate = new Map(
      adHocProtocolDays.map((d) => [
        d.targetDate.toISOString().slice(0, 10),
        d.sourceDate,
      ]),
    );
    const scheduleDateFor = (day: Date): Date =>
      adHocSourceByTargetDate.get(day.toISOString().slice(0, 10)) ?? day;

    const days = Array.from({ length: 7 }, (_, i) => {
      const date = addDays(weekStart, i);
      const { due, completed, compliant } = isDayCompliant(
        date,
        scheduleDateFor(date),
        exercises,
        completions,
      );
      return {
        date: date.toISOString().slice(0, 10),
        due,
        completed,
        compliant,
        isFuture: date.getTime() > today.getTime(),
      };
    });

    const evaluableDays = days.filter((d) => d.due > 0 && !d.isFuture);
    const compliantDays = evaluableDays.filter((d) => d.compliant);
    const weeklyCompliancePercent =
      evaluableDays.length === 0
        ? 0
        : Math.round((compliantDays.length / evaluableDays.length) * 100);

    const appointments =
      await this.appointmentRepository.listByRecoveryPlanInRange(
        input.recoveryPlanId,
        weekStart,
        weekEnd,
      );
    const appointmentsByType = {
      THERAPY: appointments.filter((a) => a.type === AppointmentType.THERAPY)
        .length,
      MEDICAL: appointments.filter((a) => a.type === AppointmentType.MEDICAL)
        .length,
    };

    let streakDays = 0;
    for (let offset = 0; ; offset++) {
      const day = addDays(today, -offset);
      if (day.getTime() < streakLookbackStart.getTime()) break;
      const { due, compliant } = isDayCompliant(
        day,
        scheduleDateFor(day),
        exercises,
        completions,
      );
      if (due === 0) continue;
      if (offset === 0 && !compliant) continue;
      if (!compliant) break;
      streakDays++;
    }

    return {
      recoveryPlanId: plan.id,
      weekStart: weekStart.toISOString().slice(0, 10),
      weekEnd: weekEnd.toISOString().slice(0, 10),
      days,
      weeklyCompliancePercent,
      appointmentsByType,
      streakDays,
    };
  }
}
