/*
  Warnings:

  - The primary key for the `stock_movement` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `stock_movement` on the `stock_movement` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "bill_detail" DROP CONSTRAINT "bill_detail_stock_movement_id_fkey";

-- AlterTable
ALTER TABLE "stock_movement" DROP CONSTRAINT "stock_movement_pkey",
DROP COLUMN "stock_movement",
ADD COLUMN     "stock_movement_id" SERIAL NOT NULL,
ADD CONSTRAINT "stock_movement_pkey" PRIMARY KEY ("stock_movement_id");

-- AddForeignKey
ALTER TABLE "bill_detail" ADD CONSTRAINT "bill_detail_stock_movement_id_fkey" FOREIGN KEY ("stock_movement_id") REFERENCES "stock_movement"("stock_movement_id") ON DELETE CASCADE ON UPDATE CASCADE;
