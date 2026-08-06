export type AddOrUpdatePainLogInput = {
  userId: string;
  recoveryPlanId: string;
  date: string;
  level: number;
  note?: string;
};
