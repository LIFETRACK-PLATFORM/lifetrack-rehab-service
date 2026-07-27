import { RecoveryPlanNotFoundError } from '../../domain/exceptions/rehab.errors';
import type { RecoveryPlanRepositoryPort } from '../../domain/ports/recovery-plan.repository.port';
import type { ExerciseRepositoryPort } from '../../domain/ports/exercise.repository.port';
import type { ExerciseLogRepositoryPort } from '../../domain/ports/exercise-log.repository.port';
import type { AppointmentRepositoryPort } from '../../domain/ports/appointment.repository.port';
import type { MeasurementRepositoryPort } from '../../domain/ports/measurement.repository.port';
import type { ProgressPhotoRepositoryPort } from '../../domain/ports/progress-photo.repository.port';
import type { ListRecoveryProgressInput } from '../dtos/list-recovery-progress.input';

export class ListRecoveryProgressUseCase {
  constructor(
    private readonly recoveryPlanRepository: RecoveryPlanRepositoryPort,
    private readonly exerciseRepository: ExerciseRepositoryPort,
    private readonly exerciseLogRepository: ExerciseLogRepositoryPort,
    private readonly appointmentRepository: AppointmentRepositoryPort,
    private readonly measurementRepository: MeasurementRepositoryPort,
    private readonly progressPhotoRepository: ProgressPhotoRepositoryPort,
  ) {}

  async execute(input: ListRecoveryProgressInput) {
    const plan = await this.recoveryPlanRepository.findByIdAndUserId(
      input.recoveryPlanId,
      input.userId,
    );
    if (!plan) throw new RecoveryPlanNotFoundError(input.recoveryPlanId);

    const exercises = await this.exerciseRepository.listByRecoveryPlan(
      input.recoveryPlanId,
    );
    const exercisesWithLogs = await Promise.all(
      exercises.map(async (exercise) => {
        const logs = await this.exerciseLogRepository.listByExercise(
          exercise.id,
        );
        return {
          exerciseId: exercise.id,
          name: exercise.name,
          targetSets: exercise.targetSets,
          targetReps: exercise.targetReps,
          phase: exercise.phase,
          logs: logs.map((log) => ({
            exerciseLogId: log.id,
            setsDone: log.setsDone,
            repsDone: log.repsDone,
            date: log.date.toISOString(),
          })),
        };
      }),
    );

    const appointments = await this.appointmentRepository.listByRecoveryPlan(
      input.recoveryPlanId,
    );
    const measurements = await this.measurementRepository.listByRecoveryPlan(
      input.recoveryPlanId,
    );
    const progressPhotos =
      await this.progressPhotoRepository.listByRecoveryPlan(
        input.recoveryPlanId,
      );

    return {
      recoveryPlanId: plan.id,
      bodyPart: plan.bodyPart,
      injuryType: plan.injuryType,
      surgeryDate: plan.surgeryDate.toISOString(),
      status: plan.status,
      exercises: exercisesWithLogs,
      appointments: appointments.map((a) => ({
        appointmentId: a.id,
        recoveryPlanId: a.recoveryPlanId,
        date: a.date.toISOString(),
        provider: a.provider,
        notes: a.notes ?? undefined,
      })),
      measurements: measurements.map((m) => ({
        measurementId: m.id,
        recoveryPlanId: m.recoveryPlanId,
        type: m.type,
        value: m.value,
        unit: m.unit,
        date: m.date.toISOString(),
      })),
      progressPhotos: progressPhotos.map((p) => ({
        progressPhotoId: p.id,
        recoveryPlanId: p.recoveryPlanId,
        photoUrl: p.photoUrl,
        date: p.date.toISOString(),
      })),
    };
  }
}
