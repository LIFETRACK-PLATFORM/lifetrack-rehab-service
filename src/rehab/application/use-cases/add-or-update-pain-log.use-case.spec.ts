import { AddOrUpdatePainLogUseCase } from './add-or-update-pain-log.use-case';
import { RecoveryPlanEntity, RecoveryPlanStatus } from '../../domain/entities/recovery-plan.entity';
import { PainLogEntity } from '../../domain/entities/pain-log.entity';
import { InvalidRehabEntityDataError, RecoveryPlanNotFoundError } from '../../domain/exceptions/rehab.errors';

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

describe('AddOrUpdatePainLogUseCase', () => {
  it('registra un nivel de dolor válido', async () => {
    const recoveryPlanRepository = { findByIdAndUserId: jest.fn().mockResolvedValue(buildPlan()) };
    const painLogRepository = {
      upsert: jest
        .fn()
        .mockImplementation((data) =>
          Promise.resolve(new PainLogEntity({ ...data, createdAt: new Date() }, 'pain-1')),
        ),
      listByRecoveryPlanInRange: jest.fn(),
    };
    const useCase = new AddOrUpdatePainLogUseCase(
      recoveryPlanRepository as any,
      painLogRepository as any,
    );

    const result = await useCase.execute({
      userId: 'user-1',
      recoveryPlanId: 'plan-1',
      date: '2026-08-06',
      level: 4,
    });

    expect(result.level).toBe(4);
    expect(painLogRepository.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ recoveryPlanId: 'plan-1', level: 4 }),
    );
  });

  it('rechaza un nivel de dolor fuera de rango antes de persistir', async () => {
    const recoveryPlanRepository = { findByIdAndUserId: jest.fn().mockResolvedValue(buildPlan()) };
    const painLogRepository = { upsert: jest.fn(), listByRecoveryPlanInRange: jest.fn() };
    const useCase = new AddOrUpdatePainLogUseCase(
      recoveryPlanRepository as any,
      painLogRepository as any,
    );

    await expect(
      useCase.execute({
        userId: 'user-1',
        recoveryPlanId: 'plan-1',
        date: '2026-08-06',
        level: 15,
      }),
    ).rejects.toBeInstanceOf(InvalidRehabEntityDataError);
    expect(painLogRepository.upsert).not.toHaveBeenCalled();
  });

  it('lanza RecoveryPlanNotFoundError si el plan no pertenece al usuario', async () => {
    const recoveryPlanRepository = { findByIdAndUserId: jest.fn().mockResolvedValue(null) };
    const painLogRepository = { upsert: jest.fn(), listByRecoveryPlanInRange: jest.fn() };
    const useCase = new AddOrUpdatePainLogUseCase(
      recoveryPlanRepository as any,
      painLogRepository as any,
    );

    await expect(
      useCase.execute({
        userId: 'other-user',
        recoveryPlanId: 'plan-1',
        date: '2026-08-06',
        level: 4,
      }),
    ).rejects.toBeInstanceOf(RecoveryPlanNotFoundError);
  });
});
