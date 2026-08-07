import type { ExerciseMetricType } from '../../domain/entities/exercise.entity';

export type UpdateExerciseInput = {
  userId: string;
  exerciseId: string;
  name: string;
  metricType: ExerciseMetricType;
  targetSets: number;
  targetReps: number;
  targetDurationMinutes?: number;
  notes?: string;
  daysOfWeek?: number[];
};
