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

export class InvalidRehabEntityDataError extends DomainError {
  constructor(message: string) {
    super(message);
  }
}
