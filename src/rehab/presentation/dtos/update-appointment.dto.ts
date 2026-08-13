import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { AppointmentType } from '../../domain/entities/appointment.entity';

export class UpdateAppointmentDto {
  @IsString()
  appointmentId: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  title?: string;

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
  @IsString()
  location?: string;
}
