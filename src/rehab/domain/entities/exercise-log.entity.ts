import { AggregateRoot } from '../../../shared/domain/building-blocks/AggregateRoot';
import { InvalidRehabEntityDataError } from '../exceptions/rehab.errors';

export type ExerciseLogProps = {
  exerciseId: string;
  setsDone: number;
  repsDone: number;
  date: Date;
  createdAt: Date;
};

export class ExerciseLogEntity extends AggregateRoot<ExerciseLogProps> {
  constructor(props: ExerciseLogProps, id?: string) {
    if (!props.exerciseId)
      throw new InvalidRehabEntityDataError('exerciseId es obligatorio');
    if (props.setsDone < 0)
      throw new InvalidRehabEntityDataError('setsDone no puede ser negativo');
    if (props.repsDone < 0)
      throw new InvalidRehabEntityDataError('repsDone no puede ser negativo');
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
