/*
  Warnings:

  - You are about to drop the column `amout` on the `payment` table. All the data in the column will be lost.
  - Added the required column `amount` to the `payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payment" DROP COLUMN "amout",
ADD COLUMN     "amount" DECIMAL(10,2) NOT NULL;
