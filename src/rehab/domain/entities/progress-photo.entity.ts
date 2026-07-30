import { Entity } from '../../../shared/domain/building-blocks/Entity';
import { InvalidRehabEntityDataError } from '../exceptions/rehab.errors';

export type ProgressPhotoProps = {
  recoveryPlanId: string;
  photoUrl: string;
  date: Date;
  createdAt: Date;
};

export class ProgressPhotoEntity extends Entity<ProgressPhotoProps> {
  constructor(props: ProgressPhotoProps, id?: string) {
    if (!props.recoveryPlanId)
      throw new InvalidRehabEntityDataError('recoveryPlanId es obligatorio');
    if (!props.photoUrl)
      throw new InvalidRehabEntityDataError('photoUrl es obligatorio');
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
