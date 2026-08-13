import type { AppointmentType } from '../../domain/entities/appointment.entity';

export type UpdateAppointmentInput = {
  userId: string;
  appointmentId: string;
  title?: string;
  date: string;
  provider: string;
  type: AppointmentType;
  notes?: string;
  location?: string;
};
