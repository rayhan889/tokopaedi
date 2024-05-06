-- AlterTable
ALTER TABLE "shopping_session" ALTER COLUMN "total" SET DATA TYPE DECIMAL(65,30);

-- CreateTable
CREATE TABLE "order_details" (
    "id" TEXT NOT NULL,
    "total" DECIMAL(65,30) NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_item" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "productId" TEXT NOT NULL,
    "orderDetailId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "order_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentDetails" (
    "id" TEXT NOT NULL,
    "amount" DECIMAL(65,30) NOT NULL,
    "provider" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentDetails_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "order_details_userId_key" ON "order_details"("userId");

-- CreateIndex
CREATE INDEX "order_details_userId_idx" ON "order_details"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "order_item_productId_key" ON "order_item"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "order_item_orderDetailId_key" ON "order_item"("orderDetailId");

-- CreateIndex
CREATE INDEX "order_item_orderDetailId_productId_idx" ON "order_item"("orderDetailId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentDetails_orderId_key" ON "PaymentDetails"("orderId");

-- AddForeignKey
ALTER TABLE "order_details" ADD CONSTRAINT "order_details_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_orderDetailId_fkey" FOREIGN KEY ("orderDetailId") REFERENCES "order_details"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentDetails" ADD CONSTRAINT "PaymentDetails_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "order_details"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
