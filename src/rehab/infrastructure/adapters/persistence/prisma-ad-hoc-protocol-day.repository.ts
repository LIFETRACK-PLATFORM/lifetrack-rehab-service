import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AdHocProtocolDayEntity } from '../../../domain/entities/ad-hoc-protocol-day.entity';
import type {
  AdHocProtocolDayRepositoryPort,
  UpsertAdHocProtocolDayInput,
} from '../../../domain/ports/ad-hoc-protocol-day.repository.port';
import { AdHocProtocolDayMapper } from './ad-hoc-protocol-day.mapper';

@Injectable()
export class PrismaAdHocProtocolDayRepository implements AdHocProtocolDayRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async upsert(
    data: UpsertAdHocProtocolDayInput,
  ): Promise<AdHocProtocolDayEntity> {
    const raw = await this.prisma.adHocProtocolDay.upsert({
      where: {
        recoveryPlanId_targetDate: {
          recoveryPlanId: data.recoveryPlanId,
          targetDate: data.targetDate,
        },
      },
      create: {
        recoveryPlanId: data.recoveryPlanId,
        targetDate: data.targetDate,
        sourceDate: data.sourceDate,
      },
      update: { sourceDate: data.sourceDate },
    });
    return AdHocProtocolDayMapper.toDomain(raw);
  }

  async deleteByPlanAndTargetDate(
    recoveryPlanId: string,
    targetDate: Date,
  ): Promise<void> {
    await this.prisma.adHocProtocolDay.deleteMany({
      where: { recoveryPlanId, targetDate },
    });
  }

  async listByRecoveryPlan(
    recoveryPlanId: string,
  ): Promise<AdHocProtocolDayEntity[]> {
    const rows = await this.prisma.adHocProtocolDay.findMany({
      where: { recoveryPlanId },
      orderBy: { targetDate: 'asc' },
    });
    return rows.map((row) => AdHocProtocolDayMapper.toDomain(row));
  }
}
