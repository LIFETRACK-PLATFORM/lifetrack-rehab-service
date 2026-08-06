import { ExerciseCompletion as PrismaExerciseCompletion } from 'generated/prisma/client';
import { ExerciseCompletionEntity } from '../../../domain/entities/exercise-completion.entity';

export class ExerciseCompletionMapper {
  static toDomain(
    raw: PrismaExerciseCompletion,
  ): ExerciseCompletionEntity {
    return new ExerciseCompletionEntity(
      {
        exerciseId: raw.exerciseId,
        date: raw.date,
        createdAt: raw.createdAt,
      },
      raw.id,
    );
  }
}
