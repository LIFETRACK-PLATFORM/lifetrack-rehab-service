import { IsDateString, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class AddPainLogDto {
  @IsString()
  recoveryPlanId: string;

  @IsDateString()
  date: string;

  @IsInt()
  @Min(0)
  @Max(10)
  level: number;

  @IsOptional()
  @IsString()
  note?: string;
}
