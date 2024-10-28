-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_itemNameId_fkey";

-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "ItemSubstats" DROP CONSTRAINT "ItemSubstats_item_id_fkey";

-- DropForeignKey
ALTER TABLE "ItemSubstats" DROP CONSTRAINT "ItemSubstats_substatTypeId_fkey";

-- AlterTable
ALTER TABLE "Inventory" ALTER COLUMN "ownerId" DROP NOT NULL,
ALTER COLUMN "itemNameId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ItemSubstats" ALTER COLUMN "item_id" DROP NOT NULL,
ALTER COLUMN "substatTypeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_itemNameId_fkey" FOREIGN KEY ("itemNameId") REFERENCES "ItemName"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemSubstats" ADD CONSTRAINT "ItemSubstats_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Inventory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemSubstats" ADD CONSTRAINT "ItemSubstats_substatTypeId_fkey" FOREIGN KEY ("substatTypeId") REFERENCES "SubstatTypes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
