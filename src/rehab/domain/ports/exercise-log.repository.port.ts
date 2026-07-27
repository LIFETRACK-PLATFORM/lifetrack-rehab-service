import { ExerciseLogEntity } from '../entities/exercise-log.entity';

export type CreateExerciseLogInput = {
  exerciseId: string;
  setsDone: number;
  repsDone: number;
  date: Date;
};

export interface ExerciseLogRepositoryPort {
  create(data: CreateExerciseLogInput): Promise<ExerciseLogEntity>;
  listByExercise(exerciseId: string): Promise<ExerciseLogEntity[]>;
}
