import { Controller, UseFilters } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import type { Metadata } from '@grpc/grpc-js';
import { CreateRecoveryPlanUseCase } from '../../application/use-cases/create-recovery-plan.use-case';
import { ListRecoveryPlansByUserUseCase } from '../../application/use-cases/list-recovery-plans-by-user.use-case';
import { UpdateRecoveryPlanStatusUseCase } from '../../application/use-cases/update-recovery-plan-status.use-case';
import { DeleteRecoveryPlanUseCase } from '../../application/use-cases/delete-recovery-plan.use-case';
import { AddExerciseUseCase } from '../../application/use-cases/add-exercise.use-case';
import { DeleteExerciseUseCase } from '../../application/use-cases/delete-exercise.use-case';
import { UpdateExerciseUseCase } from '../../application/use-cases/update-exercise.use-case';
import { LogExerciseUseCase } from '../../application/use-cases/log-exercise.use-case';
import { AddAppointmentUseCase } from '../../application/use-cases/add-appointment.use-case';
import { MarkAppointmentAttendanceUseCase } from '../../application/use-cases/mark-appointment-attendance.use-case';
import { UpdateAppointmentUseCase } from '../../application/use-cases/update-appointment.use-case';
import { DeleteAppointmentUseCase } from '../../application/use-cases/delete-appointment.use-case';
import { AddMeasurementUseCase } from '../../application/use-cases/add-measurement.use-case';
import { UpdateMeasurementUseCase } from '../../application/use-cases/update-measurement.use-case';
import { DeleteMeasurementUseCase } from '../../application/use-cases/delete-measurement.use-case';
import { AddProgressPhotoUseCase } from '../../application/use-cases/add-progress-photo.use-case';
import { ListRecoveryProgressUseCase } from '../../application/use-cases/list-recovery-progress.use-case';
import { MarkExerciseCompletionUseCase } from '../../application/use-cases/mark-exercise-completion.use-case';
import { GetTodayExercisesUseCase } from '../../application/use-cases/get-today-exercises.use-case';
import { GetWeeklySummaryUseCase } from '../../application/use-cases/get-weekly-summary.use-case';
import { AddOrUpdatePainLogUseCase } from '../../application/use-cases/add-or-update-pain-log.use-case';
import { ListPainLogsUseCase } from '../../application/use-cases/list-pain-logs.use-case';
import { SetAdHocProtocolDayUseCase } from '../../application/use-cases/set-ad-hoc-protocol-day.use-case';
import { ClearAdHocProtocolDayUseCase } from '../../application/use-cases/clear-ad-hoc-protocol-day.use-case';
import { CreateRecoveryPlanDto } from '../dtos/create-recovery-plan.dto';
import { UpdateRecoveryPlanStatusDto } from '../dtos/update-recovery-plan-status.dto';
import { DeleteRecoveryPlanDto } from '../dtos/delete-recovery-plan.dto';
import { AddExerciseDto } from '../dtos/add-exercise.dto';
import { DeleteExerciseDto } from '../dtos/delete-exercise.dto';
import { UpdateExerciseDto } from '../dtos/update-exercise.dto';
import { LogExerciseDto } from '../dtos/log-exercise.dto';
import { AddAppointmentDto } from '../dtos/add-appointment.dto';
import { MarkAppointmentAttendanceDto } from '../dtos/mark-appointment-attendance.dto';
import { UpdateAppointmentDto } from '../dtos/update-appointment.dto';
import { DeleteAppointmentDto } from '../dtos/delete-appointment.dto';
import { AddMeasurementDto } from '../dtos/add-measurement.dto';
import { UpdateMeasurementDto } from '../dtos/update-measurement.dto';
import { DeleteMeasurementDto } from '../dtos/delete-measurement.dto';
import { AddProgressPhotoDto } from '../dtos/add-progress-photo.dto';
import { ListRecoveryProgressDto } from '../dtos/list-recovery-progress.dto';
import { MarkExerciseCompletionDto } from '../dtos/mark-exercise-completion.dto';
import { GetTodayExercisesDto } from '../dtos/get-today-exercises.dto';
import { GetWeeklySummaryDto } from '../dtos/get-weekly-summary.dto';
import { AddPainLogDto } from '../dtos/add-pain-log.dto';
import { ListPainLogsDto } from '../dtos/list-pain-logs.dto';
import {
  ClearAdHocProtocolDayDto,
  SetAdHocProtocolDayDto,
} from '../dtos/ad-hoc-protocol-day.dto';
import { DomainExceptionFilter } from '../filters/domain-exception.filter';
import { getAuthenticatedUserId } from '../auth/grpc-auth.context';

