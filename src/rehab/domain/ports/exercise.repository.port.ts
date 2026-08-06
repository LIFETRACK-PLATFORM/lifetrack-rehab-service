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

export interface ExerciseRepositoryPort {
  findById(id: string): Promise<ExerciseEntity | null>;
  create(data: CreateExerciseInput): Promise<ExerciseEntity>;
  listByRecoveryPlan(recoveryPlanId: string): Promise<ExerciseEntity[]>;
  deleteById(id: string): Promise<void>;
}
