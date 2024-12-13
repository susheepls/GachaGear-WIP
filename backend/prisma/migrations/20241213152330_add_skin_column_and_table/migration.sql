-- AlterTable
ALTER TABLE "Account" ALTER COLUMN "currency" SET DEFAULT 1000;

-- AlterTable
ALTER TABLE "Inventory" ADD COLUMN     "skinNameId" INTEGER;

-- CreateTable
CREATE TABLE "ItemSkin" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ItemSkin_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_skinNameId_fkey" FOREIGN KEY ("skinNameId") REFERENCES "ItemSkin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
