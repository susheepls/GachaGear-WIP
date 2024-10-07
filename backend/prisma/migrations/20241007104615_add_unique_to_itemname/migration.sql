/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `ItemName` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ItemName_name_key" ON "ItemName"("name");
