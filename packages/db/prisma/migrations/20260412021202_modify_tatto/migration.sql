/*
  Warnings:

  - Added the required column `name` to the `tattoo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tattoo" ADD COLUMN     "name" TEXT NOT NULL;
