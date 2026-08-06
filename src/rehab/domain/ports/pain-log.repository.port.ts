import { PainLogEntity } from '../entities/pain-log.entity';

export type UpsertPainLogInput = {
  recoveryPlanId: string;
  date: Date;
  level: number;
  note?: string;
};

export interface PainLogRepositoryPort {
  upsert(data: UpsertPainLogInput): Promise<PainLogEntity>;
  listByRecoveryPlanInRange(
    recoveryPlanId: string,
    from: Date,
    to: Date,
  ): Promise<PainLogEntity[]>;
}
