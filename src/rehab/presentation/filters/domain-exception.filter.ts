import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { status as GrpcStatus } from '@grpc/grpc-js';
import { Observable, throwError } from 'rxjs';
import {
  AppointmentNotFoundError,
  DomainError,
  ExerciseNotFoundError,
  MeasurementNotFoundError,
  RecoveryPlanNotFoundError,
} from '../../domain/exceptions/rehab.errors';

type DomainErrorConstructor = new (...args: unknown[]) => DomainError;

const ERROR_CODE_MAP = new Map<DomainErrorConstructor, GrpcStatus>([
  [RecoveryPlanNotFoundError, GrpcStatus.NOT_FOUND],
  [ExerciseNotFoundError, GrpcStatus.NOT_FOUND],
  [AppointmentNotFoundError, GrpcStatus.NOT_FOUND],
  [MeasurementNotFoundError, GrpcStatus.NOT_FOUND],
]);

@Catch(DomainError)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainError, _: ArgumentsHost): Observable<never> {
    const code =
      ERROR_CODE_MAP.get(exception.constructor as DomainErrorConstructor) ??
      GrpcStatus.INVALID_ARGUMENT;

    // No envolver en `new RpcException(...)`: el transporte gRPC de NestJS
    // reenvía el error de esta observable tal cual al callback de grpc-js,
    // que solo respeta `error.code` si es una propiedad directa del objeto
    // (ver server-call.js#serverErrorToStatus). Una instancia de RpcException
    // no expone `code` como propiedad propia (solo vía getError()), así que
    // el status real en el wire caía siempre a UNKNOWN.
    return throwError(() => ({ code, message: exception.message }));
  }
}
