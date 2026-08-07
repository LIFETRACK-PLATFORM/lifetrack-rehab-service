import { UpdateMeasurementUseCase } from './update-measurement.use-case';
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
}: {
  measurement?: MeasurementEntity | null;
  plan?: RecoveryPlanEntity | null;
} = {}) {
  const measurementRepository = {
    create: jest.fn(),
    findById: jest.fn().mockResolvedValue(measurement),
    updateById: jest.fn().mockImplementation((id, data) =>
      Promise.resolve(
        new MeasurementEntity(
          {
            recoveryPlanId: measurement?.recoveryPlanId ?? 'plan-1',
            ...data,
            createdAt: new Date(),
          },
          id,
        ),
      ),
    ),
    deleteById: jest.fn(),
    listByRecoveryPlan: jest.fn(),
  };
  const recoveryPlanRepository = {
    findByIdAndUserId: jest.fn().mockResolvedValue(plan),
  };
  return { measurementRepository, recoveryPlanRepository };
}

describe('UpdateMeasurementUseCase', () => {
  it('actualiza la medición cuando el usuario es dueño del plan', async () => {
    const { measurementRepository, recoveryPlanRepository } = buildRepos();
    const useCase = new UpdateMeasurementUseCase(
      measurementRepository,
      recoveryPlanRepository as any,
    );

    const result = await useCase.execute({
      userId: 'user-1',
      measurementId: 'measurement-1',
      type: MeasurementType.WEIGHT_KG,
      value: 79,
      unit: 'kg',
      date: '2026-08-05T00:00:00.000Z',
    });

    expect(measurementRepository.updateById).toHaveBeenCalledWith(
      'measurement-1',
      expect.objectContaining({ value: 79 }),
    );
    expect(result.value).toBe(79);
  });

  it('lanza MeasurementNotFoundError si la medición no existe', async () => {
    const { measurementRepository, recoveryPlanRepository } = buildRepos({
      measurement: null,
    });
    const useCase = new UpdateMeasurementUseCase(
      measurementRepository,
      recoveryPlanRepository as any,
    );

    await expect(
      useCase.execute({
        userId: 'user-1',
        measurementId: 'missing',
        type: MeasurementType.WEIGHT_KG,
        value: 79,
        unit: 'kg',
        date: '2026-08-05T00:00:00.000Z',
      }),
    ).rejects.toThrow(MeasurementNotFoundError);
    expect(measurementRepository.updateById).not.toHaveBeenCalled();
  });

  it('lanza RecoveryPlanNotFoundError si el plan no pertenece al usuario', async () => {
    const { measurementRepository, recoveryPlanRepository } = buildRepos({
      plan: null,
    });
    const useCase = new UpdateMeasurementUseCase(
      measurementRepository,
      recoveryPlanRepository as any,
    );

    await expect(
      useCase.execute({
        userId: 'other-user',
        measurementId: 'measurement-1',
        type: MeasurementType.WEIGHT_KG,
        value: 79,
        unit: 'kg',
        date: '2026-08-05T00:00:00.000Z',
      }),
    ).rejects.toThrow(RecoveryPlanNotFoundError);
    expect(measurementRepository.updateById).not.toHaveBeenCalled();
  });
});
