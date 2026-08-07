import {
  InvalidRecoveryPlanStatusError,
  RecoveryPlanNotFoundError,
} from '../../domain/exceptions/rehab.errors';
import { RecoveryPlanStatus } from '../../domain/entities/recovery-plan.entity';
import type { RecoveryPlanRepositoryPort } from '../../domain/ports/recovery-plan.repository.port';
import type { UpdateRecoveryPlanStatusInput } from '../dtos/update-recovery-plan-status.input';

export class UpdateRecoveryPlanStatusUseCase {
  constructor(
    private readonly recoveryPlanRepository: RecoveryPlanRepositoryPort,
  ) {}

  async execute(input: UpdateRecoveryPlanStatusInput) {
    if (
      !Object.values(RecoveryPlanStatus).includes(
        input.status as RecoveryPlanStatus,
      )
    ) {
      throw new InvalidRecoveryPlanStatusError(input.status);
    }

    const plan = await this.recoveryPlanRepository.findByIdAndUserId(
      input.recoveryPlanId,
      input.userId,
    );
    if (!plan) throw new RecoveryPlanNotFoundError(input.recoveryPlanId);

    plan.changeStatus(input.status as RecoveryPlanStatus);
    const updated = await this.recoveryPlanRepository.updateStatus(
      plan.id,
      plan.status,
    );

    return {
      recoveryPlanId: updated.id,
      status: updated.status,
    };
  }
}
