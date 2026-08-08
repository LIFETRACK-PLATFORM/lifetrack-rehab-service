export type GetWeeklySummaryInput = {
  userId: string;
  recoveryPlanId: string;
  /** ISO date dentro de la semana a resumir; por defecto, hoy. */
  referenceDate?: string;
  /** Fecha "hoy" (YYYY-MM-DD) en la zona horaria local del cliente. */
  todayIso?: string;
};
