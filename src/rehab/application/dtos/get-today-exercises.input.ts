export type GetTodayExercisesInput = {
  userId: string;
  recoveryPlanId: string;
  /** Fecha "hoy" (YYYY-MM-DD) en la zona horaria local del cliente. */
  todayIso?: string;
};
