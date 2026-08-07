import { IsIn, IsUUID } from 'class-validator';

export class UpdateRecoveryPlanStatusDto {
  @IsUUID()
  recoveryPlanId!: string;

  @IsIn(['ACTIVE', 'COMPLETED', 'PAUSED'])
  status!: string;
}
