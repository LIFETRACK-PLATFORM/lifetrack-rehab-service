-- CreateEnum
CREATE TYPE "AppointmentType" AS ENUM ('THERAPY', 'MEDICAL');

-- AlterTable
ALTER TABLE "Exercise" ADD COLUMN "daysOfWeek" INTEGER[] NOT NULL DEFAULT ARRAY[]::INTEGER[];

-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN "type" "AppointmentType" NOT NULL DEFAULT 'MEDICAL';

-- CreateTable
CREATE TABLE "ExerciseCompletion" (
    "id" TEXT NOT NULL,
    "exerciseId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExerciseCompletion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PainLog" (
    "id" TEXT NOT NULL,
    "recoveryPlanId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "level" INTEGER NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PainLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExerciseCompletion_exerciseId_date_key" ON "ExerciseCompletion"("exerciseId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "PainLog_recoveryPlanId_date_key" ON "PainLog"("recoveryPlanId", "date");

-- AddForeignKey
ALTER TABLE "ExerciseCompletion" ADD CONSTRAINT "ExerciseCompletion_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PainLog" ADD CONSTRAINT "PainLog_recoveryPlanId_fkey" FOREIGN KEY ("recoveryPlanId") REFERENCES "RecoveryPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
