import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ExerciseCompletionEntity } from '../../../domain/entities/exercise-completion.entity';
import type {
  ExerciseCompletionRepositoryPort,
  MarkExerciseCompletionInput,
} from '../../../domain/ports/exercise-completion.repository.port';
import { ExerciseCompletionMapper } from './exercise-completion.mapper';

@Injectable()
export class PrismaExerciseCompletionRepository
  implements ExerciseCompletionRepositoryPort
{
  constructor(private readonly prisma: PrismaService) {}

  async markCompleted(
    data: MarkExerciseCompletionInput,
  ): Promise<ExerciseCompletionEntity> {
    const raw = await this.prisma.exerciseCompletion.upsert({
      where: {
        exerciseId_date: { exerciseId: data.exerciseId, date: data.date },
      },
      create: { exerciseId: data.exerciseId, date: data.date },
      update: {},
    });
    return ExerciseCompletionMapper.toDomain(raw);
  }

  async unmarkCompleted(exerciseId: string, date: Date): Promise<void> {
    await this.prisma.exerciseCompletion.deleteMany({
      where: { exerciseId, date },
    });
  }

  async listByExerciseIds(
    exerciseIds: string[],
    range?: { from: Date; to: Date },
  ): Promise<ExerciseCompletionEntity[]> {
    if (exerciseIds.length === 0) return [];
    const rows = await this.prisma.exerciseCompletion.findMany({
      where: {
        exerciseId: { in: exerciseIds },
        ...(range ? { date: { gte: range.from, lte: range.to } } : {}),
      },
    });
    return rows.map((row) => ExerciseCompletionMapper.toDomain(row));
  }
}
