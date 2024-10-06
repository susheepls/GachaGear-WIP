/*
  Warnings:

  - A unique constraint covering the columns `[item_id,substatType_name]` on the table `ItemSubstats` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "ItemSubstats_item_id_key";

-- DropIndex
DROP INDEX "ItemSubstats_substatType_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "ItemSubstats_item_id_substatType_name_key" ON "ItemSubstats"("item_id", "substatType_name");
