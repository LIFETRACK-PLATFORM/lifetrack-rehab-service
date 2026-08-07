import { AggregateRoot } from '../../../shared/domain/building-blocks/AggregateRoot';
import { InvalidRehabEntityDataError } from '../exceptions/rehab.errors';

export enum AppointmentType {
  THERAPY = 'THERAPY',
  MEDICAL = 'MEDICAL',
}

export type AppointmentProps = {
  recoveryPlanId: string;
  date: Date;
  provider: string;
  type: AppointmentType;
  notes?: string | null;
  attended?: boolean | null;
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
  get attended(): boolean | null | undefined {
    return this.props.attended;
  }
}
