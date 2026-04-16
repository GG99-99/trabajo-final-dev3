/*
  Warnings:

  - Added the required column `unit` to the `product_variant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product_variant" ADD COLUMN     "unit" TEXT NOT NULL;
