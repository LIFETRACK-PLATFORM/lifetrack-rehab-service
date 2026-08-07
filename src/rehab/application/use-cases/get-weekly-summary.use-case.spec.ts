import { GetWeeklySummaryUseCase } from './get-weekly-summary.use-case';
import {
  RecoveryPlanEntity,
  RecoveryPlanStatus,
} from '../../domain/entities/recovery-plan.entity';
import {
  ExerciseEntity,
  ExerciseMetricType,
} from '../../domain/entities/exercise.entity';
import { ExerciseCompletionEntity } from '../../domain/entities/exercise-completion.entity';
import { addDays, startOfDay } from '../utils/schedule.util';

function buildPlan() {
  return new RecoveryPlanEntity(
    {
      userId: 'user-1',
      bodyPart: 'rodilla',
      injuryType: 'LCA',
      surgeryDate: new Date(),
      status: RecoveryPlanStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    'plan-1',
  );
}

function buildDailyExercise() {
  return new ExerciseEntity(
    {
      recoveryPlanId: 'plan-1',
      name: 'Sentadilla',
      metricType: ExerciseMetricType.REPS,
      targetSets: 3,
      targetReps: 10,
      daysOfWeek: [],
      createdAt: new Date(),
    },
    'exercise-daily',
  );
}

function buildWeekdayExercise(id: string, daysOfWeek: number[]) {
  return new ExerciseEntity(
    {
      recoveryPlanId: 'plan-1',
      name: 'Ejercicio de lunes',
      metricType: ExerciseMetricType.REPS,
      targetSets: 3,
      targetReps: 10,
      daysOfWeek,
      createdAt: new Date(),
    },
    id,
  );
}

function completion(date: Date, exerciseId = 'exercise-daily') {
  return new ExerciseCompletionEntity(
    { exerciseId, date, createdAt: new Date() },
    `completion-${exerciseId}-${date.toISOString()}`,
  );
}

function buildUseCase(
  completions: ExerciseCompletionEntity[],
  exercises: ExerciseEntity[] = [buildDailyExercise()],
  adHocProtocolDays: { targetDate: Date; sourceDate: Date }[] = [],
) {
  const recoveryPlanRepository = {
    findByIdAndUserId: jest.fn().mockResolvedValue(buildPlan()),
  };
  const exerciseRepository = {
    findById: jest.fn(),
    create: jest.fn(),
    listByRecoveryPlan: jest.fn().mockResolvedValue(exercises),
  };
  const exerciseCompletionRepository = {
    markCompleted: jest.fn(),
    unmarkCompleted: jest.fn(),
    listByExerciseIds: jest.fn().mockResolvedValue(completions),
  };
  const appointmentRepository = {
    create: jest.fn(),
    createMany: jest.fn(),
    listByRecoveryPlan: jest.fn(),
    listByRecoveryPlanInRange: jest.fn().mockResolvedValue([]),
    findById: jest.fn(),
    updateAttendance: jest.fn(),
    deleteById: jest.fn(),
    updateById: jest.fn(),
  };
  const adHocProtocolDayRepository = {
    upsert: jest.fn(),
    deleteByPlanAndTargetDate: jest.fn(),
    listByRecoveryPlan: jest.fn().mockResolvedValue(
      adHocProtocolDays.map((d, i) => ({
        id: `adhoc-${i}`,
        recoveryPlanId: 'plan-1',
        targetDate: d.targetDate,
        sourceDate: d.sourceDate,
      })),
    ),
  };
  return new GetWeeklySummaryUseCase(
    recoveryPlanRepository as any,
    exerciseRepository as any,
    exerciseCompletionRepository,
    appointmentRepository,
    adHocProtocolDayRepository,
  );
}

describe('GetWeeklySummaryUseCase', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-08-06T12:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('cuenta la racha incluyendo hoy cuando ya se cumplió', async () => {
    const today = startOfDay(new Date());
    const completions = [
      completion(today),
      completion(addDays(today, -1)),
      completion(addDays(today, -2)),
      // addDays(today, -3) queda sin completar -> corta la racha
    ];
    const useCase = buildUseCase(completions);

    const result = await useCase.execute({
      userId: 'user-1',
      recoveryPlanId: 'plan-1',
    });

    expect(result.streakDays).toBe(3);
  });

  it('no rompe la racha si hoy todavía no se completó', async () => {
    const today = startOfDay(new Date());
    const completions = [
      completion(addDays(today, -1)),
      completion(addDays(today, -2)),
      // hoy sin completar todavía
    ];
    const useCase = buildUseCase(completions);

    const result = await useCase.execute({
      userId: 'user-1',
      recoveryPlanId: 'plan-1',
    });

    expect(result.streakDays).toBe(2);
  });

  it('la racha es 0 si ayer estaba agendado y no se cumplió', async () => {
    const useCase = buildUseCase([]);

    const result = await useCase.execute({
      userId: 'user-1',
      recoveryPlanId: 'plan-1',
    });

    expect(result.streakDays).toBe(0);
  });

  it('calcula el porcentaje de cumplimiento solo sobre días evaluables (no futuros, con ejercicios debidos)', async () => {
    const today = startOfDay(new Date());
    // Cumple hoy y ayer; los demás días evaluables de la semana (pasados) quedan incumplidos.
    const completions = [completion(today), completion(addDays(today, -1))];
    const useCase = buildUseCase(completions);

    const result = await useCase.execute({
      userId: 'user-1',
      recoveryPlanId: 'plan-1',
    });

    const evaluableDays = result.days.filter((d) => d.due > 0 && !d.isFuture);
    const compliantDays = evaluableDays.filter((d) => d.compliant);
    const expectedPercent = Math.round(
      (compliantDays.length / evaluableDays.length) * 100,
    );
    expect(result.weeklyCompliancePercent).toBe(expectedPercent);
    expect(result.days).toHaveLength(7);
  });

  describe('protocolo prestado (ad-hoc)', () => {
    // 2026-08-06 es jueves (dow 4); 2026-08-03 es lunes (dow 1).
    const thursday = startOfDay(new Date('2026-08-06T00:00:00.000Z'));
    const monday = startOfDay(new Date('2026-08-03T00:00:00.000Z'));
    const mondayExercise = buildWeekdayExercise('exercise-monday', [1]);

    it('un día prestado completado en su totalidad cuenta como cumplido', async () => {
      const completions = [completion(thursday, 'exercise-monday')];
      const useCase = buildUseCase(
        completions,
        [mondayExercise],
        [{ targetDate: thursday, sourceDate: monday }],
      );

      const result = await useCase.execute({
        userId: 'user-1',
        recoveryPlanId: 'plan-1',
      });

      const today = result.days.find((d) => d.date === '2026-08-06');
      expect(today).toEqual({
        date: '2026-08-06',
        due: 1,
        completed: 1,
        compliant: true,
        isFuture: false,
      });
    });

    it('un día prestado completado parcialmente no cuenta como cumplido', async () => {
      const secondMondayExercise = buildWeekdayExercise(
        'exercise-monday-2',
        [1],
      );
      const completions = [completion(thursday, 'exercise-monday')];
      const useCase = buildUseCase(
        completions,
        [mondayExercise, secondMondayExercise],
        [{ targetDate: thursday, sourceDate: monday }],
      );

      const result = await useCase.execute({
        userId: 'user-1',
        recoveryPlanId: 'plan-1',
      });

      const today = result.days.find((d) => d.date === '2026-08-06');
      expect(today?.due).toBe(2);
      expect(today?.completed).toBe(1);
      expect(today?.compliant).toBe(false);
    });

    it('la racha no se corta por un día prestado completado (y sin el fix daría 0)', async () => {
      const completions = [completion(thursday, 'exercise-monday')];
      const useCase = buildUseCase(
        completions,
        [mondayExercise],
        [{ targetDate: thursday, sourceDate: monday }],
      );

      const result = await useCase.execute({
        userId: 'user-1',
        recoveryPlanId: 'plan-1',
      });

      // Sin el fix, isDayCompliant usaría dayOfWeek(thursday) en vez del
      // dayOfWeek(monday) prestado: mondayExercise no está agendado los
      // jueves -> due=0 ese día -> se salta sin sumar -> streakDays sería 0.
      expect(result.streakDays).toBe(1);
    });
  });
});
