import { RecoveryPlanNotFoundError } from '../../domain/exceptions/rehab.errors';
import type { AdHocProtocolDayRepositoryPort } from '../../domain/ports/ad-hoc-protocol-day.repository.port';
import type { RecoveryPlanRepositoryPort } from '../../domain/ports/recovery-plan.repository.port';
import type { ClearAdHocProtocolDayInput } from '../dtos/clear-ad-hoc-protocol-day.input';
import { startOfDay } from '../utils/schedule.util';

function toDateOnly(iso: string): Date {
  return startOfDay(new Date(iso.slice(0, 10)));
}

export class ClearAdHocProtocolDayUseCase {
  constructor(
    private readonly recoveryPlanRepository: RecoveryPlanRepositoryPort,
    private readonly adHocProtocolDayRepository: AdHocProtocolDayRepositoryPort,
  ) {}

  async execute(input: ClearAdHocProtocolDayInput) {
    const plan = await this.recoveryPlanRepository.findByIdAndUserId(
      input.recoveryPlanId,
      input.userId,
    );
    if (!plan) throw new RecoveryPlanNotFoundError(input.recoveryPlanId);

    const targetDate = toDateOnly(input.targetDate);
    await this.adHocProtocolDayRepository.deleteByPlanAndTargetDate(
      input.recoveryPlanId,
      targetDate,
    );

    return { cleared: true };
  }
}
