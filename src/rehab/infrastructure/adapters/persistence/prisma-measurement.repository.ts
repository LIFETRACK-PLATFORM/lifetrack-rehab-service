import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MeasurementEntity } from '../../../domain/entities/measurement.entity';
import type {
  CreateMeasurementInput,
  MeasurementRepositoryPort,
} from '../../../domain/ports/measurement.repository.port';
import { MeasurementMapper } from './measurement.mapper';

@Injectable()
export class PrismaMeasurementRepository implements MeasurementRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateMeasurementInput): Promise<MeasurementEntity> {
    const raw = await this.prisma.measurement.create({
      data: {
        recoveryPlanId: data.recoveryPlanId,
        type: data.type,
        value: data.value,
        unit: data.unit,
        date: data.date,
      },
    });
    return MeasurementMapper.toDomain(raw);
  }

  async listByRecoveryPlan(
    recoveryPlanId: string,
  ): Promise<MeasurementEntity[]> {
    const rows = await this.prisma.measurement.findMany({
      where: { recoveryPlanId },
    });
    return rows.map((row) => MeasurementMapper.toDomain(row));
  }
}
