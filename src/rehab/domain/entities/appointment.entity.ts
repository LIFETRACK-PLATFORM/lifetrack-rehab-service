import { AggregateRoot } from '../../../shared/domain/building-blocks/AggregateRoot';
import { InvalidRehabEntityDataError } from '../exceptions/rehab.errors';

export enum AppointmentType {
  THERAPY = 'THERAPY',
  MEDICAL = 'MEDICAL',
}

export type AppointmentProps = {
  recoveryPlanId: string;
  title?: string | null;
  date: Date;
  provider: string;
  notes?: string | null;
  location?: string | null;
  type: AppointmentType;
  attended?: boolean | null;
  rescheduledFromDate?: Date | null;
  createdAt: Date;
};

export class AppointmentEntity extends AggregateRoot<AppointmentProps> {
  constructor(props: AppointmentProps, id?: string) {
    if (!props.recoveryPlanId)
      throw new InvalidRehabEntityDataError('recoveryPlanId es obligatorio');
    if (!props.provider)
      throw new InvalidRehabEntityDataError('provider es obligatorio');
    if (!Object.values(AppointmentType).includes(props.type)) {
      throw new InvalidRehabEntityDataError('type debe ser THERAPY o MEDICAL');
    }
    super(props, id);
  }

  get recoveryPlanId(): string {
    return this.props.recoveryPlanId;
  }
  get title(): string | null | undefined {
    return this.props.title;
  }
  get date(): Date {
    return this.props.date;
  }
  get provider(): string {
    return this.props.provider;
  }
  get type(): AppointmentType {
    return this.props.type;
  }
  get notes(): string | null | undefined {
    return this.props.notes;
  }
  get location(): string | null | undefined {
    return this.props.location;
  }
  get attended(): boolean | null | undefined {
    return this.props.attended;
  }
  get rescheduledFromDate(): Date | null | undefined {
    return this.props.rescheduledFromDate;
  }
}
