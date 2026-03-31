-- CreateEnum
CREATE TYPE "PersonType" AS ENUM ('client', 'cashier', 'worker');

-- CreateEnum
CREATE TYPE "WorkerSpecialty" AS ENUM ('realism', 'cartoon', 'other');

-- CreateEnum
CREATE TYPE "CashierSpecialty" AS ENUM ('realism', 'cartoon', 'other');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('cash', 'credit_card', 'transfer');

-- CreateEnum
CREATE TYPE "StockMovementType" AS ENUM ('entry', 'exit', 'waste');

-- CreateEnum
CREATE TYPE "BillStatus" AS ENUM ('pending', 'partially', 'paid', 'cancelled', 'refunded');

-- CreateTable
CREATE TABLE "person" (
    "person_id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "type" "PersonType" NOT NULL,

    CONSTRAINT "person_pkey" PRIMARY KEY ("person_id")
);

-- CreateTable
CREATE TABLE "worker" (
    "worker_id" SERIAL NOT NULL,
    "person_id" INTEGER NOT NULL,
    "specialty" "WorkerSpecialty" NOT NULL,

    CONSTRAINT "worker_pkey" PRIMARY KEY ("worker_id")
);

-- CreateTable
CREATE TABLE "cashier" (
    "cashier_id" SERIAL NOT NULL,
    "person_id" INTEGER NOT NULL,
    "specialty" "CashierSpecialty" NOT NULL,

    CONSTRAINT "cashier_pkey" PRIMARY KEY ("cashier_id")
);

-- CreateTable
CREATE TABLE "client" (
    "client_id" SERIAL NOT NULL,
    "person_id" INTEGER NOT NULL,
    "medical_notes" TEXT,

    CONSTRAINT "client_pkey" PRIMARY KEY ("client_id")
);

-- CreateTable
CREATE TABLE "category" (
    "category_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "category_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "product" (
    "product_id" SERIAL NOT NULL,
    "category_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "brand" TEXT NOT NULL,

    CONSTRAINT "product_pkey" PRIMARY KEY ("product_id")
);

-- CreateTable
CREATE TABLE "product_variant" (
    "product_variant_id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "presentation" TEXT NOT NULL,
    "min_stock_level" INTEGER NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "product_variant_pkey" PRIMARY KEY ("product_variant_id")
);

-- CreateTable
CREATE TABLE "inventory_item" (
    "inventory_item_id" SERIAL NOT NULL,
    "product_variant_id" INTEGER NOT NULL,
    "batch_number" TEXT NOT NULL,
    "current_quantity" INTEGER NOT NULL,
    "expiry_date" TIMESTAMP(3),

    CONSTRAINT "inventory_item_pkey" PRIMARY KEY ("inventory_item_id")
);

-- CreateTable
CREATE TABLE "stock_movement" (
    "stock_movement" SERIAL NOT NULL,
    "inventory_item_id" INTEGER NOT NULL,
    "type" "StockMovementType" NOT NULL,
    "quantity" DECIMAL(10,2) NOT NULL,
    "reason" TEXT,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stock_movement_pkey" PRIMARY KEY ("stock_movement")
);

-- CreateTable
CREATE TABLE "img" (
    "img_id" SERIAL NOT NULL,
    "source" BYTEA NOT NULL,
    "description" TEXT,

    CONSTRAINT "img_pkey" PRIMARY KEY ("img_id")
);

-- CreateTable
CREATE TABLE "tatto" (
    "tatto_id" SERIAL NOT NULL,
    "img_id" INTEGER NOT NULL,
    "cost" DECIMAL(10,2) NOT NULL,
    "time" TIME NOT NULL,

    CONSTRAINT "tatto_pkey" PRIMARY KEY ("tatto_id")
);

-- CreateTable
CREATE TABLE "tatto_material" (
    "product_variant_id" INTEGER NOT NULL,
    "tatto_id" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,

    CONSTRAINT "tatto_material_pkey" PRIMARY KEY ("product_variant_id","tatto_id")
);

-- CreateTable
CREATE TABLE "bill" (
    "bill_id" SERIAL NOT NULL,
    "client_id" INTEGER NOT NULL,
    "worker_id" INTEGER NOT NULL,
    "cashier_id" INTEGER NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "BillStatus" NOT NULL,

    CONSTRAINT "bill_pkey" PRIMARY KEY ("bill_id")
);

-- CreateTable
CREATE TABLE "bill_detail" (
    "bill_detail_id" SERIAL NOT NULL,
    "bill_id" INTEGER NOT NULL,
    "stock_movement_id" INTEGER NOT NULL,

    CONSTRAINT "bill_detail_pkey" PRIMARY KEY ("bill_detail_id")
);

-- CreateTable
CREATE TABLE "payment" (
    "payment_id" SERIAL NOT NULL,
    "bill_id" INTEGER NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amout" DECIMAL(10,2) NOT NULL,
    "method" "PaymentMethod" NOT NULL,
    "transaction_ref" TEXT NOT NULL,

    CONSTRAINT "payment_pkey" PRIMARY KEY ("payment_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "person_email_key" ON "person"("email");

-- CreateIndex
CREATE UNIQUE INDEX "worker_person_id_key" ON "worker"("person_id");

-- CreateIndex
CREATE UNIQUE INDEX "cashier_person_id_key" ON "cashier"("person_id");

-- CreateIndex
CREATE UNIQUE INDEX "client_person_id_key" ON "client"("person_id");

-- AddForeignKey
ALTER TABLE "worker" ADD CONSTRAINT "worker_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "person"("person_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cashier" ADD CONSTRAINT "cashier_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "person"("person_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "client" ADD CONSTRAINT "client_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "person"("person_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("category_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variant" ADD CONSTRAINT "product_variant_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("product_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_item" ADD CONSTRAINT "inventory_item_product_variant_id_fkey" FOREIGN KEY ("product_variant_id") REFERENCES "product_variant"("product_variant_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stock_movement" ADD CONSTRAINT "stock_movement_inventory_item_id_fkey" FOREIGN KEY ("inventory_item_id") REFERENCES "inventory_item"("inventory_item_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tatto" ADD CONSTRAINT "tatto_img_id_fkey" FOREIGN KEY ("img_id") REFERENCES "img"("img_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tatto_material" ADD CONSTRAINT "tatto_material_product_variant_id_fkey" FOREIGN KEY ("product_variant_id") REFERENCES "product_variant"("product_variant_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tatto_material" ADD CONSTRAINT "tatto_material_tatto_id_fkey" FOREIGN KEY ("tatto_id") REFERENCES "tatto"("tatto_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bill" ADD CONSTRAINT "bill_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "client"("client_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bill" ADD CONSTRAINT "bill_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "worker"("worker_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bill" ADD CONSTRAINT "bill_cashier_id_fkey" FOREIGN KEY ("cashier_id") REFERENCES "cashier"("cashier_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bill_detail" ADD CONSTRAINT "bill_detail_bill_id_fkey" FOREIGN KEY ("bill_id") REFERENCES "bill"("bill_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bill_detail" ADD CONSTRAINT "bill_detail_stock_movement_id_fkey" FOREIGN KEY ("stock_movement_id") REFERENCES "stock_movement"("stock_movement") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment" ADD CONSTRAINT "payment_bill_id_fkey" FOREIGN KEY ("bill_id") REFERENCES "bill"("bill_id") ON DELETE CASCADE ON UPDATE CASCADE;
