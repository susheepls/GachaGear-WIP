/*
  Warnings:

  - You are about to drop the column `substatType_id` on the `ItemSubstats` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[substatType_name]` on the table `ItemSubstats` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `SubstatTypes` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "ItemSubstats" DROP CONSTRAINT "ItemSubstats_substatType_id_fkey";

-- DropIndex
DROP INDEX "ItemSubstats_substatType_id_key";

-- AlterTable
ALTER TABLE "ItemSubstats" DROP COLUMN "substatType_id",
ADD COLUMN     "substatType_name" TEXT NOT NULL DEFAULT 'hp';

-- CreateIndex
CREATE UNIQUE INDEX "ItemSubstats_substatType_name_key" ON "ItemSubstats"("substatType_name");

-- CreateIndex
CREATE UNIQUE INDEX "SubstatTypes_name_key" ON "SubstatTypes"("name");

-- AddForeignKey
ALTER TABLE "ItemSubstats" ADD CONSTRAINT "ItemSubstats_substatType_name_fkey" FOREIGN KEY ("substatType_name") REFERENCES "SubstatTypes"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
