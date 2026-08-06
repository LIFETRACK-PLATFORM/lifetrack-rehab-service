import { Entity } from '../../../shared/domain/building-blocks/Entity';
import { InvalidRehabEntityDataError } from '../exceptions/rehab.errors';

export type PainLogProps = {
  recoveryPlanId: string;
  date: Date;
  level: number;
  note?: string | null;
  createdAt: Date;
};

export class PainLogEntity extends Entity<PainLogProps> {
  constructor(props: PainLogProps, id?: string) {
    if (!props.recoveryPlanId)
      throw new InvalidRehabEntityDataError('recoveryPlanId es obligatorio');
    if (!Number.isInteger(props.level) || props.level < 0 || props.level > 10) {
      throw new InvalidRehabEntityDataError(
        'level debe ser un entero entre 0 y 10',
      );
    }
    super(props, id);
  }

  get recoveryPlanId(): string {
    return this.props.recoveryPlanId;
  }
  get date(): Date {
    return this.props.date;
  }
  get level(): number {
    return this.props.level;
  }
  get note(): string | null | undefined {
    return this.props.note;
  }
}
