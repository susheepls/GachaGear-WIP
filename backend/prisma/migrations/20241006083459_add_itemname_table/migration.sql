/*
  Warnings:

  - You are about to drop the column `name` on the `Inventory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Inventory" DROP COLUMN "name",
ADD COLUMN     "itemNameId" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "ItemName" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ItemName_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_itemNameId_fkey" FOREIGN KEY ("itemNameId") REFERENCES "ItemName"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
