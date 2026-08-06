import { MarkExerciseCompletionUseCase } from './mark-exercise-completion.use-case';
import { ExerciseEntity } from '../../domain/entities/exercise.entity';
import {
  RecoveryPlanEntity,
  RecoveryPlanStatus,
} from '../../domain/entities/recovery-plan.entity';
import {
  ExerciseNotFoundError,
  RecoveryPlanNotFoundError,
} from '../../domain/exceptions/rehab.errors';

function buildExercise() {
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
    'exercise-1',
  );
}

function buildPlan(userId: string) {
  return new RecoveryPlanEntity(
    {
      userId,
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

describe('MarkExerciseCompletionUseCase', () => {
  it('marca un ejercicio como cumplido cuando el plan pertenece al usuario', async () => {
    const exerciseRepository = {
      findById: jest.fn().mockResolvedValue(buildExercise()),
    };
    const recoveryPlanRepository = {
      findByIdAndUserId: jest.fn().mockResolvedValue(buildPlan('user-1')),
    };
    const exerciseCompletionRepository = {
      markCompleted: jest.fn().mockResolvedValue({}),
      unmarkCompleted: jest.fn(),
    };

    const useCase = new MarkExerciseCompletionUseCase(
      exerciseRepository as any,
      recoveryPlanRepository as any,
      exerciseCompletionRepository as any,
    );

    const result = await useCase.execute({
      userId: 'user-1',
      exerciseId: 'exercise-1',
      date: '2026-08-06',
      completed: true,
    });

    expect(exerciseCompletionRepository.markCompleted).toHaveBeenCalledWith({
      exerciseId: 'exercise-1',
      date: new Date('2026-08-06'),
    });
    expect(result.completed).toBe(true);
  });

  it('desmarca un ejercicio cuando completed es false', async () => {
    const exerciseRepository = {
      findById: jest.fn().mockResolvedValue(buildExercise()),
    };
    const recoveryPlanRepository = {
      findByIdAndUserId: jest.fn().mockResolvedValue(buildPlan('user-1')),
    };
    const exerciseCompletionRepository = {
      markCompleted: jest.fn(),
      unmarkCompleted: jest.fn().mockResolvedValue(undefined),
    };

    const useCase = new MarkExerciseCompletionUseCase(
      exerciseRepository as any,
      recoveryPlanRepository as any,
      exerciseCompletionRepository as any,
    );

    await useCase.execute({
      userId: 'user-1',
      exerciseId: 'exercise-1',
      date: '2026-08-06',
      completed: false,
    });

    expect(exerciseCompletionRepository.unmarkCompleted).toHaveBeenCalledWith(
      'exercise-1',
      new Date('2026-08-06'),
    );
    expect(exerciseCompletionRepository.markCompleted).not.toHaveBeenCalled();
  });

  it('lanza ExerciseNotFoundError si el ejercicio no existe', async () => {
    const exerciseRepository = { findById: jest.fn().mockResolvedValue(null) };
    const recoveryPlanRepository = { findByIdAndUserId: jest.fn() };
    const exerciseCompletionRepository = {
      markCompleted: jest.fn(),
      unmarkCompleted: jest.fn(),
    };

    const useCase = new MarkExerciseCompletionUseCase(
      exerciseRepository as any,
      recoveryPlanRepository as any,
      exerciseCompletionRepository as any,
    );

    await expect(
      useCase.execute({
        userId: 'user-1',
        exerciseId: 'missing',
        date: '2026-08-06',
        completed: true,
      }),
    ).rejects.toBeInstanceOf(ExerciseNotFoundError);
  });

  it('lanza RecoveryPlanNotFoundError si el ejercicio pertenece a un plan de otro usuario', async () => {
    const exerciseRepository = {
      findById: jest.fn().mockResolvedValue(buildExercise()),
    };
    const recoveryPlanRepository = {
      findByIdAndUserId: jest.fn().mockResolvedValue(null),
    };
    const exerciseCompletionRepository = {
      markCompleted: jest.fn(),
      unmarkCompleted: jest.fn(),
    };

    const useCase = new MarkExerciseCompletionUseCase(
      exerciseRepository as any,
      recoveryPlanRepository as any,
      exerciseCompletionRepository as any,
    );

    await expect(
      useCase.execute({
        userId: 'other-user',
        exerciseId: 'exercise-1',
        date: '2026-08-06',
        completed: true,
      }),
    ).rejects.toBeInstanceOf(RecoveryPlanNotFoundError);
    expect(exerciseCompletionRepository.markCompleted).not.toHaveBeenCalled();
  });
});
