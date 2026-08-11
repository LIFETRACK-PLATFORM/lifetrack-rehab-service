import { IsUUID } from 'class-validator';

export class DeleteRecoveryPlanDto {
  @IsUUID()
  recoveryPlanId!: string;
}

