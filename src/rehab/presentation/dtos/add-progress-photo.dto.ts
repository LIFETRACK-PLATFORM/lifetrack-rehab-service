import { IsDateString, IsString } from 'class-validator';

export class AddProgressPhotoDto {
  @IsString()
  recoveryPlanId: string;

  @IsString()
  photoUrl: string;

  @IsDateString()
  date: string;
}
