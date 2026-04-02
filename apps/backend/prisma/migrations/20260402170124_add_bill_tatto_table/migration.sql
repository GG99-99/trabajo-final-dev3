-- CreateTable
CREATE TABLE "bill_tatto" (
    "bill_id" INTEGER NOT NULL,
    "tatto_id" INTEGER NOT NULL,

    CONSTRAINT "bill_tatto_pkey" PRIMARY KEY ("bill_id","tatto_id")
);

-- AddForeignKey
ALTER TABLE "bill_tatto" ADD CONSTRAINT "bill_tatto_bill_id_fkey" FOREIGN KEY ("bill_id") REFERENCES "bill"("bill_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bill_tatto" ADD CONSTRAINT "bill_tatto_tatto_id_fkey" FOREIGN KEY ("tatto_id") REFERENCES "tatto"("tatto_id") ON DELETE CASCADE ON UPDATE CASCADE;
