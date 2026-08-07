import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  ValidateIf,
} from 'class-validator';
import { MeasurementType } from '../../domain/entities/measurement.entity';

export class AddMeasurementDto {
  @IsString()
  recoveryPlanId: string;

  @IsEnum(MeasurementType)
  type: MeasurementType;

  @ValidateIf((o: AddMeasurementDto) => o.type === MeasurementType.OTHER)
  @IsNotEmpty({ message: 'customLabel es obligatorio cuando type es OTHER' })
  @IsString()
  customLabel?: string;

  @IsNumber()
  @IsPositive()
  value: number;

  @IsString()
  unit: string;

  @IsDateString()
  date: string;
}
