-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "attended" BOOLEAN;

-- CreateIndex
CREATE INDEX "RecoveryPlan_userId_idx" ON "RecoveryPlan"("userId");
