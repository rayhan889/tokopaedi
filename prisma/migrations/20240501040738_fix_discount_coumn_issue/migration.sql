-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_discountId_fkey";

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "discountId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_discountId_fkey" FOREIGN KEY ("discountId") REFERENCES "discounts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
