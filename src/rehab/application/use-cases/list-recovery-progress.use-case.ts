import { RecoveryPlanNotFoundError } from '../../domain/exceptions/rehab.errors';
import type { RecoveryPlanRepositoryPort } from '../../domain/ports/recovery-plan.repository.port';
import type { ExerciseRepositoryPort } from '../../domain/ports/exercise.repository.port';
import type { ExerciseLogRepositoryPort } from '../../domain/ports/exercise-log.repository.port';
import type { ExerciseCompletionRepositoryPort } from '../../domain/ports/exercise-completion.repository.port';
import type { AppointmentRepositoryPort } from '../../domain/ports/appointment.repository.port';
import type { MeasurementRepositoryPort } from '../../domain/ports/measurement.repository.port';
import type { ProgressPhotoRepositoryPort } from '../../domain/ports/progress-photo.repository.port';
import type { PainLogRepositoryPort } from '../../domain/ports/pain-log.repository.port';
import type { ListRecoveryProgressInput } from '../dtos/list-recovery-progress.input';
import { addDays, isSameDay, startOfDay } from '../utils/schedule.util';

const PAIN_LOG_LOOKBACK_DAYS = 30;

export class ListRecoveryProgressUseCase {
  constructor(
    private readonly recoveryPlanRepository: RecoveryPlanRepositoryPort,
    private readonly exerciseRepository: ExerciseRepositoryPort,
    private readonly exerciseLogRepository: ExerciseLogRepositoryPort,
    private readonly appointmentRepository: AppointmentRepositoryPort,
    private readonly measurementRepository: MeasurementRepositoryPort,
    private readonly progressPhotoRepository: ProgressPhotoRepositoryPort,
    private readonly exerciseCompletionRepository: ExerciseCompletionRepositoryPort,
    private readonly painLogRepository: PainLogRepositoryPort,
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
    const today = startOfDay(new Date());
    const exercisesWithLogs = await Promise.all(
      exercises.map(async (exercise) => {
        // El progreso (current/target) es por día: solo cuentan los logs de hoy,
        // si no cada tap de + acumularía sobre el historial de todos los días.
        const allLogs = await this.exerciseLogRepository.listByExercise(
          exercise.id,
        );
        const logs = allLogs.filter((log) => isSameDay(log.date, today));
        const completions =
          await this.exerciseCompletionRepository.listByExerciseIds([
            exercise.id,
          ]);
        // completedToday se calcula aca, no via GetTodayExercises: ese endpoint
        // solo incluye ejercicios "due" hoy/ayer, y un ejercicio marcado como
        // hecho pero fuera de esa ventana nunca se reflejaba como completado.
        const completedToday = completions.some((c) =>
          isSameDay(c.date, today),
        );
        return {
          exerciseId: exercise.id,
          name: exercise.name,
          metricType: exercise.metricType,
          targetSets: exercise.targetSets,
          targetReps: exercise.targetReps,
          targetDurationMinutes: exercise.targetDurationMinutes ?? undefined,
          notes: exercise.notes ?? undefined,
          referenceMediaUrl: exercise.referenceMediaUrl ?? null,
          daysOfWeek: exercise.daysOfWeek,
          completedToday,
          logs: logs.map((log) => ({
            exerciseLogId: log.id,
            setsDone: log.setsDone,
            repsDone: log.repsDone,
            date: log.date.toISOString(),
          })),
          completions: completions.map((c) => ({
            exerciseCompletionId: c.id,
            date: c.date.toISOString().slice(0, 10),
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
    const painLogs = await this.painLogRepository.listByRecoveryPlanInRange(
      input.recoveryPlanId,
      addDays(today, -PAIN_LOG_LOOKBACK_DAYS),
      today,
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
        title: a.title ?? undefined,
        date: a.date.toISOString(),
        provider: a.provider,
        type: a.type,
        notes: a.notes ?? undefined,
        attended: a.attended ?? undefined,
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
      painLogs: painLogs.map((p) => ({
        painLogId: p.id,
        recoveryPlanId: p.recoveryPlanId,
        date: p.date.toISOString().slice(0, 10),
        level: p.level,
        note: p.note ?? undefined,
      })),
    };
  }
}
