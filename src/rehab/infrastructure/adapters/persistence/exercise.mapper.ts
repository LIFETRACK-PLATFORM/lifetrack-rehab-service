import { Exercise as PrismaExercise } from 'generated/prisma/client';
import {
  ExerciseEntity,
  ExerciseMetricType,
} from '../../../domain/entities/exercise.entity';

export class ExerciseMapper {
  static toDomain(raw: PrismaExercise): ExerciseEntity {
    return new ExerciseEntity(
      {
        recoveryPlanId: raw.recoveryPlanId,
        name: raw.name,
        metricType: raw.metricType as ExerciseMetricType,
        targetSets: raw.targetSets,
        targetReps: raw.targetReps,
        targetDurationMinutes: raw.targetDurationMinutes,
        referenceMediaUrl: raw.referenceMediaUrl,
        notes: raw.notes,
        daysOfWeek: raw.daysOfWeek,
        createdAt: raw.createdAt,
      },
      raw.id,
    );
  }
}
