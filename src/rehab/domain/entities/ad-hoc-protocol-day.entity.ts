export class AdHocProtocolDayEntity {
  constructor(
    public readonly id: string,
    public readonly recoveryPlanId: string,
    public readonly targetDate: Date,
    public readonly sourceDate: Date,
  ) {}
}
