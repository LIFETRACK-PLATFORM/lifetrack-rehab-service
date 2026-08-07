import { Entity } from '../../../shared/domain/building-blocks/Entity';
import { InvalidRehabEntityDataError } from '../exceptions/rehab.errors';

export enum ExerciseMetricType {
  REPS = 'REPS',
  DURATION = 'DURATION',
}

export type ExerciseProps = {
  recoveryPlanId: string;
  name: string;
  metricType: ExerciseMetricType;
  targetSets: number;
  targetReps: number;
  targetDurationMinutes?: number | null;
  referenceMediaUrl?: string | null;
  notes?: string | null;
  daysOfWeek: number[];
  createdAt: Date;
};

export class ExerciseEntity extends Entity<ExerciseProps> {
  constructor(props: ExerciseProps, id?: string) {
    if (!props.recoveryPlanId)
      throw new InvalidRehabEntityDataError('recoveryPlanId es obligatorio');
    if (!props.name)
      throw new InvalidRehabEntityDataError('name es obligatorio');
    if (
      !Object.values(ExerciseMetricType).includes(props.metricType)
    ) {
      throw new InvalidRehabEntityDataError(
        'metricType debe ser REPS o DURATION',
      );
    }
    if (props.metricType === ExerciseMetricType.DURATION) {
      if (!props.targetDurationMinutes || props.targetDurationMinutes <= 0) {
        throw new InvalidRehabEntityDataError(
          'targetDurationMinutes debe ser positivo para ejercicios de duracion',
        );
      }
    } else {
      if (props.targetSets <= 0)
        throw new InvalidRehabEntityDataError('targetSets debe ser positivo');
      if (props.targetReps <= 0)
        throw new InvalidRehabEntityDataError('targetReps debe ser positivo');
    }
    const daysOfWeek = props.daysOfWeek ?? [];
    if (new Set(daysOfWeek).size !== daysOfWeek.length) {
      throw new InvalidRehabEntityDataError(
        'daysOfWeek no puede tener días repetidos',
      );
    }
    if (
      daysOfWeek.some((day) => !Number.isInteger(day) || day < 0 || day > 6)
    ) {
      throw new InvalidRehabEntityDataError(
        'daysOfWeek solo admite enteros entre 0 (domingo) y 6 (sábado)',
      );
    }
    super({ ...props, daysOfWeek }, id);
  }

  get recoveryPlanId(): string {
    return this.props.recoveryPlanId;
  }
  get name(): string {
    return this.props.name;
  }
  get targetSets(): number {
    return this.props.targetSets;
  }
  get targetReps(): number {
    return this.props.targetReps;
  }
  get referenceMediaUrl(): string | null | undefined {
    return this.props.referenceMediaUrl;
  }
  get metricType(): ExerciseMetricType {
    return this.props.metricType;
  }
  get targetDurationMinutes(): number | null | undefined {
    return this.props.targetDurationMinutes;
  }
  get notes(): string | null | undefined {
    return this.props.notes;
  }
  get daysOfWeek(): number[] {
    return this.props.daysOfWeek;
  }

  /** Array vacío = agendado todos los días. */
  isScheduledOn(dayOfWeek: number): boolean {
    return (
      this.props.daysOfWeek.length === 0 ||
      this.props.daysOfWeek.includes(dayOfWeek)
    );
  }
}
