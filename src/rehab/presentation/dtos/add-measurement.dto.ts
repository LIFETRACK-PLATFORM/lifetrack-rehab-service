import { IsDateString, IsEnum, IsNumber, IsString } from 'class-validator';
import { MeasurementType } from '../../domain/entities/measurement.entity';

export class AddMeasurementDto {
  @IsString()
  recoveryPlanId: string;

  @IsEnum(MeasurementType)
  type: MeasurementType;

  @IsNumber()
  value: number;

  @IsString()
  unit: string;

  @IsDateString()
  date: string;
}
