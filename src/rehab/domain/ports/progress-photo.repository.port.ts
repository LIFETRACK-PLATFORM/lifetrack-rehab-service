import { ProgressPhotoEntity } from '../entities/progress-photo.entity';

export type CreateProgressPhotoInput = {
  recoveryPlanId: string;
  photoUrl: string;
  date: Date;
};

export interface ProgressPhotoRepositoryPort {
  create(data: CreateProgressPhotoInput): Promise<ProgressPhotoEntity>;
  listByRecoveryPlan(recoveryPlanId: string): Promise<ProgressPhotoEntity[]>;
}
