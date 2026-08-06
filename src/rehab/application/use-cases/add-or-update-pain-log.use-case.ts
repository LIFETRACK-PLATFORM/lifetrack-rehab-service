import { RecoveryPlanNotFoundError } from '../../domain/exceptions/rehab.errors';
import type { RecoveryPlanRepositoryPort } from '../../domain/ports/recovery-plan.repository.port';
import type { PainLogRepositoryPort } from '../../domain/ports/pain-log.repository.port';
import type { AddOrUpdatePainLogInput } from '../dtos/add-or-update-pain-log.input';
import { PainLogEntity } from '../../domain/entities/pain-log.entity';

export class AddOrUpdatePainLogUseCase {
  constructor(
    private readonly recoveryPlanRepository: RecoveryPlanRepositoryPort,
    private readonly painLogRepository: PainLogRepositoryPort,
  ) {}

  async execute(input: AddOrUpdatePainLogInput) {
    const plan = await this.recoveryPlanRepository.findByIdAndUserId(
      input.recoveryPlanId,
      input.userId,
    );
    if (!plan) throw new RecoveryPlanNotFoundError(input.recoveryPlanId);

    // Valida el rango 0-10 con la misma regla de dominio antes de persistir.
    new PainLogEntity({
      recoveryPlanId: input.recoveryPlanId,
      date: new Date(input.date),
      level: input.level,
      note: input.note,
      createdAt: new Date(),
    });

    const painLog = await this.painLogRepository.upsert({
      recoveryPlanId: input.recoveryPlanId,
      date: new Date(input.date.slice(0, 10)),
      level: input.level,
      note: input.note,
    });

    return {
      painLogId: painLog.id,
      recoveryPlanId: painLog.recoveryPlanId,
      date: painLog.date.toISOString().slice(0, 10),
      level: painLog.level,
      note: painLog.note ?? undefined,
    };
  }
}
