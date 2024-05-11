/*
  Warnings:

  - You are about to drop the column `quantity` on the `cart_item` table. All the data in the column will be lost.
  - You are about to drop the column `shoppingSessionId` on the `cart_item` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "cart_item" DROP CONSTRAINT "cart_item_shoppingSessionId_fkey";

-- DropIndex
DROP INDEX "cart_item_productId_shoppingSessionId_key";

-- AlterTable
ALTER TABLE "cart_item" DROP COLUMN "quantity",
DROP COLUMN "shoppingSessionId";

-- CreateTable
CREATE TABLE "shoppingSession_cartItem" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "shoppingSessionId" TEXT NOT NULL,
    "cartItemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shoppingSession_cartItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shoppingSession_cartItem_cartItemId_key" ON "shoppingSession_cartItem"("cartItemId");

-- CreateIndex
CREATE UNIQUE INDEX "shoppingSession_cartItem_shoppingSessionId_cartItemId_key" ON "shoppingSession_cartItem"("shoppingSessionId", "cartItemId");

-- AddForeignKey
ALTER TABLE "shoppingSession_cartItem" ADD CONSTRAINT "shoppingSession_cartItem_shoppingSessionId_fkey" FOREIGN KEY ("shoppingSessionId") REFERENCES "shopping_session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shoppingSession_cartItem" ADD CONSTRAINT "shoppingSession_cartItem_cartItemId_fkey" FOREIGN KEY ("cartItemId") REFERENCES "cart_item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
