import { AddAppointmentUseCase } from './add-appointment.use-case';
import {
  RecoveryPlanEntity,
  RecoveryPlanStatus,
} from '../../domain/entities/recovery-plan.entity';
import {
  AppointmentEntity,
  AppointmentType,
} from '../../domain/entities/appointment.entity';
import { RecoveryPlanNotFoundError } from '../../domain/exceptions/rehab.errors';

function buildPlan() {
  return new RecoveryPlanEntity(
    {
      userId: 'user-1',
      bodyPart: 'rodilla',
      injuryType: 'LCA',
      surgeryDate: new Date(),
      status: RecoveryPlanStatus.ACTIVE,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    'plan-1',
  );
}

function buildRepos(createManyCount: number) {
  const recoveryPlanRepository = {
    findByIdAndUserId: jest.fn().mockResolvedValue(buildPlan()),
  };
  const appointmentRepository = {
    create: jest
      .fn()
      .mockImplementation((data) =>
        Promise.resolve(
          new AppointmentEntity(
            { ...data, createdAt: new Date() },
            'apt-single',
          ),
        ),
      ),
    createMany: jest
      .fn()
      .mockImplementation((items: any[]) =>
        Promise.resolve(
          items.map(
            (data, i) =>
              new AppointmentEntity(
                { ...data, createdAt: new Date() },
                `apt-${i}`,
              ),
          ),
        ),
      ),
    listByRecoveryPlan: jest.fn(),
    listByRecoveryPlanInRange: jest.fn(),
  };
  const eventPublisher = { publish: jest.fn().mockResolvedValue(undefined) };
  void createManyCount;
  return { recoveryPlanRepository, appointmentRepository, eventPublisher };
}

describe('AddAppointmentUseCase', () => {
  it('crea una única cita cuando no se pide repetición', async () => {
    const { recoveryPlanRepository, appointmentRepository, eventPublisher } =
      buildRepos(0);
    const useCase = new AddAppointmentUseCase(
      recoveryPlanRepository as any,
      appointmentRepository,
      eventPublisher,
    );

    const result = await useCase.execute({
      userId: 'user-1',
      recoveryPlanId: 'plan-1',
      date: '2026-08-10',
      provider: 'Centro Apex',
      type: AppointmentType.THERAPY,
    });

    expect(appointmentRepository.create).toHaveBeenCalledTimes(1);
    expect(appointmentRepository.createMany).not.toHaveBeenCalled();
    expect(result.appointments).toHaveLength(1);
  });

  it('crea una serie semanal cuando se pide repetición', async () => {
    const { recoveryPlanRepository, appointmentRepository, eventPublisher } =
      buildRepos(6);
    const useCase = new AddAppointmentUseCase(
      recoveryPlanRepository as any,
      appointmentRepository,
      eventPublisher,
    );

    const result = await useCase.execute({
      userId: 'user-1',
      recoveryPlanId: 'plan-1',
      date: '2026-08-10',
      provider: 'Centro Apex',
      type: AppointmentType.THERAPY,
      repeatWeeks: 5,
    });

    expect(appointmentRepository.createMany).toHaveBeenCalledTimes(1);
    expect(result.appointments).toHaveLength(6);
  });

  it('limita las repeticiones a un máximo de 12 aunque se pida más', async () => {
    const { recoveryPlanRepository, appointmentRepository, eventPublisher } =
      buildRepos(13);
    const useCase = new AddAppointmentUseCase(
      recoveryPlanRepository as any,
      appointmentRepository,
      eventPublisher,
    );

    const result = await useCase.execute({
      userId: 'user-1',
      recoveryPlanId: 'plan-1',
      date: '2026-08-10',
      provider: 'Centro Apex',
      type: AppointmentType.MEDICAL,
      repeatWeeks: 50,
    });

    expect(result.appointments).toHaveLength(13);
  });

  it('lanza RecoveryPlanNotFoundError si el plan no pertenece al usuario', async () => {
    const recoveryPlanRepository = {
      findByIdAndUserId: jest.fn().mockResolvedValue(null),
    };
    const appointmentRepository = {
      create: jest.fn(),
      createMany: jest.fn(),
      listByRecoveryPlan: jest.fn(),
      listByRecoveryPlanInRange: jest.fn(),
    };
    const eventPublisher = { publish: jest.fn() };
    const useCase = new AddAppointmentUseCase(
      recoveryPlanRepository as any,
      appointmentRepository,
      eventPublisher,
    );

    await expect(
      useCase.execute({
        userId: 'other-user',
        recoveryPlanId: 'plan-1',
        date: '2026-08-10',
        provider: 'Centro Apex',
        type: AppointmentType.THERAPY,
      }),
    ).rejects.toBeInstanceOf(RecoveryPlanNotFoundError);
    expect(appointmentRepository.create).not.toHaveBeenCalled();
  });
});
