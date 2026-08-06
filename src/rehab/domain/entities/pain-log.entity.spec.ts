import { PainLogEntity } from './pain-log.entity';

const baseProps = {
  recoveryPlanId: 'plan-1',
  date: new Date('2026-08-01'),
  level: 5,
  createdAt: new Date(),
};

describe('PainLogEntity', () => {
  it('crea un registro de dolor válido', () => {
    const log = new PainLogEntity(baseProps);
    expect(log.level).toBe(5);
  });

  it('acepta los límites 0 y 10', () => {
    expect(() => new PainLogEntity({ ...baseProps, level: 0 })).not.toThrow();
    expect(() => new PainLogEntity({ ...baseProps, level: 10 })).not.toThrow();
  });

  it('lanza error si level es negativo', () => {
    expect(() => new PainLogEntity({ ...baseProps, level: -1 })).toThrow(
      'level debe ser un entero entre 0 y 10',
    );
  });

  it('lanza error si level supera 10', () => {
    expect(() => new PainLogEntity({ ...baseProps, level: 11 })).toThrow(
      'level debe ser un entero entre 0 y 10',
    );
  });

  it('lanza error si level no es entero', () => {
    expect(() => new PainLogEntity({ ...baseProps, level: 5.5 })).toThrow(
      'level debe ser un entero entre 0 y 10',
    );
  });

  it('lanza error si falta recoveryPlanId', () => {
    expect(
      () => new PainLogEntity({ ...baseProps, recoveryPlanId: '' }),
    ).toThrow('recoveryPlanId es obligatorio');
  });
});
