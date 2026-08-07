import { ExerciseEntity, ExerciseMetricType } from './exercise.entity';

const baseProps = {
  recoveryPlanId: 'plan-1',
  name: 'Sentadilla',
  metricType: ExerciseMetricType.REPS,
  targetSets: 3,
  targetReps: 10,
  daysOfWeek: [] as number[],
  createdAt: new Date(),
};

describe('ExerciseEntity', () => {
  it('crea un ejercicio válido sin daysOfWeek (agendado todos los días)', () => {
    const exercise = new ExerciseEntity(baseProps);
    expect(exercise.daysOfWeek).toEqual([]);
    expect(exercise.isScheduledOn(0)).toBe(true);
    expect(exercise.isScheduledOn(6)).toBe(true);
  });

  it('crea un ejercicio agendado en días específicos', () => {
    const exercise = new ExerciseEntity({
      ...baseProps,
      daysOfWeek: [1, 3, 5],
    });
    expect(exercise.isScheduledOn(1)).toBe(true);
    expect(exercise.isScheduledOn(2)).toBe(false);
  });

  it('lanza error si daysOfWeek tiene días repetidos', () => {
    expect(
      () => new ExerciseEntity({ ...baseProps, daysOfWeek: [1, 1] }),
    ).toThrow('daysOfWeek no puede tener días repetidos');
  });

  it('lanza error si daysOfWeek tiene un valor fuera de rango', () => {
    expect(() => new ExerciseEntity({ ...baseProps, daysOfWeek: [7] })).toThrow(
      'daysOfWeek solo admite enteros entre 0 (domingo) y 6 (sábado)',
    );
  });

  it('lanza error si daysOfWeek tiene un valor negativo', () => {
    expect(
      () => new ExerciseEntity({ ...baseProps, daysOfWeek: [-1] }),
    ).toThrow('daysOfWeek solo admite enteros entre 0 (domingo) y 6 (sábado)');
  });

  it('crea un ejercicio de duración con targetDurationMinutes', () => {
    const exercise = new ExerciseEntity({
      ...baseProps,
      metricType: ExerciseMetricType.DURATION,
      targetDurationMinutes: 20,
    });
    expect(exercise.metricType).toBe(ExerciseMetricType.DURATION);
    expect(exercise.targetDurationMinutes).toBe(20);
  });

  it('lanza error si un ejercicio de duración no tiene targetDurationMinutes', () => {
    expect(
      () =>
        new ExerciseEntity({
          ...baseProps,
          metricType: ExerciseMetricType.DURATION,
        }),
    ).toThrow(
      'targetDurationMinutes debe ser positivo para ejercicios de duracion',
    );
  });
});
