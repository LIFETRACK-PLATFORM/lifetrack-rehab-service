import { Controller, UseFilters } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import type { Metadata } from '@grpc/grpc-js';
import { CreateRecoveryPlanUseCase } from '../../application/use-cases/create-recovery-plan.use-case';
import { ListRecoveryPlansByUserUseCase } from '../../application/use-cases/list-recovery-plans-by-user.use-case';
import { AddExerciseUseCase } from '../../application/use-cases/add-exercise.use-case';
import { LogExerciseUseCase } from '../../application/use-cases/log-exercise.use-case';
import { AddAppointmentUseCase } from '../../application/use-cases/add-appointment.use-case';
import { AddMeasurementUseCase } from '../../application/use-cases/add-measurement.use-case';
import { AddProgressPhotoUseCase } from '../../application/use-cases/add-progress-photo.use-case';
import { ListRecoveryProgressUseCase } from '../../application/use-cases/list-recovery-progress.use-case';
import { CreateRecoveryPlanDto } from '../dtos/create-recovery-plan.dto';
import { AddExerciseDto } from '../dtos/add-exercise.dto';
import { LogExerciseDto } from '../dtos/log-exercise.dto';
import { AddAppointmentDto } from '../dtos/add-appointment.dto';
import { AddMeasurementDto } from '../dtos/add-measurement.dto';
import { AddProgressPhotoDto } from '../dtos/add-progress-photo.dto';
import { ListRecoveryProgressDto } from '../dtos/list-recovery-progress.dto';
import { DomainExceptionFilter } from '../filters/domain-exception.filter';
import { getAuthenticatedUserId } from '../auth/grpc-auth.context';

@Controller()
@UseFilters(DomainExceptionFilter)
export class RehabController {
  constructor(
    private readonly createRecoveryPlanUseCase: CreateRecoveryPlanUseCase,
    private readonly listRecoveryPlansByUserUseCase: ListRecoveryPlansByUserUseCase,
    private readonly addExerciseUseCase: AddExerciseUseCase,
    private readonly logExerciseUseCase: LogExerciseUseCase,
    private readonly addAppointmentUseCase: AddAppointmentUseCase,
    private readonly addMeasurementUseCase: AddMeasurementUseCase,
    private readonly addProgressPhotoUseCase: AddProgressPhotoUseCase,
    private readonly listRecoveryProgressUseCase: ListRecoveryProgressUseCase,
  ) {}

  @GrpcMethod('RehabService', 'CreateRecoveryPlan')
  createRecoveryPlan(data: CreateRecoveryPlanDto, metadata: Metadata) {
    const userId = getAuthenticatedUserId(metadata);
    return this.createRecoveryPlanUseCase.execute({
      userId,
      bodyPart: data.bodyPart,
      injuryType: data.injuryType,
      surgeryDate: data.surgeryDate,
    });
  }

  @GrpcMethod('RehabService', 'ListRecoveryPlansByUser')
  listRecoveryPlansByUser(_data: Record<string, never>, metadata: Metadata) {
    const userId = getAuthenticatedUserId(metadata);
    return this.listRecoveryPlansByUserUseCase.execute(userId);
  }

  @GrpcMethod('RehabService', 'AddExercise')
  addExercise(data: AddExerciseDto, metadata: Metadata) {
    const userId = getAuthenticatedUserId(metadata);
    return this.addExerciseUseCase.execute({ userId, ...data });
  }

  @GrpcMethod('RehabService', 'LogExercise')
  logExercise(data: LogExerciseDto, metadata: Metadata) {
    const userId = getAuthenticatedUserId(metadata);
    return this.logExerciseUseCase.execute({ userId, ...data });
  }

  @GrpcMethod('RehabService', 'AddAppointment')
  addAppointment(data: AddAppointmentDto, metadata: Metadata) {
    const userId = getAuthenticatedUserId(metadata);
    return this.addAppointmentUseCase.execute({ userId, ...data });
  }

  @GrpcMethod('RehabService', 'AddMeasurement')
  addMeasurement(data: AddMeasurementDto, metadata: Metadata) {
    const userId = getAuthenticatedUserId(metadata);
    return this.addMeasurementUseCase.execute({ userId, ...data });
  }

  @GrpcMethod('RehabService', 'AddProgressPhoto')
  addProgressPhoto(data: AddProgressPhotoDto, metadata: Metadata) {
    const userId = getAuthenticatedUserId(metadata);
    return this.addProgressPhotoUseCase.execute({ userId, ...data });
  }

  @GrpcMethod('RehabService', 'ListRecoveryProgress')
  listRecoveryProgress(data: ListRecoveryProgressDto, metadata: Metadata) {
    const userId = getAuthenticatedUserId(metadata);
    return this.listRecoveryProgressUseCase.execute({
      userId,
      recoveryPlanId: data.recoveryPlanId,
    });
  }
}
