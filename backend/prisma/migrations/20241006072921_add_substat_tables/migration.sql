-- CreateTable
CREATE TABLE "ItemSubstats" (
    "id" SERIAL NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "item_id" INTEGER NOT NULL,

    CONSTRAINT "ItemSubstats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubstatTypes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "substat_id" INTEGER NOT NULL,

    CONSTRAINT "SubstatTypes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ItemSubstats_item_id_key" ON "ItemSubstats"("item_id");

-- CreateIndex
CREATE UNIQUE INDEX "SubstatTypes_substat_id_key" ON "SubstatTypes"("substat_id");

-- AddForeignKey
ALTER TABLE "ItemSubstats" ADD CONSTRAINT "ItemSubstats_item_id_fkey" FOREIGN KEY ("item_id") REFERENCES "Inventory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubstatTypes" ADD CONSTRAINT "SubstatTypes_substat_id_fkey" FOREIGN KEY ("substat_id") REFERENCES "ItemSubstats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
