import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  RecoveryPlanEntity,
  RecoveryPlanStatus,
} from '../../../domain/entities/recovery-plan.entity';
import type {
  CreateRecoveryPlanInput,
  RecoveryPlanRepositoryPort,
} from '../../../domain/ports/recovery-plan.repository.port';
import { RecoveryPlanMapper } from './recovery-plan.mapper';

@Injectable()
export class PrismaRecoveryPlanRepository implements RecoveryPlanRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<RecoveryPlanEntity | null> {
    const raw = await this.prisma.recoveryPlan.findUnique({ where: { id } });
    return raw ? RecoveryPlanMapper.toDomain(raw) : null;
  }

  async findByIdAndUserId(
    id: string,
    userId: string,
  ): Promise<RecoveryPlanEntity | null> {
    const raw = await this.prisma.recoveryPlan.findFirst({
      where: { id, userId },
    });
    return raw ? RecoveryPlanMapper.toDomain(raw) : null;
  }

  async listByUserId(userId: string): Promise<RecoveryPlanEntity[]> {
    const rows = await this.prisma.recoveryPlan.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((raw) => RecoveryPlanMapper.toDomain(raw));
  }

  async create(data: CreateRecoveryPlanInput): Promise<RecoveryPlanEntity> {
    const raw = await this.prisma.recoveryPlan.create({
      data: {
        userId: data.userId,
        bodyPart: data.bodyPart,
        injuryType: data.injuryType,
        surgeryDate: data.surgeryDate,
      },
    });
    return RecoveryPlanMapper.toDomain(raw);
  }

  async updateStatus(
    id: string,
    status: RecoveryPlanStatus,
  ): Promise<RecoveryPlanEntity> {
    const raw = await this.prisma.recoveryPlan.update({
      where: { id },
      data: { status },
    });
    return RecoveryPlanMapper.toDomain(raw);
  }
}
