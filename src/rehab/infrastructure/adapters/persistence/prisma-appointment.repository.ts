import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AppointmentEntity } from '../../../domain/entities/appointment.entity';
import type {
  AppointmentRepositoryPort,
  CreateAppointmentInput,
} from '../../../domain/ports/appointment.repository.port';
import { AppointmentMapper } from './appointment.mapper';

@Injectable()
export class PrismaAppointmentRepository implements AppointmentRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAppointmentInput): Promise<AppointmentEntity> {
    const raw = await this.prisma.appointment.create({
      data: {
        recoveryPlanId: data.recoveryPlanId,
        date: data.date,
        provider: data.provider,
        notes: data.notes,
      },
    });
    return AppointmentMapper.toDomain(raw);
  }

  async listByRecoveryPlan(
    recoveryPlanId: string,
  ): Promise<AppointmentEntity[]> {
    const rows = await this.prisma.appointment.findMany({
      where: { recoveryPlanId },
    });
    return rows.map((row) => AppointmentMapper.toDomain(row));
  }
}
