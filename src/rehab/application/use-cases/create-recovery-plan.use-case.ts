import { Logger } from '@nestjs/common';
import type { RecoveryPlanRepositoryPort } from '../../domain/ports/recovery-plan.repository.port';
import type { EventPublisherPort } from '../../domain/ports/event.publisher.port';
import type { CreateRecoveryPlanInput } from '../dtos/create-recovery-plan.input';

export class CreateRecoveryPlanUseCase {
  private readonly logger = new Logger(CreateRecoveryPlanUseCase.name);

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

    try {
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
    } catch (err) {
      // El plan ya se persistió con éxito: un fallo al publicar el evento
      // (ej. NATS caído momentáneamente) es un problema de notificación a
      // otros servicios, no del propio request. No debe convertirse en un
      // 500 para un cliente que ya recibió su recurso creado correctamente.
      this.logger.error(
        `Fallo al publicar rehab.plan_created.v1 para el plan ${plan.id}: ${
          err instanceof Error ? err.message : String(err)
        }`,
      );
    }

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
