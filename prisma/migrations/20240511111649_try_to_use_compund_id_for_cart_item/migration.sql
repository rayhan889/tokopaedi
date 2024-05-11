/*
  Warnings:

  - You are about to drop the `ShoppingSessionCartItem` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_CartItemToShoppingSessionCartItem` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[productId,shoppingSessionId]` on the table `cart_item` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `quantity` to the `cart_item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shoppingSessionId` to the `cart_item` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ShoppingSessionCartItem" DROP CONSTRAINT "ShoppingSessionCartItem_shoppingSessionId_fkey";

-- DropForeignKey
ALTER TABLE "_CartItemToShoppingSessionCartItem" DROP CONSTRAINT "_CartItemToShoppingSessionCartItem_A_fkey";

-- DropForeignKey
ALTER TABLE "_CartItemToShoppingSessionCartItem" DROP CONSTRAINT "_CartItemToShoppingSessionCartItem_B_fkey";

-- AlterTable
ALTER TABLE "cart_item" ADD COLUMN     "quantity" INTEGER NOT NULL,
ADD COLUMN     "shoppingSessionId" TEXT NOT NULL;

-- DropTable
DROP TABLE "ShoppingSessionCartItem";

-- DropTable
DROP TABLE "_CartItemToShoppingSessionCartItem";

-- CreateIndex
CREATE UNIQUE INDEX "cart_item_productId_shoppingSessionId_key" ON "cart_item"("productId", "shoppingSessionId");

-- AddForeignKey
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_shoppingSessionId_fkey" FOREIGN KEY ("shoppingSessionId") REFERENCES "shopping_session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
