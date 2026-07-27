import { RecoveryPlan as PrismaRecoveryPlan } from 'generated/prisma/client';
import {
  RecoveryPlanEntity,
  RecoveryPlanStatus,
} from '../../../domain/entities/recovery-plan.entity';

export class RecoveryPlanMapper {
  static toDomain(raw: PrismaRecoveryPlan): RecoveryPlanEntity {
    return new RecoveryPlanEntity(
      {
        userId: raw.userId,
        bodyPart: raw.bodyPart,
        injuryType: raw.injuryType,
        surgeryDate: raw.surgeryDate,
        status: raw.status as RecoveryPlanStatus,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      raw.id,
    );
  }
}
