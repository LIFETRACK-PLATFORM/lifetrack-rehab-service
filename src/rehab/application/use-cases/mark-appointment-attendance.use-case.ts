import {
  AppointmentNotFoundError,
  RecoveryPlanNotFoundError,
} from '../../domain/exceptions/rehab.errors';
import type { AppointmentRepositoryPort } from '../../domain/ports/appointment.repository.port';
import type { RecoveryPlanRepositoryPort } from '../../domain/ports/recovery-plan.repository.port';
import type { MarkAppointmentAttendanceInput } from '../dtos/mark-appointment-attendance.input';

export class MarkAppointmentAttendanceUseCase {
  constructor(
    private readonly appointmentRepository: AppointmentRepositoryPort,
    private readonly recoveryPlanRepository: RecoveryPlanRepositoryPort,
  ) {}

  async execute(input: MarkAppointmentAttendanceInput) {
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

    const updated = await this.appointmentRepository.updateAttendance(
      input.appointmentId,
      input.attended,
    );

    return {
      appointmentId: updated.id,
      recoveryPlanId: updated.recoveryPlanId,
      attended: updated.attended ?? false,
    };
  }
}
