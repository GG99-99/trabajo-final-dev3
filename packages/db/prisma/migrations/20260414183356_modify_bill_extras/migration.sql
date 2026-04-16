/*
  Warnings:

  - Added the required column `reason` to the `bill_aggregate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reason` to the `bill_discount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "bill_aggregate" ADD COLUMN     "reason" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "bill_discount" ADD COLUMN     "reason" TEXT NOT NULL;
