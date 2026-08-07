import { AdHocProtocolDay as PrismaAdHocProtocolDay } from 'generated/prisma/client';
import { AdHocProtocolDayEntity } from '../../../domain/entities/ad-hoc-protocol-day.entity';

export class AdHocProtocolDayMapper {
  static toDomain(raw: PrismaAdHocProtocolDay): AdHocProtocolDayEntity {
    return new AdHocProtocolDayEntity(
      raw.id,
      raw.recoveryPlanId,
      raw.targetDate,
      raw.sourceDate,
    );
  }
}
