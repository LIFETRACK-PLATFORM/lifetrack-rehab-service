import { RecoveryPlanNotFoundError } from '../../domain/exceptions/rehab.errors';
import type { RecoveryPlanRepositoryPort } from '../../domain/ports/recovery-plan.repository.port';
import type { AppointmentRepositoryPort } from '../../domain/ports/appointment.repository.port';
import type { EventPublisherPort } from '../../domain/ports/event.publisher.port';
import type { AddAppointmentInput } from '../dtos/add-appointment.input';

export class AddAppointmentUseCase {
  constructor(
    private readonly recoveryPlanRepository: RecoveryPlanRepositoryPort,
    private readonly appointmentRepository: AppointmentRepositoryPort,
    private readonly eventPublisher: EventPublisherPort,
  ) {}

  async execute(input: AddAppointmentInput) {
    const plan = await this.recoveryPlanRepository.findByIdAndUserId(
      input.recoveryPlanId,
      input.userId,
    );
    if (!plan) throw new RecoveryPlanNotFoundError(input.recoveryPlanId);

    const appointment = await this.appointmentRepository.create({
      recoveryPlanId: input.recoveryPlanId,
      date: new Date(input.date),
      provider: input.provider,
      notes: input.notes,
    });

    await this.eventPublisher.publish({
      eventType: 'rehab.appointment_added.v1',
      actorId: plan.userId,
      payload: {
        appointmentId: appointment.id,
        recoveryPlanId: appointment.recoveryPlanId,
        date: appointment.date.toISOString(),
        provider: appointment.provider,
      },
    });

    return {
      appointmentId: appointment.id,
      recoveryPlanId: appointment.recoveryPlanId,
      date: appointment.date.toISOString(),
      provider: appointment.provider,
      notes: appointment.notes ?? undefined,
    };
  }
}
