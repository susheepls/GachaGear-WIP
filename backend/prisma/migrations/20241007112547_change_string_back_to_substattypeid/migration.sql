/*
  Warnings:

  - You are about to drop the column `substatTypeName` on the `ItemSubstats` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[item_id,substatTypeId]` on the table `ItemSubstats` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `substatTypeId` to the `ItemSubstats` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ItemSubstats" DROP CONSTRAINT "ItemSubstats_substatTypeName_fkey";

-- DropIndex
DROP INDEX "ItemSubstats_item_id_substatTypeName_key";

-- AlterTable
ALTER TABLE "ItemSubstats" DROP COLUMN "substatTypeName",
ADD COLUMN     "substatTypeId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ItemSubstats_item_id_substatTypeId_key" ON "ItemSubstats"("item_id", "substatTypeId");

-- AddForeignKey
ALTER TABLE "ItemSubstats" ADD CONSTRAINT "ItemSubstats_substatTypeId_fkey" FOREIGN KEY ("substatTypeId") REFERENCES "SubstatTypes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
