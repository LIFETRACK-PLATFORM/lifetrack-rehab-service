import type { RecoveryPlanRepositoryPort } from '../../domain/ports/recovery-plan.repository.port';

export class ListRecoveryPlansByUserUseCase {
  constructor(
    private readonly recoveryPlanRepository: RecoveryPlanRepositoryPort,
  ) {}

  async execute(userId: string) {
    const plans = await this.recoveryPlanRepository.listByUserId(userId);

    return {
      plans: plans.map((plan) => ({
        recoveryPlanId: plan.id,
        bodyPart: plan.bodyPart,
        injuryType: plan.injuryType,
        surgeryDate: plan.surgeryDate.toISOString(),
        status: plan.status,
      })),
    };
  }
}
