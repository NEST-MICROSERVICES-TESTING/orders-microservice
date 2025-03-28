-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'DELIVERED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Order" (
    "nIdOrder" TEXT NOT NULL,
    "nTotalAmount" DOUBLE PRECISION NOT NULL,
    "nTotalItems" INTEGER NOT NULL,
    "sStatus" "OrderStatus" NOT NULL,
    "bPaid" BOOLEAN NOT NULL DEFAULT false,
    "dPaidAt" TIMESTAMP(3),
    "dCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dUpdateAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("nIdOrder")
);
