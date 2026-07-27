import { IsString } from 'class-validator';

export class ListRecoveryProgressDto {
  @IsString()
  recoveryPlanId: string;
}
