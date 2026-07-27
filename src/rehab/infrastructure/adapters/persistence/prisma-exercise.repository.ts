import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ExerciseEntity } from '../../../domain/entities/exercise.entity';
import type {
  CreateExerciseInput,
  ExerciseRepositoryPort,
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
        targetSets: data.targetSets,
        targetReps: data.targetReps,
        referenceMediaUrl: data.referenceMediaUrl,
        phase: data.phase,
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
}
