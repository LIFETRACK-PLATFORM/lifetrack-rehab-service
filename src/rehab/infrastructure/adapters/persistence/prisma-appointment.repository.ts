import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AppointmentEntity } from '../../../domain/entities/appointment.entity';
import type {
  AppointmentRepositoryPort,
  CreateAppointmentInput,
  UpdateAppointmentInput,
} from '../../../domain/ports/appointment.repository.port';
import { AppointmentMapper } from './appointment.mapper';

@Injectable()
export class PrismaAppointmentRepository implements AppointmentRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAppointmentInput): Promise<AppointmentEntity> {
    const raw = await this.prisma.appointment.create({
      data: {
        recoveryPlanId: data.recoveryPlanId,
        title: data.title,
        date: data.date,
        provider: data.provider,
        type: data.type,
        notes: data.notes,
      },
    });
    return AppointmentMapper.toDomain(raw);
  }

  async createMany(
    data: CreateAppointmentInput[],
  ): Promise<AppointmentEntity[]> {
    const created = await this.prisma.$transaction(
      data.map((item) =>
        this.prisma.appointment.create({
          data: {
            recoveryPlanId: item.recoveryPlanId,
            title: item.title,
            date: item.date,
            provider: item.provider,
            type: item.type,
            notes: item.notes,
          },
        }),
      ),
    );
    return created.map((raw) => AppointmentMapper.toDomain(raw));
  }

  async updateById(
    id: string,
    data: UpdateAppointmentInput,
  ): Promise<AppointmentEntity> {
    const raw = await this.prisma.appointment.update({
      where: { id },
      data: {
        title: data.title,
        date: data.date,
        provider: data.provider,
        type: data.type,
        notes: data.notes,
        rescheduledFromDate: data.rescheduledFromDate,
        attended: data.attended,
      },
    });
    return AppointmentMapper.toDomain(raw);
  }

  async findById(id: string): Promise<AppointmentEntity | null> {
    const raw = await this.prisma.appointment.findUnique({ where: { id } });
    return raw ? AppointmentMapper.toDomain(raw) : null;
  }

  async updateAttendance(
    id: string,
    attended: boolean,
  ): Promise<AppointmentEntity> {
    const raw = await this.prisma.appointment.update({
      where: { id },
      data: { attended },
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

  async listByRecoveryPlanInRange(
    recoveryPlanId: string,
    from: Date,
    to: Date,
  ): Promise<AppointmentEntity[]> {
    const rows = await this.prisma.appointment.findMany({
      where: { recoveryPlanId, date: { gte: from, lte: to } },
    });
    return rows.map((row) => AppointmentMapper.toDomain(row));
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.appointment.delete({ where: { id } });
  }
}
