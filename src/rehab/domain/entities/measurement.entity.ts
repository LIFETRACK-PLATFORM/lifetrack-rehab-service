import { Entity } from '../../../shared/domain/building-blocks/Entity';
import { InvalidRehabEntityDataError } from '../exceptions/rehab.errors';

export enum MeasurementType {
  FLEXION_DEGREES = 'FLEXION_DEGREES',
  EXTENSION_DEGREES = 'EXTENSION_DEGREES',
  QUAD_CIRCUMFERENCE_CM = 'QUAD_CIRCUMFERENCE_CM',
  WEIGHT_KG = 'WEIGHT_KG',
  WAIST_CM = 'WAIST_CM',
  HIP_CM = 'HIP_CM',
  NECK_CM = 'NECK_CM',
  OTHER = 'OTHER',
}

export type MeasurementProps = {
  recoveryPlanId: string;
  type: MeasurementType;
  customLabel?: string | null;
  value: number;
  unit: string;
  date: Date;
  createdAt: Date;
};

export class MeasurementEntity extends Entity<MeasurementProps> {
  constructor(props: MeasurementProps, id?: string) {
    if (!props.recoveryPlanId)
      throw new InvalidRehabEntityDataError('recoveryPlanId es obligatorio');
    if (typeof props.value !== 'number' || Number.isNaN(props.value)) {
      throw new InvalidRehabEntityDataError('value debe ser un número');
    }
    if (props.value <= 0) {
      throw new InvalidRehabEntityDataError('value debe ser mayor a 0');
    }
    if (props.type === MeasurementType.OTHER && !props.customLabel?.trim()) {
      throw new InvalidRehabEntityDataError(
        'customLabel es obligatorio cuando type es OTHER',
      );
    }
    super(props, id);
  }

  get recoveryPlanId(): string {
    return this.props.recoveryPlanId;
  }
  get type(): MeasurementType {
    return this.props.type;
  }
  get customLabel(): string | null {
    return this.props.customLabel ?? null;
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
