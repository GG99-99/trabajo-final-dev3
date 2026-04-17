/*
  Warnings:

  - A unique constraint covering the columns `[appointment_id]` on the table `bill` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "bill" ADD COLUMN     "appointment_id" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "bill_appointment_id_key" ON "bill"("appointment_id");

-- AddForeignKey
ALTER TABLE "bill" ADD CONSTRAINT "bill_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "appointment"("appointment_id") ON DELETE SET NULL ON UPDATE CASCADE;
