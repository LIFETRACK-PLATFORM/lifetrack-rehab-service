import {
  AppointmentNotFoundError,
  RecoveryPlanNotFoundError,
} from '../../domain/exceptions/rehab.errors';
import type { AppointmentRepositoryPort } from '../../domain/ports/appointment.repository.port';
import type { RecoveryPlanRepositoryPort } from '../../domain/ports/recovery-plan.repository.port';
import type { DeleteAppointmentInput } from '../dtos/delete-appointment.input';

export class DeleteAppointmentUseCase {
  constructor(
    private readonly appointmentRepository: AppointmentRepositoryPort,
    private readonly recoveryPlanRepository: RecoveryPlanRepositoryPort,
  ) {}

  async execute(input: DeleteAppointmentInput) {
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

    await this.appointmentRepository.deleteById(input.appointmentId);

    return {
      appointmentId: input.appointmentId,
      recoveryPlanId: appointment.recoveryPlanId,
      deleted: true,
    };
  }
}
