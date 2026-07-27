import type { RecoveryPlanRepositoryPort } from '../../domain/ports/recovery-plan.repository.port';
import type { EventPublisherPort } from '../../domain/ports/event.publisher.port';
import type { CreateRecoveryPlanInput } from '../dtos/create-recovery-plan.input';

export class CreateRecoveryPlanUseCase {
  constructor(
    private readonly recoveryPlanRepository: RecoveryPlanRepositoryPort,
    private readonly eventPublisher: EventPublisherPort,
  ) {}

  async execute(input: CreateRecoveryPlanInput) {
    const plan = await this.recoveryPlanRepository.create({
      userId: input.userId,
      bodyPart: input.bodyPart,
      injuryType: input.injuryType,
      surgeryDate: new Date(input.surgeryDate),
    });

    await this.eventPublisher.publish({
      eventType: 'rehab.plan_created.v1',
      actorId: input.userId,
      payload: {
        recoveryPlanId: plan.id,
        userId: plan.userId,
        bodyPart: plan.bodyPart,
        injuryType: plan.injuryType,
      },
    });

    return {
      recoveryPlanId: plan.id,
      userId: plan.userId,
      bodyPart: plan.bodyPart,
      injuryType: plan.injuryType,
      surgeryDate: plan.surgeryDate.toISOString(),
      status: plan.status,
    };
  }
}
