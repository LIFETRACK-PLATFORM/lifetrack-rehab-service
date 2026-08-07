import { IsUUID } from 'class-validator';

export class DeleteAppointmentDto {
  @IsUUID()
  appointmentId!: string;
}
