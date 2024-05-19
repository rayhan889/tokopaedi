/*
  Warnings:

  - You are about to drop the column `mobilePhone` on the `user_address` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `user_address` table. All the data in the column will be lost.
  - You are about to drop the column `refreshToken` on the `user_address` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user_address" DROP COLUMN "mobilePhone",
DROP COLUMN "phone",
DROP COLUMN "refreshToken";
