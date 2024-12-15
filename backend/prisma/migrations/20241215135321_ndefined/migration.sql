-- AlterTable
ALTER TABLE "ItemSkin" ADD COLUMN     "ownerId" INTEGER;

-- AddForeignKey
ALTER TABLE "ItemSkin" ADD CONSTRAINT "ItemSkin_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Account"("id") ON DELETE SET NULL ON UPDATE CASCADE;
