-- CreateTable
CREATE TABLE "bill_discount" (
    "bill_discount_id" SERIAL NOT NULL,
    "bill_id" INTEGER NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "bill_discount_pkey" PRIMARY KEY ("bill_discount_id")
);

-- CreateTable
CREATE TABLE "bill_aggregate" (
    "bill_aggregate_id" SERIAL NOT NULL,
    "bill_id" INTEGER NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "bill_aggregate_pkey" PRIMARY KEY ("bill_aggregate_id")
);

-- AddForeignKey
ALTER TABLE "bill_discount" ADD CONSTRAINT "bill_discount_bill_id_fkey" FOREIGN KEY ("bill_id") REFERENCES "bill"("bill_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bill_aggregate" ADD CONSTRAINT "bill_aggregate_bill_id_fkey" FOREIGN KEY ("bill_id") REFERENCES "bill"("bill_id") ON DELETE CASCADE ON UPDATE CASCADE;
