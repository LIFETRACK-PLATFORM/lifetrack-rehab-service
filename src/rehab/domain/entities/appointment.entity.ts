import { AggregateRoot } from '../../../shared/domain/building-blocks/AggregateRoot';
import { InvalidRehabEntityDataError } from '../exceptions/rehab.errors';

export type AppointmentProps = {
  recoveryPlanId: string;
  date: Date;
  provider: string;
  notes?: string | null;
  createdAt: Date;
};

export class AppointmentEntity extends AggregateRoot<AppointmentProps> {
  constructor(props: AppointmentProps, id?: string) {
    if (!props.recoveryPlanId)
      throw new InvalidRehabEntityDataError('recoveryPlanId es obligatorio');
    if (!props.provider)
      throw new InvalidRehabEntityDataError('provider es obligatorio');
    super(props, id);
  }

  get recoveryPlanId(): string {
    return this.props.recoveryPlanId;
  }
  get date(): Date {
    return this.props.date;
  }
  get provider(): string {
    return this.props.provider;
  }
  get notes(): string | null | undefined {
    return this.props.notes;
  }
}
