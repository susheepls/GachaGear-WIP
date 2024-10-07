/*
  Warnings:

  - You are about to drop the column `substatType_name` on the `ItemSubstats` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[item_id,substatTypeName]` on the table `ItemSubstats` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `substatTypeName` to the `ItemSubstats` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ItemSubstats" DROP CONSTRAINT "ItemSubstats_substatType_name_fkey";

-- DropIndex
DROP INDEX "ItemSubstats_item_id_substatType_name_key";

-- AlterTable
ALTER TABLE "Account" ALTER COLUMN "password" DROP DEFAULT;

-- AlterTable
ALTER TABLE "ItemSubstats" DROP COLUMN "substatType_name",
ADD COLUMN     "substatTypeName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ItemSubstats_item_id_substatTypeName_key" ON "ItemSubstats"("item_id", "substatTypeName");

-- AddForeignKey
ALTER TABLE "ItemSubstats" ADD CONSTRAINT "ItemSubstats_substatTypeName_fkey" FOREIGN KEY ("substatTypeName") REFERENCES "SubstatTypes"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
