export interface SetAdHocProtocolDayInput {
  userId: string;
  recoveryPlanId: string;
  targetDate: string;
  sourceDate: string;
  /** Fecha "hoy" (YYYY-MM-DD) en la zona horaria local del cliente. */
  todayIso?: string;
}
