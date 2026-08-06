import {
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { AppointmentType } from '../../domain/entities/appointment.entity';

export class AddAppointmentDto {
  @IsString()
  recoveryPlanId: string;

  @IsDateString()
  date: string;

  @IsString()
  @MinLength(2)
  provider: string;

  @IsEnum(AppointmentType)
  type: AppointmentType;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(12)
  repeatWeeks?: number;
}
