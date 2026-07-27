import { MeasurementType } from '../../domain/entities/measurement.entity';

export type AddMeasurementInput = {
  userId: string;
  recoveryPlanId: string;
  type: MeasurementType;
  value: number;
  unit: string;
  date: string;
};
