export type UpdateExerciseInput = {
  userId: string;
  exerciseId: string;
  name: string;
  targetSets: number;
  targetReps: number;
  phase: number;
  daysOfWeek?: number[];
};
