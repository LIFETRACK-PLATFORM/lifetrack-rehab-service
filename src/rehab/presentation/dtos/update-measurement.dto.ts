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

export class UpdateMeasurementDto {
  @IsString()
  measurementId: string;

  @IsEnum(MeasurementType)
  type: MeasurementType;

  @ValidateIf((o: UpdateMeasurementDto) => o.type === MeasurementType.OTHER)
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
