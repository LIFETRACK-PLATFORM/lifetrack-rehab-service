import { Module } from '@nestjs/common';
import { CreateRecoveryPlanUseCase } from './application/use-cases/create-recovery-plan.use-case';
import { AddExerciseUseCase } from './application/use-cases/add-exercise.use-case';
import { DeleteExerciseUseCase } from './application/use-cases/delete-exercise.use-case';
import { LogExerciseUseCase } from './application/use-cases/log-exercise.use-case';
import { AddAppointmentUseCase } from './application/use-cases/add-appointment.use-case';
import { AddMeasurementUseCase } from './application/use-cases/add-measurement.use-case';
import { AddProgressPhotoUseCase } from './application/use-cases/add-progress-photo.use-case';
import { ListRecoveryPlansByUserUseCase } from './application/use-cases/list-recovery-plans-by-user.use-case';
import { UpdateRecoveryPlanStatusUseCase } from './application/use-cases/update-recovery-plan-status.use-case';
import { ListRecoveryProgressUseCase } from './application/use-cases/list-recovery-progress.use-case';
import { MarkExerciseCompletionUseCase } from './application/use-cases/mark-exercise-completion.use-case';
import { GetTodayExercisesUseCase } from './application/use-cases/get-today-exercises.use-case';
import { GetWeeklySummaryUseCase } from './application/use-cases/get-weekly-summary.use-case';
import { AddOrUpdatePainLogUseCase } from './application/use-cases/add-or-update-pain-log.use-case';
import { ListPainLogsUseCase } from './application/use-cases/list-pain-logs.use-case';
import {
  APPOINTMENT_REPOSITORY,
  EVENT_PUBLISHER,
  EXERCISE_COMPLETION_REPOSITORY,
  EXERCISE_LOG_REPOSITORY,
  EXERCISE_REPOSITORY,
  MEASUREMENT_REPOSITORY,
  PAIN_LOG_REPOSITORY,
  PROGRESS_PHOTO_REPOSITORY,
  RECOVERY_PLAN_REPOSITORY,
} from './domain/ports/tokens';
import { PrismaService } from './infrastructure/prisma/prisma.service';
import { PrismaRecoveryPlanRepository } from './infrastructure/adapters/persistence/prisma-recovery-plan.repository';
import { PrismaExerciseRepository } from './infrastructure/adapters/persistence/prisma-exercise.repository';
import { PrismaExerciseLogRepository } from './infrastructure/adapters/persistence/prisma-exercise-log.repository';
import { PrismaAppointmentRepository } from './infrastructure/adapters/persistence/prisma-appointment.repository';
import { PrismaMeasurementRepository } from './infrastructure/adapters/persistence/prisma-measurement.repository';
import { PrismaProgressPhotoRepository } from './infrastructure/adapters/persistence/prisma-progress-photo.repository';
import { PrismaExerciseCompletionRepository } from './infrastructure/adapters/persistence/prisma-exercise-completion.repository';
import { PrismaPainLogRepository } from './infrastructure/adapters/persistence/prisma-pain-log.repository';
import { NatsEventPublisher } from './infrastructure/adapters/messaging/nats-event.publisher';
import { RehabController } from './presentation/controllers/rehab.controller';
import type { RecoveryPlanRepositoryPort } from './domain/ports/recovery-plan.repository.port';
import type { ExerciseRepositoryPort } from './domain/ports/exercise.repository.port';
import type { ExerciseLogRepositoryPort } from './domain/ports/exercise-log.repository.port';
import type { AppointmentRepositoryPort } from './domain/ports/appointment.repository.port';
import type { MeasurementRepositoryPort } from './domain/ports/measurement.repository.port';
import type { ProgressPhotoRepositoryPort } from './domain/ports/progress-photo.repository.port';
import type { ExerciseCompletionRepositoryPort } from './domain/ports/exercise-completion.repository.port';
import type { PainLogRepositoryPort } from './domain/ports/pain-log.repository.port';
import type { EventPublisherPort } from './domain/ports/event.publisher.port';

