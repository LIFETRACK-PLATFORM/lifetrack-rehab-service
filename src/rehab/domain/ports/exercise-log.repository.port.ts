import { ExerciseLogEntity } from '../entities/exercise-log.entity';

export type CreateExerciseLogInput = {
  exerciseId: string;
  setsDone: number;
  repsDone: number;
  date: Date;
};

export interface ExerciseLogRepositoryPort {
  create(data: CreateExerciseLogInput): Promise<ExerciseLogEntity>;
  /**
   * Crea o reemplaza el log del día para el ejercicio: como máximo una fila
   * por (exerciseId, día calendario), para que el progreso no se acumule
   * sumando snapshots de días distintos.
   */
  upsertForDay(data: CreateExerciseLogInput): Promise<ExerciseLogEntity>;
  listByExercise(exerciseId: string): Promise<ExerciseLogEntity[]>;
}
