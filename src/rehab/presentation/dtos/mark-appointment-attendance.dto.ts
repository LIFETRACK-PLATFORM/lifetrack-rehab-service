import { IsBoolean, IsString } from 'class-validator';

export class MarkAppointmentAttendanceDto {
  @IsString()
  appointmentId: string;

  @IsBoolean()
  attended: boolean;
}
