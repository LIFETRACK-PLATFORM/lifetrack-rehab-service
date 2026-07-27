export type AddAppointmentInput = {
  userId: string;
  recoveryPlanId: string;
  date: string;
  provider: string;
  notes?: string;
};
