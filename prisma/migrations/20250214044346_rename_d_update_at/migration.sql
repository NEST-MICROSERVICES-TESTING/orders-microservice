/*
  Warnings:

  - You are about to drop the column `dUpdateAt` on the `Order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "dUpdateAt",
ADD COLUMN     "dUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
