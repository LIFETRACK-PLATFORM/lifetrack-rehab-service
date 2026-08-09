import {
  ExerciseEntity,
  ExerciseMetricType,
} from '../entities/exercise.entity';

export type CreateExerciseInput = {
  recoveryPlanId: string;
  name: string;
  metricType: ExerciseMetricType;
  targetSets: number;
  targetReps: number;
  targetDurationMinutes?: number | null;
  referenceMediaUrl?: string;
  notes?: string | null;
  daysOfWeek?: number[];
};

export type UpdateExerciseInput = {
  name: string;
  metricType: ExerciseMetricType;
  targetSets: number;
  targetReps: number;
  targetDurationMinutes?: number | null;
  notes?: string | null;
  daysOfWeek?: number[];
};

export interface ExerciseRepositoryPort {
  findById(id: string): Promise<ExerciseEntity | null>;
  create(data: CreateExerciseInput): Promise<ExerciseEntity>;
  update(id: string, data: UpdateExerciseInput): Promise<ExerciseEntity>;
  listByRecoveryPlan(recoveryPlanId: string): Promise<ExerciseEntity[]>;
  deleteById(id: string): Promise<void>;
}
