/** Trunca una fecha a medianoche UTC (día calendario, sin hora). */
export function startOfDay(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

export function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

export function isSameDay(a: Date, b: Date): boolean {
  return startOfDay(a).getTime() === startOfDay(b).getTime();
}

/** 0 = domingo ... 6 = sábado, consistente con `Exercise.daysOfWeek`. */
export function dayOfWeek(date: Date): number {
  return date.getUTCDay();
}

/** Domingo de la semana calendario (0=domingo) que contiene `date`. */
export function startOfWeek(date: Date): Date {
  return addDays(startOfDay(date), -dayOfWeek(date));
}

/**
 * Día calendario "hoy" según el cliente (zona horaria local del usuario).
 * Sin `todayIso` cae a la fecha UTC del servidor (compatibilidad).
 */
export function resolveToday(todayIso?: string): Date {
  return todayIso ? startOfDay(new Date(todayIso)) : startOfDay(new Date());
}
