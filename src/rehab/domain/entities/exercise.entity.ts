import { Entity } from '../../../shared/domain/building-blocks/Entity';

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
    if (!props.recoveryPlanId) throw new Error('recoveryPlanId is required');
    if (!props.name) throw new Error('name is required');
    if (props.targetSets <= 0) throw new Error('targetSets must be positive');
    if (props.targetReps <= 0) throw new Error('targetReps must be positive');
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
