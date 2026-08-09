import type { AdHocProtocolDayEntity } from '../entities/ad-hoc-protocol-day.entity';

export interface UpsertAdHocProtocolDayInput {
  recoveryPlanId: string;
  targetDate: Date;
  sourceDate: Date;
}

export interface AdHocProtocolDayRepositoryPort {
  upsert(data: UpsertAdHocProtocolDayInput): Promise<AdHocProtocolDayEntity>;
  deleteByPlanAndTargetDate(
    recoveryPlanId: string,
    targetDate: Date,
  ): Promise<void>;
  listByRecoveryPlan(recoveryPlanId: string): Promise<AdHocProtocolDayEntity[]>;
}
