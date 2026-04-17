/*
  Warnings:

  - Added the required column `cashier_id` to the `payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payment" ADD COLUMN     "cashier_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_cashier_id_fkey" FOREIGN KEY ("cashier_id") REFERENCES "cashier"("cashier_id") ON DELETE CASCADE ON UPDATE CASCADE;
