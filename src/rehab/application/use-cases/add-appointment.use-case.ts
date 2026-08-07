import { Logger } from '@nestjs/common';
import { RecoveryPlanNotFoundError } from '../../domain/exceptions/rehab.errors';
import type { RecoveryPlanRepositoryPort } from '../../domain/ports/recovery-plan.repository.port';
import type { AppointmentRepositoryPort } from '../../domain/ports/appointment.repository.port';
import type { EventPublisherPort } from '../../domain/ports/event.publisher.port';
import type { AddAppointmentInput } from '../dtos/add-appointment.input';
import { AppointmentEntity } from '../../domain/entities/appointment.entity';

const MAX_REPEAT_WEEKS = 12;
const DAY_IN_MS = 24 * 60 * 60 * 1000;

export class AddAppointmentUseCase {
  private readonly logger = new Logger(AddAppointmentUseCase.name);

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

    const repeatWeeks = Math.min(
      Math.max(input.repeatWeeks ?? 0, 0),
      MAX_REPEAT_WEEKS,
    );
    const baseDate = new Date(input.date);
    // Valida los datos de cada cita usando la misma entidad de dominio antes de persistir.
    const occurrenceDates = Array.from(
      { length: repeatWeeks + 1 },
      (_, i) => new Date(baseDate.getTime() + i * 7 * DAY_IN_MS),
    );
    occurrenceDates.forEach((date) => {
      new AppointmentEntity({
        recoveryPlanId: input.recoveryPlanId,
        title: input.title,
        date,
        provider: input.provider,
        type: input.type,
        notes: input.notes,
        createdAt: new Date(),
      });
    });

    const created =
      occurrenceDates.length === 1
        ? [
            await this.appointmentRepository.create({
              recoveryPlanId: input.recoveryPlanId,
              title: input.title,
              date: occurrenceDates[0],
              provider: input.provider,
              type: input.type,
              notes: input.notes,
            }),
          ]
        : await this.appointmentRepository.createMany(
            occurrenceDates.map((date) => ({
              recoveryPlanId: input.recoveryPlanId,
              title: input.title,
              date,
              provider: input.provider,
              type: input.type,
              notes: input.notes,
            })),
          );

    for (const appointment of created) {
      try {
        await this.eventPublisher.publish({
          eventType: 'rehab.appointment_added.v1',
          actorId: plan.userId,
          payload: {
            appointmentId: appointment.id,
            recoveryPlanId: appointment.recoveryPlanId,
            date: appointment.date.toISOString(),
            provider: appointment.provider,
            type: appointment.type,
          },
        });
      } catch (err) {
        // La cita ya se persistió con éxito: un fallo al publicar el evento
        // no debe convertirse en un 500 para el cliente.
        this.logger.error(
          `Fallo al publicar rehab.appointment_added.v1 para la cita ${appointment.id}: ${
            err instanceof Error ? err.message : String(err)
          }`,
        );
      }
    }

    return {
      appointments: created.map((appointment) => ({
        appointmentId: appointment.id,
        recoveryPlanId: appointment.recoveryPlanId,
        title: appointment.title ?? undefined,
        date: appointment.date.toISOString(),
        provider: appointment.provider,
        type: appointment.type,
        notes: appointment.notes ?? undefined,
        attended: appointment.attended ?? undefined,
      })),
    };
  }
}
