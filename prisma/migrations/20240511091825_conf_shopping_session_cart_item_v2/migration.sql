/*
  Warnings:

  - You are about to drop the column `quantity` on the `cart_item` table. All the data in the column will be lost.
  - You are about to drop the `_CartItemToShoppingSession` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_CartItemToShoppingSession" DROP CONSTRAINT "_CartItemToShoppingSession_A_fkey";

-- DropForeignKey
ALTER TABLE "_CartItemToShoppingSession" DROP CONSTRAINT "_CartItemToShoppingSession_B_fkey";

-- AlterTable
ALTER TABLE "cart_item" DROP COLUMN "quantity";

-- DropTable
DROP TABLE "_CartItemToShoppingSession";

-- CreateTable
CREATE TABLE "ShoppingSessionCartItem" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "shoppingSessionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ShoppingSessionCartItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CartItemToShoppingSessionCartItem" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ShoppingSessionCartItem_shoppingSessionId_key" ON "ShoppingSessionCartItem"("shoppingSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "_CartItemToShoppingSessionCartItem_AB_unique" ON "_CartItemToShoppingSessionCartItem"("A", "B");

-- CreateIndex
CREATE INDEX "_CartItemToShoppingSessionCartItem_B_index" ON "_CartItemToShoppingSessionCartItem"("B");

-- AddForeignKey
ALTER TABLE "ShoppingSessionCartItem" ADD CONSTRAINT "ShoppingSessionCartItem_shoppingSessionId_fkey" FOREIGN KEY ("shoppingSessionId") REFERENCES "shopping_session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CartItemToShoppingSessionCartItem" ADD CONSTRAINT "_CartItemToShoppingSessionCartItem_A_fkey" FOREIGN KEY ("A") REFERENCES "cart_item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CartItemToShoppingSessionCartItem" ADD CONSTRAINT "_CartItemToShoppingSessionCartItem_B_fkey" FOREIGN KEY ("B") REFERENCES "ShoppingSessionCartItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
