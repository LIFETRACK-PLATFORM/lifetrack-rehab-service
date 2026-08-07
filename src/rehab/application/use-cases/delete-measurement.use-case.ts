import {
  MeasurementNotFoundError,
  RecoveryPlanNotFoundError,
} from '../../domain/exceptions/rehab.errors';
import type { MeasurementRepositoryPort } from '../../domain/ports/measurement.repository.port';
import type { RecoveryPlanRepositoryPort } from '../../domain/ports/recovery-plan.repository.port';
import type { DeleteMeasurementInput } from '../dtos/delete-measurement.input';

export class DeleteMeasurementUseCase {
  constructor(
    private readonly measurementRepository: MeasurementRepositoryPort,
    private readonly recoveryPlanRepository: RecoveryPlanRepositoryPort,
  ) {}

  async execute(input: DeleteMeasurementInput) {
    const measurement = await this.measurementRepository.findById(
      input.measurementId,
    );
    if (!measurement) {
      throw new MeasurementNotFoundError(input.measurementId);
    }

    const plan = await this.recoveryPlanRepository.findByIdAndUserId(
      measurement.recoveryPlanId,
      input.userId,
    );
    if (!plan) {
      throw new RecoveryPlanNotFoundError(measurement.recoveryPlanId);
    }

    await this.measurementRepository.deleteById(input.measurementId);

    return {
      measurementId: input.measurementId,
      recoveryPlanId: measurement.recoveryPlanId,
      deleted: true,
    };
  }
}
