import { MeasurementType } from '../../domain/entities/measurement.entity';

export type AddMeasurementInput = {
  userId: string;
  recoveryPlanId: string;
  type: MeasurementType;
  customLabel?: string;
  value: number;
  unit: string;
  date: string;
};
