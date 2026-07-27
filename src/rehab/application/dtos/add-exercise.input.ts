export type AddExerciseInput = {
  userId: string;
  recoveryPlanId: string;
  name: string;
  targetSets: number;
  targetReps: number;
  referenceMediaUrl?: string;
  phase: number;
};
