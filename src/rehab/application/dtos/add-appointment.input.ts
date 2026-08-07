import { AppointmentType } from '../../domain/entities/appointment.entity';

export type AddAppointmentInput = {
  userId: string;
  recoveryPlanId: string;
  title?: string;
  date: string;
  provider: string;
  type: AppointmentType;
  notes?: string;
  /** Repeticiones semanales adicionales a partir de `date` (0 = solo esta cita). Tope 12. */
  repeatWeeks?: number;
};
