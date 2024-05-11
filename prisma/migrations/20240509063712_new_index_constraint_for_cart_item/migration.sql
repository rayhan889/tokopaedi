-- CreateIndex
CREATE INDEX "cart_item_productId_shoppingSessionId_idx" ON "cart_item"("productId", "shoppingSessionId");
