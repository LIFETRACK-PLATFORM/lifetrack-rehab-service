import { Exercise as PrismaExercise } from 'generated/prisma/client';
import { ExerciseEntity } from '../../../domain/entities/exercise.entity';

export class ExerciseMapper {
  static toDomain(raw: PrismaExercise): ExerciseEntity {
    return new ExerciseEntity(
      {
        recoveryPlanId: raw.recoveryPlanId,
        name: raw.name,
        targetSets: raw.targetSets,
        targetReps: raw.targetReps,
        referenceMediaUrl: raw.referenceMediaUrl,
        phase: raw.phase,
        daysOfWeek: raw.daysOfWeek,
        createdAt: raw.createdAt,
      },
      raw.id,
    );
  }
}
