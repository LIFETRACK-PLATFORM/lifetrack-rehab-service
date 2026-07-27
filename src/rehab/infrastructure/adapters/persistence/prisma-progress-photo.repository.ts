import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ProgressPhotoEntity } from '../../../domain/entities/progress-photo.entity';
import type {
  CreateProgressPhotoInput,
  ProgressPhotoRepositoryPort,
} from '../../../domain/ports/progress-photo.repository.port';
import { ProgressPhotoMapper } from './progress-photo.mapper';

@Injectable()
export class PrismaProgressPhotoRepository implements ProgressPhotoRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProgressPhotoInput): Promise<ProgressPhotoEntity> {
    const raw = await this.prisma.progressPhoto.create({
      data: {
        recoveryPlanId: data.recoveryPlanId,
        photoUrl: data.photoUrl,
        date: data.date,
      },
    });
    return ProgressPhotoMapper.toDomain(raw);
  }

  async listByRecoveryPlan(
    recoveryPlanId: string,
  ): Promise<ProgressPhotoEntity[]> {
    const rows = await this.prisma.progressPhoto.findMany({
      where: { recoveryPlanId },
    });
    return rows.map((row) => ProgressPhotoMapper.toDomain(row));
  }
}
