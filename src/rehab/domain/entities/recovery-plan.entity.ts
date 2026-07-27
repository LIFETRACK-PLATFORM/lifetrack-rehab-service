import { AggregateRoot } from '../../../shared/domain/building-blocks/AggregateRoot';

export enum RecoveryPlanStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  PAUSED = 'PAUSED',
}

export type RecoveryPlanProps = {
  userId: string;
  bodyPart: string;
  injuryType: string;
  surgeryDate: Date;
  status: RecoveryPlanStatus;
  createdAt: Date;
  updatedAt: Date;
};

export class RecoveryPlanEntity extends AggregateRoot<RecoveryPlanProps> {
  constructor(props: RecoveryPlanProps, id?: string) {
    if (!props.userId) throw new Error('userId is required');
    if (!props.bodyPart) throw new Error('bodyPart is required');
    if (!props.injuryType) throw new Error('injuryType is required');
    super(props, id);
  }

  get userId(): string {
    return this.props.userId;
  }
  get bodyPart(): string {
    return this.props.bodyPart;
  }
  get injuryType(): string {
    return this.props.injuryType;
  }
  get surgeryDate(): Date {
    return this.props.surgeryDate;
  }
  get status(): RecoveryPlanStatus {
    return this.props.status;
  }

  isActive(): boolean {
    return this.props.status === RecoveryPlanStatus.ACTIVE;
  }
}
