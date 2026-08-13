import {
  AppointmentEntity,
  AppointmentType,
} from '../entities/appointment.entity';

export type CreateAppointmentInput = {
  recoveryPlanId: string;
  title?: string;
  date: Date;
  provider: string;
  type: AppointmentType;
  notes?: string;
  location?: string;
};

export type UpdateAppointmentInput = {
  title?: string;
  date: Date;
  provider: string;
  type: AppointmentType;
  notes?: string;
  location?: string;
  rescheduledFromDate?: Date | null;
  attended?: boolean | null;
};

export interface AppointmentRepositoryPort {
  create(data: CreateAppointmentInput): Promise<AppointmentEntity>;
  createMany(data: CreateAppointmentInput[]): Promise<AppointmentEntity[]>;
  findById(id: string): Promise<AppointmentEntity | null>;
  listByRecoveryPlan(recoveryPlanId: string): Promise<AppointmentEntity[]>;
  listByRecoveryPlanInRange(
    recoveryPlanId: string,
    from: Date,
    to: Date,
  ): Promise<AppointmentEntity[]>;
  updateAttendance(id: string, attended: boolean): Promise<AppointmentEntity>;
  updateById(
    id: string,
    data: UpdateAppointmentInput,
  ): Promise<AppointmentEntity>;
  deleteById(id: string): Promise<void>;
}
