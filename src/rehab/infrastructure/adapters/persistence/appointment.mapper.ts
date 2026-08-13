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
        title: raw.title,
        date: raw.date,
        provider: raw.provider,
        type: raw.type as AppointmentType,
        notes: raw.notes,
        location: raw.location,
        attended: raw.attended,
        rescheduledFromDate: raw.rescheduledFromDate,
        createdAt: raw.createdAt,
      },
      raw.id,
    );
  }
}
