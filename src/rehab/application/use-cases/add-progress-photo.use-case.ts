import { RecoveryPlanNotFoundError } from '../../domain/exceptions/rehab.errors';
import type { RecoveryPlanRepositoryPort } from '../../domain/ports/recovery-plan.repository.port';
import type { ProgressPhotoRepositoryPort } from '../../domain/ports/progress-photo.repository.port';
import type { AddProgressPhotoInput } from '../dtos/add-progress-photo.input';

export class AddProgressPhotoUseCase {
  constructor(
    private readonly recoveryPlanRepository: RecoveryPlanRepositoryPort,
    private readonly progressPhotoRepository: ProgressPhotoRepositoryPort,
  ) {}

  async execute(input: AddProgressPhotoInput) {
    const plan = await this.recoveryPlanRepository.findByIdAndUserId(
      input.recoveryPlanId,
      input.userId,
    );
    if (!plan) throw new RecoveryPlanNotFoundError(input.recoveryPlanId);

    const photo = await this.progressPhotoRepository.create({
      recoveryPlanId: input.recoveryPlanId,
      photoUrl: input.photoUrl,
      date: new Date(input.date),
    });

    return {
      progressPhotoId: photo.id,
      recoveryPlanId: photo.recoveryPlanId,
      photoUrl: photo.photoUrl,
      date: photo.date.toISOString(),
    };
  }
}
