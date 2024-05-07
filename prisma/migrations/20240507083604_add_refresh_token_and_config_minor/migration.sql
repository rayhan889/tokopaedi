-- AlterTable
ALTER TABLE "user_address" ADD COLUMN     "refreshToken" TEXT,
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "mobilePhone" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "refreshToken" TEXT;
