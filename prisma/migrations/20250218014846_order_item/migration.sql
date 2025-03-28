-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "sStatus" SET DEFAULT 'PENDING',
ALTER COLUMN "dUpdatedAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "OrderItem" (
    "nIdOrderItem" TEXT NOT NULL,
    "nIdProduct" INTEGER NOT NULL,
    "nQuantity" INTEGER NOT NULL,
    "nPrice" DOUBLE PRECISION NOT NULL,
    "orderNIdOrder" TEXT,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("nIdOrderItem")
);

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderNIdOrder_fkey" FOREIGN KEY ("orderNIdOrder") REFERENCES "Order"("nIdOrder") ON DELETE SET NULL ON UPDATE CASCADE;
