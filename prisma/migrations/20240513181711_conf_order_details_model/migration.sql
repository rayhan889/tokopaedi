/*
  Warnings:

  - You are about to drop the column `orderDetailId` on the `order_item` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `order_item` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "order_item" DROP CONSTRAINT "order_item_orderDetailId_fkey";

-- DropIndex
DROP INDEX "order_item_orderDetailId_key";

-- DropIndex
DROP INDEX "order_item_orderDetailId_productId_idx";

-- AlterTable
ALTER TABLE "order_item" DROP COLUMN "orderDetailId",
DROP COLUMN "quantity";

-- CreateTable
CREATE TABLE "orderDetails_item" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "orderDetailsId" TEXT NOT NULL,
    "orderItemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orderDetails_item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "orderDetails_item_orderDetailsId_orderItemId_key" ON "orderDetails_item"("orderDetailsId", "orderItemId");

-- AddForeignKey
ALTER TABLE "orderDetails_item" ADD CONSTRAINT "orderDetails_item_orderDetailsId_fkey" FOREIGN KEY ("orderDetailsId") REFERENCES "order_details"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orderDetails_item" ADD CONSTRAINT "orderDetails_item_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "order_item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
