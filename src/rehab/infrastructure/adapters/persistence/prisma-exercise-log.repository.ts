import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ExerciseLogEntity } from '../../../domain/entities/exercise-log.entity';
import type {
  CreateExerciseLogInput,
  ExerciseLogRepositoryPort,
} from '../../../domain/ports/exercise-log.repository.port';
import { ExerciseLogMapper } from './exercise-log.mapper';
import { addDays, startOfDay } from '../../../application/utils/schedule.util';

@Injectable()
export class PrismaExerciseLogRepository implements ExerciseLogRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateExerciseLogInput): Promise<ExerciseLogEntity> {
    const raw = await this.prisma.exerciseLog.create({
      data: {
        exerciseId: data.exerciseId,
        setsDone: data.setsDone,
        repsDone: data.repsDone,
        date: data.date,
      },
    });
    return ExerciseLogMapper.toDomain(raw);
  }

  async upsertForDay(data: CreateExerciseLogInput): Promise<ExerciseLogEntity> {
    const dayStart = startOfDay(data.date);
    const dayEnd = addDays(dayStart, 1);

    const existing = await this.prisma.exerciseLog.findFirst({
      where: {
        exerciseId: data.exerciseId,
        date: { gte: dayStart, lt: dayEnd },
      },
    });

    const raw = existing
      ? await this.prisma.exerciseLog.update({
          where: { id: existing.id },
          data: { setsDone: data.setsDone, repsDone: data.repsDone },
        })
      : await this.prisma.exerciseLog.create({
          data: {
            exerciseId: data.exerciseId,
            setsDone: data.setsDone,
            repsDone: data.repsDone,
            date: data.date,
          },
        });
    return ExerciseLogMapper.toDomain(raw);
  }

  async listByExercise(exerciseId: string): Promise<ExerciseLogEntity[]> {
    const rows = await this.prisma.exerciseLog.findMany({
      where: { exerciseId },
    });
    return rows.map((row) => ExerciseLogMapper.toDomain(row));
  }
}
