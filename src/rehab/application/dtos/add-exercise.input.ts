import type { ExerciseMetricType } from '../../domain/entities/exercise.entity';

export type AddExerciseInput = {
  userId: string;
  recoveryPlanId: string;
  name: string;
  metricType: ExerciseMetricType;
  targetSets: number;
  targetReps: number;
  targetDurationMinutes?: number;
  referenceMediaUrl?: string;
  notes?: string;
  daysOfWeek?: number[];
};
