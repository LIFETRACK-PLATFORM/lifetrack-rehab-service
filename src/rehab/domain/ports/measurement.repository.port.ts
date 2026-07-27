import {
  MeasurementEntity,
  MeasurementType,
} from '../entities/measurement.entity';

export type CreateMeasurementInput = {
  recoveryPlanId: string;
  type: MeasurementType;
  value: number;
  unit: string;
  date: Date;
};

export interface MeasurementRepositoryPort {
  create(data: CreateMeasurementInput): Promise<MeasurementEntity>;
  listByRecoveryPlan(recoveryPlanId: string): Promise<MeasurementEntity[]>;
}
