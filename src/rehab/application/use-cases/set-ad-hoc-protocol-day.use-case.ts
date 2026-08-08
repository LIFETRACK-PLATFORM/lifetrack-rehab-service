import {
  InvalidRehabEntityDataError,
  RecoveryPlanNotFoundError,
} from '../../domain/exceptions/rehab.errors';
import type { AdHocProtocolDayRepositoryPort } from '../../domain/ports/ad-hoc-protocol-day.repository.port';
import type { ExerciseRepositoryPort } from '../../domain/ports/exercise.repository.port';
import type { RecoveryPlanRepositoryPort } from '../../domain/ports/recovery-plan.repository.port';
import type { SetAdHocProtocolDayInput } from '../dtos/set-ad-hoc-protocol-day.input';
import { dayOfWeek, resolveToday, startOfDay } from '../utils/schedule.util';

function toDateOnly(iso: string): Date {
  return startOfDay(new Date(iso.slice(0, 10)));
}

export class SetAdHocProtocolDayUseCase {
  constructor(
    private readonly recoveryPlanRepository: RecoveryPlanRepositoryPort,
    private readonly exerciseRepository: ExerciseRepositoryPort,
    private readonly adHocProtocolDayRepository: AdHocProtocolDayRepositoryPort,
  ) {}

  async execute(input: SetAdHocProtocolDayInput) {
    const plan = await this.recoveryPlanRepository.findByIdAndUserId(
      input.recoveryPlanId,
      input.userId,
    );
    if (!plan) throw new RecoveryPlanNotFoundError(input.recoveryPlanId);

    const targetDate = toDateOnly(input.targetDate);
    const sourceDate = toDateOnly(input.sourceDate);
    const today = resolveToday(input.todayIso);

    if (targetDate.getTime() > today.getTime()) {
      throw new InvalidRehabEntityDataError(
        'No se puede asignar rutina prestada a un día futuro',
      );
    }

    const exercises = await this.exerciseRepository.listByRecoveryPlan(
      input.recoveryPlanId,
    );
    const sourceDow = dayOfWeek(sourceDate);
    const hasSourceRoutine = exercises.some((e) => e.isScheduledOn(sourceDow));
    if (!hasSourceRoutine) {
      throw new InvalidRehabEntityDataError(
        'El día origen no tiene ejercicios agendados',
      );
    }

    const targetDow = dayOfWeek(targetDate);
    const targetHasScheduled = exercises.some((e) =>
      e.isScheduledOn(targetDow),
    );
    if (targetHasScheduled) {
      throw new InvalidRehabEntityDataError(
        'Este día ya tiene ejercicios agendados en el protocolo',
      );
    }

    const saved = await this.adHocProtocolDayRepository.upsert({
      recoveryPlanId: input.recoveryPlanId,
      targetDate,
      sourceDate,
    });

    return {
      adHocProtocolDayId: saved.id,
      recoveryPlanId: saved.recoveryPlanId,
      targetDate: saved.targetDate.toISOString().slice(0, 10),
      sourceDate: saved.sourceDate.toISOString().slice(0, 10),
    };
  }
}
