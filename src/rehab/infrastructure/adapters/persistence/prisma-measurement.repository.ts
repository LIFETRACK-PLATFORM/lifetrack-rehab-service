import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { MeasurementEntity } from '../../../domain/entities/measurement.entity';
import type {
  CreateMeasurementInput,
  MeasurementRepositoryPort,
  UpdateMeasurementInput,
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
        customLabel: data.customLabel,
        value: data.value,
        unit: data.unit,
        date: data.date,
      },
    });
    return MeasurementMapper.toDomain(raw);
  }

  async findById(id: string): Promise<MeasurementEntity | null> {
    const raw = await this.prisma.measurement.findUnique({ where: { id } });
    return raw ? MeasurementMapper.toDomain(raw) : null;
  }

  async updateById(
    id: string,
    data: UpdateMeasurementInput,
  ): Promise<MeasurementEntity> {
    const raw = await this.prisma.measurement.update({
      where: { id },
      data: {
        type: data.type,
        customLabel: data.customLabel,
        value: data.value,
        unit: data.unit,
        date: data.date,
      },
    });
    return MeasurementMapper.toDomain(raw);
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.measurement.delete({ where: { id } });
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