@Module({
  controllers: [RehabController],
  providers: [
    PrismaService,
    {
      provide: RECOVERY_PLAN_REPOSITORY,
      useClass: PrismaRecoveryPlanRepository,
    },
    {
      provide: EXERCISE_REPOSITORY,
      useClass: PrismaExerciseRepository,
    },
    {
      provide: EXERCISE_LOG_REPOSITORY,
      useClass: PrismaExerciseLogRepository,
    },
    {
      provide: APPOINTMENT_REPOSITORY,
      useClass: PrismaAppointmentRepository,
    },
    {
      provide: MEASUREMENT_REPOSITORY,
      useClass: PrismaMeasurementRepository,
    },
    {
      provide: PROGRESS_PHOTO_REPOSITORY,
      useClass: PrismaProgressPhotoRepository,
    },
    {
      provide: EXERCISE_COMPLETION_REPOSITORY,
      useClass: PrismaExerciseCompletionRepository,
    },
    {
      provide: PAIN_LOG_REPOSITORY,
      useClass: PrismaPainLogRepository,
    },
    {
      provide: EVENT_PUBLISHER,
      useClass: NatsEventPublisher,
    },
    {
      provide: CreateRecoveryPlanUseCase,
      useFactory: (
        recoveryPlanRepo: RecoveryPlanRepositoryPort,
        publisher: EventPublisherPort,
      ) => new CreateRecoveryPlanUseCase(recoveryPlanRepo, publisher),
      inject: [RECOVERY_PLAN_REPOSITORY, EVENT_PUBLISHER],
    },
    {
      provide: AddExerciseUseCase,
      useFactory: (
        recoveryPlanRepo: RecoveryPlanRepositoryPort,
        exerciseRepo: ExerciseRepositoryPort,
      ) => new AddExerciseUseCase(recoveryPlanRepo, exerciseRepo),
      inject: [RECOVERY_PLAN_REPOSITORY, EXERCISE_REPOSITORY],
    },
    {
      provide: DeleteExerciseUseCase,
      useFactory: (
        recoveryPlanRepo: RecoveryPlanRepositoryPort,
        exerciseRepo: ExerciseRepositoryPort,
      ) => new DeleteExerciseUseCase(recoveryPlanRepo, exerciseRepo),
      inject: [RECOVERY_PLAN_REPOSITORY, EXERCISE_REPOSITORY],
    },
    {
      provide: LogExerciseUseCase,
      useFactory: (
        recoveryPlanRepo: RecoveryPlanRepositoryPort,
        exerciseRepo: ExerciseRepositoryPort,
        exerciseLogRepo: ExerciseLogRepositoryPort,
        publisher: EventPublisherPort,
      ) =>
        new LogExerciseUseCase(
          recoveryPlanRepo,
          exerciseRepo,
          exerciseLogRepo,
          publisher,
        ),
      inject: [
        RECOVERY_PLAN_REPOSITORY,
        EXERCISE_REPOSITORY,
        EXERCISE_LOG_REPOSITORY,
        EVENT_PUBLISHER,
      ],
    },
    {
      provide: ListRecoveryPlansByUserUseCase,
      useFactory: (recoveryPlanRepo: RecoveryPlanRepositoryPort) =>
        new ListRecoveryPlansByUserUseCase(recoveryPlanRepo),
      inject: [RECOVERY_PLAN_REPOSITORY],
    },
    {
      provide: UpdateRecoveryPlanStatusUseCase,
      useFactory: (recoveryPlanRepo: RecoveryPlanRepositoryPort) =>
        new UpdateRecoveryPlanStatusUseCase(recoveryPlanRepo),
      inject: [RECOVERY_PLAN_REPOSITORY],
    },
    {
      provide: AddAppointmentUseCase,
      useFactory: (
        recoveryPlanRepo: RecoveryPlanRepositoryPort,
        appointmentRepo: AppointmentRepositoryPort,
        publisher: EventPublisherPort,
      ) =>
        new AddAppointmentUseCase(recoveryPlanRepo, appointmentRepo, publisher),
      inject: [
        RECOVERY_PLAN_REPOSITORY,
        APPOINTMENT_REPOSITORY,
        EVENT_PUBLISHER,
      ],
    },
    {
      provide: AddMeasurementUseCase,
      useFactory: (
        recoveryPlanRepo: RecoveryPlanRepositoryPort,
        measurementRepo: MeasurementRepositoryPort,
      ) => new AddMeasurementUseCase(recoveryPlanRepo, measurementRepo),
      inject: [RECOVERY_PLAN_REPOSITORY, MEASUREMENT_REPOSITORY],
    },
    {
      provide: AddProgressPhotoUseCase,
      useFactory: (
        recoveryPlanRepo: RecoveryPlanRepositoryPort,
        progressPhotoRepo: ProgressPhotoRepositoryPort,
      ) => new AddProgressPhotoUseCase(recoveryPlanRepo, progressPhotoRepo),
      inject: [RECOVERY_PLAN_REPOSITORY, PROGRESS_PHOTO_REPOSITORY],
    },
    {
      provide: ListRecoveryProgressUseCase,
      useFactory: (
        recoveryPlanRepo: RecoveryPlanRepositoryPort,
        exerciseRepo: ExerciseRepositoryPort,
        exerciseLogRepo: ExerciseLogRepositoryPort,
        appointmentRepo: AppointmentRepositoryPort,
        measurementRepo: MeasurementRepositoryPort,
        progressPhotoRepo: ProgressPhotoRepositoryPort,
        exerciseCompletionRepo: ExerciseCompletionRepositoryPort,
        painLogRepo: PainLogRepositoryPort,
      ) =>
        new ListRecoveryProgressUseCase(
          recoveryPlanRepo,
          exerciseRepo,
          exerciseLogRepo,
          appointmentRepo,
          measurementRepo,
          progressPhotoRepo,
          exerciseCompletionRepo,
          painLogRepo,
        ),
      inject: [
        RECOVERY_PLAN_REPOSITORY,
        EXERCISE_REPOSITORY,
        EXERCISE_LOG_REPOSITORY,
        APPOINTMENT_REPOSITORY,
        MEASUREMENT_REPOSITORY,
        PROGRESS_PHOTO_REPOSITORY,
        EXERCISE_COMPLETION_REPOSITORY,
        PAIN_LOG_REPOSITORY,
      ],
    },
    {
      provide: MarkExerciseCompletionUseCase,
      useFactory: (
        exerciseRepo: ExerciseRepositoryPort,
        recoveryPlanRepo: RecoveryPlanRepositoryPort,
        exerciseCompletionRepo: ExerciseCompletionRepositoryPort,
      ) =>
        new MarkExerciseCompletionUseCase(
          exerciseRepo,
          recoveryPlanRepo,
          exerciseCompletionRepo,
        ),
      inject: [
        EXERCISE_REPOSITORY,
        RECOVERY_PLAN_REPOSITORY,
        EXERCISE_COMPLETION_REPOSITORY,
      ],
    },
    {
      provide: GetTodayExercisesUseCase,
      useFactory: (
        recoveryPlanRepo: RecoveryPlanRepositoryPort,
        exerciseRepo: ExerciseRepositoryPort,
        exerciseCompletionRepo: ExerciseCompletionRepositoryPort,
      ) =>
        new GetTodayExercisesUseCase(
          recoveryPlanRepo,
          exerciseRepo,
          exerciseCompletionRepo,
        ),
      inject: [
        RECOVERY_PLAN_REPOSITORY,
        EXERCISE_REPOSITORY,
        EXERCISE_COMPLETION_REPOSITORY,
      ],
    },
    {
      provide: GetWeeklySummaryUseCase,
      useFactory: (
        recoveryPlanRepo: RecoveryPlanRepositoryPort,
        exerciseRepo: ExerciseRepositoryPort,
        exerciseCompletionRepo: ExerciseCompletionRepositoryPort,
        appointmentRepo: AppointmentRepositoryPort,
      ) =>
        new GetWeeklySummaryUseCase(
          recoveryPlanRepo,
          exerciseRepo,
          exerciseCompletionRepo,
          appointmentRepo,
        ),
      inject: [
        RECOVERY_PLAN_REPOSITORY,
        EXERCISE_REPOSITORY,
        EXERCISE_COMPLETION_REPOSITORY,
        APPOINTMENT_REPOSITORY,
      ],
    },
    {
      provide: AddOrUpdatePainLogUseCase,
      useFactory: (
        recoveryPlanRepo: RecoveryPlanRepositoryPort,
        painLogRepo: PainLogRepositoryPort,
      ) => new AddOrUpdatePainLogUseCase(recoveryPlanRepo, painLogRepo),
      inject: [RECOVERY_PLAN_REPOSITORY, PAIN_LOG_REPOSITORY],
    },
    {
      provide: ListPainLogsUseCase,
      useFactory: (
        recoveryPlanRepo: RecoveryPlanRepositoryPort,
        painLogRepo: PainLogRepositoryPort,
      ) => new ListPainLogsUseCase(recoveryPlanRepo, painLogRepo),
      inject: [RECOVERY_PLAN_REPOSITORY, PAIN_LOG_REPOSITORY],
    },
  ],
})
export class RehabModule {}
