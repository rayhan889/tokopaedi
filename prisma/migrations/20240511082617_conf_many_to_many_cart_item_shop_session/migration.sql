/*
  Warnings:

  - You are about to drop the column `shoppingSessionCartItemId` on the `cart_item` table. All the data in the column will be lost.
  - You are about to drop the `shoppingSession_cartItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "cart_item" DROP CONSTRAINT "cart_item_shoppingSessionCartItemId_fkey";

-- DropForeignKey
ALTER TABLE "shoppingSession_cartItem" DROP CONSTRAINT "shoppingSession_cartItem_shoppingSessionId_fkey";

-- AlterTable
ALTER TABLE "cart_item" DROP COLUMN "shoppingSessionCartItemId";

-- DropTable
DROP TABLE "shoppingSession_cartItem";

-- CreateTable
CREATE TABLE "_CartItemToShoppingSession" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CartItemToShoppingSession_AB_unique" ON "_CartItemToShoppingSession"("A", "B");

-- CreateIndex
CREATE INDEX "_CartItemToShoppingSession_B_index" ON "_CartItemToShoppingSession"("B");

-- AddForeignKey
ALTER TABLE "_CartItemToShoppingSession" ADD CONSTRAINT "_CartItemToShoppingSession_A_fkey" FOREIGN KEY ("A") REFERENCES "cart_item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CartItemToShoppingSession" ADD CONSTRAINT "_CartItemToShoppingSession_B_fkey" FOREIGN KEY ("B") REFERENCES "shopping_session"("id") ON DELETE CASCADE ON UPDATE CASCADE;