@Controller()
@UseFilters(DomainExceptionFilter)
export class RehabController {
  constructor(
    private readonly createRecoveryPlanUseCase: CreateRecoveryPlanUseCase,
    private readonly listRecoveryPlansByUserUseCase: ListRecoveryPlansByUserUseCase,
    private readonly updateRecoveryPlanStatusUseCase: UpdateRecoveryPlanStatusUseCase,
    private readonly deleteRecoveryPlanUseCase: DeleteRecoveryPlanUseCase,
    private readonly addExerciseUseCase: AddExerciseUseCase,
    private readonly deleteExerciseUseCase: DeleteExerciseUseCase,
    private readonly updateExerciseUseCase: UpdateExerciseUseCase,
    private readonly logExerciseUseCase: LogExerciseUseCase,
    private readonly addAppointmentUseCase: AddAppointmentUseCase,
    private readonly markAppointmentAttendanceUseCase: MarkAppointmentAttendanceUseCase,
    private readonly updateAppointmentUseCase: UpdateAppointmentUseCase,
    private readonly deleteAppointmentUseCase: DeleteAppointmentUseCase,
    private readonly addMeasurementUseCase: AddMeasurementUseCase,
    private readonly updateMeasurementUseCase: UpdateMeasurementUseCase,
    private readonly deleteMeasurementUseCase: DeleteMeasurementUseCase,
    private readonly addProgressPhotoUseCase: AddProgressPhotoUseCase,
    private readonly listRecoveryProgressUseCase: ListRecoveryProgressUseCase,
    private readonly markExerciseCompletionUseCase: MarkExerciseCompletionUseCase,
    private readonly getTodayExercisesUseCase: GetTodayExercisesUseCase,
    private readonly getWeeklySummaryUseCase: GetWeeklySummaryUseCase,
    private readonly addOrUpdatePainLogUseCase: AddOrUpdatePainLogUseCase,
    private readonly listPainLogsUseCase: ListPainLogsUseCase,
    private readonly setAdHocProtocolDayUseCase: SetAdHocProtocolDayUseCase,
    private readonly clearAdHocProtocolDayUseCase: ClearAdHocProtocolDayUseCase,
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

  @GrpcMethod('RehabService', 'UpdateRecoveryPlanStatus')
  updateRecoveryPlanStatus(
    data: UpdateRecoveryPlanStatusDto,
    metadata: Metadata,
  ) {
    const userId = getAuthenticatedUserId(metadata);
    return this.updateRecoveryPlanStatusUseCase.execute({
      userId,
      recoveryPlanId: data.recoveryPlanId,
      status: data.status,
    });
  }

  @GrpcMethod('RehabService', 'DeleteRecoveryPlan')
  deleteRecoveryPlan(data: DeleteRecoveryPlanDto, metadata: Metadata) {
    const userId = getAuthenticatedUserId(metadata);
    return this.deleteRecoveryPlanUseCase.execute({
      userId,
      recoveryPlanId: data.recoveryPlanId,
    });
  }

  @GrpcMethod('RehabService', 'AddExercise')
  addExercise(data: AddExerciseDto, metadata: Metadata) {
    const userId = getAuthenticatedUserId(metadata);
    return this.addExerciseUseCase.execute({ userId, ...data });
  }

  @GrpcMethod('RehabService', 'DeleteExercise')
  deleteExercise(data: DeleteExerciseDto, metadata: Metadata) {
    const userId = getAuthenticatedUserId(metadata);
    return this.deleteExerciseUseCase.execute({
      userId,
      exerciseId: data.exerciseId,
    });
  }

  @GrpcMethod('RehabService', 'UpdateExercise')
  updateExercise(data: UpdateExerciseDto, metadata: Metadata) {
    const userId = getAuthenticatedUserId(metadata);
    return this.updateExerciseUseCase.execute({ userId, ...data });
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

  @GrpcMethod('RehabService', 'MarkAppointmentAttendance')
  markAppointmentAttendance(
    data: MarkAppointmentAttendanceDto,
    metadata: Metadata,
  ) {
    const userId = getAuthenticatedUserId(metadata);
    return this.markAppointmentAttendanceUseCase.execute({
      userId,
      ...data,
    });
  }

  @GrpcMethod('RehabService', 'UpdateAppointment')
  updateAppointment(data: UpdateAppointmentDto, metadata: Metadata) {
    const userId = getAuthenticatedUserId(metadata);
    return this.updateAppointmentUseCase.execute({ userId, ...data });
  }

  @GrpcMethod('RehabService', 'DeleteAppointment')
  deleteAppointment(data: DeleteAppointmentDto, metadata: Metadata) {
    const userId = getAuthenticatedUserId(metadata);
    return this.deleteAppointmentUseCase.execute({
      userId,
      appointmentId: data.appointmentId,
    });
  }

  @GrpcMethod('RehabService', 'AddMeasurement')
  addMeasurement(data: AddMeasurementDto, metadata: Metadata) {
    const userId = getAuthenticatedUserId(metadata);
    return this.addMeasurementUseCase.execute({ userId, ...data });
  }

  @GrpcMethod('RehabService', 'UpdateMeasurement')
  updateMeasurement(data: UpdateMeasurementDto, metadata: Metadata) {
    const userId = getAuthenticatedUserId(metadata);
    return this.updateMeasurementUseCase.execute({ userId, ...data });
  }

  @GrpcMethod('RehabService', 'DeleteMeasurement')
  deleteMeasurement(data: DeleteMeasurementDto, metadata: Metadata) {
    const userId = getAuthenticatedUserId(metadata);
    return this.deleteMeasurementUseCase.execute({
      userId,
      measurementId: data.measurementId,
    });
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

  @GrpcMethod('RehabService', 'MarkExerciseCompletion')
  markExerciseCompletion(data: MarkExerciseCompletionDto, metadata: Metadata) {
    const userId = getAuthenticatedUserId(metadata);
    return this.markExerciseCompletionUseCase.execute({ userId, ...data });
  }

  @GrpcMethod('RehabService', 'GetTodayExercises')
  getTodayExercises(data: GetTodayExercisesDto, metadata: Metadata) {
    const userId = getAuthenticatedUserId(metadata);
    return this.getTodayExercisesUseCase
      .execute({
        userId,
        recoveryPlanId: data.recoveryPlanId,
        todayIso: data.todayIso,
      })
      .then((exercises) => ({ exercises }));
  }

  @GrpcMethod('RehabService', 'GetWeeklySummary')
  getWeeklySummary(data: GetWeeklySummaryDto, metadata: Metadata) {
    const userId = getAuthenticatedUserId(metadata);
    return this.getWeeklySummaryUseCase.execute({ userId, ...data });
  }

  @GrpcMethod('RehabService', 'AddPainLog')
  addPainLog(data: AddPainLogDto, metadata: Metadata) {
    const userId = getAuthenticatedUserId(metadata);
    return this.addOrUpdatePainLogUseCase.execute({ userId, ...data });
  }

  @GrpcMethod('RehabService', 'ListPainLogs')
  listPainLogs(data: ListPainLogsDto, metadata: Metadata) {
    const userId = getAuthenticatedUserId(metadata);
    return this.listPainLogsUseCase.execute({ userId, ...data });
  }

  @GrpcMethod('RehabService', 'SetAdHocProtocolDay')
  setAdHocProtocolDay(data: SetAdHocProtocolDayDto, metadata: Metadata) {
    const userId = getAuthenticatedUserId(metadata);
    return this.setAdHocProtocolDayUseCase.execute({ userId, ...data });
  }

  @GrpcMethod('RehabService', 'ClearAdHocProtocolDay')
  clearAdHocProtocolDay(data: ClearAdHocProtocolDayDto, metadata: Metadata) {
    const userId = getAuthenticatedUserId(metadata);
    return this.clearAdHocProtocolDayUseCase.execute({ userId, ...data });
  }
}
