-- CreateTable
CREATE TABLE "AdHocProtocolDay" (
    "id" TEXT NOT NULL,
    "recoveryPlanId" TEXT NOT NULL,
    "targetDate" DATE NOT NULL,
    "sourceDate" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdHocProtocolDay_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdHocProtocolDay_recoveryPlanId_targetDate_key" ON "AdHocProtocolDay"("recoveryPlanId", "targetDate");

-- AddForeignKey
ALTER TABLE "AdHocProtocolDay" ADD CONSTRAINT "AdHocProtocolDay_recoveryPlanId_fkey" FOREIGN KEY ("recoveryPlanId") REFERENCES "RecoveryPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
