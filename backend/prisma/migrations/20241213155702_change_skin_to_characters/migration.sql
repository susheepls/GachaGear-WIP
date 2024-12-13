/*
  Warnings:

  - You are about to drop the column `skinNameId` on the `Inventory` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Inventory" DROP CONSTRAINT "Inventory_skinNameId_fkey";

-- AlterTable
ALTER TABLE "Inventory" DROP COLUMN "skinNameId";

-- AlterTable
ALTER TABLE "ItemSkin" ADD COLUMN     "itemNameId" INTEGER;

-- CreateTable
CREATE TABLE "_CharacterToItemSkin" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CharacterToItemSkin_AB_unique" ON "_CharacterToItemSkin"("A", "B");

-- CreateIndex
CREATE INDEX "_CharacterToItemSkin_B_index" ON "_CharacterToItemSkin"("B");

-- AddForeignKey
ALTER TABLE "ItemSkin" ADD CONSTRAINT "ItemSkin_itemNameId_fkey" FOREIGN KEY ("itemNameId") REFERENCES "ItemName"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CharacterToItemSkin" ADD CONSTRAINT "_CharacterToItemSkin_A_fkey" FOREIGN KEY ("A") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CharacterToItemSkin" ADD CONSTRAINT "_CharacterToItemSkin_B_fkey" FOREIGN KEY ("B") REFERENCES "ItemSkin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
