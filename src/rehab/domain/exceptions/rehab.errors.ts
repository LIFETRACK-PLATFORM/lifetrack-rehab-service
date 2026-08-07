export abstract class DomainError extends Error {}

export class RecoveryPlanNotFoundError extends DomainError {
  constructor(recoveryPlanId: string) {
    super(`El plan de recuperación ${recoveryPlanId} no existe`);
  }
}

export class ExerciseNotFoundError extends DomainError {
  constructor(exerciseId: string) {
    super(`El ejercicio ${exerciseId} no existe`);
  }
}

export class AppointmentNotFoundError extends DomainError {
  constructor(appointmentId: string) {
    super(`La cita ${appointmentId} no existe`);
  }
}

export class InvalidRehabEntityDataError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}

export class InvalidRecoveryPlanStatusError extends DomainError {
  constructor(status: string) {
    super(`Estado de plan de recuperación inválido: ${status}`);
  }
}
