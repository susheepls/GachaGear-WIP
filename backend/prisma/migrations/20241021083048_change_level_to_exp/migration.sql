/*
  Warnings:

  - You are about to drop the column `level` on the `Inventory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Inventory" DROP COLUMN "level",
ADD COLUMN     "exp" INTEGER NOT NULL DEFAULT 0;
