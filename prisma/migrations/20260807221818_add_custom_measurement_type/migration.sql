-- AlterEnum
ALTER TYPE "MeasurementType" ADD VALUE 'OTHER';

-- AlterTable
ALTER TABLE "Measurement" ADD COLUMN     "customLabel" TEXT;
