/*
  Warnings:

  - Added the required column `provider_id` to the `product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product" ADD COLUMN     "provider_id" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "provider" (
    "provider_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "provider_pkey" PRIMARY KEY ("provider_id")
);

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "provider"("provider_id") ON DELETE CASCADE ON UPDATE CASCADE;
