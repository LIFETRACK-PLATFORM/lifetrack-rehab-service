import { Entity } from '../../../shared/domain/building-blocks/Entity';

export enum MeasurementType {
  FLEXION_DEGREES = 'FLEXION_DEGREES',
  EXTENSION_DEGREES = 'EXTENSION_DEGREES',
  QUAD_CIRCUMFERENCE_CM = 'QUAD_CIRCUMFERENCE_CM',
  WEIGHT_KG = 'WEIGHT_KG',
}

export type MeasurementProps = {
  recoveryPlanId: string;
  type: MeasurementType;
  value: number;
  unit: string;
  date: Date;
  createdAt: Date;
};

export class MeasurementEntity extends Entity<MeasurementProps> {
  constructor(props: MeasurementProps, id?: string) {
    if (!props.recoveryPlanId) throw new Error('recoveryPlanId is required');
    if (typeof props.value !== 'number' || Number.isNaN(props.value)) {
      throw new Error('value must be a number');
    }
    super(props, id);
  }

  get recoveryPlanId(): string {
    return this.props.recoveryPlanId;
  }
  get type(): MeasurementType {
    return this.props.type;
  }
  get value(): number {
    return this.props.value;
  }
  get unit(): string {
    return this.props.unit;
  }
  get date(): Date {
    return this.props.date;
  }
}
