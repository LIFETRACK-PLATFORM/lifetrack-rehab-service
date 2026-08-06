import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PainLogEntity } from '../../../domain/entities/pain-log.entity';
import type {
  PainLogRepositoryPort,
  UpsertPainLogInput,
} from '../../../domain/ports/pain-log.repository.port';
import { PainLogMapper } from './pain-log.mapper';

@Injectable()
export class PrismaPainLogRepository implements PainLogRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async upsert(data: UpsertPainLogInput): Promise<PainLogEntity> {
    const raw = await this.prisma.painLog.upsert({
      where: {
        recoveryPlanId_date: {
          recoveryPlanId: data.recoveryPlanId,
          date: data.date,
        },
      },
      create: {
        recoveryPlanId: data.recoveryPlanId,
        date: data.date,
        level: data.level,
        note: data.note,
      },
      update: { level: data.level, note: data.note },
    });
    return PainLogMapper.toDomain(raw);
  }

  async listByRecoveryPlanInRange(
    recoveryPlanId: string,
    from: Date,
    to: Date,
  ): Promise<PainLogEntity[]> {
    const rows = await this.prisma.painLog.findMany({
      where: { recoveryPlanId, date: { gte: from, lte: to } },
      orderBy: { date: 'asc' },
    });
    return rows.map((row) => PainLogMapper.toDomain(row));
  }
}
