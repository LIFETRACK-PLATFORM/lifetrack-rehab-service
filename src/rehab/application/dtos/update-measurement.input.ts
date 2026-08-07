import type { MeasurementType } from '../../domain/entities/measurement.entity';

export type UpdateMeasurementInput = {
  userId: string;
  measurementId: string;
  type: MeasurementType;
  customLabel?: string;
  value: number;
  unit: string;
  date: string;
};
