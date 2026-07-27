import { Module } from '@nestjs/common';
import { CreateRecoveryPlanUseCase } from './application/use-cases/create-recovery-plan.use-case';
import { AddExerciseUseCase } from './application/use-cases/add-exercise.use-case';
import { LogExerciseUseCase } from './application/use-cases/log-exercise.use-case';
import { AddAppointmentUseCase } from './application/use-cases/add-appointment.use-case';
import { AddMeasurementUseCase } from './application/use-cases/add-measurement.use-case';
import { AddProgressPhotoUseCase } from './application/use-cases/add-progress-photo.use-case';
import { ListRecoveryPlansByUserUseCase } from './application/use-cases/list-recovery-plans-by-user.use-case';
import { ListRecoveryProgressUseCase } from './application/use-cases/list-recovery-progress.use-case';
import {
  APPOINTMENT_REPOSITORY,
  EVENT_PUBLISHER,
  EXERCISE_LOG_REPOSITORY,
  EXERCISE_REPOSITORY,
  MEASUREMENT_REPOSITORY,
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
import { NatsEventPublisher } from './infrastructure/adapters/messaging/nats-event.publisher';
import { RehabController } from './presentation/controllers/rehab.controller';
import type { RecoveryPlanRepositoryPort } from './domain/ports/recovery-plan.repository.port';
import type { ExerciseRepositoryPort } from './domain/ports/exercise.repository.port';
import type { ExerciseLogRepositoryPort } from './domain/ports/exercise-log.repository.port';
import type { AppointmentRepositoryPort } from './domain/ports/appointment.repository.port';
import type { MeasurementRepositoryPort } from './domain/ports/measurement.repository.port';
import type { ProgressPhotoRepositoryPort } from './domain/ports/progress-photo.repository.port';
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
      ) =>
        new ListRecoveryProgressUseCase(
          recoveryPlanRepo,
          exerciseRepo,
          exerciseLogRepo,
          appointmentRepo,
          measurementRepo,
          progressPhotoRepo,
        ),
      inject: [
        RECOVERY_PLAN_REPOSITORY,
        EXERCISE_REPOSITORY,
        EXERCISE_LOG_REPOSITORY,
        APPOINTMENT_REPOSITORY,
        MEASUREMENT_REPOSITORY,
        PROGRESS_PHOTO_REPOSITORY,
      ],
    },
  ],
})
export class RehabModule {}
