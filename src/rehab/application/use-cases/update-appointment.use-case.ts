import {
  AppointmentNotFoundError,
  RecoveryPlanNotFoundError,
} from '../../domain/exceptions/rehab.errors';
import type { AppointmentRepositoryPort } from '../../domain/ports/appointment.repository.port';
import type { RecoveryPlanRepositoryPort } from '../../domain/ports/recovery-plan.repository.port';
import type { UpdateAppointmentInput } from '../dtos/update-appointment.input';

export class UpdateAppointmentUseCase {
  constructor(
    private readonly appointmentRepository: AppointmentRepositoryPort,
    private readonly recoveryPlanRepository: RecoveryPlanRepositoryPort,
  ) {}

  async execute(input: UpdateAppointmentInput) {
    const appointment = await this.appointmentRepository.findById(
      input.appointmentId,
    );
    if (!appointment) {
      throw new AppointmentNotFoundError(input.appointmentId);
    }

    const plan = await this.recoveryPlanRepository.findByIdAndUserId(
      appointment.recoveryPlanId,
      input.userId,
    );
    if (!plan) {
      throw new RecoveryPlanNotFoundError(appointment.recoveryPlanId);
    }

    const newDate = new Date(input.date);
    const dateChanged = appointment.date.getTime() !== newDate.getTime();
    const rescheduledFromDate = dateChanged
      ? appointment.date
      : appointment.rescheduledFromDate;

    const updated = await this.appointmentRepository.updateById(
      input.appointmentId,
      {
        title: input.title,
        date: newDate,
        provider: input.provider,
        type: input.type,
        notes: input.notes,
        rescheduledFromDate,
      },
    );

    return {
      appointmentId: updated.id,
      recoveryPlanId: updated.recoveryPlanId,
      title: updated.title ?? undefined,
      date: updated.date.toISOString(),
      provider: updated.provider,
      type: updated.type,
      notes: updated.notes ?? undefined,
      attended: updated.attended ?? undefined,
      rescheduledFromDate:
        updated.rescheduledFromDate?.toISOString() ?? undefined,
    };
  }
}
