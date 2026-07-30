import { Entity } from '../../../shared/domain/building-blocks/Entity';
import { InvalidRehabEntityDataError } from '../exceptions/rehab.errors';

export type ExerciseProps = {
  recoveryPlanId: string;
  name: string;
  targetSets: number;
  targetReps: number;
  referenceMediaUrl?: string | null;
  phase: number;
  createdAt: Date;
};

export class ExerciseEntity extends Entity<ExerciseProps> {
  constructor(props: ExerciseProps, id?: string) {
    if (!props.recoveryPlanId)
      throw new InvalidRehabEntityDataError('recoveryPlanId es obligatorio');
    if (!props.name)
      throw new InvalidRehabEntityDataError('name es obligatorio');
    if (props.targetSets <= 0)
      throw new InvalidRehabEntityDataError('targetSets debe ser positivo');
    if (props.targetReps <= 0)
      throw new InvalidRehabEntityDataError('targetReps debe ser positivo');
    super(props, id);
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
  get phase(): number {
    return this.props.phase;
  }
}
