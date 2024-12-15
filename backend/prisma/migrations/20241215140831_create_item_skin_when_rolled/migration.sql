/*
  Warnings:

  - You are about to drop the `_AccountItemSkins` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_AccountItemSkins" DROP CONSTRAINT "_AccountItemSkins_A_fkey";

-- DropForeignKey
ALTER TABLE "_AccountItemSkins" DROP CONSTRAINT "_AccountItemSkins_B_fkey";

-- AlterTable
ALTER TABLE "ItemSkin" ADD COLUMN     "ownerId" INTEGER;

-- DropTable
DROP TABLE "_AccountItemSkins";

-- AddForeignKey
ALTER TABLE "ItemSkin" ADD CONSTRAINT "ItemSkin_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
