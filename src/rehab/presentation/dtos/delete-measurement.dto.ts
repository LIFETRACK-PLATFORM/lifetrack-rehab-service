import { IsUUID } from 'class-validator';

export class DeleteMeasurementDto {
  @IsUUID()
  measurementId!: string;
}
