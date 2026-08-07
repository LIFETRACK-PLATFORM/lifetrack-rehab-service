/*
  Warnings:

  - You are about to drop the column `phase` on the `Exercise` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ExerciseMetricType" AS ENUM ('REPS', 'DURATION');

-- AlterTable
ALTER TABLE "Exercise" DROP COLUMN "phase",
ADD COLUMN     "metricType" "ExerciseMetricType" NOT NULL DEFAULT 'REPS',
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "targetDurationMinutes" INTEGER;
