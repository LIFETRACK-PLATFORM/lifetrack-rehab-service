import { ProgressPhoto as PrismaProgressPhoto } from 'generated/prisma/client';
import { ProgressPhotoEntity } from '../../../domain/entities/progress-photo.entity';

export class ProgressPhotoMapper {
  static toDomain(raw: PrismaProgressPhoto): ProgressPhotoEntity {
    return new ProgressPhotoEntity(
      {
        recoveryPlanId: raw.recoveryPlanId,
        photoUrl: raw.photoUrl,
        date: raw.date,
        createdAt: raw.createdAt,
      },
      raw.id,
    );
  }
}
