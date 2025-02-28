-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'PAID';

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "stripeChargeId" TEXT;

-- CreateTable
CREATE TABLE "OrderReceipt" (
    "nIdOrderReceipt" TEXT NOT NULL,
    "orderNIdOrder" TEXT NOT NULL,
    "receiptUrl" TEXT NOT NULL,
    "dCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dUpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderReceipt_pkey" PRIMARY KEY ("nIdOrderReceipt")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrderReceipt_orderNIdOrder_key" ON "OrderReceipt"("orderNIdOrder");

-- AddForeignKey
ALTER TABLE "OrderReceipt" ADD CONSTRAINT "OrderReceipt_orderNIdOrder_fkey" FOREIGN KEY ("orderNIdOrder") REFERENCES "Order"("nIdOrder") ON DELETE RESTRICT ON UPDATE CASCADE;
