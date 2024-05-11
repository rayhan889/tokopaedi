/*
  Warnings:

  - You are about to drop the column `shoppingSessionCartItemId` on the `shopping_session` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[shoppingSessionId]` on the table `shoppingSession_cartItem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `shoppingSessionId` to the `shoppingSession_cartItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "shopping_session" DROP CONSTRAINT "shopping_session_shoppingSessionCartItemId_fkey";

-- AlterTable
ALTER TABLE "shoppingSession_cartItem" ADD COLUMN     "shoppingSessionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "shopping_session" DROP COLUMN "shoppingSessionCartItemId";

-- CreateIndex
CREATE UNIQUE INDEX "shoppingSession_cartItem_shoppingSessionId_key" ON "shoppingSession_cartItem"("shoppingSessionId");

-- AddForeignKey
ALTER TABLE "shoppingSession_cartItem" ADD CONSTRAINT "shoppingSession_cartItem_shoppingSessionId_fkey" FOREIGN KEY ("shoppingSessionId") REFERENCES "shopping_session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
