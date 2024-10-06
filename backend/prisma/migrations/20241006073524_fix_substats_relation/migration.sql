/*
  Warnings:

  - You are about to drop the column `substat_id` on the `SubstatTypes` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[substatType_id]` on the table `ItemSubstats` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `substatType_id` to the `ItemSubstats` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SubstatTypes" DROP CONSTRAINT "SubstatTypes_substat_id_fkey";

-- DropIndex
DROP INDEX "SubstatTypes_substat_id_key";

-- AlterTable
ALTER TABLE "ItemSubstats" ADD COLUMN     "substatType_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "SubstatTypes" DROP COLUMN "substat_id";

-- CreateIndex
CREATE UNIQUE INDEX "ItemSubstats_substatType_id_key" ON "ItemSubstats"("substatType_id");

-- AddForeignKey
ALTER TABLE "ItemSubstats" ADD CONSTRAINT "ItemSubstats_substatType_id_fkey" FOREIGN KEY ("substatType_id") REFERENCES "SubstatTypes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
