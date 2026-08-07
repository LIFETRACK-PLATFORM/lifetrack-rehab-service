import {
  MeasurementNotFoundError,
  RecoveryPlanNotFoundError,
} from '../../domain/exceptions/rehab.errors';
import type { MeasurementRepositoryPort } from '../../domain/ports/measurement.repository.port';
import type { RecoveryPlanRepositoryPort } from '../../domain/ports/recovery-plan.repository.port';
import type { UpdateMeasurementInput } from '../dtos/update-measurement.input';

export class UpdateMeasurementUseCase {
  constructor(
    private readonly measurementRepository: MeasurementRepositoryPort,
    private readonly recoveryPlanRepository: RecoveryPlanRepositoryPort,
  ) {}

  async execute(input: UpdateMeasurementInput) {
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

    const updated = await this.measurementRepository.updateById(
      input.measurementId,
      {
        type: input.type,
        customLabel: input.customLabel,
        value: input.value,
        unit: input.unit,
        date: new Date(input.date),
      },
    );

    return {
      measurementId: updated.id,
      recoveryPlanId: updated.recoveryPlanId,
      type: updated.type,
      customLabel: updated.customLabel ?? undefined,
      value: updated.value,
      unit: updated.unit,
      date: updated.date.toISOString(),
    };
  }
}
