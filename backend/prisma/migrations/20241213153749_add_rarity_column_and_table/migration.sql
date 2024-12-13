/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `ItemSkin` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ItemSkin" ADD COLUMN     "rarityId" INTEGER;

-- CreateTable
CREATE TABLE "SkinRarity" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "SkinRarity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SkinRarity_name_key" ON "SkinRarity"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ItemSkin_name_key" ON "ItemSkin"("name");

-- AddForeignKey
ALTER TABLE "ItemSkin" ADD CONSTRAINT "ItemSkin_rarityId_fkey" FOREIGN KEY ("rarityId") REFERENCES "SkinRarity"("id") ON DELETE SET NULL ON UPDATE CASCADE;
