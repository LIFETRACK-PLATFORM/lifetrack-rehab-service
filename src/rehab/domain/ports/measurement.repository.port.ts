import {
  MeasurementEntity,
  MeasurementType,
} from '../entities/measurement.entity';

export type CreateMeasurementInput = {
  recoveryPlanId: string;
  type: MeasurementType;
  customLabel?: string | null;
  value: number;
  unit: string;
  date: Date;
};

export type UpdateMeasurementInput = {
  type: MeasurementType;
  customLabel?: string | null;
  value: number;
  unit: string;
  date: Date;
};

export interface MeasurementRepositoryPort {
  create(data: CreateMeasurementInput): Promise<MeasurementEntity>;
  findById(id: string): Promise<MeasurementEntity | null>;
  updateById(
    id: string,
    data: UpdateMeasurementInput,
  ): Promise<MeasurementEntity>;
  deleteById(id: string): Promise<void>;
  listByRecoveryPlan(recoveryPlanId: string): Promise<MeasurementEntity[]>;
}
