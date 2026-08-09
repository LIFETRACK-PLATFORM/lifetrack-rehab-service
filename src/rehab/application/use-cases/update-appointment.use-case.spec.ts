import { UpdateAppointmentUseCase } from './update-appointment.use-case';
import {
  AppointmentEntity,
  AppointmentProps,
  AppointmentType,
} from '../../domain/entities/appointment.entity';
import {
  AppointmentNotFoundError,
  RecoveryPlanNotFoundError,
} from '../../domain/exceptions/rehab.errors';

function baseProps(
  overrides: Partial<AppointmentProps> = {},
): AppointmentProps {
  return {
    recoveryPlanId: 'plan-1',
    title: 'Control',
    date: new Date('2026-08-10T09:00:00.000Z'),
    provider: 'Centro Apex',
    notes: null,
    type: AppointmentType.THERAPY,
    attended: null,
    rescheduledFromDate: null,
    createdAt: new Date(),
    ...overrides,
  };
}

function buildRepos(currentProps: AppointmentProps) {
  const current = new AppointmentEntity(currentProps, 'apt-1');
  const appointmentRepository = {
    create: jest.fn(),
    createMany: jest.fn(),
    listByRecoveryPlan: jest.fn(),
    listByRecoveryPlanInRange: jest.fn(),
    findById: jest.fn().mockResolvedValue(current),
    updateAttendance: jest.fn(),
    deleteById: jest.fn(),
    updateById: jest
      .fn()
      .mockImplementation((id: string, data: Partial<AppointmentProps>) =>
        Promise.resolve(
          new AppointmentEntity({ ...currentProps, ...data }, id),
        ),
      ),
  };
  const recoveryPlanRepository = {
    findByIdAndUserId: jest.fn().mockResolvedValue({ id: 'plan-1' }),
  };
  return { appointmentRepository, recoveryPlanRepository };
}

describe('UpdateAppointmentUseCase', () => {
  it('captura la fecha anterior en rescheduledFromDate cuando la fecha cambia', async () => {
    const { appointmentRepository, recoveryPlanRepository } =
      buildRepos(baseProps());
    const useCase = new UpdateAppointmentUseCase(
      appointmentRepository,
      recoveryPlanRepository as any,
    );

    const result = await useCase.execute({
      userId: 'user-1',
      appointmentId: 'apt-1',
      title: 'Control',
      date: '2026-08-15T09:00:00.000Z',
      provider: 'Centro Apex',
      type: AppointmentType.THERAPY,
    });

    expect(appointmentRepository.updateById).toHaveBeenCalledWith(
      'apt-1',
      expect.objectContaining({
        rescheduledFromDate: new Date('2026-08-10T09:00:00.000Z'),
      }),
    );
    expect(result.rescheduledFromDate).toBe('2026-08-10T09:00:00.000Z');
  });

  it('preserva rescheduledFromDate existente cuando la fecha no cambia', async () => {
    const { appointmentRepository, recoveryPlanRepository } = buildRepos(
      baseProps({ rescheduledFromDate: new Date('2026-08-01T09:00:00.000Z') }),
    );
    const useCase = new UpdateAppointmentUseCase(
      appointmentRepository,
      recoveryPlanRepository as any,
    );

    await useCase.execute({
      userId: 'user-1',
      appointmentId: 'apt-1',
      title: 'Control (notas actualizadas)',
      date: '2026-08-10T09:00:00.000Z',
      provider: 'Centro Apex',
      type: AppointmentType.THERAPY,
    });

    expect(appointmentRepository.updateById).toHaveBeenCalledWith(
      'apt-1',
      expect.objectContaining({
        rescheduledFromDate: new Date('2026-08-01T09:00:00.000Z'),
      }),
    );
  });

  it('lanza AppointmentNotFoundError si la cita no existe', async () => {
    const appointmentRepository = {
      create: jest.fn(),
      createMany: jest.fn(),
      listByRecoveryPlan: jest.fn(),
      listByRecoveryPlanInRange: jest.fn(),
      findById: jest.fn().mockResolvedValue(null),
      updateAttendance: jest.fn(),
      deleteById: jest.fn(),
      updateById: jest.fn(),
    };
    const recoveryPlanRepository = { findByIdAndUserId: jest.fn() };
    const useCase = new UpdateAppointmentUseCase(
      appointmentRepository,
      recoveryPlanRepository as any,
    );

    await expect(
      useCase.execute({
        userId: 'user-1',
        appointmentId: 'missing',
        title: 'x',
        date: '2026-08-10T09:00:00.000Z',
        provider: 'Centro Apex',
        type: AppointmentType.THERAPY,
      } as any),
    ).rejects.toBeInstanceOf(AppointmentNotFoundError);
  });

  it('lanza RecoveryPlanNotFoundError si el plan no pertenece al usuario', async () => {
    const { appointmentRepository } = buildRepos(baseProps());
    const recoveryPlanRepository = {
      findByIdAndUserId: jest.fn().mockResolvedValue(null),
    };
    const useCase = new UpdateAppointmentUseCase(
      appointmentRepository,
      recoveryPlanRepository as any,
    );

    await expect(
      useCase.execute({
        userId: 'other-user',
        appointmentId: 'apt-1',
        title: 'x',
        date: '2026-08-10T09:00:00.000Z',
        provider: 'Centro Apex',
        type: AppointmentType.THERAPY,
      } as any),
    ).rejects.toBeInstanceOf(RecoveryPlanNotFoundError);
    expect(appointmentRepository.updateById).not.toHaveBeenCalled();
  });
});
