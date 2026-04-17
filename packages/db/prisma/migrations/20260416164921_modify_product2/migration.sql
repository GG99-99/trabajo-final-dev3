/*
  Warnings:

  - A unique constraint covering the columns `[product_id,presentation]` on the table `product_variant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "product_variant_product_id_presentation_key" ON "product_variant"("product_id", "presentation");
