/*
  Warnings:

  - You are about to drop the column `discountPercen` on the `discounts` table. All the data in the column will be lost.
  - Added the required column `discountPercent` to the `discounts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "discounts" DROP COLUMN "discountPercen",
ADD COLUMN     "discountPercent" DECIMAL(65,30) NOT NULL;
