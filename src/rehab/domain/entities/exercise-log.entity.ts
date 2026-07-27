import { AggregateRoot } from '../../../shared/domain/building-blocks/AggregateRoot';

export type ExerciseLogProps = {
  exerciseId: string;
  setsDone: number;
  repsDone: number;
  date: Date;
  createdAt: Date;
};

export class ExerciseLogEntity extends AggregateRoot<ExerciseLogProps> {
  constructor(props: ExerciseLogProps, id?: string) {
    if (!props.exerciseId) throw new Error('exerciseId is required');
    if (props.setsDone < 0) throw new Error('setsDone cannot be negative');
    if (props.repsDone < 0) throw new Error('repsDone cannot be negative');
    super(props, id);
  }

  get exerciseId(): string {
    return this.props.exerciseId;
  }
  get setsDone(): number {
    return this.props.setsDone;
  }
  get repsDone(): number {
    return this.props.repsDone;
  }
  get date(): Date {
    return this.props.date;
  }
}
