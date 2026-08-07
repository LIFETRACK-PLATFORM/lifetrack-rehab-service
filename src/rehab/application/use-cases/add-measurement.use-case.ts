import { RecoveryPlanNotFoundError } from '../../domain/exceptions/rehab.errors';
import type { RecoveryPlanRepositoryPort } from '../../domain/ports/recovery-plan.repository.port';
import type { MeasurementRepositoryPort } from '../../domain/ports/measurement.repository.port';
import type { AddMeasurementInput } from '../dtos/add-measurement.input';

export class AddMeasurementUseCase {
  constructor(
    private readonly recoveryPlanRepository: RecoveryPlanRepositoryPort,
    private readonly measurementRepository: MeasurementRepositoryPort,
  ) {}

  async execute(input: AddMeasurementInput) {
    const plan = await this.recoveryPlanRepository.findByIdAndUserId(
      input.recoveryPlanId,
      input.userId,
    );
    if (!plan) throw new RecoveryPlanNotFoundError(input.recoveryPlanId);

    const measurement = await this.measurementRepository.create({
      recoveryPlanId: input.recoveryPlanId,
      type: input.type,
      customLabel: input.customLabel,
      value: input.value,
      unit: input.unit,
      date: new Date(input.date),
    });

    return {
      measurementId: measurement.id,
      recoveryPlanId: measurement.recoveryPlanId,
      type: measurement.type,
      customLabel: measurement.customLabel ?? undefined,
      value: measurement.value,
      unit: measurement.unit,
      date: measurement.date.toISOString(),
    };
  }
}
