/*
  Warnings:

  - You are about to drop the column `ownerId` on the `ItemSkin` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ItemSkin" DROP CONSTRAINT "ItemSkin_ownerId_fkey";

-- AlterTable
ALTER TABLE "ItemSkin" DROP COLUMN "ownerId";

-- CreateTable
CREATE TABLE "_AccountItemSkins" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_AccountItemSkins_AB_unique" ON "_AccountItemSkins"("A", "B");

-- CreateIndex
CREATE INDEX "_AccountItemSkins_B_index" ON "_AccountItemSkins"("B");

-- AddForeignKey
ALTER TABLE "_AccountItemSkins" ADD CONSTRAINT "_AccountItemSkins_A_fkey" FOREIGN KEY ("A") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_AccountItemSkins" ADD CONSTRAINT "_AccountItemSkins_B_fkey" FOREIGN KEY ("B") REFERENCES "ItemSkin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
