import { RecoveryPlanEntity, RecoveryPlanStatus } from './recovery-plan.entity';

const baseProps = {
  userId: 'user-1',
  bodyPart: 'rodilla derecha',
  injuryType: 'ligamento cruzado anterior',
  surgeryDate: new Date('2026-01-15'),
  status: RecoveryPlanStatus.ACTIVE,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('RecoveryPlanEntity', () => {
  it('crea un plan de recuperación válido con sus props', () => {
    const plan = new RecoveryPlanEntity(baseProps);

    expect(plan.userId).toBe(baseProps.userId);
    expect(plan.bodyPart).toBe(baseProps.bodyPart);
    expect(plan.injuryType).toBe(baseProps.injuryType);
  });

  it('lanza error si falta el userId', () => {
    expect(() => new RecoveryPlanEntity({ ...baseProps, userId: '' })).toThrow(
      'userId es obligatorio',
    );
  });

  it('lanza error si falta el bodyPart', () => {
    expect(
      () => new RecoveryPlanEntity({ ...baseProps, bodyPart: '' }),
    ).toThrow('bodyPart es obligatorio');
  });

  it('lanza error si falta el injuryType', () => {
    expect(
      () => new RecoveryPlanEntity({ ...baseProps, injuryType: '' }),
    ).toThrow('injuryType es obligatorio');
  });

  it('isActive() retorna true cuando el status es ACTIVE', () => {
    const plan = new RecoveryPlanEntity(baseProps);
    expect(plan.isActive()).toBe(true);
  });

  it('isActive() retorna false cuando el status no es ACTIVE', () => {
    const plan = new RecoveryPlanEntity({
      ...baseProps,
      status: RecoveryPlanStatus.PAUSED,
    });
    expect(plan.isActive()).toBe(false);
  });
});
