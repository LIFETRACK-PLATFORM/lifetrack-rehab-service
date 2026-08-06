import { RecoveryPlanNotFoundError } from '../../domain/exceptions/rehab.errors';
import type { RecoveryPlanRepositoryPort } from '../../domain/ports/recovery-plan.repository.port';
import type { PainLogRepositoryPort } from '../../domain/ports/pain-log.repository.port';
import type { ListPainLogsInput } from '../dtos/list-pain-logs.input';

export class ListPainLogsUseCase {
  constructor(
    private readonly recoveryPlanRepository: RecoveryPlanRepositoryPort,
    private readonly painLogRepository: PainLogRepositoryPort,
  ) {}

  async execute(input: ListPainLogsInput) {
    const plan = await this.recoveryPlanRepository.findByIdAndUserId(
      input.recoveryPlanId,
      input.userId,
    );
    if (!plan) throw new RecoveryPlanNotFoundError(input.recoveryPlanId);

    const logs = await this.painLogRepository.listByRecoveryPlanInRange(
      input.recoveryPlanId,
      new Date(input.from),
      new Date(input.to),
    );

    return {
      painLogs: logs.map((log) => ({
        painLogId: log.id,
        recoveryPlanId: log.recoveryPlanId,
        date: log.date.toISOString().slice(0, 10),
        level: log.level,
        note: log.note ?? undefined,
      })),
    };
  }
}
