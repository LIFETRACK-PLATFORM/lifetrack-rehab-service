import { Measurement as PrismaMeasurement } from 'generated/prisma/client';
import {
  MeasurementEntity,
  MeasurementType,
} from '../../../domain/entities/measurement.entity';

export class MeasurementMapper {
  static toDomain(raw: PrismaMeasurement): MeasurementEntity {
    return new MeasurementEntity(
      {
        recoveryPlanId: raw.recoveryPlanId,
        type: raw.type as MeasurementType,
        value: raw.value,
        unit: raw.unit,
        date: raw.date,
        createdAt: raw.createdAt,
      },
      raw.id,
    );
  }
}
