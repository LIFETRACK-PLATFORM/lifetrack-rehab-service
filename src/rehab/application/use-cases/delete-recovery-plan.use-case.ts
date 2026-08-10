import { RecoveryPlanNotFoundError } from '../../domain/exceptions/rehab.errors';
import type { RecoveryPlanRepositoryPort } from '../../domain/ports/recovery-plan.repository.port';

export type DeleteRecoveryPlanInput = {
  userId: string;
  recoveryPlanId: string;
};

export class DeleteRecoveryPlanUseCase {
  constructor(
    private readonly recoveryPlanRepository: RecoveryPlanRepositoryPort,
  ) {}

  async execute(input: DeleteRecoveryPlanInput) {
    const plan = await this.recoveryPlanRepository.findByIdAndUserId(
      input.recoveryPlanId,
      input.userId,
    );
    if (!plan) throw new RecoveryPlanNotFoundError(input.recoveryPlanId);

    await this.recoveryPlanRepository.deleteById(input.recoveryPlanId);

    return {
      recoveryPlanId: input.recoveryPlanId,
      deleted: true,
    };
  }
}
