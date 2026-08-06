import { Logger } from '@nestjs/common';
import {
  ExerciseNotFoundError,
  RecoveryPlanNotFoundError,
} from '../../domain/exceptions/rehab.errors';
import type { ExerciseRepositoryPort } from '../../domain/ports/exercise.repository.port';
import type { ExerciseLogRepositoryPort } from '../../domain/ports/exercise-log.repository.port';
import type { EventPublisherPort } from '../../domain/ports/event.publisher.port';
import type { RecoveryPlanRepositoryPort } from '../../domain/ports/recovery-plan.repository.port';
import type { LogExerciseInput } from '../dtos/log-exercise.input';

export class LogExerciseUseCase {
  private readonly logger = new Logger(LogExerciseUseCase.name);

  constructor(
    private readonly recoveryPlanRepository: RecoveryPlanRepositoryPort,
    private readonly exerciseRepository: ExerciseRepositoryPort,
    private readonly exerciseLogRepository: ExerciseLogRepositoryPort,
    private readonly eventPublisher: EventPublisherPort,
  ) {}

  async execute(input: LogExerciseInput) {
    const exercise = await this.exerciseRepository.findById(input.exerciseId);
    if (!exercise) throw new ExerciseNotFoundError(input.exerciseId);

    const plan = await this.recoveryPlanRepository.findByIdAndUserId(
      exercise.recoveryPlanId,
      input.userId,
    );
    if (!plan) throw new RecoveryPlanNotFoundError(exercise.recoveryPlanId);

    const log = await this.exerciseLogRepository.create({
      exerciseId: input.exerciseId,
      setsDone: input.setsDone,
      repsDone: input.repsDone,
      date: new Date(input.date),
    });

    try {
      await this.eventPublisher.publish({
        eventType: 'rehab.exercise_logged.v1',
        payload: {
          exerciseLogId: log.id,
          exerciseId: log.exerciseId,
          recoveryPlanId: exercise.recoveryPlanId,
          setsDone: log.setsDone,
          repsDone: log.repsDone,
        },
      });
    } catch (err) {
      // El registro del ejercicio ya se persistió con éxito: un fallo al
      // publicar el evento no debe convertirse en un 500 para el cliente.
      this.logger.error(
        `Fallo al publicar rehab.exercise_logged.v1 para el log ${log.id}: ${
          err instanceof Error ? err.message : String(err)
        }`,
      );
    }

    return {
      exerciseLogId: log.id,
      exerciseId: log.exerciseId,
      setsDone: log.setsDone,
      repsDone: log.repsDone,
      date: log.date.toISOString(),
    };
  }
}
