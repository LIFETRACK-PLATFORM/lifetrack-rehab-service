import {
  RecoveryPlanEntity,
  RecoveryPlanStatus,
} from '../entities/recovery-plan.entity';

export type CreateRecoveryPlanInput = {
  userId: string;
  bodyPart: string;
  injuryType: string;
  surgeryDate: Date;
};

export interface RecoveryPlanRepositoryPort {
  findById(id: string): Promise<RecoveryPlanEntity | null>;
  findByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<RecoveryPlanEntity | null>;
  listByUserId(userId: string): Promise<RecoveryPlanEntity[]>;
  create(data: CreateRecoveryPlanInput): Promise<RecoveryPlanEntity>;
  updateStatus(
    id: string,
    status: RecoveryPlanStatus,
  ): Promise<RecoveryPlanEntity>;
  deleteById(id: string): Promise<void>;
}
