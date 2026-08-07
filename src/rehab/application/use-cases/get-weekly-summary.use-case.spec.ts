import { GetWeeklySummaryUseCase } from './get-weekly-summary.use-case';
import {
  RecoveryPlanEntity,
  RecoveryPlanStatus,
} from '../../domain/entities/recovery-plan.entity';
import { ExerciseEntity } from '../../domain/entities/exercise.entity';
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
      targetSets: 3,
      targetReps: 10,
      phase: 1,
      daysOfWeek: [],
      createdAt: new Date(),
    },
    'exercise-daily',
  );
}

function completion(date: Date) {
  return new ExerciseCompletionEntity(
    { exerciseId: 'exercise-daily', date, createdAt: new Date() },
    `completion-${date.toISOString()}`,
  );
}

function buildUseCase(completions: ExerciseCompletionEntity[]) {
  const recoveryPlanRepository = {
    findByIdAndUserId: jest.fn().mockResolvedValue(buildPlan()),
  };
  const exerciseRepository = {
    findById: jest.fn(),
    create: jest.fn(),
    listByRecoveryPlan: jest.fn().mockResolvedValue([buildDailyExercise()]),
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
  };
  return new GetWeeklySummaryUseCase(
    recoveryPlanRepository as any,
    exerciseRepository as any,
    exerciseCompletionRepository,
    appointmentRepository,
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
});
