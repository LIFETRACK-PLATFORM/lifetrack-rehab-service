import { IsDateString, IsString } from 'class-validator';

export class ListPainLogsDto {
  @IsString()
  recoveryPlanId: string;

  @IsDateString()
  from: string;

  @IsDateString()
  to: string;
}
