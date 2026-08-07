import { DeleteMeasurementUseCase } from './delete-measurement.use-case';
import {
  RecoveryPlanEntity,
  RecoveryPlanStatus,
} from '../../domain/entities/recovery-plan.entity';
import {
  MeasurementEntity,
  MeasurementType,
} from '../../domain/entities/measurement.entity';
import {
  MeasurementNotFoundError,
  RecoveryPlanNotFoundError,
} from '../../domain/exceptions/rehab.errors';

function buildPlan(userId = 'user-1') {
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

function buildMeasurement() {
  return new MeasurementEntity(
    {
      recoveryPlanId: 'plan-1',
      type: MeasurementType.WEIGHT_KG,
      value: 80,
      unit: 'kg',
      date: new Date('2026-08-01'),
      createdAt: new Date(),
    },
    'measurement-1',
  );
}

function buildRepos({
  measurement = buildMeasurement(),
  plan = buildPlan(),
}: { measurement?: MeasurementEntity | null; plan?: RecoveryPlanEntity | null } = {}) {
  const measurementRepository = {
    create: jest.fn(),
    findById: jest.fn().mockResolvedValue(measurement),
    updateById: jest.fn(),
    deleteById: jest.fn().mockResolvedValue(undefined),
    listByRecoveryPlan: jest.fn(),
  };
  const recoveryPlanRepository = {
    findByIdAndUserId: jest.fn().mockResolvedValue(plan),
  };
  return { measurementRepository, recoveryPlanRepository };
}

describe('DeleteMeasurementUseCase', () => {
  it('elimina la medición cuando el usuario es dueño del plan', async () => {
    const { measurementRepository, recoveryPlanRepository } = buildRepos();
    const useCase = new DeleteMeasurementUseCase(
      measurementRepository as any,
      recoveryPlanRepository as any,
    );

    const result = await useCase.execute({
      userId: 'user-1',
      measurementId: 'measurement-1',
    });

    expect(measurementRepository.deleteById).toHaveBeenCalledWith(
      'measurement-1',
    );
    expect(result.deleted).toBe(true);
  });

  it('lanza MeasurementNotFoundError si la medición no existe', async () => {
    const { measurementRepository, recoveryPlanRepository } = buildRepos({
      measurement: null,
    });
    const useCase = new DeleteMeasurementUseCase(
      measurementRepository as any,
      recoveryPlanRepository as any,
    );

    await expect(
      useCase.execute({ userId: 'user-1', measurementId: 'missing' }),
    ).rejects.toThrow(MeasurementNotFoundError);
    expect(measurementRepository.deleteById).not.toHaveBeenCalled();
  });

  it('lanza RecoveryPlanNotFoundError si el plan no pertenece al usuario', async () => {
    const { measurementRepository, recoveryPlanRepository } = buildRepos({
      plan: null,
    });
    const useCase = new DeleteMeasurementUseCase(
      measurementRepository as any,
      recoveryPlanRepository as any,
    );

    await expect(
      useCase.execute({ userId: 'other-user', measurementId: 'measurement-1' }),
    ).rejects.toThrow(RecoveryPlanNotFoundError);
    expect(measurementRepository.deleteById).not.toHaveBeenCalled();
  });
});
