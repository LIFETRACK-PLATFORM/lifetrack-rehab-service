import { PainLog as PrismaPainLog } from 'generated/prisma/client';
import { PainLogEntity } from '../../../domain/entities/pain-log.entity';

export class PainLogMapper {
  static toDomain(raw: PrismaPainLog): PainLogEntity {
    return new PainLogEntity(
      {
        recoveryPlanId: raw.recoveryPlanId,
        date: raw.date,
        level: raw.level,
        note: raw.note,
        createdAt: raw.createdAt,
      },
      raw.id,
    );
  }
}
