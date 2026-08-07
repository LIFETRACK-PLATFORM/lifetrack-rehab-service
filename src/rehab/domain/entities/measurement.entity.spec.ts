import { MeasurementEntity, MeasurementType } from './measurement.entity';

const baseProps = {
  recoveryPlanId: 'plan-1',
  type: MeasurementType.WEIGHT_KG,
  value: 80,
  unit: 'kg',
  date: new Date('2026-08-01'),
  createdAt: new Date(),
};

describe('MeasurementEntity', () => {
  it('crea una medición válida', () => {
    const measurement = new MeasurementEntity(baseProps);
    expect(measurement.value).toBe(80);
    expect(measurement.type).toBe(MeasurementType.WEIGHT_KG);
  });

  it.each([
    MeasurementType.WAIST_CM,
    MeasurementType.HIP_CM,
    MeasurementType.NECK_CM,
  ])('acepta el tipo general %s', (type) => {
    expect(
      () => new MeasurementEntity({ ...baseProps, type, unit: 'cm' }),
    ).not.toThrow();
  });

  it('lanza error si value no es un número', () => {
    expect(
      () =>
        new MeasurementEntity({
          ...baseProps,
          value: Number.NaN,
        }),
    ).toThrow('value debe ser un número');
  });

  it('lanza error si value es 0', () => {
    expect(() => new MeasurementEntity({ ...baseProps, value: 0 })).toThrow(
      'value debe ser mayor a 0',
    );
  });

  it('lanza error si value es negativo', () => {
    expect(() => new MeasurementEntity({ ...baseProps, value: -5 })).toThrow(
      'value debe ser mayor a 0',
    );
  });

  it('lanza error si falta recoveryPlanId', () => {
    expect(
      () => new MeasurementEntity({ ...baseProps, recoveryPlanId: '' }),
    ).toThrow('recoveryPlanId es obligatorio');
  });
});
