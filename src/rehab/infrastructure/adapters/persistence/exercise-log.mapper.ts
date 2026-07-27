import { ExerciseLog as PrismaExerciseLog } from 'generated/prisma/client';
import { ExerciseLogEntity } from '../../../domain/entities/exercise-log.entity';

export class ExerciseLogMapper {
  static toDomain(raw: PrismaExerciseLog): ExerciseLogEntity {
    return new ExerciseLogEntity(
      {
        exerciseId: raw.exerciseId,
        setsDone: raw.setsDone,
        repsDone: raw.repsDone,
        date: raw.date,
        createdAt: raw.createdAt,
      },
      raw.id,
    );
  }
}
