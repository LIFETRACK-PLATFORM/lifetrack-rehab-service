import { AppointmentEntity } from '../entities/appointment.entity';

export type CreateAppointmentInput = {
  recoveryPlanId: string;
  date: Date;
  provider: string;
  notes?: string;
};

export interface AppointmentRepositoryPort {
  create(data: CreateAppointmentInput): Promise<AppointmentEntity>;
  listByRecoveryPlan(recoveryPlanId: string): Promise<AppointmentEntity[]>;
}
