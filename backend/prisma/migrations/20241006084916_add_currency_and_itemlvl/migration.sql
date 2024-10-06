-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "currency" INTEGER NOT NULL DEFAULT 100;

-- AlterTable
ALTER TABLE "Inventory" ADD COLUMN     "level" INTEGER NOT NULL DEFAULT 0;
