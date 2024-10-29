-- AlterTable
ALTER TABLE "Account" ALTER COLUMN "last_box_open" DROP NOT NULL,
ALTER COLUMN "last_box_open" DROP DEFAULT,
ALTER COLUMN "last_box_open" SET DATA TYPE TIMESTAMP(0);
