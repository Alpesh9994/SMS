-- CreateTable
CREATE TABLE "TimeTableConfig" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "periodsPerDay" SMALLINT NOT NULL,
    "defaultDuration" SMALLINT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "breakSlots" JSONB[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TimeTableConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TimeTableConfig_tenantId_key" ON "TimeTableConfig"("tenantId");

-- AddForeignKey
ALTER TABLE "TimeTableConfig" ADD CONSTRAINT "TimeTableConfig_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
