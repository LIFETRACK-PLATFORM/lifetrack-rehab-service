import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ExerciseEntity } from '../../../domain/entities/exercise.entity';
import type {
  CreateExerciseInput,
  ExerciseRepositoryPort,
  UpdateExerciseInput,
} from '../../../domain/ports/exercise.repository.port';
import { ExerciseMapper } from './exercise.mapper';

@Injectable()
export class PrismaExerciseRepository implements ExerciseRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<ExerciseEntity | null> {
    const raw = await this.prisma.exercise.findUnique({ where: { id } });
    return raw ? ExerciseMapper.toDomain(raw) : null;
  }

  async create(data: CreateExerciseInput): Promise<ExerciseEntity> {
    const raw = await this.prisma.exercise.create({
      data: {
        recoveryPlanId: data.recoveryPlanId,
        name: data.name,
        metricType: data.metricType,
        targetSets: data.targetSets,
        targetReps: data.targetReps,
        targetDurationMinutes: data.targetDurationMinutes,
        referenceMediaUrl: data.referenceMediaUrl,
        notes: data.notes,
        daysOfWeek: data.daysOfWeek ?? [],
      },
    });
    return ExerciseMapper.toDomain(raw);
  }

  async update(id: string, data: UpdateExerciseInput): Promise<ExerciseEntity> {
    const raw = await this.prisma.exercise.update({
      where: { id },
      data: {
        name: data.name,
        metricType: data.metricType,
        targetSets: data.targetSets,
        targetReps: data.targetReps,
        targetDurationMinutes: data.targetDurationMinutes,
        notes: data.notes,
        daysOfWeek: data.daysOfWeek ?? [],
      },
    });
    return ExerciseMapper.toDomain(raw);
  }

  async listByRecoveryPlan(recoveryPlanId: string): Promise<ExerciseEntity[]> {
    const rows = await this.prisma.exercise.findMany({
      where: { recoveryPlanId },
    });
    return rows.map((row) => ExerciseMapper.toDomain(row));
  }

  async deleteById(id: string): Promise<void> {
    await this.prisma.$transaction([
      this.prisma.exerciseLog.deleteMany({ where: { exerciseId: id } }),
      this.prisma.exerciseCompletion.deleteMany({ where: { exerciseId: id } }),
      this.prisma.exercise.delete({ where: { id } }),
    ]);
  }
}
