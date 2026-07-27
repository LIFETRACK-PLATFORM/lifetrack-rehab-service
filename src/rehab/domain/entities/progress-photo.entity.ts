import { Entity } from '../../../shared/domain/building-blocks/Entity';

export type ProgressPhotoProps = {
  recoveryPlanId: string;
  photoUrl: string;
  date: Date;
  createdAt: Date;
};

export class ProgressPhotoEntity extends Entity<ProgressPhotoProps> {
  constructor(props: ProgressPhotoProps, id?: string) {
    if (!props.recoveryPlanId) throw new Error('recoveryPlanId is required');
    if (!props.photoUrl) throw new Error('photoUrl is required');
    super(props, id);
  }

  get recoveryPlanId(): string {
    return this.props.recoveryPlanId;
  }
  get photoUrl(): string {
    return this.props.photoUrl;
  }
  get date(): Date {
    return this.props.date;
  }
}
