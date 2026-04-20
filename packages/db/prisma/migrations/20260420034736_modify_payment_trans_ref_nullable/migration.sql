-- AlterTable
ALTER TABLE "fingerprint" ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" DROP DEFAULT,
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "payment" ALTER COLUMN "transaction_ref" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "fingerprint" ADD CONSTRAINT "fingerprint_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "worker"("worker_id") ON DELETE CASCADE ON UPDATE CASCADE;
