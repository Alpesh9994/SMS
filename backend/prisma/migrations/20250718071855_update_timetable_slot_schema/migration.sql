/*
  Warnings:

  - You are about to alter the column `periodNumber` on the `TimetableSlot` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.
  - You are about to alter the column `duration` on the `TimetableSlot` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `SmallInt`.
  - Changed the type of `dayOfWeek` on the `TimetableSlot` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "DayOfWeek" AS ENUM ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY');

-- AlterTable
ALTER TABLE "TimetableSlot" DROP COLUMN "dayOfWeek",
ADD COLUMN     "dayOfWeek" "DayOfWeek" NOT NULL,
ALTER COLUMN "periodNumber" SET DATA TYPE SMALLINT,
ALTER COLUMN "duration" SET DATA TYPE SMALLINT;

-- CreateIndex
CREATE INDEX "TimetableSlot_tenantId_idx" ON "TimetableSlot"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "TimetableSlot_divisionId_dayOfWeek_periodNumber_key" ON "TimetableSlot"("divisionId", "dayOfWeek", "periodNumber");
