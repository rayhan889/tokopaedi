/*
  Warnings:

  - You are about to drop the column `shoppingSessionId` on the `cart_item` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "cart_item" DROP CONSTRAINT "cart_item_shoppingSessionId_fkey";

-- DropIndex
DROP INDEX "cart_item_productId_shoppingSessionId_idx";

-- AlterTable
ALTER TABLE "cart_item" DROP COLUMN "shoppingSessionId",
ADD COLUMN     "shoppingSessionCartItemId" TEXT;

-- AlterTable
ALTER TABLE "shopping_session" ADD COLUMN     "shoppingSessionCartItemId" TEXT;

-- CreateTable
CREATE TABLE "shoppingSession_cartItem" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shoppingSession_cartItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "shopping_session" ADD CONSTRAINT "shopping_session_shoppingSessionCartItemId_fkey" FOREIGN KEY ("shoppingSessionCartItemId") REFERENCES "shoppingSession_cartItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_shoppingSessionCartItemId_fkey" FOREIGN KEY ("shoppingSessionCartItemId") REFERENCES "shoppingSession_cartItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
