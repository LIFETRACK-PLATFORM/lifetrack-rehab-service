import { ExerciseEntity } from '../entities/exercise.entity';

export type CreateExerciseInput = {
  recoveryPlanId: string;
  name: string;
  targetSets: number;
  targetReps: number;
  referenceMediaUrl?: string;
  phase: number;
  daysOfWeek?: number[];
};

export type UpdateExerciseInput = {
  name: string;
  targetSets: number;
  targetReps: number;
  phase: number;
  daysOfWeek?: number[];
};

export interface ExerciseRepositoryPort {
  findById(id: string): Promise<ExerciseEntity | null>;
  create(data: CreateExerciseInput): Promise<ExerciseEntity>;
  update(id: string, data: UpdateExerciseInput): Promise<ExerciseEntity>;
  listByRecoveryPlan(recoveryPlanId: string): Promise<ExerciseEntity[]>;
  deleteById(id: string): Promise<void>;
}
