export type GetWeeklySummaryInput = {
  userId: string;
  recoveryPlanId: string;
  /** ISO date dentro de la semana a resumir; por defecto, hoy. */
  referenceDate?: string;
};
