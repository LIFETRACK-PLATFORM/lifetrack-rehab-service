import { Appointment as PrismaAppointment } from 'generated/prisma/client';
import {
  AppointmentEntity,
  AppointmentType,
} from '../../../domain/entities/appointment.entity';

export class AppointmentMapper {
  static toDomain(raw: PrismaAppointment): AppointmentEntity {
    return new AppointmentEntity(
      {
        recoveryPlanId: raw.recoveryPlanId,
        date: raw.date,
        provider: raw.provider,
        type: raw.type as AppointmentType,
        notes: raw.notes,
        createdAt: raw.createdAt,
      },
      raw.id,
    );
  }
}
