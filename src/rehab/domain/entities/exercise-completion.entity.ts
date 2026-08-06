import { Entity } from '../../../shared/domain/building-blocks/Entity';
import { InvalidRehabEntityDataError } from '../exceptions/rehab.errors';

export type ExerciseCompletionProps = {
  exerciseId: string;
  date: Date;
  createdAt: Date;
};

export class ExerciseCompletionEntity extends Entity<ExerciseCompletionProps> {
  constructor(props: ExerciseCompletionProps, id?: string) {
    if (!props.exerciseId)
      throw new InvalidRehabEntityDataError('exerciseId es obligatorio');
    super(props, id);
  }

  get exerciseId(): string {
    return this.props.exerciseId;
  }
  get date(): Date {
    return this.props.date;
  }
}
